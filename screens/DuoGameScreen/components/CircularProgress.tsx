// screens/DuoGameScreen/components/CircularProgress.tsx
// Create this new component for the circular progress indicator

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size,
  strokeWidth,
  color,
  bgColor = '#EEEEEE',
  textColor,
  fontSize = 24,
}) => {
  // Calculate radius (must subtract stroke width to fit inside the container)
  const radius = (size - strokeWidth) / 2;
  
  // Calculate the circumference of the circle
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke dash offset based on percentage
  // When percentage is 0, offset is the full circumference (no progress shown)
  // When percentage is 100, offset is 0 (full circle shown)
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Center point of the SVG
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          // Start from the top (rotate -90 degrees)
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
      
      {/* Percentage Text in the center */}
      <View style={styles.textContainer}>
        <Text style={[styles.percentageText, { color: textColor || color, fontSize }]}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontWeight: '700',
  },
});

export default CircularProgress;