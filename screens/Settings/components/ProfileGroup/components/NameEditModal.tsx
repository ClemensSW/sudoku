// screens/Settings/components/ProfileGroup/components/NameEditModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/hooks/useProgressColor';
import { spacing, radius } from '@/utils/theme';
import { triggerHaptic } from '@/utils/haptics';
import { getRandomStarterName } from '@/utils/randomProfile';
import BottomSheetModal from '@/components/BottomSheetModal';

interface NameEditModalProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (name: string) => void;
}

const NameEditModal: React.FC<NameEditModalProps> = ({
  visible,
  onClose,
  currentName,
  onSave,
}) => {
  const { t } = useTranslation('settings');
  const theme = useTheme();
  const { colors, isDark, typography } = theme;
  const progressColor = useProgressColor();

  const [name, setName] = useState(currentName);

  // Update name when currentName prop changes
  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  // Reset name when modal opens
  useEffect(() => {
    if (visible) {
      setName(currentName);
    }
  }, [visible, currentName]);

  const handleRandom = () => {
    triggerHaptic('light');
    setName(getRandomStarterName());
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      triggerHaptic('success');
      onSave(trimmedName);
      onClose();
    }
  };

  const isValidName = name.trim().length > 0;

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t('appearance.nameModal.title')}
      isDark={isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['50%']}
      keyboardBehavior="fillParent"
      android_keyboardInputMode="adjustResize"
      managesBottomNav={false}
    >
      <View style={styles.container}>
        {/* Input Container */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
            {t('appearance.nameModal.label')}
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                borderColor: colors.border,
              },
            ]}
          >
            <Feather name="user" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <BottomSheetTextInput
              style={[styles.input, { color: colors.textPrimary, fontSize: typography.size.md }]}
              placeholder={t('appearance.nameModal.placeholder')}
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              maxLength={20}
              autoCorrect={false}
              autoFocus
            />
            <TouchableOpacity
              onPress={handleRandom}
              style={styles.randomButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="refresh-cw" size={20} color={progressColor} />
            </TouchableOpacity>
          </View>

          {/* Character Counter */}
          <Text style={[styles.counter, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
            {name.length}/20
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: progressColor,
              shadowColor: progressColor,
              opacity: isValidName ? 1 : 0.5,
            },
          ]}
          onPress={handleSave}
          disabled={!isValidName}
        >
          <Text style={[styles.saveButtonText, { fontSize: typography.size.md }]}>
            {t('appearance.nameModal.save')}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  randomButton: {
    padding: spacing.xs,
  },
  counter: {
    alignSelf: 'flex-end',
    marginRight: spacing.xs,
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default NameEditModal;
