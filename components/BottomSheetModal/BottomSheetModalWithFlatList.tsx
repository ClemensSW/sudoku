// components/BottomSheetModal/BottomSheetModalWithFlatList.tsx
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop as GorhomBackdrop
} from '@gorhom/bottom-sheet';
import { useNavigation } from '@/contexts/navigation';
import BottomSheetHandle from './BottomSheetHandle';
import CustomBottomSheetBackdrop from './BottomSheetBackdrop';

export interface BottomSheetModalWithFlatListProps<T> {
  visible: boolean;
  onClose: () => void;
  title: string;
  data: T[];
  renderItem: (item: { item: T; index: number }) => React.ReactElement | null;
  keyExtractor: (item: T, index: number) => string;
  numColumns?: number;
  isDark: boolean;
  textPrimaryColor: string;
  surfaceColor: string;
  borderColor: string;
  /** Typography size for title. Default: 18 */
  titleFontSize?: number;
  snapPoints?: (string | number)[];
  initialSnapIndex?: number;
  contentContainerStyle?: any;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  /** Ob das Modal die Bottom Navigation verwalten soll. Default: true (für Rückwärtskompatibilität) */
  managesBottomNav?: boolean;
}

/**
 * BottomSheet Modal mit integrierter FlatList für optimale Performance
 *
 * Verwendet BottomSheetFlatList von Gorhom statt verschachtelter ScrollViews
 * - Keine nested VirtualizedList warnings
 * - Optimale Scroll-Performance
 * - Lazy loading & recycled views
 */
function BottomSheetModalWithFlatList<T>({
  visible,
  onClose,
  title,
  data,
  renderItem,
  keyExtractor,
  numColumns = 1,
  isDark,
  textPrimaryColor,
  surfaceColor,
  borderColor,
  snapPoints: customSnapPoints,
  initialSnapIndex = 0,
  contentContainerStyle,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  managesBottomNav = true,
  titleFontSize,
}: BottomSheetModalWithFlatListProps<T>) {
  const bottomSheetRef = useRef<GorhomBottomSheetModal>(null);
  const { currentRoute, hideBottomNav, resetBottomNav } = useNavigation();

  const snapPoints = useMemo(
    () => customSnapPoints || ['70%', '90%'],
    [customSnapPoints]
  );

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  useEffect(() => {
    if (!managesBottomNav) return;

    if (visible) {
      hideBottomNav();
    }
    return () => {
      resetBottomNav();
    };
  }, [visible, managesBottomNav, hideBottomNav, resetBottomNav]);

  useEffect(() => {
    if (visible) {
      onClose();
    }
  }, [currentRoute]);

  const renderHandle = useCallback(
    (props: any) => <BottomSheetHandle {...props} isDark={isDark} />,
    [isDark]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        isDark={isDark}
      />
    ),
    [isDark]
  );

  // Sticky Footer with ListFooterComponent
  const StickyFooter = useCallback(() => {
    if (!ListFooterComponent) return null;
    return (
      <View style={[styles.stickyFooter, { backgroundColor: surfaceColor, borderColor: borderColor }]}>
        {typeof ListFooterComponent === 'function'
          ? <ListFooterComponent />
          : ListFooterComponent
        }
      </View>
    );
  }, [ListFooterComponent, surfaceColor, borderColor]);

  return (
    <GorhomBottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={initialSnapIndex}
      onDismiss={handleDismiss}
      enablePanDownToClose
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: surfaceColor,
        borderWidth: 1,
        borderColor: borderColor,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
    >
      <View style={[styles.stickyHeader, { backgroundColor: surfaceColor, borderColor: borderColor }]}>
        <Text style={[styles.title, { color: textPrimaryColor, fontSize: titleFontSize || 18 }]}>{title}</Text>
        {ListHeaderComponent && (
          typeof ListHeaderComponent === 'function'
            ? <ListHeaderComponent />
            : ListHeaderComponent
        )}
      </View>
      <BottomSheetFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        initialNumToRender={15}
        windowSize={10}
        ListEmptyComponent={ListEmptyComponent}
      />
      <StickyFooter />
    </GorhomBottomSheetModal>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  title: {
    // fontSize set dynamically via prop or default
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  stickyFooter: {
    // Padding wird jetzt vom Footer-Component selbst kontrolliert
  },
});

export default BottomSheetModalWithFlatList;
