// CommunitySection.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import ReviewManager from "@/screens/Settings/components/ReviewSystem/ReviewManager";
import FeedbackIcon from "@/assets/svg/feedback.svg";
import LatteArtIcon from "@/assets/svg/latte-art.svg";
import ShareIcon from "@/assets/svg/share.svg";

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
    height: 64,
    paddingLeft: 16,
    paddingRight: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
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
      {/* Support Button */}
      <TouchableOpacity
        style={customStyles.actionButton}
        onPress={onSupportPress}
      >
        <View style={customStyles.actionIcon}>
          <LatteArtIcon width={40} height={40} />
        </View>
        <View style={customStyles.actionTextContainer}>
          <Text
            style={[customStyles.actionTitle, { color: colors.textPrimary }]}
          >
            Kostenlos spielen
          </Text>
          <Text
            style={[
              customStyles.actionDescription,
              { color: colors.textSecondary },
            ]}
          >
            Entwicklung freiwillig unterstützen
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
      {/* Feedback Button - vorher "Fehler gefunden?" */}
      <TouchableOpacity
        style={[
          customStyles.actionButton,
          { borderTopWidth: 1, borderTopColor: colors.border }
        ]}
        onPress={handleFeedbackPress}
      >
        <View style={customStyles.actionIcon}>
          <FeedbackIcon width={40} height={40} />
        </View>
        <View style={customStyles.actionTextContainer}>
          <Text
            style={[customStyles.actionTitle, { color: colors.textPrimary }]}
          >
            Feedback senden
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
        <View style={customStyles.actionIcon}>
          <ShareIcon width={40} height={40} />
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
        <View style={customStyles.actionIcon}>
          <Feather
            name="info"
            size={40}
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