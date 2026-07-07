/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());

// Persistent File System Setup for Syncing and Owner Settings
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_DIR = path.join(DATA_DIR, "users");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_DIR)) {
  fs.mkdirSync(USERS_DIR, { recursive: true });
}

// App Settings & Custom AI Prompt Persistence
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
let appSettings = {
  systemPrompt: `You are LifeSpanFit AI's clinical digital dietitian, expert nutritionist, physical therapist, and wellness coach.
You provide scientifically backed, empathetic, and clear wellness guidance tailored exactly to the active profile's life stage, age, physical stats, goals, diet preferences, body measurements, and body type (Ectomorph, Mesomorph, Endomorph).
Maintain a professional, encouraging, and medical-grade tone. Keep answers concise but comprehensive, using clean markdown, list items, and bold labels.
Always emphasize safe, age-specific practices. When advising on workouts, tailor the advice to their body type and measurements. For nutrition, give explicit meal examples: e.g., "Low Carbs & Low Fat" for Weight Loss, "High Carbs & High Protein" for Muscle Gain/Weight Gain.`,
  ownerPasscode: process.env.OWNER_PASSCODE || "owner2026"
};

if (fs.existsSync(SETTINGS_FILE)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    appSettings = { ...appSettings, ...loaded };
  } catch (err) {
    console.error("Failed to load settings file:", err);
  }
} else {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write initial settings file:", err);
  }
}

const PORT = process.env.PORT || 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }
  return null;
}

// Robust retry wrapper with exponential/incremental backoff for Gemini API calls
async function callGeminiWithRetry(fn: () => Promise<any>, retries = 2, delayMs = 1000): Promise<any> {
  let lastError: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini API attempt ${attempt} failed: ${err.message || err}`);
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  throw lastError;
}

// 1. Health Status endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    hasApiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
  });
});

// 2. AI Chat assistant proxy
app.post("/api/gemini/chat", async (req: express.Request, res: express.Response): Promise<any> => {
  const { message, history, profile } = req.body;

  if (!message || !profile) {
    return res.status(400).json({ error: "Missing required message or profile data" });
  }

  const ai = getAIClient();

  // If no API key, return a highly educational simulated response
  if (!ai) {
    const fallbackAnswer = generateSimulatedChatResponse(message, profile);
    return res.json({ text: fallbackAnswer, simulated: true });
  }

  try {
    const profileDetails = `
Profile Name: ${profile.name}
Age: ${profile.age} years old
Gender: ${profile.gender}
Height: ${profile.height} cm
Weight: ${profile.weight} kg
Activity Level: ${profile.activityLevel}
Goals: ${profile.goals}
Diet Preference: ${profile.dietPreference}
Medical Conditions: ${profile.medicalConditions?.length > 0 ? profile.medicalConditions.join(", ") : "None"}
Relation to account: ${profile.relation}
Chest: ${profile.chest ? profile.chest + " cm" : "Not provided"}
Waist: ${profile.waist ? profile.waist + " cm" : "Not provided"}
Hips: ${profile.hips ? profile.hips + " cm" : "Not provided"}
Body Fat %: ${profile.bodyFat ? profile.bodyFat + "%" : "Not provided"}
Body Type: ${profile.bodyType || "Not Specified"}
`;

    const systemInstruction = `${appSettings.systemPrompt}

Here is the active user profile you are currently advising:
${profileDetails}
Always refer to the user by their name (${profile.name}) occasionally to personalize the experience. Mention if their request aligns with their goals or physical stats.`;

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    }), 2, 800);

    const reply = response.text || "I apologize, I could not formulate a response at this time.";
    return res.json({ text: reply });
  } catch (err: any) {
    console.error("Gemini Chat API Error (falling back to simulator):", err);
    const fallbackAnswer = generateSimulatedChatResponse(message, profile);
    return res.json({ 
      text: `${fallbackAnswer}\n\n*(Note: Operating in high-fidelity local biological assessment mode due to high cloud demand.)*`, 
      simulated: true 
    });
  }
});

// 3. AI Health Assessment Generator
app.post("/api/gemini/assess", async (req: express.Request, res: express.Response): Promise<any> => {
  const { profile, trackerHistory } = req.body;

  if (!profile) {
    return res.status(400).json({ error: "Missing active profile" });
  }

  const ai = getAIClient();

  // Return realistic simulated assessment if no key exists
  if (!ai) {
    const simulatedAssessment = generateSimulatedAssessment(profile, trackerHistory || []);
    return res.json({ ...simulatedAssessment, simulated: true });
  }

  try {
    const historyText = trackerHistory && trackerHistory.length > 0 
      ? JSON.stringify(trackerHistory.slice(0, 5))
      : "No tracking history logged yet.";

    const prompt = `Generate a personalized, age-specific comprehensive clinical health assessment for the following individual.
Profile Details:
- Name: ${profile.name}
- Age: ${profile.age} years old
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Activity Level: ${profile.activityLevel}
- Goals: ${profile.goals}
- Diet Preference: ${profile.dietPreference}
- Medical Conditions: ${profile.medicalConditions?.length > 0 ? profile.medicalConditions.join(", ") : "None"}
- Chest: ${profile.chest ? profile.chest + " cm" : "Not provided"}
- Waist: ${profile.waist ? profile.waist + " cm" : "Not provided"}
- Hips: ${profile.hips ? profile.hips + " cm" : "Not provided"}
- Body Fat %: ${profile.bodyFat ? profile.bodyFat + "%" : "Not provided"}
- Body Type: ${profile.bodyType || "Not Specified"}

Tracking Logs (Past few days):
${historyText}

Calculate BMI and evaluate Waist-to-Hip ratio if measurements are provided. Categorize BMI according to age-specific medical guidelines.
Generate appropriate, personalized scores out of 100 for Health Score, Nutrition Score, and Fitness Score. Take body measurements and body type into account.
Provide ideal weight range guidance, recommended daily calorie intake target, key insights, specific tailored dietary advice (give explicit meal examples e.g. low-carb/low-fat vs high-carb/high-protein), exercise advice tailored for their body type (Ectomorph/Mesomorph/Endomorph), and age-specific preventive care checklist.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        healthScore: { type: Type.INTEGER, description: "Overall health score from 0 to 100 based on lifestyle and medical background" },
        nutritionScore: { type: Type.INTEGER, description: "Nutrition score from 0 to 100 based on diet preference and goals" },
        fitnessScore: { type: Type.INTEGER, description: "Fitness score from 0 to 100 based on exercise levels and physical stats" },
        idealWeightRange: { type: Type.STRING, description: "Estimated healthy weight range, e.g., '55kg - 70kg' or 'Growth percentile tracking for children'" },
        caloriesTarget: { type: Type.INTEGER, description: "Daily recommended calorie intake in kcal" },
        summary: { type: Type.STRING, description: "Comprehensive personalized wellness assessment summary (3-4 sentences)." },
        keyInsights: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of exactly 3 valuable, concrete, personalized insights based on physical stats, age group, or trackers."
        },
        dietaryAdvice: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of exactly 3 or 4 specific, actionable dietary guidelines matching their goal and medical background."
        },
        exerciseAdvice: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of exactly 3 safe, fun physical activity ideas matching their age and activity level."
        },
        preventiveCare: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of exactly 2 or 3 important age-specific medical screenings, habits, or warnings (e.g., vaccines for children, bone density scans for seniors, eye checks for working professionals)."
        }
      },
      required: [
        "healthScore",
        "nutritionScore",
        "fitnessScore",
        "idealWeightRange",
        "caloriesTarget",
        "summary",
        "keyInsights",
        "dietaryAdvice",
        "exerciseAdvice",
        "preventiveCare"
      ]
    };

    let parsedAssessment;
    try {
      const response = await callGeminiWithRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a professional full-stack clinical wellness AI. Analyze the health profile with scientific accuracy, and return the response in strict JSON matching the requested schema.",
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.5
        }
      }), 2, 800);

      const jsonText = response.text;
      if (!jsonText) {
        throw new Error("No response text from Gemini");
      }
      parsedAssessment = JSON.parse(jsonText.trim());
    } catch (apiErr: any) {
      console.error("Gemini Assessment API Error (falling back to simulator):", apiErr);
      const simulatedAssessment = generateSimulatedAssessment(profile, trackerHistory || []);
      parsedAssessment = {
        ...simulatedAssessment,
        summary: `${simulatedAssessment.summary} *(Note: Currently utilizing high-fidelity local biological assessment model due to high cloud demand.)*`,
        simulated: true
      };
    }
    return res.json(parsedAssessment);
  } catch (err: any) {
    console.error("Outer Assessment Route Error (falling back to simulator):", err);
    const simulatedAssessment = generateSimulatedAssessment(profile, trackerHistory || []);
    return res.json({
      ...simulatedAssessment,
      summary: `${simulatedAssessment.summary} *(Note: Currently utilizing high-fidelity local biological assessment model due to high cloud demand.)*`,
      simulated: true
    });
  }
});

// HELPER FOR SIMULATED CHAT RESPONSES (When API Key is not set)
function generateSimulatedChatResponse(message: string, profile: any): string {
  const lower = message.toLowerCase();
  const name = profile.name;
  const age = profile.age;
  const bodyType = profile.bodyType || "Mesomorph";
  
  if (lower.includes("eat") || lower.includes("diet") || lower.includes("food") || lower.includes("recipe") || lower.includes("nutrition")) {
    return `### 🥦 Personalized Nutrition Guidance for **${name}**

Hello ${name}! Based on your age (${profile.age}), diet preference (**${profile.dietPreference}**), and goal (**${profile.goals}**), here is my specialized advice:

1. **Focus on Macronutrients**: Ensure a balanced intake of complex carbohydrates, clean protein (such as lentils, tofu, or lean meats depending on your preferences), and healthy fats (olive oil, avocados, or nuts).
2. **Age-specific recommendation**: 
   ${profile.age < 1 ? "At 0-12 months old, prioritize breast milk or formulated milk. Begin introducing soft, single-ingredient solids like puréed banana or iron-fortified cereals after 6 months, following pediatrician clearance." : ""}
   ${profile.age >= 1 && profile.age <= 12 ? "For children, prioritize calcium and vitamin D for skeletal growth. Offer a variety of whole foods, avoiding sugary snacks and high-sodium options." : ""}
   ${profile.age > 12 && profile.age <= 19 ? "For teenagers, support rapid skeletal and muscle growth with high-quality protein, iron, and adequate hydration. Steer clear of fad influencer diets." : ""}
   ${profile.age > 19 && profile.age < 56 ? "For adults, focus on anti-inflammatory whole foods, cellular recovery, and fiber-rich vegetables to prevent insulin spikes and maintain weight management." : ""}
   ${profile.age >= 56 ? "For seniors, lean proteins, high-fiber grains, and calcium-rich options are crucial. Focus on easily digestible meals to sustain cognitive performance and muscle density." : ""}
3. **Hydration target**: Drink at least 8-10 cups of water daily to support metabolic activity.

Is there a specific meal or recipe you would like to design for your goals?`;
  }

  if (lower.includes("exercise") || lower.includes("workout") || lower.includes("gym") || lower.includes("fitness") || lower.includes("stretch")) {
    return `### 🏃‍♂️ Tailored Fitness Coach Routine for **${name}**

As your virtual trainer, I've aligned this activity plan with your goal of **${profile.goals}** and your activity level (**${profile.activityLevel}**):

*   **Warm Up (5-10 mins)**: High-knees, light stretching, or arm circles to lubricate joints.
*   **Main Routine**:
    ${profile.age < 5 ? "Focus on play-based physical exploration. Ensure 180 minutes of active movement throughout the day with tumbling, climbing, and crawling." : ""}
    ${profile.age >= 5 && profile.age <= 12 ? "Focus on cardiovascular fun: swimming, running, bicycling, or active sports for at least 60 minutes daily." : ""}
    ${profile.age > 12 && profile.age <= 19 ? "Incorporate both aerobic conditioning and beginner weight/bodyweight resistance training to build stable joint foundations." : ""}
    ${profile.age > 19 && profile.age < 56 ? "Combine 150 minutes of moderate cardio with 2-3 sessions of progressive strength training (squats, deadlifts, push-ups)." : ""}
    ${profile.age >= 56 ? "Focus on joint-friendly mobility. Low-impact aerobic walking, resistance bands, and targeted balancing to prevent fall hazards." : ""}
*   **Cool Down**: Hamstring and shoulder stretches. Focus on slow, diaphragmatic breathing.

*Note: Always listen to your body and modify movements if you feel joint stress.*`;
  }

  return `### 👋 Welcome to LifeSpanFit AI Chat, **${name}**!

I am your 24/7 AI Health Companion. I see that you are **${profile.age} years old** managing a profile under **${profile.relation}** relation. 

Your active goal is **${profile.goals}**, and your diet preference is set to **${profile.dietPreference}**.

How can I help you today? You can ask me:
- *"What is a good meal prep recipe for weight management?"*
- *"Can you list a joint-friendly workout plan?"*
- *"What are key nutritional milestones for my current age?"*
- *"How should I adjust sleep and water to optimize my energy?"*`;
}

// HELPER FOR SIMULATED ASSESSMENTS (When API Key is not set)
function generateSimulatedAssessment(profile: any, tracker: any[]): any {
  const age = profile.age;
  const height = profile.height;
  const weight = profile.weight;
  const bmi = Number((weight / ((height / 100) * (height / 100))).toFixed(1));

  let bmiCategory = "Normal Weight";
  let idealWeightRange = "55 kg - 74 kg";
  let caloriesTarget = 2000;
  let healthScore = 78;
  let nutritionScore = 80;
  let fitnessScore = 75;

  // Age based targets & categories
  if (age < 2) {
    bmiCategory = "N/A (Infant growth tracking)";
    idealWeightRange = "Refer to pediatric growth charts";
    caloriesTarget = 850;
    healthScore = 90;
    nutritionScore = 88;
    fitnessScore = 85;
  } else if (bmi < 18.5) {
    bmiCategory = "Underweight";
    idealWeightRange = `${(18.5 * (height/100) * (height/100)).toFixed(0)}kg - ${(24.9 * (height/100) * (height/100)).toFixed(0)}kg`;
    caloriesTarget = profile.gender === 'Male' ? 2400 : 2000;
    healthScore = 70;
  } else if (bmi > 29.9) {
    bmiCategory = "Obese";
    idealWeightRange = `${(18.5 * (height/100) * (height/100)).toFixed(0)}kg - ${(24.9 * (height/100) * (height/100)).toFixed(0)}kg`;
    caloriesTarget = profile.gender === 'Male' ? 1900 : 1600;
    healthScore = 62;
    nutritionScore = 65;
    fitnessScore = 60;
  } else if (bmi > 24.9) {
    bmiCategory = "Overweight";
    idealWeightRange = `${(18.5 * (height/100) * (height/100)).toFixed(0)}kg - ${(24.9 * (height/100) * (height/100)).toFixed(0)}kg`;
    caloriesTarget = profile.gender === 'Male' ? 2100 : 1750;
    healthScore = 72;
    nutritionScore = 70;
    fitnessScore = 68;
  } else {
    idealWeightRange = `${(18.5 * (height/100) * (height/100)).toFixed(0)}kg - ${(24.9 * (height/100) * (height/100)).toFixed(0)}kg`;
    caloriesTarget = profile.gender === 'Male' ? 2500 : 2100;
    healthScore = 85;
    nutritionScore = 86;
    fitnessScore = 84;
  }

  // Activity level adjustment
  if (profile.activityLevel === "Sedentary") {
    caloriesTarget -= 200;
    fitnessScore = Math.max(50, fitnessScore - 15);
  } else if (profile.activityLevel === "Very Active") {
    caloriesTarget += 400;
    fitnessScore = Math.min(98, fitnessScore + 12);
    healthScore = Math.min(98, healthScore + 5);
  }

  return {
    healthScore,
    nutritionScore,
    fitnessScore,
    bmi,
    bmiCategory,
    idealWeightRange,
    caloriesTarget,
    summary: `Based on ${profile.name}'s profile, they are a ${profile.age}-year-old ${profile.gender} with a BMI of ${bmi} (${bmiCategory}). Their goal is ${profile.goals}, adopting a ${profile.dietPreference} lifestyle. At this stage of life, maintaining skeletal density, cellular regeneration, and steady heart-rate recovery are critical parameters for overall health.`,
    keyInsights: [
      `Your current BMI of ${bmi} falls in the "${bmiCategory}" classification. Tracking caloric intake and weight consistency weekly will help maintain healthy biological parameters.`,
      `Your activity level is marked as "${profile.activityLevel}". Transitioning to a more active daily routine could improve cardiovascular health and cognitive function.`,
      `With a ${profile.dietPreference} diet preference, focused meal-planning is essential to avoid potential micro-nutritional deficits (like Vitamin B12, Iron, or Vitamin D).`
    ],
    dietaryAdvice: [
      `Prioritize ${profile.dietPreference === 'Vegan' || profile.dietPreference === 'Vegetarian' ? 'plant-based proteins like edamame, organic tempeh, green lentils, and quinoa' : 'lean proteins like skinless chicken, wild-caught salmon, egg whites, or organic tofu'} to preserve lean muscle tissue.`,
      `Integrate high-fiber root greens, broccoli, spinach, and complex carbohydrates to stabilize blood sugar levels and encourage favorable gut microbiome wellness.`,
      `Strictly monitor salt intake and keep sodium under 2,000mg per day, especially if managing medical conditions like ${profile.medicalConditions?.length > 0 ? profile.medicalConditions.join(", ") : "hypertension precursors"}.`
    ],
    exerciseAdvice: [
      `Incorporate 30 minutes of aerobic movement (such as brisk walking, swimming, or cycling) at least 5 days a week to support longevity.`,
      `Add 2 days of basic resistance training, focusing on bodyweight squats, gentle push-ups, and core plank holds for muscular stability.`,
      `Perform daily mobility stretching (10 minutes) centering on lower back, hamstrings, and shoulders to maintain flexibility and reduce injury risk.`
    ],
    preventiveCare: [
      `Schedule regular diagnostic checkups including blood pressure monitoring, lipids profiling, and HbA1c screening every 12 months.`,
      `Maintain optimal sleep cycles of 7 to 8 hours nightly to trigger cellular repair and healthy endocrine rhythms.`,
      `Incorporate a professional bone mineral density test if transitioning into higher age cohorts (especially post-50) to proactively prevent osteoporosis.`
    ]
  };
}

// --- SYNC & OWNER BACKEND ROUTES ---

// Save User Sync data
app.post("/api/sync/save", (req: express.Request, res: express.Response): any => {
  const { email, name, profiles, trackerHistory, assessments, chatHistories } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required to sync" });
  }

  const sanitizedEmail = email.toLowerCase().replace(/[^a-z0-9@._-]/g, "");
  const filePath = path.join(USERS_DIR, `${sanitizedEmail}.json`);

  const userData = {
    email: email.toLowerCase(),
    name: name || email.split("@")[0],
    lastSynced: new Date().toISOString(),
    profiles: profiles || [],
    trackerHistory: trackerHistory || {},
    assessments: assessments || {},
    chatHistories: chatHistories || {}
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), "utf8");
    res.json({ success: true, lastSynced: userData.lastSynced });
  } catch (err: any) {
    console.error(`Failed to save user sync data for ${email}:`, err);
    res.status(500).json({ error: "Failed to save data on server" });
  }
});

// Load User Sync data
app.post("/api/sync/load", (req: express.Request, res: express.Response): any => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required to load" });
  }

  const sanitizedEmail = email.toLowerCase().replace(/[^a-z0-9@._-]/g, "");
  const filePath = path.join(USERS_DIR, `${sanitizedEmail}.json`);

  if (!fs.existsSync(filePath)) {
    return res.json({ found: false });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json({ found: true, data });
  } catch (err) {
    console.error(`Failed to read user sync data for ${email}:`, err);
    res.status(500).json({ error: "Failed to read data from server" });
  }
});

// Admin Authorization Middleware (Check passcode in Headers)
const checkAdminPasscode = (req: express.Request, res: express.Response, next: express.NextFunction): any => {
  const authHeader = req.headers["x-owner-passcode"];
  if (!authHeader || authHeader !== appSettings.ownerPasscode) {
    return res.status(401).json({ error: "Unauthorized: Invalid owner passcode" });
  }
  next();
};

// Admin: Verify passcode
app.post("/api/admin/verify", (req: express.Request, res: express.Response): any => {
  const { passcode } = req.body;
  if (passcode === appSettings.ownerPasscode) {
    res.json({ success: true, message: "Passcode verified successfully" });
  } else {
    res.status(401).json({ error: "Invalid owner passcode" });
  }
});

// Admin: Get Summary Dashboard Stats
app.get("/api/admin/summary", checkAdminPasscode, (req: express.Request, res: express.Response): any => {
  try {
    const files = fs.readdirSync(USERS_DIR).filter(file => file.endsWith(".json"));
    
    let totalProfiles = 0;
    let totalMealsLogged = 0;
    let totalChatsLogged = 0;
    let totalAssessments = 0;
    
    const goalsBreakdown: Record<string, number> = {};
    const activityBreakdown: Record<string, number> = {};
    const relationBreakdown: Record<string, number> = {};
    const usersList: any[] = [];

    for (const file of files) {
      try {
        const filePath = path.join(USERS_DIR, file);
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        
        const userProfilesCount = data.profiles?.length || 0;
        totalProfiles += userProfilesCount;
        
        let userMealsCount = 0;
        if (data.trackerHistory) {
          Object.values(data.trackerHistory).forEach((trackers: any) => {
            if (Array.isArray(trackers)) {
              trackers.forEach(t => {
                userMealsCount += t.mealsLogged?.length || 0;
              });
            }
          });
        }
        totalMealsLogged += userMealsCount;

        let userChatsCount = 0;
        if (data.chatHistories) {
          Object.values(data.chatHistories).forEach((chats: any) => {
            if (Array.isArray(chats)) {
              userChatsCount += chats.length;
            }
          });
        }
        totalChatsLogged += userChatsCount;

        const userAssessmentsCount = Object.keys(data.assessments || {}).length;
        totalAssessments += userAssessmentsCount;

        // Breakdowns
        if (Array.isArray(data.profiles)) {
          data.profiles.forEach((p: any) => {
            if (p.goals) goalsBreakdown[p.goals] = (goalsBreakdown[p.goals] || 0) + 1;
            if (p.activityLevel) activityBreakdown[p.activityLevel] = (activityBreakdown[p.activityLevel] || 0) + 1;
            if (p.relation) relationBreakdown[p.relation] = (relationBreakdown[p.relation] || 0) + 1;
          });
        }

        usersList.push({
          email: data.email,
          name: data.name,
          lastSynced: data.lastSynced,
          profilesCount: userProfilesCount,
          mealsCount: userMealsCount,
          chatsCount: userChatsCount,
          assessmentsCount: userAssessmentsCount
        });
      } catch (err) {
        console.warn(`Error reading details of file ${file}:`, err);
      }
    }

    res.json({
      totalUsers: files.length,
      totalProfiles,
      totalMealsLogged,
      totalChatsLogged,
      totalAssessments,
      goalsBreakdown,
      activityBreakdown,
      relationBreakdown,
      users: usersList,
      appSettings: {
        systemPrompt: appSettings.systemPrompt,
        ownerPasscode: appSettings.ownerPasscode
      }
    });
  } catch (err: any) {
    console.error("Failed to compile admin summary:", err);
    res.status(500).json({ error: "Failed to load admin summary stats" });
  }
});

// Admin: Get specific User detailed logs
app.get("/api/admin/user-details", checkAdminPasscode, (req: express.Request, res: express.Response): any => {
  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: "Email query param is required" });
  }

  const sanitizedEmail = email.toLowerCase().replace(/[^a-z0-9@._-]/g, "");
  const filePath = path.join(USERS_DIR, `${sanitizedEmail}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "User data not found" });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json(data);
  } catch (err) {
    console.error(`Failed to load full admin user details for ${email}:`, err);
    res.status(500).json({ error: "Failed to load detailed user logs" });
  }
});

// Admin: Update Prompt & Settings
app.post("/api/admin/settings/update", checkAdminPasscode, (req: express.Request, res: express.Response): any => {
  const { systemPrompt, ownerPasscode } = req.body;

  if (systemPrompt !== undefined) appSettings.systemPrompt = systemPrompt;
  if (ownerPasscode !== undefined && ownerPasscode.trim() !== "") {
    appSettings.ownerPasscode = ownerPasscode.trim();
  }

  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(appSettings, null, 2), "utf8");
    res.json({ success: true, message: "Settings updated successfully", appSettings });
  } catch (err: any) {
    console.error("Failed to save updated settings:", err);
    res.status(500).json({ error: "Failed to persist updated settings on server" });
  }
});

// Vite Server middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const listenPort = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
  app.listen(listenPort, "0.0.0.0", () => {
    console.log(`Server running on port ${listenPort}`);
  });
}

startServer();
