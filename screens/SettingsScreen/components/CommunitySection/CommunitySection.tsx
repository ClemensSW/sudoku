// CommunitySection.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import ReviewManager from "@/screens/SettingsScreen/components/ReviewSystem/ReviewManager";

// Definiere eigene Styles für diese Komponente, um actionDescription zu unterstützen
const customStyles = StyleSheet.create({
  settingsGroup: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
});

interface CommunitySectionProps {
  onSupportPress: () => void;
  onSharePress: () => void;
  onAboutPress: () => void;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({
  onSupportPress,
  onSharePress,
  onAboutPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const { showAlert } = useAlert();
  const [showReviewSystem, setShowReviewSystem] = useState(false);

  // Feedback-Button Handler
  const handleFeedbackPress = () => {
    triggerHaptic("light");
    setShowReviewSystem(true);
  };

  // Schließen des Review-Systems
  const handleCloseReview = () => {
    setShowReviewSystem(false);
  };

  // Fehlerberichtsfunktion (falls der Nutzer auf Google Play weitergeleitet wird)
  const handlePlayStoreRedirect = () => {
    console.log("Nutzer zur Google Play Store Bewertung weitergeleitet");
  };

  // Feedback wurde abgeschickt
  const handleFeedbackSent = (data: any) => {
    console.log("Feedback erhalten:", data);
  };

  return (
    <View
      style={[
        customStyles.settingsGroup,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Feedback Button - vorher "Fehler gefunden?" */}
      <TouchableOpacity
        style={customStyles.actionButton}
        onPress={handleFeedbackPress}
      >
        <View
          style={[
            customStyles.actionIconContainer,
            { backgroundColor: `${colors.info}20` },
          ]}
        >
          <Feather name="message-circle" size={20} color={colors.info} />
        </View>
        <View style={customStyles.actionTextContainer}>
          <Text
            style={[customStyles.actionTitle, { color: colors.textPrimary }]}
          >
            Feedback senden
          </Text>
          <Text
            style={[
              customStyles.actionDescription,
              { color: colors.textSecondary },
            ]}
          >
            Hilf mir, die App zu verbessern
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Share button */}
      <TouchableOpacity
        style={[
          customStyles.actionButton,
          { borderTopWidth: 1, borderTopColor: colors.border }
        ]}
        onPress={onSharePress}
      >
        <View
          style={[
            customStyles.actionIconContainer,
            { backgroundColor: `${colors.success}20` },
          ]}
        >
          <Feather name="share-2" size={20} color={colors.success} />
        </View>
        <View style={customStyles.actionTextContainer}>
          <Text
            style={[customStyles.actionTitle, { color: colors.textPrimary }]}
          >
            Mit Freunden teilen
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* About button */}
      <TouchableOpacity
        style={[
          customStyles.actionButton,
          { borderTopWidth: 1, borderTopColor: colors.border }
        ]}
        onPress={onAboutPress}
      >
        <View
  style={[
    customStyles.actionIconContainer,
    { backgroundColor: theme.isDark ? "rgba(138, 120, 180, 0.15)" : "rgba(110, 90, 160, 0.12)" },
  ]}
>
  <Feather 
    name="info" 
    size={20} 
    color={theme.isDark ? "#8A78B4" : "#6E5AA0"} 
  />
</View>
        <View style={customStyles.actionTextContainer}>
          <Text
            style={[customStyles.actionTitle, { color: colors.textPrimary }]}
          >
            Über Sudoku Duo
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Review Manager */}
      <ReviewManager 
        isVisible={showReviewSystem}
        appPackageName="de.playfusiongate.sudokuduo"
        feedbackEmail="info@playfusion-gate.de"
        onClose={handleCloseReview}
        onPlayStoreRedirect={handlePlayStoreRedirect}
        onFeedbackSent={handleFeedbackSent}
      />
    </View>
  );
};

export default CommunitySection;