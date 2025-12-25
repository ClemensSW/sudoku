// components/BottomSheetModal/BottomSheetModal.tsx
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetModal as GorhomBottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop as GorhomBackdrop } from '@gorhom/bottom-sheet';
import { useNavigation } from '@/contexts/navigation';
import BottomSheetHandle from './BottomSheetHandle';
import CustomBottomSheetBackdrop from './BottomSheetBackdrop';

export interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDark: boolean;
  textPrimaryColor: string;
  surfaceColor: string;
  borderColor: string;
  /** Snap points als Prozent-Strings oder Pixel-Werte. Default: ['40%', '90%'] */
  snapPoints?: (string | number)[];
  /** Start-Index des Snap Points. Default: 0 (erster Snap Point) */
  initialSnapIndex?: number;
  /** Enable scroll behavior. Default: true */
  enableScroll?: boolean;
  /** Ob das Modal die Bottom Navigation verwalten soll. Default: true (für Rückwärtskompatibilität) */
  managesBottomNav?: boolean;
  /** Keyboard behavior. Default: 'interactive'. Use 'fillParent' for forms. */
  keyboardBehavior?: 'interactive' | 'extend' | 'fillParent';
  /** Android keyboard input mode. Default: 'adjustPan'. Use 'adjustResize' for forms. */
  android_keyboardInputMode?: 'adjustPan' | 'adjustResize';
}

/**
 * Professionelle Bottom Sheet Modal-Komponente
 *
 * Features:
 * - Slide-in Animation von unten
 * - Multi-Stage Snap Points (expandable)
 * - Drag-to-dismiss
 * - Blur Backdrop mit Tap-to-close
 * - Handle Indicator
 * - Scrollable Content
 * - Theme-aware
 */
const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  visible,
  onClose,
  title,
  children,
  isDark,
  textPrimaryColor,
  surfaceColor,
  borderColor,
  snapPoints: customSnapPoints,
  initialSnapIndex = 0,
  enableScroll = true,
  managesBottomNav = true,
  keyboardBehavior = 'interactive',
  android_keyboardInputMode = 'adjustPan',
}) => {
  const bottomSheetRef = useRef<GorhomBottomSheetModal>(null);
  const { currentRoute, hideBottomNav, resetBottomNav } = useNavigation();

  // Default snap points: 40% collapsed, 90% expanded
  const snapPoints = useMemo(
    () => customSnapPoints || ['40%', '90%'],
    [customSnapPoints]
  );

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

  // Hide BottomNav when modal is visible (nur wenn managesBottomNav = true)
  useEffect(() => {
    if (!managesBottomNav) return;

    if (visible) {
      hideBottomNav();
    }
    return () => {
      resetBottomNav();
    };
  }, [visible, managesBottomNav, hideBottomNav, resetBottomNav]);

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
      enablePanDownToClose
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior="restore"
      android_keyboardInputMode={android_keyboardInputMode}
      backgroundStyle={{
        backgroundColor: surfaceColor,
        borderWidth: 1,
        borderColor: borderColor,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      style={styles.bottomSheet}
    >
      {/* Header: Title (centered) */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textPrimaryColor }]}>
          {title}
        </Text>
      </View>

      {/* Scrollable Content */}
      {enableScroll ? (
        <BottomSheetScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {children}
        </BottomSheetScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});

export default BottomSheetModal;
