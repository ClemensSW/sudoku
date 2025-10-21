/**
 * Board Converter Utilities
 *
 * Converts between Firestore object format and 2D array format
 * Firestore doesn't support nested arrays, so we store boards as objects with row keys
 */

/**
 * Converts Firestore board object to 2D array
 *
 * @param firestoreBoard - Object with row keys: { "0": [...], "1": [...], ... }
 * @returns 2D array: [[...], [...], ...]
 */
export function firestoreBoardToArray(
  firestoreBoard: { [rowIndex: string]: number[] } | any
): number[][] {
  // Handle null/undefined
  if (!firestoreBoard) {
    return [];
  }

  // Convert to plain object if needed (Firestore returns special objects)
  const plainBoard = JSON.parse(JSON.stringify(firestoreBoard));

  const board: number[][] = [];

  // Assume 9x9 Sudoku board
  for (let i = 0; i < 9; i++) {
    const row = plainBoard[i.toString()];
    if (row && Array.isArray(row)) {
      board.push([...row]); // Create a copy of the row
    } else {
      // Fallback: empty row
      board.push(Array(9).fill(0));
    }
  }

  return board;
}

/**
 * Converts 2D array to Firestore board object
 *
 * @param board - 2D array: [[...], [...], ...]
 * @returns Object with row keys: { "0": [...], "1": [...], ... }
 */
export function arrayBoardToFirestore(
  board: number[][]
): { [rowIndex: string]: number[] } {
  const result: { [rowIndex: string]: number[] } = {};

  board.forEach((row, index) => {
    result[index.toString()] = [...row]; // Create a copy of the row
  });

  return result;
}
