// screens/DuoGame/utils/opponentNames.ts
import { ImageSourcePropType } from "react-native";
import {
  defaultAvatars,
  DEFAULT_AVATAR,
} from "@/screens/Leistung/utils/defaultAvatars";
import { getLevels } from "@/screens/GameCompletion/components/PlayerProgressionCard/utils/levelData";

/**
 * Fun-Namen für lokale Gegner nach Sprache
 */
const opponentNamesByLanguage: Record<string, string[]> = {
  de: [
    "Sudoku-Ninja",
    "Zahlen-Meister",
    "Puzzle-Pro",
    "Rätsel-König",
    "Grid-Guru",
    "Logik-Fuchs",
    "Ziffern-Zauberer",
    "Denk-Champion",
    "Hirn-Akrobat",
    "Knobel-Held",
    "Zellen-Flüsterer",
    "Kopfnuss-Knacker",
    "Strategie-Star",
    "Blitz-Denker",
    "Raster-Rakete",
  ],
  en: [
    "Sudoku-Ninja",
    "Number-Master",
    "Puzzle-Pro",
    "Riddle-King",
    "Grid-Guru",
    "Logic-Fox",
    "Digit-Wizard",
    "Brain-Champion",
    "Mind-Acrobat",
    "Puzzle-Hero",
    "Cell-Whisperer",
    "Brainiac-Boss",
    "Strategy-Star",
    "Quick-Thinker",
    "Grid-Rocket",
  ],
  hi: [
    "सुडोकू-निंजा",
    "नंबर-मास्टर",
    "पज़ल-प्रो",
    "पहेली-राजा",
    "ग्रिड-गुरु",
    "लॉजिक-फॉक्स",
    "अंक-जादूगर",
    "दिमाग-चैंपियन",
    "माइंड-एक्रोबैट",
    "पज़ल-हीरो",
    "सेल-विस्परर",
    "ब्रेनियक-बॉस",
    "स्ट्रेटजी-स्टार",
    "क्विक-थिंकर",
    "ग्रिड-रॉकेट",
  ],
};

/**
 * Gibt einen zufälligen Fun-Namen für den lokalen Gegner zurück
 * @param language Aktuelle Sprache (de, en, hi)
 * @returns Zufälliger Fun-Name
 */
export function getRandomOpponentName(language: string): string {
  // Fallback auf Englisch, wenn Sprache nicht unterstützt
  const names = opponentNamesByLanguage[language] || opponentNamesByLanguage.en;
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

/**
 * Gibt einen zufälligen Avatar für den lokalen Gegner zurück
 * Wählt aus allen verfügbaren Avataren (Cartoon, Anime, Tiere)
 * @returns Avatar-Source für Image-Komponente
 */
export function getRandomOpponentAvatar(): ImageSourcePropType {
  // Filtere den Default-Avatar aus, damit der Gegner immer einen "echten" Avatar hat
  const availableAvatars = defaultAvatars.filter(
    (avatar) => avatar.id !== "default"
  );

  if (availableAvatars.length === 0) {
    return DEFAULT_AVATAR;
  }

  const randomIndex = Math.floor(Math.random() * availableAvatars.length);
  return availableAvatars[randomIndex].source;
}

/**
 * Gibt einen zufälligen Titel für den lokalen Gegner zurück
 * Wählt aus den verfügbaren Level-Titeln
 * @returns Zufälliger Titel-Name
 */
export function getRandomOpponentTitle(): string {
  const levels = getLevels();
  // Wähle aus den ersten 25 Levels (Haupttitel)
  const availableLevels = levels.slice(0, 25);
  const randomIndex = Math.floor(Math.random() * availableLevels.length);
  return availableLevels[randomIndex].name;
}

/**
 * Generiert komplette Gegnerdaten (Name + Avatar + Titel)
 * Sollte einmal pro Spiel aufgerufen werden, nicht bei jedem Render
 * @param language Aktuelle Sprache
 * @returns Objekt mit name, avatarSource und title
 */
export function generateOpponentData(language: string): {
  name: string;
  avatarSource: ImageSourcePropType;
  title: string;
} {
  return {
    name: getRandomOpponentName(language),
    avatarSource: getRandomOpponentAvatar(),
    title: getRandomOpponentTitle(),
  };
}
