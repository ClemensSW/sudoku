// screens/Settings/LegalScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";

// Import legal documents
const legalDocs = {
  de: {
    impressum: require("@/assets/legal/impressum.de.md"),
    datenschutz: require("@/assets/legal/datenschutz.de.md"),
    agb: require("@/assets/legal/agb.de.md"),
    widerruf: require("@/assets/legal/widerruf.de.md"),
  },
  en: {
    impressum: require("@/assets/legal/impressum.en.md"),
    datenschutz: require("@/assets/legal/datenschutz.en.md"),
    agb: require("@/assets/legal/agb.en.md"),
    widerruf: require("@/assets/legal/widerruf.en.md"),
  },
};

type LegalDocType = "impressum" | "datenschutz" | "agb" | "widerruf";

interface LegalScreenProps {
  visible: boolean;
  onClose: () => void;
}

const LegalScreen: React.FC<LegalScreenProps> = ({ visible, onClose }) => {
  const { t, i18n } = useTranslation("settings");
  const { colors, isDark } = useTheme();
  const [selectedDoc, setSelectedDoc] = useState<LegalDocType | null>(null);
  const [docContent, setDocContent] = useState<string>("");

  // Get current language (fallback to en if not de/en)
  const currentLang = i18n.language.startsWith("de") ? "de" : "en";

  const loadDocument = async (docType: LegalDocType) => {
    try {
      // In React Native with Metro, we need to use fetch with the asset path
      // For now, we'll use placeholder text until we implement proper asset loading
      const content = getPlaceholderContent(docType, currentLang);
      setDocContent(content);
      setSelectedDoc(docType);
    } catch (error) {
      console.error("Error loading document:", error);
      setDocContent(t("legal.loadError"));
    }
  };

  // Placeholder content (will be replaced with actual file reading)
  const getPlaceholderContent = (docType: LegalDocType, lang: string): string => {
    // This is a temporary solution - in production, you'd read from the actual files
    const templates = {
      de: {
        impressum: `# Impressum\n\n**Angaben gemäß § 5 TMG**\n\nClemens Walther - AppVentures\nMalzstraße 12\n42119 Wuppertal\nDeutschland\n\n**Kontakt:**\nE-Mail: info@playfusion-gate.de\n\n**Kleinunternehmerregelung:**\nGemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen.`,
        datenschutz: `# Datenschutzerklärung\n\n**Stand:** Oktober 2025\n\n## 1. Verantwortlicher\n\nClemens Walther - AppVentures\nMalzstraße 12\n42119 Wuppertal\nE-Mail: info@playfusion-gate.de\n\n## 2. Welche Daten werden erhoben?\n\n### 2.1 Lokale Datenspeicherung\nSudoku Duo speichert Spielstände lokal auf deinem Gerät.\n\n### 2.2 In-App-Käufe\nBei Käufen werden Daten über RevenueCat verarbeitet.`,
        agb: `# Nutzungsbedingungen (AGB)\n\n**Stand:** Oktober 2025\n\n## 1. Geltungsbereich\n\nDiese Nutzungsbedingungen gelten für die App "Sudoku Duo".\n\n## 2. Leistungsumfang\n\nDie App bietet kostenlose und kostenpflichtige Funktionen an.`,
        widerruf: `# Widerrufsbelehrung\n\n## Widerrufsrecht\n\nSie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.\n\n**Kontakt:**\nClemens Walther - AppVentures\nE-Mail: info@playfusion-gate.de`,
      },
      en: {
        impressum: `# Legal Notice\n\n**Information according to § 5 TMG**\n\nClemens Walther - AppVentures\nMalzstraße 12\n42119 Wuppertal\nGermany\n\n**Contact:**\nEmail: info@playfusion-gate.de\n\n**Small Business Regulation:**\nAccording to § 19 UStG, no VAT is shown.`,
        datenschutz: `# Privacy Policy\n\n**Last updated:** October 2025\n\n## 1. Controller\n\nClemens Walther - AppVentures\nMalzstraße 12\n42119 Wuppertal\nEmail: info@playfusion-gate.de\n\n## 2. What Data is Collected?\n\n### 2.1 Local Data Storage\nSudoku Duo stores game progress locally on your device.\n\n### 2.2 In-App Purchases\nFor purchases, data is processed via RevenueCat.`,
        agb: `# Terms of Service\n\n**Last updated:** October 2025\n\n## 1. Scope\n\nThese terms apply to the app "Sudoku Duo".\n\n## 2. Scope of Services\n\nThe app offers free and paid features.`,
        widerruf: `# Right of Withdrawal\n\n## Right of Withdrawal\n\nYou have the right to withdraw from this contract within fourteen days without giving any reason.\n\n**Contact:**\nClemens Walther - AppVentures\nEmail: info@playfusion-gate.de`,
      },
    };

    return templates[lang as keyof typeof templates][docType] || "Document not found";
  };

  const handleDocPress = (docType: LegalDocType) => {
    triggerHaptic("light");
    loadDocument(docType);
  };

  const handleBackPress = () => {
    triggerHaptic("light");
    if (selectedDoc) {
      setSelectedDoc(null);
      setDocContent("");
    } else {
      onClose();
    }
  };

  // Document list view
  const renderDocumentList = () => (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Feather name="x" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t("legal.title")}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t("legal.subtitle")}
        </Text>

        <View style={[styles.docList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.docItem, { borderBottomColor: colors.border }]}
            onPress={() => handleDocPress("impressum")}
          >
            <Text style={[styles.docTitle, { color: colors.textPrimary }]}>
              {t("legal.impressum")}
            </Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.docItem, { borderBottomColor: colors.border }]}
            onPress={() => handleDocPress("datenschutz")}
          >
            <Text style={[styles.docTitle, { color: colors.textPrimary }]}>
              {t("legal.datenschutz")}
            </Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.docItem, { borderBottomColor: colors.border }]}
            onPress={() => handleDocPress("agb")}
          >
            <Text style={[styles.docTitle, { color: colors.textPrimary }]}>
              {t("legal.agb")}
            </Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.docItem}
            onPress={() => handleDocPress("widerruf")}
          >
            <Text style={[styles.docTitle, { color: colors.textPrimary }]}>
              {t("legal.widerruf")}
            </Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  // Document viewer
  const renderDocumentViewer = () => (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {selectedDoc && t(`legal.${selectedDoc}`)}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={[styles.content, styles.documentContent]}>
        <Text style={[styles.documentText, { color: colors.textPrimary }]}>
          {docContent}
        </Text>
      </ScrollView>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleBackPress}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        {selectedDoc ? renderDocumentViewer() : renderDocumentList()}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 4,
    width: 40,
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  docList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  documentContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  documentText: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: "monospace",
  },
});

export default LegalScreen;
