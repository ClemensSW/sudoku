// CommunitySection.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import ReviewManager from "@/screens/Settings/components/ReviewSystem/ReviewManager";
import FeedbackIcon from "@/assets/svg/feedback.svg";
import LatteArtIcon from "@/assets/svg/latte-art.svg";
import ShareIcon from "@/assets/svg/share.svg";
import { spacing } from "@/utils/theme";

// Definiere eigene Styles für diese Komponente, um actionDescription zu unterstützen
const customStyles = StyleSheet.create({
  settingsGroup: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
        marginBottom: spacing.xxl,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    marginBottom: 2,
  },
  actionDescription: {
    // fontSize set dynamically via theme.typography
    opacity: 0.8,
  },
});

interface CommunitySectionProps {
  onSupportPress: () => void;
  onShareApp: () => void;
  showAlert?: (config: any) => void;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({
  onSupportPress,
  onShareApp,
  showAlert,
}) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const { colors, typography } = theme;
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
          <LatteArtIcon width={48} height={48} />
        </View>
        <View style={customStyles.actionTextContainer}>
          <Text
            style={[customStyles.actionTitle, { color: colors.textPrimary, fontSize: typography.size.md }]}
          >
            {t("community.supportTitle")}
          </Text>
          <Text
            style={[
              customStyles.actionDescription,
              { color: colors.textSecondary, fontSize: typography.size.sm },
            ]}
          >
            {t("community.supportDescription")}
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
          <FeedbackIcon width={48} height={48} />
        </View>
        <View style={customStyles.actionTextContainer}>
          <Text
            style={[customStyles.actionTitle, { color: colors.textPrimary, fontSize: typography.size.md }]}
          >
            {t("community.feedback")}
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
        onPress={onShareApp}
      >
        <View style={customStyles.actionIcon}>
          <ShareIcon width={48} height={48} />
        </View>
        <View style={customStyles.actionTextContainer}>
          <Text
            style={[customStyles.actionTitle, { color: colors.textPrimary, fontSize: typography.size.md }]}
          >
            {t("community.share")}
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
        showAlert={showAlert}
      />
    </View>
  );
};

export default CommunitySection;