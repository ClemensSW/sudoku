// screens/Settings/components/ReviewSystem/FeedbackBottomSheet.tsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  BackHandler,
} from "react-native";
import { BottomSheetModal as GorhomBottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import CustomBottomSheetBackdrop from '@/components/BottomSheetModal/BottomSheetBackdrop';
import BottomSheetHandle from '@/components/BottomSheetModal/BottomSheetHandle';
import { useNavigation } from '@/contexts/navigation';

// Import Views
import RatingView from './views/RatingView';
import CategoryView from './views/CategoryView';
import DetailView from './views/DetailView';
import SuccessView from './views/SuccessView';

// Import Types
import { Rating, FeedbackCategory, FeedbackData } from './types';

type FeedbackView = "rating" | "category" | "detail" | "success";

interface FeedbackBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onFeedbackSubmit: (data: FeedbackData) => Promise<{ queued?: boolean }>;
  onPlayStoreRedirect?: () => void;
}

const FeedbackBottomSheet: React.FC<FeedbackBottomSheetProps> = ({
  visible,
  onClose,
  onFeedbackSubmit,
  onPlayStoreRedirect,
}) => {
  const { t } = useTranslation("feedback");
  const { colors, isDark } = useTheme();
  const { hideBottomNav, resetBottomNav } = useNavigation();

  // Navigation state
  const [currentView, setCurrentView] = useState<FeedbackView>("rating");
  const [rating, setRating] = useState<Rating | null>(null);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackQueued, setFeedbackQueued] = useState(false);

  const bottomSheetRef = useRef<GorhomBottomSheetModal>(null);

  // Snap points - expandable
  const snapPoints = useMemo(() => ['75%', '90%'], []);

  // Get current title based on view
  const getTitle = () => {
    switch (currentView) {
      case "rating":
        return t("rating.title");
      case "category":
        return t("category.title");
      case "detail":
        return t("detail.title");
      case "success":
        return t("sent.title");
      default:
        return t("rating.title");
    }
  };

  // Handle rating selection
  const handleRate = useCallback(async (selectedRating: Rating) => {
    setRating(selectedRating);

    // 5-star rating: Go to Play Store directly
    if (selectedRating === 5) {
      triggerHaptic('success');

      // Open Play Store
      if (onPlayStoreRedirect) {
        onPlayStoreRedirect();
      }

      // Close bottom sheet after delay
      setTimeout(() => {
        onClose();
      }, 500);
    }
    // 1-4 stars: Show category selection
    else {
      triggerHaptic(selectedRating === 4 ? 'light' : 'warning');

      // Navigate to category view
      setTimeout(() => {
        setCurrentView("category");
      }, 300);
    }
  }, [onPlayStoreRedirect, onClose]);

  // Handle category selection
  const handleSelectCategory = useCallback((selectedCategory: FeedbackCategory) => {
    setCategory(selectedCategory);

    // Navigate to detail view and snap to 100% for keyboard visibility
    setTimeout(() => {
      setCurrentView("detail");
      // Snap to 100% to ensure button is visible
      bottomSheetRef.current?.snapToIndex(1);
    }, 300);
  }, []);

  // Handle feedback submission
  const handleSubmit = useCallback(async (data: FeedbackData) => {
    setIsSubmitting(true);
    try {
      const result = await onFeedbackSubmit(data);

      // Check if feedback was queued
      setFeedbackQueued(result.queued || false);

      // Show success view after submission
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentView("success");
      }, 500);
    } catch (error) {
      // Reset submitting state on error
      setIsSubmitting(false);
    }
  }, [onFeedbackSubmit]);

  // Handle back button
  const handleBackPress = useCallback(() => {
    triggerHaptic("light");

    if (currentView === "success") {
      // On success view, close modal
      onClose();
    } else if (currentView === "detail") {
      setCurrentView("category");
    } else if (currentView === "category") {
      setCurrentView("rating");
      setRating(null);
      setCategory(null);
    } else {
      // On rating view, close modal
      onClose();
    }
  }, [currentView, onClose]);

  // Handle close button
  const handleClosePress = useCallback(() => {
    triggerHaptic("light");
    onClose();
  }, [onClose]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    setCurrentView("rating");
    setRating(null);
    setCategory(null);
    setIsSubmitting(false);
    setFeedbackQueued(false);
    onClose();
  }, [onClose]);

  // Open/close modal based on visible prop
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  // Hide BottomNav when modal is visible
  useEffect(() => {
    if (visible) {
      hideBottomNav();
    }
    return () => {
      resetBottomNav();
    };
  }, [visible, hideBottomNav, resetBottomNav]);

  // Handle Android back button
  useEffect(() => {
    if (!visible) return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBackPress();
        return true; // Prevent default behavior
      }
    );

    return () => backHandler.remove();
  }, [visible, handleBackPress]);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setCurrentView("rating");
      setRating(null);
      setCategory(null);
      setIsSubmitting(false);
      setFeedbackQueued(false);
    }
  }, [visible]);

  // Render custom handle
  const renderHandle = useCallback(
    (props: any) => <BottomSheetHandle {...props} isDark={isDark} />,
    [isDark]
  );

  // Render custom backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBottomSheetBackdrop
        {...props}
        isDark={isDark}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [isDark]
  );

  // Handle success close
  const handleSuccessClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case "rating":
        return <RatingView onRate={handleRate} />;
      case "category":
        return <CategoryView onSelectCategory={handleSelectCategory} />;
      case "detail":
        return rating ? (
          <DetailView
            category={category}
            rating={rating}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : null;
      case "success":
        return <SuccessView onClose={handleSuccessClose} queued={feedbackQueued} />;
      default:
        return <RatingView onRate={handleRate} />;
    }
  };

  return (
    <GorhomBottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      enablePanDownToClose={currentView === "rating" || currentView === "success"}
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      style={styles.bottomSheet}
    >
      {/* Header with title and close/back button */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        {currentView !== "rating" && currentView !== "success" ? (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {getTitle()}
        </Text>

        <TouchableOpacity onPress={handleClosePress} style={styles.closeButton}>
          <Feather name="x" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {renderView()}
      </BottomSheetScrollView>
    </GorhomBottomSheetModal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 4,
    width: 40,
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    width: 40,
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 40,
  },
});

export default FeedbackBottomSheet;
