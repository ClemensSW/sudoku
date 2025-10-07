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
  snapPoints?: (string | number)[];
  initialSnapIndex?: number;
  contentContainerStyle?: any;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
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
  ListEmptyComponent,
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
    if (visible) {
      hideBottomNav();
    }
    return () => {
      resetBottomNav();
    };
  }, [visible, hideBottomNav, resetBottomNav]);

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

  // Header with title
  const ListHeader = useCallback(() => (
    <>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: textPrimaryColor }]}>{title}</Text>
      </View>
      {ListHeaderComponent && (
        typeof ListHeaderComponent === 'function'
          ? <ListHeaderComponent />
          : ListHeaderComponent
      )}
    </>
  ), [title, textPrimaryColor, ListHeaderComponent]);

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
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmptyComponent}
      />
    </GorhomBottomSheetModal>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BottomSheetModalWithFlatList;
