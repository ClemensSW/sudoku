// components/AvatarPicker/styles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const GRID_SPACING = 12;
const NUM_COLUMNS = 3;
const AVATAR_SIZE =
  (width - 32 - GRID_SPACING * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default StyleSheet.create({
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // Preview Styles
  previewContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },

  // Tab Navigation (Modern Gallery-style)
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    marginTop: 8,
    borderRadius: 12,
    height: 48,
    position: "relative",
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonText: {
    fontSize: 14,
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    borderRadius: 1.5,
    // No width defined here as it will be determined dynamically
  },

  // Option Styles
  optionsContainer: {
    marginBottom: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },

  // Avatar Grid Styles
  gridContainer: {
    paddingHorizontal: GRID_SPACING / 2,
    paddingBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 12,
    marginLeft: GRID_SPACING / 2,
    paddingTop: 8,
    backgroundColor: "transparent",
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },

  // Avatar Option Styles
  avatarOption: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    margin: GRID_SPACING / 2,
    borderRadius: AVATAR_SIZE / 2,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarSelected: {
    borderWidth: 3,
  },
  avatarName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
    height: 16, // Fixed height for text to maintain consistent layouts
  },

  // Loading Styles
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  // New avatar badge
  newBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF5722",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  newBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  avatarWrapper: {
    padding: GRID_SPACING / 2,
    width: "33.33%", // For 3 columns
  },

  columnWrapper: {
    flexWrap: "wrap",
    flexDirection: "row",
  },

  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    height: 200,
  },
});
