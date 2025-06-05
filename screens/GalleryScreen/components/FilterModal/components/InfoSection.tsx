// screens/GalleryScreen/components/FilterModal/components/InfoSection.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { spacing, radius } from "@/utils/theme";

interface InfoItemProps {
  icon: string;
  title: string;
  description: string;
  iconColor?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, title, description, iconColor }) => {
  const theme = useTheme();
  const { colors } = theme;
  
  return (
    <View style={styles.infoItem}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: iconColor ? `${iconColor}20` : `${colors.primary}20` }
      ]}>
        <Feather
          name={icon as any}
          size={20}
          color={iconColor || colors.primary}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
          {title}
        </Text>
        <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const InfoSection: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  
  return (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        So funktioniert deine Sammlung
      </Text>
      
      <View style={styles.infoContainer}>
        <InfoItem
          icon="grid"
          iconColor={colors.primary}
          title="Bilder sammeln"
          description="Jedes gelöste Sudoku bringt dich einem neuen Bild näher – schalte sie alle frei und fülle deine Galerie!"
        />
        
        <InfoItem
          icon="target"
          iconColor={colors.info}
          title="Bild auswählen"
          description="Entscheide selbst, welches Bild du als Nächstes sammeln möchtest. Tippe dazu in der Detailansicht auf 'Dieses Bild freischalten'."
        />
        
        <InfoItem
          icon="heart"
          iconColor={colors.error}
          title="Favoriten setzen"
          description="Markiere vollständige Bilder als Favorit – so erscheinen sie auf deinem Startbildschirm."
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  
  infoContainer: {
    gap: spacing.md,
  },
  
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  
  textContainer: {
    flex: 1,
  },
  
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: spacing.xxs,
  },
  
  infoDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default InfoSection;