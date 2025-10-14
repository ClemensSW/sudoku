// screens/Settings/DevTestingMenu.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { Feather } from '@expo/vector-icons';
import {
  markAsPurchased,
  resetPurchaseStatus,
  getPurchaseType,
  checkHasPurchased
} from '@/screens/SupportShop/utils/purchaseTracking';
import { getSupporterStatus, getImageUnlockQuota } from '@/modules/subscriptions/entitlements';
import {
  recordPurchase,
  calculateLifetimeQuota,
  getPurchaseCount,
  resetPurchaseQuota,
  debugPrintQuota
} from '@/modules/subscriptions/purchaseQuota';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refillShields, getStreakStats } from '@/utils/dailyStreak';

const DevTestingMenu: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [status, setStatus] = useState<string>('Bereit zum Testen');

  const updateStatus = async () => {
    const hasPurchased = await checkHasPurchased();
    const purchaseType = await getPurchaseType();
    const supporterStatus = await getSupporterStatus();
    const quota = await getImageUnlockQuota();
    const streakStats = await getStreakStats();

    // DEBUG: Log zur Analyse
    console.log('[DevTestingMenu] Status Update:', {
      purchaseType,
      isPremiumSubscriber: supporterStatus.isPremiumSubscriber,
      supportType: supporterStatus.supportType,
      maxRegularShields: streakStats?.maxRegularShields,
      shieldsAvailable: streakStats?.shieldsAvailable,
    });

    // Determine subscription type for display
    let subTypeLabel = '';
    if (quota.isSubscription) {
      if (quota.subscriptionType === 'yearly') {
        subTypeLabel = ' (Jährlich)';
      } else if (quota.subscriptionType === 'monthly') {
        subTypeLabel = ' (Monatlich)';
      }
    }

    const lifetimeQuota = await calculateLifetimeQuota();
    const unlockInfo = quota.isSubscription
      ? `${quota.remainingUnlocks}/${quota.monthlyLimit} (monatlich${subTypeLabel})`
      : `${quota.remainingUnlocks}/${lifetimeQuota} (lifetime)`;

    const shieldInfo = streakStats
      ? `${streakStats.shieldsAvailable}/${streakStats.maxRegularShields} + ${streakStats.bonusShields} Bonus`
      : 'N/A';

    setStatus(`
Status: ${hasPurchased ? '✅ Supporter' : '❌ Kein Supporter'}
Typ: ${purchaseType}${subTypeLabel}
Premium: ${supporterStatus.isPremiumSubscriber ? '✅ Ja' : '❌ Nein'}
EP Multiplikator: ${supporterStatus.isSupporter ? '2x' : '1x'}
Bilder übrig: ${unlockInfo}
Lifetime Quota: ${lifetimeQuota} (gekaufte Produkte)
Schutzschilder: ${shieldInfo}
    `.trim());
  };

  const simulateOneTimePurchase = async () => {
    await markAsPurchased(
      {
        id: 'de.playfusiongate.sudokuduo.coffee',
        name: 'Test Kaffee',
        price: 1.99,
        timestamp: new Date().toISOString(),
      },
      'one-time'
    );
    // Record in quota system
    await recordPurchase('de.playfusiongate.sudokuduo.coffee');
    // Schutzschilder auffüllen (automatisch)
    await refillShields('one-time');
    await updateStatus();
    const quota = await calculateLifetimeQuota();
    const stats = await getStreakStats();
    Alert.alert('✅ Erfolg', `Einmalkauf simuliert!\n\n• 2× EP aktiv\n• ${quota} Bild(er) (lifetime) freischaltbar\n• Schutzschilder: ${stats?.shieldsAvailable}/${stats?.maxRegularShields}`);
  };

  const simulateMultipleCoffeePurchases = async () => {
    Alert.prompt(
      '☕ Kaffee kaufen',
      'Wie viele Kaffees kaufen? (1-10)',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Kaufen',
          onPress: async (count) => {
            const numPurchases = parseInt(count || '1', 10);
            if (isNaN(numPurchases) || numPurchases < 1 || numPurchases > 10) {
              Alert.alert('Fehler', 'Bitte eine Zahl zwischen 1 und 10 eingeben');
              return;
            }

            // Mark as purchased (one-time)
            if (numPurchases === 1) {
              await markAsPurchased(
                {
                  id: 'de.playfusiongate.sudokuduo.coffee',
                  name: 'Test Kaffee',
                  price: 1.99,
                  timestamp: new Date().toISOString(),
                },
                'one-time'
              );
            }

            // Record all purchases in quota system
            for (let i = 0; i < numPurchases; i++) {
              await recordPurchase('de.playfusiongate.sudokuduo.coffee');
            }

            await updateStatus();
            await debugPrintQuota();

            const quota = await calculateLifetimeQuota();
            Alert.alert(
              '✅ Erfolg',
              `${numPurchases}× Kaffee gekauft!\n\n• 2× EP aktiv\n• ${quota} Bild(er) freischaltbar`
            );
          }
        }
      ],
      'plain-text',
      '3'
    );
  };

  const simulateMonthlySubscription = async () => {
    const productId = 'monthly_support'; // Product ID für Detection
    await markAsPurchased(
      {
        id: 'de.playfusiongate.sudokuduo.monthly:monthly',
        name: 'Monatliches Abo',
        price: 1.99,
        timestamp: new Date().toISOString(),
      },
      'subscription'
    );
    // Schutzschilder auf 3 auffüllen (mit productId für sofortige Detection)
    await refillShields('subscription', productId);
    await updateStatus();
    const stats = await getStreakStats();
    Alert.alert('✅ Erfolg', `Monatliches Abo simuliert!\n\n• 2× EP aktiv\n• 1 Bild pro Monat freischaltbar\n• Schutzschilder: ${stats?.shieldsAvailable}/${stats?.maxRegularShields} (sollte 3 sein)\n• Aktiv im Support Shop`);
  };

  const simulateYearlySubscription = async () => {
    const productId = 'yearly_support'; // Product ID für Detection (enthält "yearly" → 4 Schilde!)
    await markAsPurchased(
      {
        id: 'de.playfusiongate.sudokuduo.yearly:yearly',
        name: 'Jährliches Abo',
        price: 19.99,
        timestamp: new Date().toISOString(),
      },
      'subscription'
    );
    // Schutzschilder auf 4 auffüllen (mit productId für sofortige Detection)
    await refillShields('subscription', productId);
    await updateStatus();
    const stats = await getStreakStats();
    Alert.alert('✅ Erfolg', `Jährliches Abo simuliert!\n\n• 2× EP aktiv\n• 2 Bilder pro Monat freischaltbar\n• Schutzschilder: ${stats?.shieldsAvailable}/${stats?.maxRegularShields} (sollte 4 sein!)\n• Aktiv im Support Shop`);
  };

  const resetAll = async () => {
    await resetPurchaseStatus();
    await resetPurchaseQuota();
    await AsyncStorage.removeItem('@sudoku/image_unlock_quota');
    await updateStatus();
    Alert.alert('🔄 Zurückgesetzt', 'Alle Käufe und Freischaltungen gelöscht');
  };

  const resetMonthlyQuota = async () => {
    const quota = await getImageUnlockQuota();
    await AsyncStorage.removeItem('@sudoku/image_unlock_quota');
    await updateStatus();
    const limitText = quota.monthlyLimit === 2 ? '2 Bilder' : '1 Bild';
    Alert.alert('🔄 Quota zurückgesetzt', `Du kannst wieder ${limitText} freischalten`);
  };

  const showCurrentStatus = async () => {
    await updateStatus();
  };

  React.useEffect(() => {
    updateStatus();
  }, []);

  return (
    <View style={{
      backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
      borderRadius: 12,
      padding: 16,
      marginVertical: 12,
    }}>
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 12,
      }}>
        🧪 Supporter Testing (nur Expo Go)
      </Text>

      <View style={{
        backgroundColor: isDark ? '#2A2A2E' : '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
      }}>
        <Text style={{
          fontSize: 12,
          color: colors.textSecondary,
          fontFamily: 'monospace',
        }}>
          {status}
        </Text>
      </View>

      <TestButton
        icon="coffee"
        label="Einmalkauf simulieren"
        description="2× EP + 1 Bild + Schilder auffüllen"
        onPress={simulateOneTimePurchase}
        colors={colors}
      />

      <TestButton
        icon="layers"
        label="Multiple Käufe simulieren"
        description="3× Kaffee = 3 Unlocks"
        onPress={simulateMultipleCoffeePurchases}
        colors={colors}
      />

      <TestButton
        icon="calendar"
        label="Monatliches Abo simulieren"
        description="2× EP + 1 Bild/Monat + 3 Schilder/Woche"
        onPress={simulateMonthlySubscription}
        colors={colors}
      />

      <TestButton
        icon="heart"
        label="Jährliches Abo simulieren"
        description="2× EP + 2 Bilder/Monat + 4 Schilder/Woche 🎉"
        onPress={simulateYearlySubscription}
        colors={colors}
      />

      <TestButton
        icon="rotate-cw"
        label="Monatliche Quota zurücksetzen"
        description="Unlock-Limit auffrischen"
        onPress={resetMonthlyQuota}
        colors={colors}
      />

      <TestButton
        icon="refresh-cw"
        label="Status aktualisieren"
        description="Zeigt aktuellen Stand"
        onPress={showCurrentStatus}
        colors={colors}
      />

      <TestButton
        icon="trash-2"
        label="Alles zurücksetzen"
        description="Löscht alle Testkäufe"
        onPress={resetAll}
        colors={colors}
        isDestructive
      />

      <View style={{
        backgroundColor: isDark ? '#2A2A2E' : '#E8F4FD',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
      }}>
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
          💡 Nach Simulierung:
          {'\n'}• Gehe zur Galerie → Bild öffnen → Unlock-Button testen
          {'\n'}• Spiele Sudoku → EP sollte 2× sein
          {'\n'}• Dankesseite erscheint nach Kauf im SupportShop
          {'\n'}• Schutzschilder: Gehe zu Leistung → Streak Tab
          {'\n'}• Premium-Banner ändert sich je nach Status (none/one-time/subscription)
        </Text>
      </View>
    </View>
  );
};

interface TestButtonProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  description: string;
  onPress: () => void;
  colors: any;
  isDestructive?: boolean;
}

const TestButton: React.FC<TestButtonProps> = ({
  icon,
  label,
  description,
  onPress,
  colors,
  isDestructive = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: isDestructive ? '#ff444420' : colors.card,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: isDestructive ? '#ff4444' : 'rgba(255,255,255,0.1)',
      }}
    >
      <View style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: isDestructive ? '#ff444420' : colors.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}>
        <Feather
          name={icon}
          size={18}
          color={isDestructive ? '#ff4444' : colors.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: isDestructive ? '#ff4444' : colors.textPrimary,
          marginBottom: 2,
        }}>
          {label}
        </Text>
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DevTestingMenu;
