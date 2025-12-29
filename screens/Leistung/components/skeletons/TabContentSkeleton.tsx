import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { SkeletonBox, SkeletonText } from '@/components/Skeleton';

const TabContentSkeleton: React.FC = () => {
  const theme = useTheme();

  const cardBg = theme.isDark ? theme.colors.surface : '#FFFFFF';
  const cardBorder = theme.isDark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(0,0,0,0.06)';

  return (
    <View style={styles.container}>
      {/* Card 1 - Main content area */}
      <View
        style={[
          styles.card,
          { backgroundColor: cardBg, borderColor: cardBorder },
        ]}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <SkeletonBox width={48} height={48} borderRadius={12} />
          <View style={styles.headerText}>
            <SkeletonBox width={120} height={20} borderRadius={4} />
            <View style={{ height: 8 }} />
            <SkeletonBox width={180} height={14} borderRadius={3} />
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <SkeletonBox width="100%" height={12} borderRadius={6} />
          <View style={{ height: 8 }} />
          <View style={styles.progressLabels}>
            <SkeletonBox width={60} height={12} borderRadius={3} />
            <SkeletonBox width={60} height={12} borderRadius={3} />
          </View>
        </View>
      </View>

      {/* Card 2 - Secondary content */}
      <View
        style={[
          styles.card,
          { backgroundColor: cardBg, borderColor: cardBorder },
        ]}
      >
        <SkeletonText lines={3} lineHeight={14} lineSpacing={10} lastLineWidth="70%" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  card: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  progressSection: {
    width: '100%',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default TabContentSkeleton;
