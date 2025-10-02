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

// NEU: Import Navigation Control
import { useNavigationControl } from "@/app/_layout";

// Components
import Banner from "./components/Banner";
import ProductCard from "./components/ProductCard";
import SubscriptionCard from "./components/SubscriptionCard";
import PurchaseOverlay from "./components/PurchaseOverlay";

// Utils
import BillingManager, { Product } from "@/utils/billing/BillingManager";
import { getRandomConfirmMessage } from "./utils/supportMessages";
import { markAsPurchased } from "@/utils/purchaseTracking";
import styles from "./SupportShopScreen.styles";

interface SupportShopScreenProps {
  onClose: () => void;
  hideNavOnClose?: boolean; // NEU: Optional prop um zu steuern, ob Nav versteckt bleiben soll
}

const SupportShopScreen: React.FC<SupportShopScreenProps> = ({ onClose, hideNavOnClose = false }) => {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  
  // NEU: Navigation Control verwenden
  const { setHideBottomNav } = useNavigationControl();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptions, setSubscriptions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [billingManager, setBillingManager] = useState<BillingManager | null>(null);
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

  // NEU: Navigation beim Öffnen und Schließen kontrollieren
  useEffect(() => {
    // Bottom Navigation beim Öffnen verstecken
    setHideBottomNav(true);
    
    // Cleanup: Navigation nur wieder anzeigen, wenn nicht von Settings geöffnet
    return () => {
      if (!hideNavOnClose) {
        setHideBottomNav(false);
      }
    };
  }, [setHideBottomNav, hideNavOnClose]);

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
  const handlePurchaseCompleted = async (purchase: any) => {
    // Strong success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Show success state in overlay
    setPurchaseSuccess(true);

    // KAUF REGISTRIERUNG
    // Registriere den Kauf für den Support-Banner
    try {
      if (currentPurchase) {
        await markAsPurchased({
          id: currentPurchase.productId,
          name: currentPurchase.title,
          price: parseFloat(currentPurchase.price.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0,
          timestamp: new Date().toISOString(),
        });
        
        console.log("Kauf wurde registriert - Support-Banner wird entfernt");
      }
    } catch (error) {
      console.error("Fehler beim Registrieren des Kaufs:", error);
      // Fehler beim Registrieren sollte den Kauf-Flow nicht unterbrechen
    }

    // Get random thank you message
    const { title, message } = getRandomConfirmMessage();
    
    // Erweitere die Nachricht um Banner-Info
    const enhancedMessage = message + " Der Support-Banner wurde entfernt.";

    // Show success message
    setSuccessMessage({
      visible: true,
      title,
      message: enhancedMessage,
    });

    // Reset purchase states after delay
    setTimeout(() => {
      setPurchasing(false);
      setPurchaseSuccess(false);
      setCurrentPurchase(null);

      // Hide success message after another delay
      setTimeout(() => {
        setSuccessMessage({ visible: false, title: "", message: "" });
      }, 3000);

      // Close the shop if appropriate
      // You might want to keep it open so users can make additional purchases
      // onClose();
    }, 2000);
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
      "Fehler beim Kauf",
      "Es gab ein Problem beim Kaufvorgang. Bitte versuche es später erneut.",
      [{ text: "OK" }]
    );
  };

  // Get random confirmation message
  const getRandomConfirmMessage = () => {
    const messages = [
      {
        title: "Vielen Dank für deine Unterstützung!",
        message: "Dein Beitrag hilft dabei, die App kontinuierlich zu verbessern. Du bist super! 🎉"
      },
      {
        title: "Wow, du bist großartig!",
        message: "Mit deiner Unterstützung kann ich weiterhin an coolen Features arbeiten. Danke! 🙏"
      },
      {
        title: "High Five! ✋",
        message: "Danke für deine Unterstützung! Jetzt habe ich noch mehr Motivation, die App zu verbessern."
      },
      {
        title: "Jubel, Trubel, Heiterkeit! 🎊",
        message: "Deine Unterstützung sorgt für gute Laune und neue Sudoku-Features!"
      }
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Lade Produkte...
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

export default SupportShopScreen;