import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  
  // Animation styles
  quoteIconContainer: {
    position: "absolute",
    opacity: 0.1,
    right: spacing.md,
    bottom: spacing.md,
  },
  
  // Autotext warnings
  warningContainer: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  
  warningText: {
    fontSize: 13,
    marginLeft: spacing.xs,
    flex: 1,
  },
});