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
import AsyncStorage from '@react-native-async-storage/async-storage';

const DevTestingMenu: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [status, setStatus] = useState<string>('Bereit zum Testen');

  const updateStatus = async () => {
    const hasPurchased = await checkHasPurchased();
    const purchaseType = await getPurchaseType();
    const supporterStatus = await getSupporterStatus();
    const quota = await getImageUnlockQuota();

    const unlockType = quota.isSubscription ? 'Monat' : 'Gesamt';
    const unlockInfo = quota.isSubscription
      ? `${quota.remainingUnlocks}/${quota.monthlyLimit} (monatlich)`
      : `${quota.remainingUnlocks}/${quota.monthlyLimit} (lifetime)`;

    setStatus(`
Status: ${hasPurchased ? '✅ Supporter' : '❌ Kein Supporter'}
Typ: ${purchaseType}
EP Multiplikator: ${supporterStatus.isSupporter ? '2x' : '1x'}
Bilder übrig: ${unlockInfo}
    `.trim());
  };

  const simulateOneTimePurchase = async () => {
    await markAsPurchased(
      {
        id: 'test_coffee',
        name: 'Test Kaffee',
        price: 2.99,
        timestamp: new Date().toISOString(),
      },
      'one-time'
    );
    await updateStatus();
    Alert.alert('✅ Erfolg', 'Einmalkauf simuliert!\n\n• 2× EP aktiv\n• 1 Bild (lifetime) freischaltbar');
  };

  const simulateMonthlySubscription = async () => {
    await markAsPurchased(
      {
        id: 'monthly_support',
        name: 'Monatliches Abo',
        price: 2.99,
        timestamp: new Date().toISOString(),
      },
      'subscription'
    );
    await updateStatus();
    Alert.alert('✅ Erfolg', 'Monatliches Abo simuliert!\n\n• 2× EP aktiv\n• 1 Bild pro Monat freischaltbar\n• Aktiv im Support Shop');
  };

  const simulateYearlySubscription = async () => {
    await markAsPurchased(
      {
        id: 'yearly_support',
        name: 'Jährliches Abo',
        price: 29.99,
        timestamp: new Date().toISOString(),
      },
      'subscription'
    );
    await updateStatus();
    Alert.alert('✅ Erfolg', 'Jährliches Abo simuliert!\n\n• 2× EP aktiv\n• 12 Bilder pro Jahr freischaltbar\n• Aktiv im Support Shop');
  };

  const resetAll = async () => {
    await resetPurchaseStatus();
    await AsyncStorage.removeItem('@sudoku/image_unlock_quota');
    await updateStatus();
    Alert.alert('🔄 Zurückgesetzt', 'Alle Käufe und Freischaltungen gelöscht');
  };

  const resetMonthlyQuota = async () => {
    await AsyncStorage.removeItem('@sudoku/image_unlock_quota');
    await updateStatus();
    Alert.alert('🔄 Quota zurückgesetzt', 'Du kannst wieder 1 Bild freischalten');
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
        description="2× EP + 1 Bild (lifetime)"
        onPress={simulateOneTimePurchase}
        colors={colors}
      />

      <TestButton
        icon="calendar"
        label="Monatliches Abo simulieren"
        description="2× EP + 1 Bild/Monat"
        onPress={simulateMonthlySubscription}
        colors={colors}
      />

      <TestButton
        icon="heart"
        label="Jährliches Abo simulieren"
        description="2× EP + 12 Bilder/Jahr"
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
