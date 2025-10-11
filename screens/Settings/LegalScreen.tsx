// screens/Settings/LegalScreen.tsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  BackHandler,
} from "react-native";
import { BottomSheetModal as GorhomBottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import Markdown from 'react-native-markdown-display';
import CustomBottomSheetBackdrop from '@/components/BottomSheetModal/BottomSheetBackdrop';
import BottomSheetHandle from '@/components/BottomSheetModal/BottomSheetHandle';
import { useNavigation } from '@/contexts/navigation';

type LegalDocType = "impressum" | "datenschutz" | "agb" | "widerruf";

interface LegalScreenProps {
  visible: boolean;
  onClose: () => void;
}

const LegalScreen: React.FC<LegalScreenProps> = ({ visible, onClose }) => {
  const { t, i18n } = useTranslation("settings");
  const { colors, isDark } = useTheme();
  const { hideBottomNav, resetBottomNav } = useNavigation();
  const [selectedDoc, setSelectedDoc] = useState<LegalDocType | null>(null);
  const [docContent, setDocContent] = useState<string>("");
  const bottomSheetRef = useRef<GorhomBottomSheetModal>(null);

  // Get current language (fallback to en if not de/en)
  const currentLang = i18n.language.startsWith("de") ? "de" : "en";

  // Snap points - Start at 70%, expandable to fullscreen
  const snapPoints = useMemo(() => ['70%', '100%'], []);

  // Get document content from the markdown files
  const getDocumentContent = (docType: LegalDocType, lang: string): string => {
    const templates = {
      de: {
        impressum: `# Impressum

**Angaben gemäß § 5 TMG**

Clemens Walther - AppVentures
Malzstraße 12
42119 Wuppertal
Deutschland

**Kontakt:**
E-Mail: info@playfusion-gate.de

**Kleinunternehmerregelung:**
Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen.

**Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:**
Clemens Walther
Malzstraße 12
42119 Wuppertal

**Streitschlichtung:**
Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr

Unsere E-Mail-Adresse finden Sie oben im Impressum.

Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.`,
        datenschutz: `# Datenschutzerklärung

**Stand:** Oktober 2025

## 1. Verantwortlicher

Clemens Walther - AppVentures
Malzstraße 12
42119 Wuppertal
E-Mail: info@playfusion-gate.de

## 2. Welche Daten werden erhoben?

### 2.1 Lokale Datenspeicherung
Sudoku Duo speichert Spielstände, Einstellungen und freigeschaltete Inhalte **lokal auf deinem Gerät**. Diese Daten verlassen dein Gerät nicht und werden nicht an uns oder Dritte übertragen.

**Gespeicherte Daten:**
- Spielstände und Statistiken
- App-Einstellungen (Theme, Sprache, etc.)
- Freischaltungen von Premium-Inhalten
- Tutorial-Status

### 2.2 In-App-Käufe
Bei In-App-Käufen werden Transaktionsdaten über **RevenueCat** (Auftragsverarbeiter) und **Google Play** verarbeitet.

**Verarbeitete Daten:**
- Google Play Account-ID (anonymisiert)
- Kauf-Historie und Abo-Status
- Geräteinformationen (zur Betrugsverhinderung)

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

**Datenverarbeiter:**
- RevenueCat Inc., USA (Privacy Shield zertifiziert)
- Google Ireland Limited, Irland (Google Play Billing)

### 2.3 Keine Analyse-Tools
Wir verwenden **keine** Tracking-Tools, Analytics oder Werbung. Deine Privatsphäre ist uns wichtig.

## 3. Deine Rechte

Du hast das Recht auf:
- **Auskunft** über gespeicherte Daten (Art. 15 DSGVO)
- **Berichtigung** falscher Daten (Art. 16 DSGVO)
- **Löschung** deiner Daten (Art. 17 DSGVO)
- **Einschränkung** der Verarbeitung (Art. 18 DSGVO)
- **Datenübertragbarkeit** (Art. 20 DSGVO)
- **Widerspruch** gegen die Verarbeitung (Art. 21 DSGVO)

**Kontakt:** info@playfusion-gate.de

**Beschwerderecht:**
Du kannst dich bei der zuständigen Aufsichtsbehörde beschweren:
Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen
https://www.ldi.nrw.de

## 4. Datensicherheit

Wir setzen technische und organisatorische Maßnahmen ein, um deine Daten zu schützen:
- Lokale Speicherung auf deinem Gerät (kein Server)
- Verschlüsselte Übertragung bei Käufen (TLS)
- Zugriffsbeschränkungen gemäß iOS/Android Sicherheitsstandards

## 5. Änderungen dieser Datenschutzerklärung

Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um aktuellen rechtlichen Anforderungen zu entsprechen. Bei wesentlichen Änderungen informieren wir dich über ein Update der App.`,
        agb: `# Nutzungsbedingungen (AGB)

**Stand:** Oktober 2025

## 1. Geltungsbereich

Diese Nutzungsbedingungen gelten für die App "Sudoku Duo" (nachfolgend "App") von Clemens Walther - AppVentures.

## 2. Leistungsumfang

### 2.1 Kostenlose Funktionen
Die App bietet grundlegende Sudoku-Funktionen kostenlos an:
- Einzelspieler-Modus
- Mehrere Schwierigkeitsgrade
- Statistiken und Fortschritt

### 2.2 Premium-Funktionen (In-App-Käufe)
Zusätzliche Funktionen können per Einmalkauf oder Abonnement freigeschaltet werden:
- **Supporter-Status (Einmalkauf):** Einmalige Zahlung, lebenslanger Zugang zu Premium-Features
- **Premium-Abo (Monatlich/Jährlich):** Wiederkehrende Zahlung mit zusätzlichen monatlichen Freischaltungen

## 3. Vertragsschluss

Der Vertrag kommt durch den Kauf eines In-App-Produkts über Google Play zustande. Google Play wickelt die Zahlung ab.

## 4. Preise und Zahlung

Alle Preise sind in Euro (€) angegeben und verstehen sich als **Endpreise**.

**Kleinunternehmerregelung:**
Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen.

**Zahlungsabwicklung:**
Google Play (bei Android) bzw. Apple App Store (bei iOS)

## 5. Abonnements

### 5.1 Laufzeit und Verlängerung
- Abonnements verlängern sich **automatisch** um die jeweilige Laufzeit (Monat/Jahr)
- Kündigung ist jederzeit über Google Play/App Store möglich
- Kündigung wird zum Ende der aktuellen Laufzeit wirksam

### 5.2 Kündigung
- **Google Play:** Einstellungen → Abos → Sudoku Duo → Kündigen
- **App Store:** Einstellungen → [Name] → Abos → Sudoku Duo → Kündigen

## 6. Widerrufsrecht

Für digitale Inhalte gilt ein **14-tägiges Widerrufsrecht**. Das Widerrufsrecht erlischt bei sofortiger Bereitstellung (nach Kaufabschluss).

Details siehe separate **Widerrufsbelehrung**.

## 7. Gewährleistung

Wir bemühen uns, die App fehlerfrei und unterbrechungsfrei bereitzustellen. Ein Rechtsanspruch darauf besteht jedoch nicht.

**Gewährleistung:**
Es gelten die gesetzlichen Gewährleistungsrechte.

## 8. Haftung

Wir haften nur für Vorsatz und grobe Fahrlässigkeit. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit gesetzlich zulässig.

## 9. Nutzungsrechte

Du erhältst ein **nicht-übertragbares, nicht-exklusives** Nutzungsrecht für die App. Die App darf nur für private, nicht-kommerzielle Zwecke genutzt werden.

**Verboten:**
- Reverse Engineering
- Verbreitung oder Weiterverkauf
- Manipulation der App

## 10. Änderungen der AGB

Wir behalten uns vor, diese AGB anzupassen. Über wesentliche Änderungen informieren wir dich rechtzeitig (mindestens 6 Wochen vor Inkrafttreten).

## 11. Schlussbestimmungen

**Anwendbares Recht:**
Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.

**Gerichtsstand:**
Bei Streitigkeiten ist der Gerichtsstand Wuppertal (bei Verbrauchern: Wohnsitz des Verbrauchers).

**Salvatorische Klausel:**
Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.`,
        widerruf: `# Widerrufsbelehrung

## Widerrufsrecht

Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.

Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses (Kaufdatum).

## Ausübung des Widerrufsrechts

Um Ihr Widerrufsrecht auszuüben, müssen Sie uns:

**Clemens Walther - AppVentures**
Malzstraße 12
42119 Wuppertal
E-Mail: info@playfusion-gate.de

mittels einer eindeutigen Erklärung (z. B. per E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.

## Widerrufsfolgen

Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.

**Rückzahlung:**
Die Rückzahlung erfolgt über die ursprüngliche Zahlungsmethode (Google Play / App Store).

## Erlöschen des Widerrufsrechts

**Wichtig:**
Das Widerrufsrecht erlischt bei digitalen Inhalten, wenn Sie der **sofortigen Bereitstellung** zugestimmt haben und zur Kenntnis genommen haben, dass Sie durch die Zustimmung Ihr Widerrufsrecht verlieren.

**In der App:**
Nach Abschluss eines Kaufs werden Premium-Funktionen **sofort freigeschaltet**. Mit dem Kauf stimmen Sie der sofortigen Bereitstellung zu und verzichten auf Ihr Widerrufsrecht.

## Ausnahmen

Bei **Abonnements** bleibt das Widerrufsrecht für zukünftige Zahlungen bestehen. Sie können das Abo jederzeit über Google Play / App Store kündigen.

---

**Hinweis:**
Diese Widerrufsbelehrung entspricht den Vorgaben des § 312g BGB in Verbindung mit Art. 246a § 1 Abs. 2 EGBGB.`,
      },
      en: {
        impressum: `# Legal Notice

**Information according to § 5 TMG**

Clemens Walther - AppVentures
Malzstraße 12
42119 Wuppertal
Germany

**Contact:**
Email: info@playfusion-gate.de

**Small Business Regulation:**
According to § 19 UStG, no VAT is shown.

**Responsible for content according to § 55 Abs. 2 RStV:**
Clemens Walther
Malzstraße 12
42119 Wuppertal

**Dispute Resolution:**
The European Commission provides a platform for online dispute resolution (ODR): https://ec.europa.eu/consumers/odr

Our email address can be found above in the legal notice.

We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.`,
        datenschutz: `# Privacy Policy

**Last updated:** October 2025

## 1. Controller

Clemens Walther - AppVentures
Malzstraße 12
42119 Wuppertal
Email: info@playfusion-gate.de

## 2. What Data is Collected?

### 2.1 Local Data Storage
Sudoku Duo stores game progress, settings, and unlocked content **locally on your device**. This data does not leave your device and is not transmitted to us or third parties.

**Stored data:**
- Game progress and statistics
- App settings (theme, language, etc.)
- Premium content unlocks
- Tutorial status

### 2.2 In-App Purchases
For in-app purchases, transaction data is processed via **RevenueCat** (data processor) and **Google Play**.

**Processed data:**
- Google Play Account ID (anonymized)
- Purchase history and subscription status
- Device information (for fraud prevention)

**Legal basis:** Art. 6(1)(b) GDPR (contract fulfillment)

**Data processors:**
- RevenueCat Inc., USA (Privacy Shield certified)
- Google Ireland Limited, Ireland (Google Play Billing)

### 2.3 No Analytics Tools
We do **not** use tracking tools, analytics, or advertising. Your privacy is important to us.

## 3. Your Rights

You have the right to:
- **Access** stored data (Art. 15 GDPR)
- **Rectification** of incorrect data (Art. 16 GDPR)
- **Erasure** of your data (Art. 17 GDPR)
- **Restriction** of processing (Art. 18 GDPR)
- **Data portability** (Art. 20 GDPR)
- **Object** to processing (Art. 21 GDPR)

**Contact:** info@playfusion-gate.de

**Right to lodge a complaint:**
You can file a complaint with the competent supervisory authority:
Data Protection Authority of North Rhine-Westphalia
https://www.ldi.nrw.de

## 4. Data Security

We implement technical and organizational measures to protect your data:
- Local storage on your device (no server)
- Encrypted transmission for purchases (TLS)
- Access restrictions according to iOS/Android security standards

## 5. Changes to this Privacy Policy

We reserve the right to adapt this privacy policy to comply with current legal requirements. For substantial changes, we will inform you via an app update.`,
        agb: `# Terms of Service

**Last updated:** October 2025

## 1. Scope

These terms of service apply to the app "Sudoku Duo" (hereinafter "App") by Clemens Walther - AppVentures.

## 2. Scope of Services

### 2.1 Free Features
The app offers basic Sudoku features for free:
- Single-player mode
- Multiple difficulty levels
- Statistics and progress tracking

### 2.2 Premium Features (In-App Purchases)
Additional features can be unlocked via one-time purchase or subscription:
- **Supporter Status (One-time):** One-time payment, lifetime access to premium features
- **Premium Subscription (Monthly/Yearly):** Recurring payment with additional monthly unlocks

## 3. Contract Formation

The contract is formed by purchasing an in-app product via Google Play. Google Play processes the payment.

## 4. Prices and Payment

All prices are shown in Euro (€) as **final prices**.

**Small Business Regulation:**
According to § 19 UStG, no VAT is shown.

**Payment processing:**
Google Play (on Android) or Apple App Store (on iOS)

## 5. Subscriptions

### 5.1 Duration and Renewal
- Subscriptions **automatically renew** for the respective period (month/year)
- Cancellation is possible at any time via Google Play/App Store
- Cancellation becomes effective at the end of the current period

### 5.2 Cancellation
- **Google Play:** Settings → Subscriptions → Sudoku Duo → Cancel
- **App Store:** Settings → [Name] → Subscriptions → Sudoku Duo → Cancel

## 6. Right of Withdrawal

For digital content, a **14-day right of withdrawal** applies. The right of withdrawal expires upon immediate provision (after purchase completion).

See separate **Right of Withdrawal** for details.

## 7. Warranty

We strive to provide the app error-free and uninterrupted. However, there is no legal claim to this.

**Warranty:**
Statutory warranty rights apply.

## 8. Liability

We are only liable for intent and gross negligence. Liability for slight negligence is excluded to the extent permitted by law.

## 9. Usage Rights

You receive a **non-transferable, non-exclusive** right to use the app. The app may only be used for private, non-commercial purposes.

**Prohibited:**
- Reverse engineering
- Distribution or resale
- Manipulation of the app

## 10. Changes to Terms

We reserve the right to modify these terms. We will inform you about substantial changes in advance (at least 6 weeks before they take effect).

## 11. Final Provisions

**Applicable Law:**
German law applies, excluding the UN Convention on Contracts for the International Sale of Goods.

**Jurisdiction:**
In case of disputes, the place of jurisdiction is Wuppertal (for consumers: consumer's place of residence).

**Severability Clause:**
If individual provisions are invalid, the validity of the remaining provisions remains unaffected.`,
        widerruf: `# Right of Withdrawal

## Right of Withdrawal

You have the right to withdraw from this contract within fourteen days without giving any reason.

The withdrawal period is fourteen days from the date of contract conclusion (purchase date).

## Exercising the Right of Withdrawal

To exercise your right of withdrawal, you must inform us:

**Clemens Walther - AppVentures**
Malzstraße 12
42119 Wuppertal
Email: info@playfusion-gate.de

by means of a clear statement (e.g., by email) of your decision to withdraw from this contract.

## Consequences of Withdrawal

If you withdraw from this contract, we must reimburse all payments we have received from you without undue delay and no later than fourteen days from the day we received notice of your withdrawal from this contract.

**Reimbursement:**
Reimbursement will be made using the original payment method (Google Play / App Store).

## Expiry of the Right of Withdrawal

**Important:**
The right of withdrawal expires for digital content if you have consented to **immediate provision** and acknowledged that you lose your right of withdrawal through this consent.

**In the App:**
After completing a purchase, premium features are **unlocked immediately**. With the purchase, you consent to immediate provision and waive your right of withdrawal.

## Exceptions

For **subscriptions**, the right of withdrawal remains for future payments. You can cancel the subscription at any time via Google Play / App Store.

---

**Note:**
This right of withdrawal notice complies with the requirements of § 312g BGB in conjunction with Art. 246a § 1 Para. 2 EGBGB.`,
      },
    };

    return templates[lang as keyof typeof templates]?.[docType] || "Document not found";
  };

  const loadDocument = useCallback((docType: LegalDocType) => {
    const content = getDocumentContent(docType, currentLang);
    setDocContent(content);
    setSelectedDoc(docType);
  }, [currentLang]);

  const handleDocPress = useCallback((docType: LegalDocType) => {
    triggerHaptic("light");
    loadDocument(docType);
  }, [loadDocument]);

  const handleBackPress = useCallback(() => {
    triggerHaptic("light");
    if (selectedDoc) {
      setSelectedDoc(null);
      setDocContent("");
    } else {
      onClose();
    }
  }, [selectedDoc, onClose]);

  const handleClosePress = useCallback(() => {
    triggerHaptic("light");
    onClose();
  }, [onClose]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    setSelectedDoc(null);
    setDocContent("");
    onClose();
  }, [onClose]);

  // Open/close modal based on visible prop
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  // Hide BottomNav when modal is visible
  useEffect(() => {
    if (visible) {
      hideBottomNav();
    }
    return () => {
      resetBottomNav();
    };
  }, [visible, hideBottomNav, resetBottomNav]);

  // Handle Android back button
  useEffect(() => {
    if (!visible) return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (selectedDoc) {
          // If document is open, go back to list
          setSelectedDoc(null);
          setDocContent("");
          return true; // Prevent default behavior
        }
        // If on list, allow default behavior (close modal)
        return false;
      }
    );

    return () => backHandler.remove();
  }, [visible, selectedDoc]);

  // Render custom handle
  const renderHandle = useCallback(
    (props: any) => <BottomSheetHandle {...props} isDark={isDark} />,
    [isDark]
  );

  // Render custom backdrop with blur
  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBottomSheetBackdrop
        {...props}
        isDark={isDark}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [isDark]
  );

  // Markdown styles
  const markdownStyles = useMemo(() => ({
    body: {
      color: colors.textPrimary,
      fontSize: 14,
      lineHeight: 24,
    },
    heading1: {
      color: colors.textPrimary,
      fontSize: 24,
      fontWeight: '700',
      marginTop: 20,
      marginBottom: 12,
    },
    heading2: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '600',
      marginTop: 16,
      marginBottom: 10,
    },
    heading3: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
      marginTop: 12,
      marginBottom: 8,
    },
    paragraph: {
      color: colors.textPrimary,
      marginBottom: 10,
    },
    strong: {
      fontWeight: '700',
      color: colors.textPrimary,
    },
    link: {
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    list_item: {
      color: colors.textPrimary,
      marginBottom: 4,
    },
    bullet_list: {
      marginBottom: 10,
    },
    code_inline: {
      backgroundColor: colors.surface,
      color: colors.primary,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
  }), [colors]);

  // Document list view
  const renderDocumentList = () => (
    <View style={styles.listContainer}>
      <View style={styles.subtitleContainer}>
        <Feather
          name="shield"
          size={32}
          color={colors.textSecondary}
          style={styles.subtitleIcon}
        />
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t("legal.subtitle")}
        </Text>
      </View>

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
          style={[styles.docItem, { borderBottomWidth: 0 }]}
          onPress={() => handleDocPress("widerruf")}
        >
          <Text style={[styles.docTitle, { color: colors.textPrimary }]}>
            {t("legal.widerruf")}
          </Text>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Document viewer
  const renderDocumentViewer = () => (
    <View style={styles.documentContainer}>
      <Markdown style={markdownStyles}>
        {docContent}
      </Markdown>
    </View>
  );

  return (
    <GorhomBottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      enablePanDownToClose={!selectedDoc}
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      style={styles.bottomSheet}
    >
      {/* Header with title and close/back button */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        {selectedDoc ? (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {selectedDoc ? t(`legal.${selectedDoc}`) : t("legal.title")}
        </Text>

        <TouchableOpacity onPress={handleClosePress} style={styles.closeButton}>
          <Feather name="x" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <BottomSheetScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {selectedDoc ? renderDocumentViewer() : renderDocumentList()}
      </BottomSheetScrollView>
    </GorhomBottomSheetModal>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 4,
    width: 40,
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    width: 40,
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  listContainer: {
    paddingTop: 16,
  },
  subtitleContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  subtitleIcon: {
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  docList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
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
  documentContainer: {
    paddingTop: 16,
  },
});

export default LegalScreen;
