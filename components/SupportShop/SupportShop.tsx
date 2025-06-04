import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import Animated, {
  FadeIn,
  SlideInUp,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/utils/theme/ThemeProvider";

// Components
import Banner from "./components/Banner";
import ProductCard from "./components/ProductCard";
import SubscriptionCard from "./components/SubscriptionCard";
import PurchaseOverlay from "./components/PurchaseOverlay";

// Utils
import BillingManager, { Product } from "@/utils/billing/BillingManager";
import { getRandomConfirmMessage } from "./utils/supportMessages";
import styles from "./SupportShop.styles";

interface SupportShopProps {
  onClose: () => void;
}

const SupportShop: React.FC<SupportShopProps> = ({ onClose }) => {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptions, setSubscriptions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [billingManager, setBillingManager] = useState<BillingManager | null>(
    null
  );
  const [currentPurchase, setCurrentPurchase] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState({
    visible: false,
    title: "",
    message: "",
  });

  // Decide which product to mark as popular (typically mid-tier)
  const getPopularProductId = () => {
    return "sudoku_lunch";
  };

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
          "Verbindungsfehler",
          "Es konnte keine Verbindung zum Store hergestellt werden.",
          [{ text: "OK", onPress: onClose }]
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
        "Fehler beim Kauf",
        "Beim Kaufvorgang ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
        [{ text: "OK" }]
      );
    }
  };

  // Handle successful purchase
  const handlePurchaseCompleted = (purchase: any) => {
    // Strong success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Show success state in overlay
    setPurchaseSuccess(true);

    // Get random thank you message
    const { title, message } = getRandomConfirmMessage();

    // After delay, hide overlay and show toast
    setTimeout(() => {
      setPurchasing(false);
      setPurchaseSuccess(false);
      setCurrentPurchase(null);

      // Show success message toast
      setSuccessMessage({
        visible: true,
        title,
        message,
      });

      // Auto-hide message after delay
      setTimeout(() => {
        setSuccessMessage((prev) => ({ ...prev, visible: false }));
      }, 4000);
    }, 2000);
  };

  // Handle purchase error
  const handlePurchaseError = (error: any) => {
    // Error haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // Reset state
    setPurchasing(false);
    setPurchaseSuccess(false);
    setCurrentPurchase(null);

    // Show error alert
    Alert.alert(
      "Kauf nicht abgeschlossen",
      "Beim Kaufvorgang ist ein Problem aufgetreten. Keine Sorge, es wurde nichts abgebucht.",
      [{ text: "OK" }]
    );
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Unterstützung
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Lade Unterstützungsoptionen...
          </Text>
        </View>
      </View>
    );
  }

  // Main shop view
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
          Unterstützung
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
        {/* Banner */}
        <Animated.View entering={FadeIn.duration(400)}>
          <Banner
            primaryColor={colors.primary}
            secondaryColor={colors.primaryDark}
          />
        </Animated.View>

        {/* One-time support section */}
        <Animated.View entering={SlideInUp.delay(200).duration(500)}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Einmalige Unterstützung
          </Text>

          

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
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Regelmäßige Unterstützung
          </Text>

          

          {subscriptions.map((subscription, index) => (
            <SubscriptionCard
              key={subscription.productId}
              subscription={subscription}
              index={index}
              onPress={handlePurchase}
              isBestValue={subscription.productId === "yearly_support"}
              disabled={purchasing}
            />
          ))}
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
            Schön, dass du da bist. Wenn du mich unterstützen möchtest, freut mich das riesig – danke dir!
          </Text>
          <Text style={styles.thanksEmoji}>❤️</Text>
        </Animated.View>
      </ScrollView>

      {/* Purchase overlay */}
      {purchasing && (
        <PurchaseOverlay
          visible={purchasing}
          isSuccess={purchaseSuccess}
          title={purchaseSuccess ? "Vielen Dank!" : "Verarbeite Kauf..."}
          message={
            purchaseSuccess
              ? "Deine Unterstützung bedeutet mir sehr viel!"
              : "Bitte warte einen Moment"
          }
          primaryColor={currentPurchase?.color || colors.primary}
        />
      )}

      {/* Success toast message */}
      {successMessage.visible && (
        <Animated.View
          style={[
            styles.successMessage,
            { backgroundColor: theme.isDark ? colors.card : "white" },
          ]}
          entering={SlideInUp.duration(300)}
          exiting={SlideOutDown.duration(300)}
        >
          <View style={styles.successIcon}>
            <Feather name="check-circle" size={24} color={colors.success} />
          </View>
          <View style={styles.successTextContainer}>
            <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
              {successMessage.title}
            </Text>
            <Text
              style={[styles.successSubtitle, { color: colors.textSecondary }]}
            >
              {successMessage.message}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default SupportShop;
