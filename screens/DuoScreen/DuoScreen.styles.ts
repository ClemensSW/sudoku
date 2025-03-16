// screens/DuoScreen/DuoScreen.styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  titlePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
    maxWidth: 300,
  },
  
  // Game visualization container
  gameVisualizer: {
    width: width * 0.9,
    maxWidth: 400,
    aspectRatio: 0.9,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginVertical: 32,
    marginHorizontal: 16,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  boardContainer: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  boardTop: {
    height: "50%",
    width: "100%",
    position: "relative",
  },
  boardBottom: {
    height: "50%",
    width: "100%",
    position: "relative",
  },
  divider: {
    height: 2,
    width: "100%",
    position: "absolute",
    top: "50%",
    marginTop: -1,
    zIndex: 5,
  },
  versusContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -24,
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  versusText: {
    fontSize: 16,
    fontWeight: "800",
  },
  playerContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  playerInfo: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "700",
  },
  playerScore: {
    fontSize: 12,
    opacity: 0.8,
  },
  sudokuCells: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  
  // Feature section
  featureList: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  
  // CTA Section
  ctaContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  ctaButton: {
    width: "100%",
    maxWidth: 300,
    height: 56,
    borderRadius: radius.xl,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});