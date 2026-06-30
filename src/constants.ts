/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgeCategoryDetails, Profile, DailyTracker } from './types';

export const AGE_CATEGORIES: AgeCategoryDetails[] = [
  {
    name: 'Newborn',
    ageRange: '0–12 Months',
    description: 'Critical milk feeding phase and slow transition to single-ingredient solid purées.',
    keyFocus: 'Brain development, immune building, allergen safety, motor coordination.',
    iconName: 'Baby'
  },
  {
    name: 'Toddlers',
    ageRange: '1–3 Years',
    description: 'High energy requirements for rapid growth, solid food integration, and active sensory exploration.',
    keyFocus: 'Nutrient-dense finger foods, motor skill play, foundational speech, physical security.',
    iconName: 'Smile'
  },
  {
    name: 'Children',
    ageRange: '4–12 Years',
    description: 'Active learning, sports, peer interactions, and skeletal growth bone consolidation.',
    keyFocus: 'Calcium, full whole foods diet, cognitive development, cardiovascular conditioning.',
    iconName: 'Sparkles'
  },
  {
    name: 'Teenagers',
    ageRange: '13–19 Years',
    description: 'Rapid hormonal adjustments, bone density build, high energy output, and mental self-awareness.',
    keyFocus: 'Hormonal nutrition balance, iron (especially for females), postural exercises, joint strength.',
    iconName: 'Flame'
  },
  {
    name: 'Young Adults',
    ageRange: '20–35 Years',
    description: 'Peak physical condition, high cognitive stress, carrier building, and potential child rearing.',
    keyFocus: 'Metabolic optimization, intense muscle building, stress management, cardiovascular stamina.',
    iconName: 'Zap'
  },
  {
    name: 'Middle Age Adults',
    ageRange: '36–55 Years',
    description: 'Metabolic slowing, hormonal transition, muscle preservation, and lifestyle disease hazard prevention.',
    keyFocus: 'Anti-inflammatory diets, core core strength, lipid tracking, sleep quality.',
    iconName: 'Activity'
  },
  {
    name: 'Senior Citizens',
    ageRange: '56+ Years',
    description: 'Joint lubrication, muscle preservation, vascular integrity, and longevity optimization.',
    keyFocus: 'High digestible protein, bone density maintenance, mobility/flexibility stretching, balance drills.',
    iconName: 'Heart'
  }
];

export function getAgeCategory(age: number): string {
  if (age < 1) return 'Newborn';
  if (age <= 3) return 'Toddlers';
  if (age <= 12) return 'Children';
  if (age <= 19) return 'Teenagers';
  if (age <= 35) return 'Young Adults';
  if (age <= 55) return 'Middle Age Adults';
  return 'Senior Citizens';
}

export const EXERCISE_LIBRARY = {
  'Newborn': [
    {
      id: 'nb-1',
      name: 'Tummy Time',
      duration: '5-10 mins',
      intensity: 'Low',
      description: 'Place baby on tummy while awake to strengthen neck and shoulder muscles.',
      bestForBodyType: ['Not Specified'],
      instructions: [
        'Place a clean, soft blanket on a flat, firm floor surface.',
        'Gently lay the baby down on their stomach facing forward.',
        'Place colorful toys or yourself in front of them to encourage head lifting.',
        'Perform this for 3 to 5 minute stretches, supervising closely at all times.'
      ]
    },
    {
      id: 'nb-2',
      name: 'Bicycle Legs',
      duration: '3-5 mins',
      intensity: 'Low',
      description: 'Gently cycle baby legs to alleviate digestive discomfort.',
      bestForBodyType: ['Not Specified'],
      instructions: [
        'Lay the baby flat on their back on a soft, comfortable surface.',
        'Gently hold the baby\'s feet or lower legs with your hands.',
        'Carefully push one knee up toward their chest while keeping the other leg straight.',
        'Alternate legs in a smooth, slow, cycling motion to help relieve trapped gas.'
      ]
    },
    {
      id: 'nb-3',
      name: 'Reach & Grasp Play',
      duration: '10 mins',
      intensity: 'Low',
      description: 'Hold safe colorful toys just out of reach to encourage coordination.',
      bestForBodyType: ['Not Specified'],
      instructions: [
        'Position the baby comfortably on their back or in a supported sitting pose.',
        'Hold a bright, rattle-style or textured toy about 8-12 inches above their chest.',
        'Shake or squeak the toy gently to catch their attention and focus.',
        'Slowly bring it slightly closer to encourage reaching, grasping, and visual tracking.'
      ]
    }
  ],
  'Toddlers': [
    {
      id: 'td-1',
      name: 'Obstacle Course Crawling',
      duration: '15 mins',
      intensity: 'Medium',
      description: 'Arrange soft cushions and toys on the floor to navigate.',
      bestForBodyType: ['Not Specified'],
      instructions: [
        'Select a spacious room and clear any sharp objects or hazards.',
        'Arrange lightweight pillows, folded blankets, and soft toys in a winding path.',
        'Demonstrate crawling over the obstacles to spark the toddler\'s interest.',
        'Guide and praise them as they crawl, climb, and wiggle through the course.'
      ]
    },
    {
      id: 'td-2',
      name: 'Freeze Dance',
      duration: '10 mins',
      intensity: 'Medium',
      description: 'Dance to music and stop when it pauses to develop response control.',
      bestForBodyType: ['Not Specified'],
      instructions: [
        'Play cheerful, high-energy music in an open room.',
        'Encourage the toddler to shake, jump, and wiggle along with the rhythm.',
        'Suddenly pause the music and shout "Freeze!", holding a funny pose.',
        'Wait a few seconds, then resume the music. This builds cognitive impulse control.'
      ]
    },
    {
      id: 'td-3',
      name: 'Mimic Animal Walks',
      duration: '10 mins',
      intensity: 'Medium',
      description: 'Hop like a frog, waddle like a duck, or crawl like a bear.',
      bestForBodyType: ['Not Specified'],
      instructions: [
        'Call out an animal name clearly to start the movement theme.',
        'Frog: squat low and hop forward with both hands touching the ground.',
        'Bear: crawl on hands and feet with hips raised high in the air.',
        'Waddle: tuck elbows like wings and take small rocking steps to walk like a duck.'
      ]
    }
  ],
  'Children': [
    {
      id: 'ch-1',
      name: 'Playground Free Play',
      duration: '30 mins',
      intensity: 'Medium',
      description: 'Climbing structures, monkey bars, and slide navigation.',
      bestForBodyType: ['Ectomorph', 'Mesomorph', 'Endomorph'],
      instructions: [
        'Allow the child to explore playground structures under general supervision.',
        'Encourage climbing up ladders and ladders/nets to develop full-body grip strength.',
        'Perform hanging on monkey bars to build shoulder stability and core control.',
        'Run between play stations to develop stamina and cardiorespiratory agility.'
      ]
    },
    {
      id: 'ch-2',
      name: 'Bicycle / Scooter Riding',
      duration: '20 mins',
      intensity: 'Medium',
      description: 'Encourage cardiovascular capacity and vestibular balancing.',
      bestForBodyType: ['Ectomorph', 'Mesomorph', 'Endomorph'],
      instructions: [
        'Equip the child with a certified safety helmet and joint pads.',
        'Find a flat, paved area away from vehicle traffic or steep slopes.',
        'Practice pushing off and maintaining momentum to build vestibular balance.',
        'Encourage steady pedaling and safe braking techniques to develop spatial reflexes.'
      ]
    },
    {
      id: 'ch-3',
      name: 'Kids Core Gymnastics',
      duration: '15 mins',
      intensity: 'Low',
      description: 'Cartwheels, forward rolls, and stretching routines.',
      bestForBodyType: ['Ectomorph', 'Mesomorph', 'Endomorph'],
      instructions: [
        'Roll out an exercise mat on a flat surface.',
        'Practice basic forward rolls by tucking the chin tightly to the chest.',
        'Attempt cartwheels or side-to-side bunny hops to practice weight bearing on hands.',
        'Finish with simple hamstring and shoulder stretches to maintain soft tissue elasticity.'
      ]
    }
  ],
  'Teenagers': [
    {
      id: 'tn-1',
      name: 'Bodyweight Calisthenics',
      duration: '30 mins',
      intensity: 'High',
      description: 'Push-ups, pull-ups, squats, and lunges for fundamental strength.',
      bestForBodyType: ['Mesomorph', 'Ectomorph'],
      instructions: [
        'Start with a 5-minute dynamic warm-up of arm circles and torso twists.',
        'Perform 3 sets of 10-12 controlled squats, keeping the chest high and knees aligned.',
        'Do 3 sets of push-ups (on toes or knees), focusing on a rigid torso and full depth.',
        'Execute static hanging or pull-ups if a bar is available, followed by walking lunges.'
      ]
    },
    {
      id: 'tn-2',
      name: 'Cardio Interval Running',
      duration: '25 mins',
      intensity: 'High',
      description: '30s sprint followed by 1 min walk, repeating 10 times.',
      bestForBodyType: ['Endomorph', 'Mesomorph'],
      instructions: [
        'Warm up with 5 minutes of steady jogging or brisk walking.',
        'Sprint at 85-90% of maximum effort for exactly 30 seconds.',
        'Recover immediately by walking slowly or light jogging for 60 seconds.',
        'Repeat this cycle 10 times, then cool down with a 5-minute slow walk.'
      ]
    },
    {
      id: 'tn-3',
      name: 'Vinyasa Flow Yoga',
      duration: '20 mins',
      intensity: 'Low',
      description: 'Improves posture, flexibility, and mitigates academic stress.',
      bestForBodyType: ['Ectomorph', 'Endomorph', 'Mesomorph'],
      instructions: [
        'Begin in a comfortable seated position, focusing on deep nasal breathing.',
        'Flow through Sun Salutations: plank, low push-up (chaturanga), upward dog, and downward dog.',
        'Hold standing poses like Warrior II and Triangle for 5 breaths on each side.',
        'Conclude with 3 minutes of silent meditation in Savasana (corpse pose) to relieve mental tension.'
      ]
    }
  ],
  'Young Adults': [
    {
      id: 'ya-1',
      name: 'High-Intensity Circuit Training',
      duration: '30 mins',
      intensity: 'High',
      description: 'Burpees, kettlebell swings, and jump lunges for maximum metabolic rate.',
      bestForBodyType: ['Endomorph'],
      instructions: [
        'Perform each of the 4 exercises for 45 seconds followed by 15 seconds of rest.',
        'Exercise 1: Burpees - drop to plank, push-up, jump up with hands overhead.',
        'Exercise 2: Kettlebell Swings - hinge at hips, power through glutes to swing bell to eye level.',
        'Exercise 3: Jump Lunges - switch legs explosively in mid-air, landing softly.',
        'Complete 4 total rounds of this circuit with a 2-minute break between rounds.'
      ]
    },
    {
      id: 'ya-2',
      name: 'Hypertrophy Weight Training',
      duration: '45 mins',
      intensity: 'High',
      description: 'Targeted muscular overload with dumbbells or gym equipment.',
      bestForBodyType: ['Ectomorph', 'Mesomorph'],
      instructions: [
        'Select dumbbells or weights where you reach muscular fatigue in 8-12 repetitions.',
        'Focus on key compound lifts: Dumbbell Chest Press, Bent-over Rows, and Dumbbell Goblet Squats.',
        'Maintain a 2-second concentric (lifting) phase and a 3-second eccentric (lowering) phase.',
        'Rest for 90 seconds between sets. Perform 3-4 sets of each exercise with perfect posture.'
      ]
    },
    {
      id: 'ya-3',
      name: 'Running / Power Row',
      duration: '30 mins',
      intensity: 'Medium',
      description: 'Steady state zone-2 cardio for long term mitochondrial wellness.',
      bestForBodyType: ['Endomorph', 'Mesomorph'],
      instructions: [
        'Adjust the rowing machine damper setting to a moderate level (4 to 6).',
        'Initiate the drive phase by pushing powerfully with your legs first.',
        'Lean back slightly and pull the handle toward your lower ribs with your arms.',
        'Maintain a steady, rhythmic breathing cycle, targeting a heart rate around 130-145 BPM.'
      ]
    }
  ],
  'Middle Age Adults': [
    {
      id: 'ma-1',
      name: 'Full Body Kettlebell Flow',
      duration: '30 mins',
      intensity: 'Medium',
      description: 'Swings, goblet squats, and rows to preserve posture and skeletal safety.',
      bestForBodyType: ['Mesomorph', 'Ectomorph'],
      instructions: [
        'Hold a light-to-medium kettlebell with both hands in front of your pelvis.',
        'Perform 15 Kettlebell Swings, driving from the hips with a flat back.',
        'Transition into 10 Goblet Squats, holding the kettlebell close to your chest.',
        'Follow with 10 Single-arm Rows on each side, pulling the bell toward your hip socket.'
      ]
    },
    {
      id: 'ma-2',
      name: 'Pilates Core Fusion',
      duration: '20 mins',
      intensity: 'Medium',
      description: 'Focuses heavily on deep abdominal transverse stabilizer muscles.',
      bestForBodyType: ['Ectomorph', 'Endomorph', 'Mesomorph'],
      instructions: [
        'Lie flat on your back on a mat, lifting legs to tabletop position (90 degrees).',
        'Perform the Pilates Hundred: pump arms rapidly up and down while curling head and shoulders off the mat.',
        'Incorporate Single-Leg Stretches, keeping the lower back pressed firmly into the floor.',
        'Finish with a 1-minute forearm plank, pulling the navel tightly toward the spine.'
      ]
    },
    {
      id: 'ma-3',
      name: 'Vascular Power Walk',
      duration: '40 mins',
      intensity: 'Low',
      description: 'Brisk pace walk designed to reduce fasting blood glucose levels.',
      bestForBodyType: ['Endomorph'],
      instructions: [
        'Walk at a fast pace where talking is possible but singing would be difficult.',
        'Swing your arms naturally and roll through the entire foot from heel to toe.',
        'Look forward (not at the floor) to maintain a neutral, upright spine.',
        'Try to walk outdoors on variable terrain or on a slight treadmill incline (1.5 - 3.0%).'
      ]
    }
  ],
  'Senior Citizens': [
    {
      id: 'sc-1',
      name: 'Joint-Friendly Water Aerobics',
      duration: '30 mins',
      intensity: 'Medium',
      description: 'Water resistance movements reducing load on arthritic knees.',
      bestForBodyType: ['Endomorph', 'Mesomorph', 'Ectomorph'],
      instructions: [
        'Enter the pool so the water level is at chest height to reduce skeletal weight load.',
        'Warm up with 5 minutes of high-knee water marching, pumping your arms underwater.',
        'Perform lateral side-stepping across the pool width against water resistance.',
        'Incorporate chest presses and arm circles utilizing foam water dumbbells for resistance.'
      ]
    },
    {
      id: 'sc-2',
      name: 'Silver Balance & Ankle Drills',
      duration: '15 mins',
      intensity: 'Low',
      description: 'Single-leg balancing, heel-to-toe walking to reduce falling accidents.',
      bestForBodyType: ['Ectomorph', 'Endomorph', 'Mesomorph', 'Not Specified'],
      instructions: [
        'Stand near a sturdy wall or high-backed chair for balance support.',
        'Lift one foot 2 inches off the ground and hold for 15-30 seconds. Alternate legs.',
        'Walk in a straight line placing the heel of one foot directly in front of the toes of the other.',
        'Practice 10 slow calf raises, rising onto your toes and lowering back down control.'
      ]
    },
    {
      id: 'sc-3',
      name: 'Seated Resistance Bands',
      duration: '20 mins',
      intensity: 'Low',
      description: 'Rowing, shoulder pulls, and leg presses utilizing elastic tension.',
      bestForBodyType: ['Ectomorph', 'Mesomorph'],
      instructions: [
        'Sit tall in a sturdy chair with feet flat and core engaged.',
        'Row: loop the resistance band under both feet and pull handles toward hips.',
        'Shoulder Press: sit on the center of the band and press handles straight up over shoulders.',
        'Leg Press: loop the band under one foot, hold handles, and slowly extend that leg forward.'
      ]
    }
  ]
};

export const RECIPIES_LIBRARY = {
  'Newborn': [
    { name: 'Iron-Fortified Oat Paste', cal: 120, macro: '15g Carbs, 3g Protein, 2g Fat', notes: 'Best introduced around 6-7 months with breast milk.' },
    { name: 'Creamed Avocado & Banana puree', cal: 180, macro: '18g Carbs, 2g Protein, 10g Fat', notes: 'High in clean brain-supporting monounsaturated fats.' },
    { name: 'Steamed Sweet Potato mash', cal: 110, macro: '24g Carbs, 1.5g Protein, 0.2g Fat', notes: 'Excellent source of Vitamin A and mild natural sweetness.' }
  ],
  'Toddlers': [
    { name: 'Broccoli-Cheddar Egg Muffins', cal: 150, macro: '2g Carbs, 10g Protein, 8g Fat', notes: 'Great finger food, loaded with calcium and high quality choline.' },
    { name: 'Berry Green Yogurt Smoothie', cal: 200, macro: '26g Carbs, 12g Protein, 3g Fat', notes: 'Hides spinach under antioxidant-rich sweet blueberries.' },
    { name: 'Turkey & Hummus Pinwheels', cal: 220, macro: '18g Carbs, 14g Protein, 6g Fat', notes: 'Easy to hold bite-sized energy boost.' }
  ],
  'Children': [
    { name: 'Golden Oatmeal with Peanut Butter & Apples', cal: 320, macro: '42g Carbs, 10g Protein, 11g Fat', notes: 'Topped with hemp seeds for cellular growth building blocks.' },
    { name: 'Baked Salmon nuggets with sweet potato fries', cal: 380, macro: '30g Carbs, 22g Protein, 12g Fat', notes: 'Loaded with DHA omega-3s supporting school focus.' },
    { name: 'Quinoa & Veggie Fried Rice', cal: 290, macro: '38g Carbs, 9g Protein, 7g Fat', notes: 'Full of colorful micronutrient vegetables and complex fibers.' }
  ],
  'Teenagers': [
    { name: 'Double Protein Power Bowl', cal: 550, macro: '52g Carbs, 35g Protein, 15g Fat', notes: 'Greek yogurt base topped with mixed nuts, granola, and organic honey.' },
    { name: 'Grilled Chicken & Quinoa Avocado Salad', cal: 620, macro: '45g Carbs, 42g Protein, 18g Fat', notes: 'Packed with muscle tissue repair builders and iron.' },
    { name: 'Lentil & Sweet Potato Chili', cal: 410, macro: '58g Carbs, 18g Protein, 4g Fat', notes: 'High fiber, vegetarian friendly, provides durable complex carbs.' }
  ],
  'Young Adults': [
    { name: 'Pro-Gain Beef & Rice Burrito Bowl', cal: 680, macro: '65g Carbs, 48g Protein, 20g Fat', notes: 'Brown rice, grilled lean beef, black beans, pico de gallo.' },
    { name: 'Smoked Salmon & Poached Egg Toast', cal: 430, macro: '24g Carbs, 28g Protein, 16g Fat', notes: 'Omega-3 rich breakfast, supports high cognitive workloads.' },
    { name: 'Spiced Tempeh & Broccoli Stir-Fry', cal: 390, macro: '35g Carbs, 24g Protein, 12g Fat', notes: 'Low glycemic index, rich vegan-friendly pre-workout fuel.' }
  ],
  'Middle Age Adults': [
    { name: 'Anti-Inflammatory Salmon & Asparagus', cal: 420, macro: '8g Carbs, 36g Protein, 18g Fat', notes: 'Drizzled with extra virgin olive oil, rich in cardioprotective polyphenols.' },
    { name: 'Mediterranean Chickpea & Feta Salad', cal: 360, macro: '32g Carbs, 14g Protein, 12g Fat', notes: 'Packed with plant fiber, red onions, cucumbers, and lemon vinaigrette.' },
    { name: 'Tofu & Mixed Mushrooms in bone broth', cal: 280, macro: '12g Carbs, 20g Protein, 9g Fat', notes: 'Immune reinforcing, supports hormonal safety indicators.' }
  ],
  'Senior Citizens': [
    { name: 'Soft Flaky Lemon Cod with Spinach purée', cal: 290, macro: '10g Carbs, 26g Protein, 8g Fat', notes: 'Easy to chew, extremely rich in highly bioavailable light proteins.' },
    { name: 'Bone-Strength Chia Milk Pudding with Walnuts', cal: 240, macro: '18g Carbs, 8g Protein, 12g Fat', notes: 'Calcium-rich base loaded with cognitive protecting walnut fats.' },
    { name: 'Lentil Veggie Mash', cal: 210, macro: '28g Carbs, 12g Protein, 3g Fat', notes: 'Gentle on digestives, full of critical blood-pressure managing potassium.' }
  ]
};

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'p-self',
    name: 'Avasthi Manoj',
    age: 35,
    gender: 'Male',
    height: 178,
    weight: 76,
    activityLevel: 'Moderately Active',
    goals: 'Healthy Lifestyle',
    medicalConditions: ['None'],
    dietPreference: 'Vegetarian',
    relation: 'Self',
    createdAt: new Date().toISOString(),
    chest: 102,
    waist: 86,
    hips: 98,
    bodyFat: 18,
    bodyType: 'Mesomorph'
  },
  {
    id: 'p-child',
    name: 'Aarav Manoj',
    age: 2,
    gender: 'Male',
    height: 88,
    weight: 12.5,
    activityLevel: 'Very Active',
    goals: 'Child Development',
    medicalConditions: ['None'],
    dietPreference: 'Vegetarian',
    relation: 'Child',
    createdAt: new Date().toISOString(),
    chest: 52,
    waist: 50,
    hips: 52,
    bodyFat: 15,
    bodyType: 'Not Specified'
  },
  {
    id: 'p-grandparent',
    name: 'Robert Manoj',
    age: 68,
    gender: 'Male',
    height: 170,
    weight: 72,
    activityLevel: 'Lightly Active',
    goals: 'Senior Fitness',
    medicalConditions: ['Hypertension'],
    dietPreference: 'Vegetarian',
    relation: 'Grandparent',
    createdAt: new Date().toISOString(),
    chest: 98,
    waist: 94,
    hips: 100,
    bodyFat: 24,
    bodyType: 'Endomorph'
  }
];

export const INITIAL_TRACKER_HISTORY: DailyTracker[] = [
  {
    date: '2026-06-29',
    waterIntake: 2200,
    steps: 7200,
    sleep: 7.2,
    exerciseDuration: 25,
    caloriesConsumed: 1850,
    caloriesBurned: 350,
    mealsLogged: [
      { id: 'ml-1', mealType: 'Breakfast', name: 'Golden Oatmeal with honey', calories: 310, protein: 8, carbs: 45, fat: 5 },
      { id: 'ml-2', mealType: 'Lunch', name: 'Mediterranean Salad with Feta', calories: 360, protein: 12, carbs: 32, fat: 12 },
      { id: 'ml-3', mealType: 'Dinner', name: 'Quinoa & Veggie Stir-fry', calories: 420, protein: 14, carbs: 55, fat: 8 }
    ]
  },
  {
    date: '2026-06-28',
    waterIntake: 2600,
    steps: 9200,
    sleep: 8,
    exerciseDuration: 40,
    caloriesConsumed: 2100,
    caloriesBurned: 420,
    mealsLogged: [
      { id: 'ml-4', mealType: 'Breakfast', name: 'Fruit Smoothie Bowl', calories: 280, protein: 9, carbs: 40, fat: 4 },
      { id: 'ml-5', mealType: 'Lunch', name: 'Paneer Wrap & Hummus', calories: 510, protein: 22, carbs: 50, fat: 14 },
      { id: 'ml-6', mealType: 'Dinner', name: 'Brown Rice with Dal', calories: 450, protein: 18, carbs: 65, fat: 6 }
    ]
  },
  {
    date: '2026-06-27',
    waterIntake: 1800,
    steps: 5400,
    sleep: 6.5,
    exerciseDuration: 15,
    caloriesConsumed: 1950,
    caloriesBurned: 220,
    mealsLogged: [
      { id: 'ml-7', mealType: 'Breakfast', name: 'Toast with Avocado & Tea', calories: 290, protein: 7, carbs: 35, fat: 10 }
    ]
  },
  {
    date: '2026-06-26',
    waterIntake: 2500,
    steps: 11000,
    sleep: 7.5,
    exerciseDuration: 50,
    caloriesConsumed: 2250,
    caloriesBurned: 510,
    mealsLogged: []
  },
  {
    date: '2026-06-25',
    waterIntake: 2400,
    steps: 8100,
    sleep: 7,
    exerciseDuration: 30,
    caloriesConsumed: 2000,
    caloriesBurned: 320,
    mealsLogged: []
  }
];
