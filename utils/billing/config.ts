// utils/billing/config.ts
// Billing Konfiguration

export const BILLING_CONFIG = {
  // RevenueCat API Keys
  // Diese findest du in deinem RevenueCat Dashboard unter Project Settings > API Keys
  REVENUECAT_API_KEY_ANDROID: 'YOUR_ANDROID_API_KEY_HERE', // TODO: Ersetze mit deinem echten Key
  REVENUECAT_API_KEY_IOS: 'YOUR_IOS_API_KEY_HERE', // TODO: Ersetze mit deinem echten Key
  
  // Google Play Product IDs
  // Diese müssen exakt mit den IDs in der Google Play Console übereinstimmen
  GOOGLE_PLAY_PRODUCTS: {
    // Consumables (Einmalkäufe)
    COFFEE: 'de.playfusiongate.sudokuduo.coffee',
    BREAKFAST: 'de.playfusiongate.sudokuduo.breakfast',
    LUNCH: 'de.playfusiongate.sudokuduo.lunch',
    FEAST: 'de.playfusiongate.sudokuduo.feast',
    
    // Subscriptions (Abonnements)
    MONTHLY_SUB: 'de.playfusiongate.sudokuduo.monthly',
    YEARLY_SUB: 'de.playfusiongate.sudokuduo.yearly'
  }
};