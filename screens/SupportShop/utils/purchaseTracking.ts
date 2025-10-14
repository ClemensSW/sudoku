// utils/purchaseTracking.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const PURCHASE_KEY = "@user_has_purchased";
const BANNER_INTERACTIONS_KEY = "@banner_interactions";
const PURCHASE_DATE_KEY = "@purchase_date";
const PURCHASE_ITEM_KEY = "@purchased_items";
const PURCHASE_TYPE_KEY = "@purchase_type";
const ACTIVE_SUBSCRIPTION_PRODUCT_ID_KEY = "@active_subscription_product_id";

interface BannerInteraction {
  type: 'banner_click' | 'close_click' | 'dismiss';
  timestamp: string;
}

interface PurchaseItem {
  id: string;
  name: string;
  price: number;
  timestamp: string;
}

export type PurchaseType = 'one-time' | 'subscription' | 'none';

/**
 * Check if user has made any purchase
 */
export const checkHasPurchased = async (): Promise<boolean> => {
  try {
    const hasPurchased = await AsyncStorage.getItem(PURCHASE_KEY);
    return hasPurchased === "true";
  } catch (error) {
    console.error("Error checking purchase status:", error);
    return false;
  }
};

/**
 * Mark user as having purchased
 */
export const markAsPurchased = async (item?: PurchaseItem, purchaseType: PurchaseType = 'one-time'): Promise<boolean> => {
  try {
    // Set purchase flag
    await AsyncStorage.setItem(PURCHASE_KEY, "true");

    // Save purchase date
    await AsyncStorage.setItem(PURCHASE_DATE_KEY, new Date().toISOString());

    // Save purchase type
    await AsyncStorage.setItem(PURCHASE_TYPE_KEY, purchaseType);

    // Save purchased item details if provided
    if (item) {
      const existingItems = await getPurchasedItems();
      existingItems.push(item);
      await AsyncStorage.setItem(PURCHASE_ITEM_KEY, JSON.stringify(existingItems));

      // If this is a subscription, save the product ID as active
      if (purchaseType === 'subscription') {
        await AsyncStorage.setItem(ACTIVE_SUBSCRIPTION_PRODUCT_ID_KEY, item.id);
      }
    }

    return true;
  } catch (error) {
    console.error("Error marking as purchased:", error);
    return false;
  }
};

/**
 * Get all purchased items
 */
export const getPurchasedItems = async (): Promise<PurchaseItem[]> => {
  try {
    const items = await AsyncStorage.getItem(PURCHASE_ITEM_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error("Error getting purchased items:", error);
    return [];
  }
};

/**
 * Track banner interaction
 */
export const trackBannerInteraction = async (
  type: 'banner_click' | 'close_click' | 'dismiss'
): Promise<void> => {
  try {
    const existingInteractions = await getBannerInteractions();
    const newInteraction: BannerInteraction = {
      type,
      timestamp: new Date().toISOString(),
    };
    
    existingInteractions.push(newInteraction);
    
    // Keep only last 50 interactions
    const limitedInteractions = existingInteractions.slice(-50);
    
    await AsyncStorage.setItem(
      BANNER_INTERACTIONS_KEY,
      JSON.stringify(limitedInteractions)
    );
  } catch (error) {
    console.error("Error tracking banner interaction:", error);
  }
};

/**
 * Get all banner interactions
 */
export const getBannerInteractions = async (): Promise<BannerInteraction[]> => {
  try {
    const interactions = await AsyncStorage.getItem(BANNER_INTERACTIONS_KEY);
    return interactions ? JSON.parse(interactions) : [];
  } catch (error) {
    console.error("Error getting banner interactions:", error);
    return [];
  }
};

/**
 * Get purchase date if exists
 */
export const getPurchaseDate = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PURCHASE_DATE_KEY);
  } catch (error) {
    console.error("Error getting purchase date:", error);
    return null;
  }
};

/**
 * Get the type of purchase (one-time or subscription)
 */
export const getPurchaseType = async (): Promise<PurchaseType> => {
  try {
    const hasPurchased = await checkHasPurchased();
    if (!hasPurchased) return 'none';

    const purchaseType = await AsyncStorage.getItem(PURCHASE_TYPE_KEY);
    return (purchaseType as PurchaseType) || 'one-time'; // Default to one-time for legacy purchases
  } catch (error) {
    console.error("Error getting purchase type:", error);
    return 'none';
  }
};

/**
 * Check if user has an active subscription
 */
export const isSubscriptionActive = async (): Promise<boolean> => {
  try {
    const purchaseType = await getPurchaseType();
    return purchaseType === 'subscription';
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
};

/**
 * Maps Google Play product IDs to internal product IDs
 * Example: 'de.playfusiongate.sudokuduo.monthly:monthly' → 'monthly_support'
 * @param googlePlayId The Google Play product ID
 * @returns Internal product ID used in SupportShop
 */
export const mapGooglePlayIdToProductId = (googlePlayId: string | null): string | null => {
  if (!googlePlayId) return null;

  // Mapping table: Google Play ID → Internal Product ID
  const mapping: Record<string, string> = {
    'de.playfusiongate.sudokuduo.monthly:monthly': 'monthly_support',
    'de.playfusiongate.sudokuduo.yearly:yearly': 'yearly_support',
  };

  // Check if direct mapping exists
  if (mapping[googlePlayId]) {
    return mapping[googlePlayId];
  }

  // Fallback: Check if it's already an internal ID
  if (googlePlayId === 'monthly_support' || googlePlayId === 'yearly_support') {
    return googlePlayId;
  }

  // Fallback: Try to detect from Google Play ID pattern
  if (googlePlayId.includes('monthly')) {
    return 'monthly_support';
  } else if (googlePlayId.includes('yearly')) {
    return 'yearly_support';
  }

  console.warn(`[purchaseTracking] Unknown product ID: ${googlePlayId}`);
  return null;
};

/**
 * Get the active subscription product ID
 * Returns the internal product ID (e.g. 'monthly_support') used in SupportShop
 */
export const getActiveSubscriptionProductId = async (): Promise<string | null> => {
  try {
    const isActive = await isSubscriptionActive();
    if (!isActive) return null;

    const storedId = await AsyncStorage.getItem(ACTIVE_SUBSCRIPTION_PRODUCT_ID_KEY);
    // Map Google Play ID to internal product ID
    return mapGooglePlayIdToProductId(storedId);
  } catch (error) {
    console.error("Error getting active subscription product ID:", error);
    return null;
  }
};

/**
 * Reset purchase status (for testing)
 */
export const resetPurchaseStatus = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      PURCHASE_KEY,
      PURCHASE_DATE_KEY,
      PURCHASE_ITEM_KEY,
      PURCHASE_TYPE_KEY,
      BANNER_INTERACTIONS_KEY,
      ACTIVE_SUBSCRIPTION_PRODUCT_ID_KEY,
    ]);
  } catch (error) {
    console.error("Error resetting purchase status:", error);
  }
};

/**
 * Check if should show banner based on interactions
 * (e.g., don't show if dismissed too many times recently)
 */
export const shouldShowBanner = async (): Promise<boolean> => {
  try {
    // First check if purchased
    const hasPurchased = await checkHasPurchased();
    if (hasPurchased) return false;
    
    // Check recent dismissals
    const interactions = await getBannerInteractions();
    const recentDismissals = interactions.filter(
      (i) => {
        if (i.type !== 'dismiss') return false;
        const interactionDate = new Date(i.timestamp);
        const daysSince = (Date.now() - interactionDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince < 7; // Dismissals in last 7 days
      }
    );
    
    // Don't show if dismissed more than 3 times in last week
    if (recentDismissals.length >= 3) return false;
    
    return true;
  } catch (error) {
    console.error("Error checking if should show banner:", error);
    return true; // Show by default if error
  }
};