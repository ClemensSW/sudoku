import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import SkeletonBox from './SkeletonBox';

interface SkeletonTextProps {
  width?: DimensionValue;
  lines?: number;
  lineHeight?: number;
  lineSpacing?: number;
  lastLineWidth?: DimensionValue;
  style?: ViewStyle;
}

const SkeletonText: React.FC<SkeletonTextProps> = ({
  width = '100%',
  lines = 1,
  lineHeight = 16,
  lineSpacing = 8,
  lastLineWidth = '60%',
  style,
}) => {
  if (lines === 1) {
    return (
      <SkeletonBox
        width={width}
        height={lineHeight}
        borderRadius={lineHeight / 2}
        style={style}
      />
    );
  }

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLastLine = index === lines - 1;
        return (
          <SkeletonBox
            key={index}
            width={isLastLine ? lastLineWidth : width}
            height={lineHeight}
            borderRadius={lineHeight / 2}
            style={index < lines - 1 ? { marginBottom: lineSpacing } : undefined}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default SkeletonText;
