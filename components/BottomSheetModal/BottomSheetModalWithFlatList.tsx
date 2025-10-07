// components/BottomSheetModal/BottomSheetModalWithFlatList.tsx
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop as GorhomBackdrop
} from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
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
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
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
  ListFooterComponent,
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
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: textPrimaryColor }]}>{title}</Text>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                opacity: pressed ? 0.6 : 1,
              }
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={20} color={textPrimaryColor} />
          </Pressable>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  stickyFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
});

export default BottomSheetModalWithFlatList;
