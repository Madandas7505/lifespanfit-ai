/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';

export type HealthGoal = 
  | 'Weight Loss' 
  | 'Weight Gain' 
  | 'Healthy Lifestyle' 
  | 'Child Development' 
  | 'Senior Fitness' 
  | 'Muscle Building';

export type RelationType = 'Self' | 'Child' | 'Parent' | 'Grandparent' | 'Partner' | 'Other';

export type DietPreference = 'Vegetarian' | 'Vegan' | 'Non-Vegetarian';

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
  goals: HealthGoal;
  medicalConditions: string[];
  dietPreference: DietPreference;
  relation: RelationType;
  createdAt: string;
  chest?: number;    // chest measurement in cm
  waist?: number;    // waist measurement in cm
  hips?: number;     // hips measurement in cm
  bodyFat?: number;  // body fat %
  bodyType?: 'Ectomorph' | 'Mesomorph' | 'Endomorph' | 'Not Specified';
}

export interface MealLog {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface DailyTracker {
  date: string; // YYYY-MM-DD
  waterIntake: number; // ml
  steps: number;
  sleep: number; // hours
  exerciseDuration: number; // minutes
  caloriesConsumed: number;
  caloriesBurned: number;
  mealsLogged: MealLog[];
}

export interface HealthAssessment {
  profileId: string;
  timestamp: string;
  healthScore: number;
  nutritionScore: number;
  fitnessScore: number;
  bmi: number;
  bmiCategory: string;
  idealWeightRange: string;
  caloriesTarget: number;
  summary: string;
  keyInsights: string[];
  dietaryAdvice: string[];
  exerciseAdvice: string[];
  preventiveCare: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface AgeCategoryDetails {
  name: string;
  ageRange: string;
  description: string;
  keyFocus: string;
  iconName: string;
}
