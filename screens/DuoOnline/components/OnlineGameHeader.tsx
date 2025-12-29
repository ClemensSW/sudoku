/**
 * OnlineGameHeader Component
 *
 * Displays player info header for online multiplayer matches
 * Design inspired by Google Play Multiplayer Sudoku
 *
 * Layout:
 * ┌────────────────────────────────────────┐
 * │  ┌────┐                      ┌────┐   │
 * │  │ 👤 │  ❤❤❤        ❤❤❤  │ 🤖 │   │
 * │  └────┘   4           12   └────┘   │
 * │  Player 1              AI Bot        │
 * └────────────────────────────────────────┘
 */

import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { Feather } from '@expo/vector-icons';
import { PlayerInfo, CellMove } from '@/hooks/online/useRealtimeMatch';
import { defaultAvatars, DEFAULT_AVATAR } from '@/screens/Leistung/utils/defaultAvatars';
import { getAvatarIdFromUri } from '@/utils/ai/aiAvatar';

interface OnlineGameHeaderProps {
  player1: PlayerInfo;
  player2: PlayerInfo;
  player1Moves: CellMove[];
  player2Moves: CellMove[];
  player1Errors: number;
  player2Errors: number;
  maxErrors?: number; // Max errors allowed (default: 3)
}

const OnlineGameHeader: React.FC<OnlineGameHeaderProps> = ({
  player1,
  player2,
  player1Moves,
  player2Moves,
  player1Errors,
  player2Errors,
  maxErrors = 3,
}) => {
  const theme = useTheme();

  // Get avatar image source from URI
  const getAvatarSource = (avatarUri: string | undefined) => {
    if (!avatarUri) return DEFAULT_AVATAR;

    const avatarId = getAvatarIdFromUri(avatarUri);
    if (!avatarId) return DEFAULT_AVATAR;

    const avatar = defaultAvatars.find((a) => a.id === avatarId);
    return avatar?.source || DEFAULT_AVATAR;
  };

  // Count correct moves (only moves with isCorrect: true)
  const player1Correct = useMemo(
    () => player1Moves.filter((m) => m.isCorrect).length,
    [player1Moves]
  );

  const player2Correct = useMemo(
    () => player2Moves.filter((m) => m.isCorrect).length,
    [player2Moves]
  );

  // Render hearts (3 = max errors)
  const renderHearts = (errors: number) => {
    const hearts = [];
    for (let i = 0; i < maxErrors; i++) {
      const isLost = i < errors;
      hearts.push(
        <Feather
          key={i}
          name="heart"
          size={16}
          color={isLost ? theme.colors.textSecondary : theme.colors.error}
          style={{ marginHorizontal: 2 }}
        />
      );
    }
    return hearts;
  };

  // Truncate name to max 15 characters
  const truncateName = (name: string) => {
    return name.length > 15 ? name.substring(0, 12) + '...' : name;
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    playerContainer: {
      alignItems: 'center',
      flex: 1,
    },
    playerContainerLeft: {
      alignItems: 'flex-start',
    },
    playerContainerRight: {
      alignItems: 'flex-end',
    },
    playerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    playerRowReverse: {
      flexDirection: 'row-reverse',
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    statsContainer: {
      alignItems: 'center',
      marginLeft: 12,
    },
    statsContainerRight: {
      alignItems: 'center',
      marginRight: 12,
    },
    heartsRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    correctCount: {
      fontSize: theme.typography.size.lg,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    playerName: {
      fontSize: theme.typography.size.sm,
      fontWeight: '500',
      color: theme.colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
    vsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.md,
    },
    vsText: {
      fontSize: theme.typography.size.md,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      letterSpacing: 1,
    },
  });

  return (
    <View style={styles.container}>
      {/* Player 1 (Left) */}
      <View style={[styles.playerContainer, styles.playerContainerLeft]}>
        <View style={styles.playerRow}>
          <Image
            source={getAvatarSource(player1.avatarUri)}
            style={styles.avatar}
          />
          <View style={styles.statsContainer}>
            <View style={styles.heartsRow}>{renderHearts(player1Errors)}</View>
            <Text style={styles.correctCount}>{player1Correct}</Text>
          </View>
        </View>
        <Text style={styles.playerName}>{truncateName(player1.displayName)}</Text>
      </View>

      {/* VS Badge */}
      <View style={styles.vsContainer}>
        <Text style={styles.vsText}>VS</Text>
      </View>

      {/* Player 2 (Right) */}
      <View style={[styles.playerContainer, styles.playerContainerRight]}>
        <View style={[styles.playerRow, styles.playerRowReverse]}>
          <Image
            source={getAvatarSource(player2.avatarUri)}
            style={styles.avatar}
          />
          <View style={styles.statsContainerRight}>
            <View style={styles.heartsRow}>{renderHearts(player2Errors)}</View>
            <Text style={styles.correctCount}>{player2Correct}</Text>
          </View>
        </View>
        <Text style={styles.playerName}>{truncateName(player2.displayName)}</Text>
      </View>
    </View>
  );
};

export default OnlineGameHeader;
