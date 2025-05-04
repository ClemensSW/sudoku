// utils.ts
import { Linking, Platform } from 'react-native';
import { FeedbackData } from './types';
import { EMAIL_CONFIG } from './constants';

/**
 * Öffnet den Google Play Store für die App-Bewertung
 * @param packageName Die Package-ID der App (z.B. 'de.playfusiongate.sudokuduo')
 * @returns Promise<boolean> ob der Store erfolgreich geöffnet wurde
 */
export const openPlayStoreForRating = async (packageName: string): Promise<boolean> => {
  try {
    // Direct Play Store App-URL (öffnet die native Play Store App wenn installiert)
    const playStoreUrl = `market://details?id=${packageName}`;
    
    // Prüfen, ob die URL geöffnet werden kann (ob Play Store App installiert ist)
    const canOpenPlayStore = await Linking.canOpenURL(playStoreUrl);
    
    if (canOpenPlayStore) {
      // Native Play Store App öffnen
      await Linking.openURL(playStoreUrl);
      return true;
    } else {
      // Fallback: Öffne Play Store im Browser
      const webPlayStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
      await Linking.openURL(webPlayStoreUrl);
      return true;
    }
  } catch (error) {
    console.error('Fehler beim Öffnen des Play Store:', error);
    return false;
  }
};

/**
 * Sendet das Feedback per E-Mail
 * @param data Feedback-Daten
 * @param emailAddress Die E-Mail-Adresse für das Feedback
 * @returns Promise<boolean> ob die E-Mail-App erfolgreich geöffnet wurde
 */
export const sendFeedbackViaEmail = async (
  data: FeedbackData,
  emailAddress: string
): Promise<boolean> => {
  try {
    // Erstelle den Betreff basierend auf der Bewertung
    const subject = `${EMAIL_CONFIG.SUBJECT_PREFIX}${data.rating} Sterne`;
    
    // Erstelle den E-Mail-Body mit den Feedback-Details
    let body = '';
    
    // Hinzufügen der Kategorie, falls vorhanden
    if (data.category) {
      body += `Kategorie: ${data.category}\n\n`;
    }
    
    // Hinzufügen der Details, falls vorhanden
    if (data.details) {
      body += `Feedback:\n${data.details}\n\n`;
    }
    
    // Hinzufügen zusätzlicher Informationen
    body += `Bewertung: ${data.rating} Sterne\n`;
    body += `Platform: ${Platform.OS} ${Platform.Version}\n`;
    
    // E-Mail URI codieren
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // E-Mail URI erstellen
    const mailtoUrl = `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Prüfen, ob eine E-Mail-App verfügbar ist
    const canOpenEmail = await Linking.canOpenURL(mailtoUrl);
    
    if (canOpenEmail) {
      // E-Mail-App öffnen
      await Linking.openURL(mailtoUrl);
      return true;
    } else {
      console.warn('Keine E-Mail-App gefunden');
      return false;
    }
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    return false;
  }
};

/**
 * Hilft beim Debugging, indem die Feedback-Daten in der Konsole angezeigt werden
 * @param data Die Feedback-Daten
 */
export const logFeedbackData = (data: FeedbackData): void => {
  console.log('Feedback erhalten:', JSON.stringify(data, null, 2));
};