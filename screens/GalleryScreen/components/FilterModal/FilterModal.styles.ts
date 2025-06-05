// screens/GalleryScreen/components/FilterModal/FilterModal.styles.ts
import { StyleSheet, Dimensions, Platform } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  // Backdrop
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  
  backdropTouch: {
    flex: 1,
  },
  
  // Modal Container
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.7, // Noch kleiner für bessere Sichtbarkeit
  },
  
  blurBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    overflow: "hidden",
  },
  
  modalContent: {
    flex: 1,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    ...(Platform.OS === "android" && {
      elevation: 20,
      shadowColor: "#000",
    }),
  },
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  
  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  
  resetButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  
  resetText: {
    fontSize: 14,
    fontWeight: "600",
  },
  
  // Content
  scrollView: {
    flex: 1,
    maxHeight: height * 0.45, // Begrenzte Höhe für ScrollView
  },
  
  scrollContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  
  // Sections
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  
  sectionHeader: {
    marginBottom: spacing.md,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.xxs,
  },
  
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: "400",
  },
  
  // All Categories Button
  allButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 2,
    marginBottom: spacing.md,
  },
  
  allButtonActive: {
    borderWidth: 0,
  },
  
  allButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  
  // Info Section
  infoSectionContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  
  // Footer - Wichtig: Feste Höhe und immer sichtbar
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 0, // Wird dynamisch im JSX gesetzt
    borderTopWidth: 1,
    flexDirection: "column",
    gap: spacing.xs,
    // Feste Position am unteren Rand
    position: "relative",
    bottom: 0,
  },
  
  footerInfo: {
    alignItems: "center",
  },
  
  footerInfoText: {
    fontSize: 13,
    fontWeight: "500",
  },
  
  applyButton: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});