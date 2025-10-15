// screens/Settings/components/AuthSection/AccountInfoCard.tsx
/**
 * AccountInfoCard
 *
 * Zeigt Account-Informationen wenn User eingeloggt ist:
 * - User Email/Name mit Google Profilbild
 * - Auto-Sync Status
 * - Sign Out Button
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/components/CustomAlert/AlertProvider';
import { useProgressColor } from '@/hooks/useProgressColor';

interface AccountInfoCardProps {
  onSignOut?: () => void;
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ onSignOut }) => {
  const { t } = useTranslation('settings');
  const theme = useTheme();
  const colors = theme.colors;
  const { user, signOut, loading: authLoading } = useAuth();
  const { showAlert } = useAlert();
  const progressColor = useProgressColor();

  // Handle sign out
  const handleSignOut = async () => {
    try {
      showAlert({
        title: t('authSection.signOutConfirmTitle'),
        message: t('authSection.signOutConfirmMessage'),
        type: 'warning',
        buttons: [
          {
            text: t('authSection.cancel'),
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: t('authSection.signOut'),
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
                if (onSignOut) onSignOut();
                showAlert({
                  title: t('authSection.signOutSuccess'),
                  message: t('authSection.signOutSuccessMessage'),
                  type: 'success',
                  buttons: [
                    {
                      text: 'OK',
                      style: 'primary',
                      onPress: () => {},
                    },
                  ],
                });
              } catch (error: any) {
                console.error('[AccountInfoCard] Sign out error:', error);
                showAlert({
                  title: t('authSection.signOutError'),
                  message: error.message || t('authSection.signOutErrorMessage'),
                  type: 'error',
                  buttons: [
                    {
                      text: 'OK',
                      style: 'primary',
                      onPress: () => {},
                    },
                  ],
                });
              }
            },
          },
        ],
      });
    } catch (error) {
      console.error('[AccountInfoCard] Sign out alert error:', error);
    }
  };

  if (!user) return null;

  const email = user.email || t('authSection.noEmail');
  const displayName = user.displayName || email.split('@')[0];
  const photoURL = user.photoURL;

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(500)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          shadowColor: theme.isDark ? '#000' : '#000',
        },
      ]}
    >
      {/* User Info Header */}
      <View style={styles.header}>
        {/* Profile Photo */}
        <View style={[styles.avatarContainer, { borderColor: progressColor }]}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: progressColor + '20' }]}>
              <Feather name="user" size={32} color={progressColor} />
            </View>
          )}
        </View>

        {/* User Details */}
        <View style={styles.userInfo}>
          <Text style={[styles.displayName, { color: colors.textPrimary }]} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>
            {email}
          </Text>
        </View>
      </View>

      {/* Auto-Sync Info - Simple one-liner */}
      <View style={[styles.syncInfo, { backgroundColor: progressColor + '10' }]}>
        <Feather name="cloud-lightning" size={16} color={progressColor} />
        <Text style={[styles.syncInfoText, { color: colors.textSecondary }]}>
          {t('authSection.autoSyncInfo')}
        </Text>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[styles.signOutButton, { borderColor: colors.border }]}
        onPress={handleSignOut}
        disabled={authLoading}
        activeOpacity={0.7}
      >
        {authLoading ? (
          <ActivityIndicator size="small" color={colors.textSecondary} />
        ) : (
          <Feather name="log-out" size={18} color={colors.textSecondary} />
        )}
        <Text style={[styles.signOutButtonText, { color: colors.textSecondary }]}>
          {t('authSection.signOut')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    gap: spacing.md,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  email: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Auto-Sync Info - Simple
  syncInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.sm,
    gap: spacing.xs,
  },
  syncInfoText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Sign Out Button
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  signOutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default AccountInfoCard;
