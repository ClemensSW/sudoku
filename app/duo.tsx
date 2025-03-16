// app/duo.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/Button/Button";

export default function DuoScreen() {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      {/* Background Image */}
      <Image
        source={require("@/assets/images/background/mountains_purple.png")}
        style={styles.backgroundImage}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Settings Icon in Top Right */}
        <Animated.View style={styles.header} entering={FadeIn.duration(300)}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                borderWidth: 1,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => router.push("/settings")}
          >
            <Feather name="settings" size={24} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={styles.content} entering={FadeIn.duration(500)}>
          <Animated.View
            style={styles.featureContainer}
            entering={FadeIn.delay(300).duration(800)}
          >
            <Feather
              name="users"
              size={80}
              color={colors.primary}
              style={styles.icon}
            />

            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Demnächst verfügbar!
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Das Duo-Feature ermöglicht dir, gemeinsam mit Freunden Sudoku zu
              spielen. Fordere andere heraus oder löst zusammen komplexe Rätsel.
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                title="Benachrichtigen, wenn verfügbar"
                onPress={() => {}}
                variant="primary"
                style={styles.button}
                icon={
                  <Feather name="bell" size={20} color={colors.buttonText} />
                }
              />
            </View>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  featureContainer: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 400,
    paddingHorizontal: 16,
    paddingVertical: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  button: {
    width: "100%",
    height: 52,
  },
});
