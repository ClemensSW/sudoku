// screens/Settings/components/ProfileGroup/components/EditableNameField.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { triggerHaptic } from '@/utils/haptics';

interface EditableNameFieldProps {
  name: string;
  onNameChange: (newName: string) => void;
  onStartEdit: () => void;
  isEditing: boolean;
  textPrimaryColor: string;
  textSecondaryColor: string;
  primaryColor: string;
}

const EditableNameField: React.FC<EditableNameFieldProps> = ({
  name,
  onNameChange,
  onStartEdit,
  isEditing,
  textPrimaryColor,
  textSecondaryColor,
  primaryColor,
}) => {
  const { t } = useTranslation('settings');

  const isDefaultName = !name || name === 'User';
  const [editedName, setEditedName] = useState(isDefaultName ? '' : name);
  const inputRef = useRef<TextInput>(null);

  // Update editedName when name prop changes
  useEffect(() => {
    if (!isEditing) {
      setEditedName(isDefaultName ? '' : name);
    }
  }, [name, isDefaultName, isEditing]);

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedName = editedName.trim();

    if (trimmedName.length > 0 && trimmedName.length <= 20) {
      onNameChange(trimmedName);
      triggerHaptic('success');
    } else {
      // Revert to original name if invalid
      setEditedName(isDefaultName ? '' : name);
      triggerHaptic('light');
    }
  };

  if (isEditing) {
    return (
      <View style={styles.editContainer}>
        <TextInput
          ref={inputRef}
          value={editedName}
          onChangeText={setEditedName}
          onBlur={handleSave}
          onSubmitEditing={handleSave}
          placeholder={t('appearance.nameModal.placeholder')}
          placeholderTextColor={textSecondaryColor}
          returnKeyType="done"
          maxLength={20}
          autoCorrect={false}
          style={[
            styles.input,
            {
              color: textPrimaryColor,
              borderBottomColor: primaryColor,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <Text style={[styles.nameText, { color: textSecondaryColor }]} numberOfLines={1}>
      {name}
    </Text>
  );
};

const styles = StyleSheet.create({
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    minWidth: 100,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default EditableNameField;
