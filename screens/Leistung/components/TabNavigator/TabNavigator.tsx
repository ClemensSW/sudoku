// screens/LeistungScreen/components/TabNavigator/TabNavigator.tsx
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { spacing, radius } from "@/utils/theme";
import { useProgressColor } from "@/hooks/useProgressColor";

// Export the TabItem type
export interface TabItem {
  id: string;
  label: string;
}

interface TabNavigatorProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  elevated?: boolean;  // Shadow nur wenn true (für sticky version)
}

const TabNavigator: React.FC<TabNavigatorProps> = ({
  tabs,
  activeTab,
  onTabChange,
  elevated = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const progressColor = useProgressColor();

  // Animated values for tab indicator
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  // Store the layout measurements of each tab
  const [tabLayouts, setTabLayouts] = React.useState<{
    [key: string]: { x: number; width: number };
  }>({});

  // Update indicator position when active tab changes
  useEffect(() => {
    if (tabLayouts[activeTab]) {
      indicatorPosition.value = withTiming(tabLayouts[activeTab].x, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      indicatorWidth.value = withTiming(tabLayouts[activeTab].width, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [activeTab, tabLayouts]);

  // Animated style for the tab indicator
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
    width: indicatorWidth.value,
  }));

  // Save the layout of a tab
  const handleTabLayout = (tabId: string, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => ({
      ...prev,
      [tabId]: { x, width },
    }));

    // If this is the initial active tab, set the indicator position immediately
    if (tabId === activeTab && !tabLayouts[tabId]) {
      indicatorPosition.value = x;
      indicatorWidth.value = width;
    }
  };

  return (
    <View
      style={[
        styles.tabsContainer,
        { backgroundColor: colors.background },
        elevated && styles.elevated,
        elevated && {
          borderBottomColor: theme.isDark
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
        },
      ]}
    >
      {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                isActive && [
                  styles.activeTabButton,
                  {
                    backgroundColor: theme.isDark
                      ? `${progressColor}1F` // ~12% opacity
                      : `${progressColor}14`, // ~8% opacity
                  },
                ],
              ]}
              onPress={() => onTabChange(tab.id)}
              onLayout={(e) => handleTabLayout(tab.id, e)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? progressColor : colors.textSecondary },
                  isActive && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}

      {/* Animated indicator */}
      <Animated.View
        style={[
          styles.tabIndicator,
          { backgroundColor: progressColor },
          indicatorStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    width: "100%",
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    // Keine shadows/borders by default - clean inline look
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    borderBottomWidth: 1,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    flex: 1,
    marginHorizontal: 4,
  },
  activeTabButton: {
    // Style for active tab
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  activeTabText: {
    fontWeight: "600",
  },
  tabIndicator: {
    height: 3,
    position: "absolute",
    bottom: -1,
    left: 0,
    borderRadius: 1.5,
  },
});

export default TabNavigator;