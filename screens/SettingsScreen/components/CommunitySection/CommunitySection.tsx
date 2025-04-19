// screens/SettingsScreen/components/CommunitySection/CommunitySection.tsx
import React from "react";
import { View, Text, TouchableOpacity, Linking, Clipboard } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import styles from "./CommunitySection.styles";

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

  // Verbesserte Fehlerbericht-Funktion mit besserer Fehlerbehandlung
  const handleReportBug = async () => {
    triggerHaptic("light");
    
    // E-Mail-Daten
    const email = "info@sudokuduo.app";
    const subject = "Fehlerbericht%20Sudoku%20Duo";
    const body = "Beschreibe%20hier%20den%20Fehler:";
    
    // Erstelle den mailto-Link - bereits kodiert für bessere Kompatibilität
    const url = `mailto:${email}?subject=${subject}&body=${body}`;
    
    try {
      // Prüfe, ob ein E-Mail-Client verfügbar ist
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        // Öffne den E-Mail-Client
        await Linking.openURL(url);
      } else {
        // Falls kein E-Mail-Client geöffnet werden kann, zeige eine Meldung an
        showAlert({
          title: "E-Mail-Client nicht verfügbar",
          message: `Bitte sende dein Feedback manuell an: ${email}`,
          type: "info",
          buttons: [{ text: "OK", style: "primary" }]
        });
      }
    } catch (error) {
      console.error("Error opening email client:", error);
      
      // Benutzerfreundliche Fehlermeldung
      showAlert({
        title: "E-Mail konnte nicht geöffnet werden",
        message: `Bitte sende dein Feedback manuell an: ${email}`,
        type: "warning",
        buttons: [
          { 
            text: "E-Mail kopieren", 
            style: "primary",
            onPress: () => {
              Clipboard.setString(email);
              showAlert({
                title: "E-Mail kopiert",
                message: "Die E-Mail-Adresse wurde in die Zwischenablage kopiert.",
                type: "success",
                buttons: [{ text: "OK", style: "primary" }]
              });
            }
          },
          { text: "Abbrechen", style: "cancel" }
        ]
      });
    }
  };

  return (
    <View
      style={[
        styles.settingsGroup,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Bug Report Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleReportBug}
      >
        <View
          style={[
            styles.actionIconContainer,
            { backgroundColor: `${colors.error}15` },
          ]}
        >
          <Feather name="alert-circle" size={20} color={colors.error} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text
            style={[styles.actionTitle, { color: colors.textPrimary }]}
          >
            Fehler gefunden?
          </Text>
          <Text
            style={[
              styles.actionDescription,
              { color: colors.textSecondary },
            ]}
          >
            Sende mir eine E-Mail mit deinem Feedback
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
          <Text
            style={[
              styles.actionDescription,
              { color: colors.textSecondary },
            ]}
          >
            Fordere sie zum Sudoku-Duell heraus
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
    </View>
  );
};

export default CommunitySection;