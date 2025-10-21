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
  firestoreBoard: { [rowIndex: string]: number[] }
): number[][] {
  const rows = Object.keys(firestoreBoard).length;
  const board: number[][] = [];

  for (let i = 0; i < rows; i++) {
    const row = firestoreBoard[i.toString()];
    if (row) {
      board.push([...row]); // Create a copy of the row
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
