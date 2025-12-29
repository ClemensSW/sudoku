// screens/LeistungScreen/components/LoadingState.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ProfileHeaderSkeleton, TabContentSkeleton } from "./skeletons";
import { SkeletonBox } from "@/components/Skeleton";

const LoadingState: React.FC = () => {
  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(300)}
      accessibilityLabel="Inhalte werden geladen"
    >
      <View style={styles.profileWrapper}>
        <ProfileHeaderSkeleton />
      </View>

      {/* Tab Navigator Skeleton */}
      <View style={styles.tabNavigator}>
        <SkeletonBox width="23%" height={44} borderRadius={8} />
        <SkeletonBox width="23%" height={44} borderRadius={8} />
        <SkeletonBox width="23%" height={44} borderRadius={8} />
        <SkeletonBox width="23%" height={44} borderRadius={8} />
      </View>

      <View style={styles.tabContent}>
        <TabContentSkeleton />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  profileWrapper: {
    marginBottom: 8,
  },
  tabNavigator: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabContent: {
    marginTop: 8,
  },
});

export default LoadingState;