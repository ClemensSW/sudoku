/**
 * ELO Rating System Calculator
 *
 * Standard ELO formula:
 * ΔR = K × (S - E)
 *
 * Where:
 *   ΔR = Rating change
 *   K  = K-Factor (maximum change, default 32)
 *   S  = Actual Score (1 for win, 0 for loss)
 *   E  = Expected Score (probability of winning)
 *
 * Expected Score: E = 1 / (1 + 10^((R_opponent - R_player) / 400))
 */

const K_FACTOR = 32; // Standard K-Factor
const MAX_ELO_CHANGE = 50; // Cap at ±50 per match

/**
 * Calculates ELO change for a player
 *
 * @param playerRating Current ELO rating of the player
 * @param opponentRating Current ELO rating of the opponent
 * @param won Whether the player won (true) or lost (false)
 * @param kFactor K-Factor (default: 32)
 * @returns ELO change (can be negative)
 */
export function calculateEloChange(
  playerRating: number,
  opponentRating: number,
  won: boolean,
  kFactor: number = K_FACTOR
): number {
  // Calculate expected score (probability of winning)
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));

  // Actual score (1 for win, 0 for loss)
  const actualScore = won ? 1 : 0;

  // Calculate change
  const change = kFactor * (actualScore - expectedScore);

  // Round and cap at ±MAX_ELO_CHANGE
  return Math.max(-MAX_ELO_CHANGE, Math.min(MAX_ELO_CHANGE, Math.round(change)));
}

/**
 * Calculates ELO changes for both players
 *
 * @param player1Rating Current ELO of player 1
 * @param player2Rating Current ELO of player 2
 * @param winner 1 for player 1 win, 2 for player 2 win, 0 for tie
 * @returns Object with player1Change and player2Change
 */
export function calculateEloChanges(
  player1Rating: number,
  player2Rating: number,
  winner: 0 | 1 | 2
): {
  player1Change: number;
  player2Change: number;
  newPlayer1Elo: number;
  newPlayer2Elo: number;
} {
  if (winner === 0) {
    // Tie - no ELO change
    return {
      player1Change: 0,
      player2Change: 0,
      newPlayer1Elo: player1Rating,
      newPlayer2Elo: player2Rating,
    };
  }

  const player1Change = calculateEloChange(
    player1Rating,
    player2Rating,
    winner === 1
  );

  const player2Change = calculateEloChange(
    player2Rating,
    player1Rating,
    winner === 2
  );

  return {
    player1Change,
    player2Change,
    newPlayer1Elo: player1Rating + player1Change,
    newPlayer2Elo: player2Rating + player2Change,
  };
}

/**
 * Determines rank tier based on ELO
 */
export function getRankTier(elo: number): string {
  if (elo < 1000) return "novice";
  if (elo < 1200) return "bronze";
  if (elo < 1400) return "silver";
  if (elo < 1600) return "gold";
  if (elo < 1800) return "diamond";
  if (elo < 2000) return "master";
  return "grandmaster";
}
