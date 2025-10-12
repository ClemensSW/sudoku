// screens/Settings/components/InfoSettingsModal.tsx
import React, { useRef, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
import InfoSection from "./InfoSection/InfoSection";

interface InfoSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onAboutPress: () => void;
  onLegalPress: () => void;
}

const InfoSettingsModal: React.FC<InfoSettingsModalProps> = ({
  visible,
  onClose,
  onAboutPress,
  onLegalPress,
}) => {
  const { t } = useTranslation("settings");
  const { colors, isDark } = useTheme();
  const { hideBottomNav, resetBottomNav } = useNavigation();
  const bottomSheetRef = useRef<GorhomBottomSheetModal>(null);

  // Snap points - Start at 70%, expandable to fullscreen
  const snapPoints = useMemo(() => ['70%', '100%'], []);

  const handleClosePress = useCallback(() => {
    triggerHaptic("light");
    onClose();
  }, [onClose]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
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
        onClose();
        return true; // Prevent default behavior
      }
    );

    return () => backHandler.remove();
  }, [visible, onClose]);

  // Render custom handle
  const renderHandle = useCallback(
    (props: any) => <BottomSheetHandle {...props} isDark={isDark} />,
    [isDark]
  );

  // Render custom backdrop with blur
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

  return (
    <GorhomBottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      enablePanDownToClose={true}
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
      {/* Header with title and close button */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.placeholder} />

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t("categories.info")}
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
        <InfoSection
          onAboutPress={onAboutPress}
          onLegalPress={onLegalPress}
        />
      </BottomSheetScrollView>
    </GorhomBottomSheetModal>
  );
};

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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
  },
});

export default InfoSettingsModal;
