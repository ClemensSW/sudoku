import React from 'react';
import { ViewStyle } from 'react-native';
import SkeletonBox from './SkeletonBox';

interface SkeletonCircleProps {
  size: number;
  style?: ViewStyle;
}

const SkeletonCircle: React.FC<SkeletonCircleProps> = ({ size, style }) => {
  return (
    <SkeletonBox
      width={size}
      height={size}
      borderRadius={size / 2}
      style={style}
    />
  );
};

export default SkeletonCircle;
