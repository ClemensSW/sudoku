// types.ts
export type Rating = 1 | 2 | 3 | 4 | 5;

export type FeedbackCategory = 
  | 'problem'        // A problem occurred
  | 'missing'        // Features are missing
  | 'idea'           // An idea for the app
  | 'complicated'    // Complicated to use
  | 'other';         // Other

export interface FeedbackData {
  rating: Rating;
  category?: FeedbackCategory;
  details?: string;
  email?: string; // Optional for reply
}