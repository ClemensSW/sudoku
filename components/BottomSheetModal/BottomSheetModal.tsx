// components/BottomSheetModal/BottomSheetModal.tsx
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { triggerHaptic } from '@/utils/haptics';
import BottomSheetHandle from './BottomSheetHandle';
import BottomSheetBackdrop from './BottomSheetBackdrop';

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
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Default snap points: 40% collapsed, 90% expanded
  const snapPoints = useMemo(
    () => customSnapPoints || ['40%', '90%'],
    [customSnapPoints]
  );

  // Handle sheet changes
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      // Sheet is closed
      onClose();
    }
  }, [onClose]);

  // Handle close with haptic
  const handleClose = useCallback(() => {
    triggerHaptic('light');
    bottomSheetRef.current?.close();
  }, []);

  // Handle backdrop press
  const handleBackdropPress = useCallback(() => {
    handleClose();
  }, [handleClose]);

  // Open/close sheet based on visible prop
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(initialSnapIndex);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible, initialSnapIndex]);

  // Render custom handle
  const renderHandle = useCallback(
    (props: any) => <BottomSheetHandle {...props} isDark={isDark} />,
    [isDark]
  );

  // Render custom backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        isDark={isDark}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [isDark]
  );

  if (!visible) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: surfaceColor,
        borderWidth: 1,
        borderColor: borderColor,
      }}
      style={styles.bottomSheet}
    >
      {/* Header: Title + Close Button */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textPrimaryColor }]}>
          {title}
        </Text>
        <TouchableOpacity
          onPress={handleClose}
          style={[
            styles.closeButton,
            {
              backgroundColor: isDark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(0,0,0,0.04)',
            },
          ]}
        >
          <Feather name="x" size={20} color={textPrimaryColor} />
        </TouchableOpacity>
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
    </BottomSheet>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
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
