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
    console.warn('[boardConverter] firestoreBoard is null/undefined');
    return Array(9).fill(null).map(() => Array(9).fill(0));
  }

  const board: number[][] = [];

  // Assume 9x9 Sudoku board
  // Try both numeric and string keys for maximum compatibility
  for (let i = 0; i < 9; i++) {
    // Try numeric key first, then string key
    let row = firestoreBoard[i] || firestoreBoard[i.toString()];

    // If row is a Firestore object, try to extract the array
    if (row && typeof row === 'object' && !Array.isArray(row)) {
      // Handle Firestore DocumentData objects
      // Convert to array by iterating over numeric keys
      const rowArray: number[] = [];
      for (let j = 0; j < 9; j++) {
        const cell = row[j] ?? row[j.toString()] ?? 0;
        rowArray.push(typeof cell === 'number' ? cell : 0);
      }
      row = rowArray;
    }

    if (row && Array.isArray(row) && row.length === 9) {
      // Valid row found - create a copy
      board.push([...row]);
    } else {
      // Row is missing or invalid - log warning and create empty row
      console.warn(`[boardConverter] Row ${i} is missing or invalid:`, row);
      board.push(Array(9).fill(0));
    }
  }

  // Final validation: ensure we have exactly 9 rows
  if (board.length !== 9) {
    console.error(`[boardConverter] Invalid board length: ${board.length}, expected 9`);
    // Pad with empty rows if needed
    while (board.length < 9) {
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
