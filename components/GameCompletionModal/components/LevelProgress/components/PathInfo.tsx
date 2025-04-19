// components/LevelProgress/components/PathInfo.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from "@/utils/theme/ThemeProvider";
import { LevelInfo } from '../utils/types';

interface PathInfoProps {
  levelInfo: LevelInfo;
  showDescription?: boolean;
  style?: any;
  compact?: boolean;
}

const PathInfo: React.FC<PathInfoProps> = ({
  levelInfo,
  showDescription = true,
  style,
  compact = false,
}) => {
  // Theme für Farben verwenden
  const theme = useTheme();
  const colors = theme.colors;
  
  // Extrahiere Pfad-Informationen
  const { currentPath, levelData } = levelInfo;
  
  // Berechne Pfad-Fortschritt
  const pathProgress = levelData.pathIndex + 1;
  const pathTotal = currentPath.levelRange[1] - currentPath.levelRange[0] + 1;
  
  return (
    <View style={[styles.container, compact && styles.compactContainer, style]}>
      {/* Pfad-Titel und Fortschritt */}
      <View style={styles.headerRow}>
        <Text 
          style={[styles.pathTitle, { color: colors.textPrimary }]} 
          numberOfLines={1}
        >
          {currentPath.name}
        </Text>
        
        <View 
          style={[
            styles.pathBadge, 
            { backgroundColor: currentPath.color }
          ]}
        >
          <Text style={styles.pathBadgeText}>
            {pathProgress}/{pathTotal}
          </Text>
        </View>
      </View>
      
      {/* Optionale Pfad-Beschreibung */}
      {showDescription && !compact && (
        <Text 
          style={[
            styles.pathDescription, 
            { color: colors.textSecondary }
          ]} 
          numberOfLines={2}
        >
          {currentPath.description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  compactContainer: {
    marginVertical: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  pathBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  pathBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pathDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  }
});

export default PathInfo;