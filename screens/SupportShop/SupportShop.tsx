// screens/SupportShopScreen/SupportShopScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
} from "react-native";
import Animated, {
  FadeIn,
  SlideInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";

import { useNavigation } from "@/contexts/navigation";
import { useSupporter } from "@/modules/subscriptions/hooks/useSupporter";

// Components
import BenefitsBanner from "./components/BenefitsBanner";
import ThankYouModal from "./components/ThankYouModal";
import ProductCard from "./components/ProductCard";
import SubscriptionCardSimple from "./components/SubscriptionCardSimple";
import PurchaseOverlay from "./components/PurchaseOverlay";

// Utils
import BillingManager, { Product } from "./utils/billing/BillingManager";
import { markAsPurchased, getActiveSubscriptionProductId } from "./utils/purchaseTracking";
import styles from "./SupportShop.styles";

interface SupportShopScreenProps {
  onClose: () => void;
  hideNavOnClose?: boolean; // NEU: Optional prop um zu steuern, ob Nav versteckt bleiben soll
}

const SupportShop: React.FC<SupportShopScreenProps> = ({ onClose, hideNavOnClose = false }) => {
  const { t } = useTranslation('supportShop');
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  const { hideBottomNav, resetBottomNav } = useNavigation();
  const { supportType } = useSupporter();

  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptions, setSubscriptions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [billingManager, setBillingManager] = useState<BillingManager | null>(null);
  const [currentPurchase, setCurrentPurchase] = useState<Product | null>(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [activeSubscriptionProductId, setActiveSubscriptionProductId] = useState<string | null>(null);

  // Decide which product to mark as popular (typically mid-tier)
  const getPopularProductId = () => {
    return "sudoku_lunch";
  };

  // Load active subscription product ID
  useEffect(() => {
    const loadActiveSubscription = async () => {
      if (supportType === 'subscription') {
        const productId = await getActiveSubscriptionProductId();
        setActiveSubscriptionProductId(productId);
      } else {
        setActiveSubscriptionProductId(null);
      }
    };

    loadActiveSubscription();
  }, [supportType]);

  // Navigation beim Öffnen und Schließen kontrollieren
  useEffect(() => {
    // Bottom Navigation beim Öffnen verstecken
    hideBottomNav();

    // Cleanup: Reset to automatic route-based logic
    return () => {
      if (!hideNavOnClose) {
        resetBottomNav();
      }
    };
  }, [hideBottomNav, resetBottomNav, hideNavOnClose]);

  // Initialize billing and load products
  useEffect(() => {
    const manager = BillingManager.getInstance();
    setBillingManager(manager);

    // Setup billing
    const initBilling = async () => {
      try {
        // Event listeners
        manager.on("purchase-completed", handlePurchaseCompleted);
        manager.on("purchase-error", handlePurchaseError);

        // Initialize connection
        await manager.initialize();

        // Load products
        setProducts(manager.getAllProducts());
        setSubscriptions(manager.getAllSubscriptions());
        setLoading(false);
      } catch (error) {
        console.error("Error initializing billing:", error);
        setLoading(false);
        Alert.alert(
          t('errors.connection.title'),
          t('errors.connection.message'),
          [{ text: t('common.ok'), onPress: onClose }]
        );
      }
    };

    // Trigger haptic feedback on open
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    initBilling();

    // Cleanup
    return () => {
      if (manager) {
        manager.removeAllListeners("purchase-completed");
        manager.removeAllListeners("purchase-error");
      }
    };
  }, []);

  // Handle subscription management (open Play Store)
  const handleManageSubscription = async () => {
    try {
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const playStoreUrl = 'https://play.google.com/store/account/subscriptions';
      const canOpen = await Linking.canOpenURL(playStoreUrl);

      if (canOpen) {
        await Linking.openURL(playStoreUrl);
      } else {
        Alert.alert(
          t('errors.playStore.title'),
          t('errors.playStore.message'),
          [{ text: t('common.ok') }]
        );
      }
    } catch (error) {
      console.error("Error opening Play Store:", error);
      Alert.alert(
        t('errors.playStore.title'),
        t('errors.playStore.message'),
        [{ text: t('common.ok') }]
      );
    }
  };

  // Start a purchase
  const handlePurchase = async (product: Product) => {
    try {
      if (!billingManager) return;

      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Update state
      setPurchasing(true);
      setCurrentPurchase(product);

      // Start purchase process
      await billingManager.purchaseProduct(product.productId);

      // Processing happens in event handlers
    } catch (error) {
      console.error("Purchase error:", error);
      setPurchasing(false);
      setCurrentPurchase(null);

      // Show error alert
      Alert.alert(
        t('errors.purchase.title'),
        t('errors.purchase.message'),
        [{ text: t('common.ok') }]
      );
    }
  };

  // Handle successful purchase
  const handlePurchaseCompleted = async (purchase: any) => {
    // Strong success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Show success state in overlay
    setPurchaseSuccess(true);

    // KAUF REGISTRIERUNG
    // Registriere den Kauf für den Support-Banner
    try {
      if (currentPurchase) {
        // Bestimme Purchase-Typ basierend auf Product-ID
        const isSubscription = currentPurchase.productId.includes('monthly_support') ||
                              currentPurchase.productId.includes('yearly_support');
        const purchaseType = isSubscription ? 'subscription' : 'one-time';

        await markAsPurchased({
          id: currentPurchase.productId,
          name: currentPurchase.title,
          price: parseFloat(currentPurchase.price.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0,
          timestamp: new Date().toISOString(),
        }, purchaseType);

        console.log(`Kauf wurde registriert - Type: ${purchaseType}`);
      }
    } catch (error) {
      console.error("Fehler beim Registrieren des Kaufs:", error);
      // Fehler beim Registrieren sollte den Kauf-Flow nicht unterbrechen
    }

    // Reset purchase states after short delay
    setTimeout(() => {
      setPurchasing(false);
      setPurchaseSuccess(false);
      setCurrentPurchase(null);

      // Show ThankYouModal
      setShowThankYouModal(true);
    }, 1500);
  };

  // Handle purchase error
  const handlePurchaseError = (error: any) => {
    console.error("Purchase error:", error);
    setPurchasing(false);
    setCurrentPurchase(null);
    setPurchaseSuccess(false);

    // Don't show error for user cancellation
    if (error?.error?.code === 'USER_CANCELLED') {
      return;
    }

    // Show error alert for other errors
    Alert.alert(
      t('errors.generic.title'),
      t('errors.generic.message'),
      [{ text: t('common.ok') }]
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t('loading.text')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop:
              insets.top > 0 ? insets.top : Platform.OS === "ios" ? 50 : 20,
          },
        ]}
        entering={FadeIn.duration(300)}
      >
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Feather name="x" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t('header.title')}
        </Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Benefits Banner - Visual with rotating variants */}
        <Animated.View entering={FadeIn.duration(400)}>
          <BenefitsBanner
            primaryColor={colors.primary}
            secondaryColor={colors.primaryDark}
          />
        </Animated.View>

        {/* One-time support section */}
        <Animated.View entering={SlideInUp.delay(200).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('sections.oneTime')}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              {t('sections.oneTimeSubtitle')}
            </Text>
          </View>

          <View style={styles.productsGrid}>
            {products.map((product, index) => (
              <ProductCard
                key={product.productId}
                product={product}
                index={index}
                onPress={handlePurchase}
                isPopular={product.productId === getPopularProductId()}
                disabled={purchasing}
              />
            ))}
          </View>
        </Animated.View>

        {/* Subscription section */}
        <Animated.View
          style={styles.subscriptionsContainer}
          entering={SlideInUp.delay(400).duration(500)}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('sections.subscription')}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              {t('sections.subscriptionSubtitle')}
            </Text>
          </View>

          <View style={styles.productsGrid}>
            {subscriptions.map((subscription, index) => {
              const isActive = activeSubscriptionProductId === subscription.productId;
              return (
                <SubscriptionCardSimple
                  key={subscription.productId}
                  subscription={subscription}
                  index={index}
                  onPress={isActive ? handleManageSubscription : handlePurchase}
                  isBestValue={subscription.productId === "yearly_support"}
                  disabled={purchasing}
                  isActive={isActive}
                />
              );
            })}
          </View>
        </Animated.View>

        {/* Thank you message */}
        <Animated.View
          style={[
            styles.thanksContainer,
            { borderColor: colors.primary + "30" },
          ]}
          entering={SlideInUp.delay(600).duration(500)}
        >
          <Text style={[styles.thanksText, { color: colors.textPrimary }]}>
            {t('thanks.message')}
          </Text>
          <Text style={styles.thanksEmoji}>{t('thanks.emoji')}</Text>
        </Animated.View>
      </ScrollView>

      {/* Purchase overlay */}
      {purchasing && (
        <PurchaseOverlay
          visible={purchasing}
          isSuccess={purchaseSuccess}
          title={purchaseSuccess ? t('purchase.overlay.success.title') : t('purchase.overlay.processing.title')}
          message={
            purchaseSuccess
              ? t('purchase.overlay.success.message')
              : t('purchase.overlay.processing.message')
          }
          primaryColor={currentPurchase?.color || colors.primary}
        />
      )}

      {/* Thank You Modal */}
      <ThankYouModal
        visible={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        isSupporter={true}
      />
    </View>
  );
};

export default SupportShop;