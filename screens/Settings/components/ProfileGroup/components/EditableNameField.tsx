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
  progressColor: string; // Pfadfarbe (nicht primaryColor!)
}

const EditableNameField: React.FC<EditableNameFieldProps> = ({
  name,
  onNameChange,
  onStartEdit,
  isEditing,
  textPrimaryColor,
  textSecondaryColor,
  progressColor,
}) => {
  const { t } = useTranslation('settings');

  const isDefaultName = !name || name === 'User';
  const [editedName, setEditedName] = useState(isDefaultName ? '' : name);
  const inputRef = useRef<TextInput>(null);

  // FIX 1: Update editedName when name prop changes (auch im Edit-Modus!)
  useEffect(() => {
    setEditedName(isDefaultName ? '' : name);
  }, [name, isDefaultName]);

  // FIX 2: Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing) {
      // Sofortiger Focus ohne Delay
      inputRef.current?.focus();
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
          autoFocus={true} // FIX 2: autoFocus hinzugefügt
          autoCorrect={false}
          style={[
            styles.input,
            {
              color: textPrimaryColor,
              borderBottomColor: progressColor, // FIX 3: progressColor (Pfadfarbe)
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
