import { StyleSheet } from "react-native";

export default StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
    opacity: 0.7,
  },
  compactBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  compactText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
