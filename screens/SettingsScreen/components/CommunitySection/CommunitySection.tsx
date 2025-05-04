// screens/SettingsScreen/components/CommunitySection/CommunitySection.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking, Clipboard } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import styles from "./CommunitySection.styles";
import ReviewManager from "@/screens/SettingsScreen/components/ReviewSystem/ReviewManager";

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
        styles.settingsGroup,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Feedback Button - vorher "Fehler gefunden?" */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleFeedbackPress}
      >
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: `${colors.info}20` },
          ]}
        >
          <Feather name="message-circle" size={20} color={colors.info} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text
            style={[styles.actionTitle, { color: colors.textPrimary }]}
          >
            Feedback senden
          </Text>
          <Text
            style={[
              styles.actionDescription,
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
          styles.actionButton,
          { borderTopWidth: 1, borderTopColor: colors.border }
        ]}
        onPress={onSharePress}
      >
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: `${colors.success}20` },
          ]}
        >
          <Feather name="share-2" size={20} color={colors.success} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text
            style={[styles.actionTitle, { color: colors.textPrimary }]}
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
          styles.actionButton,
          { borderTopWidth: 1, borderTopColor: colors.border }
        ]}
        onPress={onAboutPress}
      >
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: `${colors.info}20` },
          ]}
        >
          <Feather name="info" size={20} color={colors.info} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text
            style={[styles.actionTitle, { color: colors.textPrimary }]}
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