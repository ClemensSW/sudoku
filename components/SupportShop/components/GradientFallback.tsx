import React from 'react';
import { View, StyleSheet } from 'react-native';

// Ein einfaches Fallback für LinearGradient, falls die Library Probleme bereitet
interface GradientFallbackProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: any;
  children?: React.ReactNode;
}

const GradientFallback: React.FC<GradientFallbackProps> = ({
  colors,
  style,
  children
}) => {
  // Verwende einfach die erste Farbe als Fallback
  const backgroundColor = colors.length > 0 ? colors[0] : 'transparent';
  
  return (
    <View style={[style, { backgroundColor }]}>
      {children}
    </View>
  );
};

export default GradientFallback;