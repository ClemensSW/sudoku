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
  Image,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
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
  const { status } = useSupporter();
  const supportType = status?.supportType || 'none';

  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptions, setSubscriptions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [billingManager, setBillingManager] = useState<BillingManager | null>(null);
  const [currentPurchase, setCurrentPurchase] = useState<Product | null>(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [activeSubscriptionProductId, setActiveSubscriptionProductId] = useState<string | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

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

    // KAUF REGISTRIERUNG & SHIELDS AUFFÜLLEN
    // Registriere den Kauf für den Support-Banner und fülle Schutzschilder auf
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

        // Schutzschilder auffüllen (mit productId für sofortige yearly/monthly Detection)
        const { refillShields } = await import('@/utils/dailyStreak');
        await refillShields(purchaseType, currentPurchase.productId);
        console.log(`Schutzschilder aufgefüllt - Type: ${purchaseType}, ProductId: ${currentPurchase.productId}`);
      }
    } catch (error) {
      console.error("Fehler beim Registrieren des Kaufs oder Auffüllen der Shields:", error);
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

  // Handle scroll to hide scroll indicator
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 50 && showScrollIndicator) {
      setShowScrollIndicator(false);
    }
  };

  // Handle purchase error
  const handlePurchaseError = (errorData: any) => {
    console.error("Purchase error:", errorData);
    setPurchasing(false);
    setCurrentPurchase(null);
    setPurchaseSuccess(false);

    // Don't show error for user cancellation (handled silently in BillingManager)
    if (errorData?.error?.code === 'USER_CANCELLED') {
      return;
    }

    // Get error type and determine appropriate message
    const errorType = errorData?.errorType || 'UNKNOWN';
    let title = t('errors.purchase.title');
    let message = t('errors.purchase.generic');

    // Use specific error messages based on error type
    switch (errorType) {
      case 'NETWORK_ERROR':
        title = t('errors.purchase.network.title');
        message = t('errors.purchase.network.message');
        break;
      case 'PRODUCT_NOT_AVAILABLE':
        title = t('errors.purchase.productNotAvailable.title');
        message = t('errors.purchase.productNotAvailable.message');
        break;
      case 'PURCHASE_NOT_ALLOWED':
        title = t('errors.purchase.notAllowed.title');
        message = t('errors.purchase.notAllowed.message');
        break;
      case 'STORE_PROBLEM':
        title = t('errors.purchase.storeProblem.title');
        message = t('errors.purchase.storeProblem.message');
        break;
      case 'PAYMENT_PENDING':
        title = t('errors.purchase.paymentPending.title');
        message = t('errors.purchase.paymentPending.message');
        break;
      case 'UNKNOWN':
      default:
        title = t('errors.purchase.title');
        message = t('errors.purchase.generic');
        break;
    }

    // Show error alert
    Alert.alert(title, message, [{ text: t('common.ok') }]);
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
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
          style={[
            styles.subscriptionsContainer,
            { marginBottom: activeSubscriptionProductId ? 0 : 20 }
          ]}
          entering={SlideInUp.delay(400).duration(500)}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {activeSubscriptionProductId
                ? t('sections.activeSubscription')
                : t('sections.subscription')
              }
            </Text>
            {activeSubscriptionProductId && (
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                {t('sections.activeSubscriptionSubtitle')}
              </Text>
            )}
          </View>

          <View style={[
            styles.productsGrid,
            activeSubscriptionProductId && { justifyContent: 'center' }
          ]}>
            {subscriptions
              .filter(sub =>
                activeSubscriptionProductId
                  ? sub.productId === activeSubscriptionProductId
                  : true
              )
              .map((subscription, index) => {
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
                    isFullWidth={isActive}
                  />
                );
              })
            }
          </View>
        </Animated.View>

        {/* Personal Thank You Message with Profile */}
        <Animated.View
          style={[
            styles.thanksContainer,
            {
              borderColor: colors.primary + "30",
              marginVertical: 0,
              marginTop: 16,
              marginBottom: 40,
            },
          ]}
          entering={SlideInUp.delay(600).duration(500)}
        >
          {/* Header with Profile */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, width: '100%' }}>
            <Image
              source={require('@/assets/images/profile.jpg')}
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                borderWidth: 2,
                borderColor: colors.primary + '40',
                marginRight: 16,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.textPrimary,
              }}>
                Clemens
              </Text>
              <Text style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginTop: 2,
              }}>
                {t('thanks.subtitle')}
              </Text>
            </View>
          </View>

          {/* Personal Message */}
          <Text style={{
            fontSize: 14,
            lineHeight: 20,
            color: colors.textSecondary,
            textAlign: 'left',
          }}>
            {t('thanks.personalMessage')}
          </Text>
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

      {/* Scroll Indicator */}
      {showScrollIndicator && !activeSubscriptionProductId && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: insets.bottom + 20,
            left: 0,
            right: 0,
            alignItems: 'center',
            pointerEvents: 'none',
          }}
          entering={FadeIn.delay(800).duration(600)}
          exiting={FadeOut.duration(300)}
        >
          <LinearGradient
            colors={['transparent', colors.background]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.primary + '20',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.primary + '40',
            }}
          >
            <Feather name="chevron-down" size={16} color={colors.primary} />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: colors.primary,
                marginLeft: 6,
              }}
            >
              Mehr Optionen
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default SupportShop;