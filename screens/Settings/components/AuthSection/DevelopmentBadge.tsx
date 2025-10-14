// screens/Settings/components/AuthSection/DevelopmentBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';

const DevelopmentBadge: React.FC = () => {
  const { t } = useTranslation('settings');
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.isDark
            ? 'rgba(255, 193, 7, 0.12)'
            : 'rgba(255, 193, 7, 0.15)',
          borderColor: theme.isDark
            ? 'rgba(255, 193, 7, 0.3)'
            : 'rgba(255, 152, 0, 0.35)',
        },
      ]}
    >
      <Feather
        name="code"
        size={14}
        color={theme.isDark ? '#FFD54F' : '#F57C00'}
      />
      <Text
        style={[
          styles.badgeText,
          {
            color: theme.isDark ? '#FFD54F' : '#F57C00',
          },
        ]}
      >
        {t('authSection.inDevelopment')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignSelf: 'center', // Center in parent container
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default DevelopmentBadge;
