// components/BottomSheetModal/BottomSheetHandle.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetHandleProps } from '@gorhom/bottom-sheet';

interface CustomHandleProps extends BottomSheetHandleProps {
  isDark: boolean;
}

const BottomSheetHandle: React.FC<CustomHandleProps> = ({ isDark }) => {
  return (
    <View style={styles.handleContainer}>
      <View
        style={[
          styles.handle,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(0, 0, 0, 0.2)',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  handleContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});

export default BottomSheetHandle;
