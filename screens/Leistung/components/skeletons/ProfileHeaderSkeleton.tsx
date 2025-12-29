import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { SkeletonCircle, SkeletonBox } from '@/components/Skeleton';

const ProfileHeaderSkeleton: React.FC = () => {
  const theme = useTheme();

  const cardBg = theme.isDark ? theme.colors.surface : '#FFFFFF';
  const cardBorder = theme.isDark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(0,0,0,0.06)';
  const dividerColor = theme.isDark
    ? 'rgba(255,255,255,0.20)'
    : 'rgba(0,0,0,0.15)';

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <SkeletonCircle size={180} />
      </View>

      {/* Name + Title */}
      <View style={styles.nameContainer}>
        <SkeletonBox width={160} height={28} borderRadius={6} />
        <View style={{ height: 10 }} />
        <SkeletonBox width={120} height={20} borderRadius={4} />
      </View>

      {/* Stats Card */}
      <View
        style={[
          styles.statsCard,
          { backgroundColor: cardBg, borderColor: cardBorder },
        ]}
      >
        <View style={styles.statsRow}>
          {/* StatTile 1 */}
          <View style={styles.statItem}>
            <SkeletonCircle size={40} />
            <View style={{ height: 8 }} />
            <SkeletonBox width={40} height={26} borderRadius={4} />
            <View style={{ height: 4 }} />
            <SkeletonBox width={50} height={14} borderRadius={3} />
            <View style={{ height: 4 }} />
            <SkeletonBox width={60} height={12} borderRadius={3} />
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* StatTile 2 */}
          <View style={styles.statItem}>
            <SkeletonCircle size={40} />
            <View style={{ height: 8 }} />
            <SkeletonBox width={40} height={26} borderRadius={4} />
            <View style={{ height: 4 }} />
            <SkeletonBox width={50} height={14} borderRadius={3} />
            <View style={{ height: 4 }} />
            <SkeletonBox width={60} height={12} borderRadius={3} />
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* StatTile 3 */}
          <View style={styles.statItem}>
            <SkeletonCircle size={40} />
            <View style={{ height: 8 }} />
            <SkeletonBox width={40} height={26} borderRadius={4} />
            <View style={{ height: 4 }} />
            <SkeletonBox width={50} height={14} borderRadius={3} />
            <View style={{ height: 4 }} />
            <SkeletonBox width={60} height={12} borderRadius={3} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 28,
  },
  avatarWrapper: {
    marginBottom: 12,
    padding: 4,
  },
  nameContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  statsCard: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 20,
    paddingHorizontal: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
});

export default ProfileHeaderSkeleton;
