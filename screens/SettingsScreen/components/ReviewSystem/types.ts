// components/ReviewSystem/types.ts

export type Rating = 1 | 2 | 3 | 4 | 5;

export type FeedbackCategory = 
  | 'problem'        // Ein Problem ist aufgetreten
  | 'missing'        // Funktionen fehlen
  | 'idea'           // Eine Idee für die App
  | 'complicated'    // Kompliziert zu bedienen
  | 'other';         // Sonstiges

export interface FeedbackData {
  rating: Rating;
  category?: FeedbackCategory;
  details?: string;
  email?: string; // Optional für Antwort
}

export interface ReviewManagerProps {
  // Play Store ID deiner App
  appPackageName: string;
  
  // Email-Adresse für Feedback
  feedbackEmail: string;
  
  // Callback wenn der ganze Prozess beendet ist
  onComplete?: () => void;
  
  // Callback wenn Bewertung auf PlayStore abgegeben wird
  onPlayStoreRedirect?: () => void;
  
  // Callback wenn Feedback abgesendet wird
  onFeedbackSent?: (data: FeedbackData) => void;
}