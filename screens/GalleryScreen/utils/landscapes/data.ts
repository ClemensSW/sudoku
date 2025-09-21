// screens/GalleryScreen/utils/landscapes/data.ts
import { Landscape, LandscapeSegment } from "./types";

// Aktuelle Version der Landschaftssammlung
// WICHTIG: Erhöhen, wenn neue Bilder hinzugefügt werden!
export const CURRENT_COLLECTION_VERSION = 2;

/**
 * KATEGORIEN DEFINITION UND ÜBERSETZUNG
 * Hier neue Kategorien hinzufügen - automatisch überall verfügbar!
 */
export const LANDSCAPE_CATEGORIES = {
  cities: "Städte",
  architecture: "Architektur",
  animals: "Tiere",
  plants: "Pflanzen",
  landscapes: "Landschaften",
  water: "Wasser",
  sky: "Himmel",
  path: "Deine Reise",
  // Neue Kategorien einfach hier hinzufügen:
  // deserts: "Wüsten",
  // cities: "Städte",
} as const;

// Typ für Kategorien (wird automatisch aus dem Objekt generiert)
export type LandscapeCategory = keyof typeof LANDSCAPE_CATEGORIES;

// Helper-Funktion für Kategorie-Namen
export const getCategoryName = (category: string): string => {
  return LANDSCAPE_CATEGORIES[category as LandscapeCategory] || category;
};

/**
 * Erzeugt ein Array von 9 leeren Segmenten für ein neues Landschaftsbild
 */
const createEmptySegments = (): LandscapeSegment[] => {
  return Array.from({ length: 9 }, (_, index) => ({
    id: index,
    isUnlocked: false,
  }));
};

/**
 * BILDSAMMLUNG
 * Hier neue Bilder hinzufügen - einfach das Schema kopieren!
 *
 * Anleitung:
 * 1. Bilder in assets/imageCollection/[kategorie]/ ablegen
 *    - [name]_640.jpg (Preview)
 *    - [name]_1920.jpg (Vollbild)
 * 2. Neuen Eintrag hier hinzufügen
 * 3. CURRENT_COLLECTION_VERSION erhöhen
 * 4. Fertig!
 */
export const initialLandscapes: Landscape[] = [
  {
    id: "mountains-fuji",
    name: "Sudoku Duo",
    description:
      "Ein Sudoku-Heft mit Bleistift auf der Fensterbank. Eine Einladung für deine Rätselreise.",
    previewSource: require("@/assets/imageCollection/sudoku-duo_640.jpg"),
    fullSource: require("@/assets/imageCollection/sudoku-duo_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "path",
  },
  {
    id: "gardens-japanese",
    name: "Teegarten",
    description:
      "Traditionelles japanisches Teehaus unter leuchtend roten Ahornbäumen",
    previewSource: require("@/assets/imageCollection/architecture/gardens-japanese_640.jpg"),
    fullSource: require("@/assets/imageCollection/architecture/gardens-japanese_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "architecture",
  },
  {
    id: "night-skies-1",
    name: "Milchstraße",
    description:
      "Spektakulärer Blick auf die funkelnde Milchstraße über dunklen Hügeln",
    previewSource: require("@/assets/imageCollection/sky/milky-way_640.jpg"),
    fullSource: require("@/assets/imageCollection/sky/milky-way_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "sky",
  },
  {
    id: "rainforest-toucan",
    name: "Regenbogentukan",
    description:
      "Ein farbenprächtiger Regenbogentukan sitzt im Regen auf einem Ast mitten im üppigen Regenwald",
    previewSource: require("@/assets/imageCollection/animals/costa-rica-9301364_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/costa-rica-9301364_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "waterfalls-1",
    name: "Wasserfall",
    description:
      "Sanft herabstürzender Wasserfall inmitten eines üppigen Waldes",
    previewSource: require("@/assets/imageCollection/water/waterfall-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/waterfall-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "lakes-1",
    name: "Waldsee",
    description:
      "Ruhiger See umgeben von dicht bewaldeten Bergen und einem kleinen Bootssteg",
    previewSource: require("@/assets/imageCollection/water/lake-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/lake-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "forests-1",
    name: "Bambuswald",
    description: "Dichter Bambuswald mit hoch aufragenden, grünen Halmen",
    previewSource: require("@/assets/imageCollection/plants/bamboo-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/plants/bamboo-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "plants",
  },
  {
    id: "beaches-1",
    name: "Tropenstrand",
    description:
      "Schneeweißer Sandstrand mit türkisblauem Wasser und schattenspendenden Palmen",
    previewSource: require("@/assets/imageCollection/water/beach-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/beach-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "valley-mist-sunrise",
    name: "Nebel im Tal",
    description:
      "Morgennebel, der sanft ein grünes Tal umhüllt, mit pastellfarbenem Sonnenaufgangshimmel",
    previewSource: require("@/assets/imageCollection/landscapes/fog-7440132_640.jpg"),
    fullSource: require("@/assets/imageCollection/landscapes/fog-7440132_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "landscapes",
  },
  {
    id: "cities-kyoto-temple",
    name: "Pagode",
    description:
      "Eine stille Gasse führt dich zu einer leuchtenden Pagode im Abendlicht – ein Tor zu neuen Rätseln.",
    previewSource: require("@/assets/imageCollection/cities/cities-kyoto-temple_640.jpg"),
    fullSource: require("@/assets/imageCollection/cities/cities-kyoto-temple_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "cities",
  },
  {
    id: "cities-tokyo-alley",
    name: "Tokio",
    description:
      "Enge Gassen voller Laternen und Kirschblüten – ein lebendiges Labyrinth, das neue Geheimnisse birgt.",
    previewSource: require("@/assets/imageCollection/cities/cities-tokyo-alley_640.jpg"),
    fullSource: require("@/assets/imageCollection/cities/cities-tokyo-alley_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "cities",
  },
  {
    id: "cities-shanghai-skyline",
    name: "Shanghai",
    description:
      "Glitzernde Wolkenkratzer im Mondlicht – eine Metropole, die niemals schläft und voller Rätsel steckt.",
    previewSource: require("@/assets/imageCollection/cities/cities-shanghai-skyline_640.jpg"),
    fullSource: require("@/assets/imageCollection/cities/cities-shanghai-skyline_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "cities",
  },
  {
    id: "cities-dubai-burj",
    name: "Dubai",
    description:
      "Zwischen endlosen Straßen und funkelnden Türmen ragt ein Bauwerk bis in den Himmel – ein Rätsel der Superlative.",
    previewSource: require("@/assets/imageCollection/cities/cities-dubai-burj_640.jpg"),
    fullSource: require("@/assets/imageCollection/cities/cities-dubai-burj_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "cities",
  },
  {
    id: "cities-venice-gondola",
    name: "Venedig",
    description:
      "Ein stilles Café mit Blick auf Gondeln im Wasser – ein Ort, an dem Geschichten und Rätsel beginnen.",
    previewSource: require("@/assets/imageCollection/cities/cities-venice-gondola_640.jpg"),
    fullSource: require("@/assets/imageCollection/cities/cities-venice-gondola_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "cities",
  },
  {
    id: "architecture-rome-colosseum",
    name: "Kolosseum",
    description:
      "Mächtige Mauern voller Geschichte – ein Monument, das seine Geheimnisse wie ein uraltes Rätsel bewahrt.",
    previewSource: require("@/assets/imageCollection/architecture/architecture-rome-colosseum_640.jpg"),
    fullSource: require("@/assets/imageCollection/architecture/architecture-rome-colosseum_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "architecture",
  },
  {
    id: "architecture-singapore-green",
    name: "Vertikale Gärten",
    description:
      "Moderne Glasfassaden verschmelzen mit üppigem Grün – ein Bauwerk, das wie ein lebendes Rätsel wirkt.",
    previewSource: require("@/assets/imageCollection/architecture/architecture-singapore-green_640.jpg"),
    fullSource: require("@/assets/imageCollection/architecture/architecture-singapore-green_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "architecture",
  },
  {
    id: "architecture-singapore-jewel",
    name: "Jewel Wasserfall",
    description:
      "Ein Wasserfall stürzt mitten in eine gläserne Kuppel – futurale Architektur, die wie ein Tor zu neuen Welten wirkt.",
    previewSource: require("@/assets/imageCollection/architecture/architecture-singapore-jewel_640.jpg"),
    fullSource: require("@/assets/imageCollection/architecture/architecture-singapore-jewel_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "architecture",
  },
  {
    id: "architecture-germany-castle",
    name: "Burg im Nebel",
    description:
      "Eine geheimnisvolle Burg erhebt sich aus dem Morgennebel – ein Tor in die Vergangenheit voller ungelöster Rätsel.",
    previewSource: require("@/assets/imageCollection/architecture/architecture-germany-castle_640.jpg"),
    fullSource: require("@/assets/imageCollection/architecture/architecture-germany-castle_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "architecture",
  },
  {
    id: "architecture-abu-dhabi-mosque",
    name: "Weiße Moschee",
    description:
      "Strahlend weiße Kuppeln und goldene Verzierungen – ein Ort der Stille, der wie ein heiliges Rätsel wirkt.",
    previewSource: require("@/assets/imageCollection/architecture/architecture-abu-dhabi-mosque_640.jpg"),
    fullSource: require("@/assets/imageCollection/architecture/architecture-abu-dhabi-mosque_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "architecture",
  },
  {
    id: "architecture-hobbiton-house",
    name: "Hobbithaus",
    description:
      "Versteckt im grünen Hügel liegt eine runde Tür – ein märchenhaftes Rätsel, das dich in eine andere Welt einlädt.",
    previewSource: require("@/assets/imageCollection/architecture/architecture-hobbiton-house_640.jpg"),
    fullSource: require("@/assets/imageCollection/architecture/architecture-hobbiton-house_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "architecture",
  },
  {
    id: "architecture-dubai-burj-night",
    name: "Burj Khalifa",
    description:
      "Ein Turm aus Glas und Licht ragt in die Wolken – wie ein endloses Rätsel, das den Himmel herausfordert.",
    previewSource: require("@/assets/imageCollection/architecture/architecture-dubai-burj-night_640.jpg"),
    fullSource: require("@/assets/imageCollection/architecture/architecture-dubai-burj-night_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "architecture",
  },
  {
    id: "architecture-egypt-pyramid",
    name: "Pyramide von Gizeh",
    description:
      "Ein uraltes Bauwerk erhebt sich aus der Wüste – ein Rätsel der Menschheit, das bis heute ungelöst scheint.",
    previewSource: require("@/assets/imageCollection/architecture/architecture-egypt-pyramid_640.jpg"),
    fullSource: require("@/assets/imageCollection/architecture/architecture-egypt-pyramid_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "architecture",
  },
  {
    id: "architecture-mexico-chichenitza",
    name: "Chichén Itzá",
    description:
      "Eine gewaltige Stufenpyramide erhebt sich majestätisch – ein Relikt der Maya, das noch immer Rätsel birgt.",
    previewSource: require("@/assets/imageCollection/architecture/architecture-mexico-chichenitza_640.jpg"),
    fullSource: require("@/assets/imageCollection/architecture/architecture-mexico-chichenitza_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "architecture",
  },
  {
    id: "animals-sea-turtle",
    name: "Meeresschildkröte",
    description:
      "Lautlos zieht sie ihre Bahnen im endlosen Blau – ein Symbol für Freiheit und die Geheimnisse des Ozeans.",
    previewSource: require("@/assets/imageCollection/animals/animals-sea-turtle_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-sea-turtle_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-hummingbird",
    name: "Kolibri",
    description:
      "Mit schillernden Flügeln schwebt er in der Luft – ein winziger Akrobat, der die Schönheit der Natur sichtbar macht.",
    previewSource: require("@/assets/imageCollection/animals/animals-hummingbird_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-hummingbird_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-wolf",
    name: "Wolf",
    description:
      "Mit wachsamen Augen streift er durch den verschneiten Wald – Sinnbild für Stärke, Freiheit und das Wilde in der Natur.",
    previewSource: require("@/assets/imageCollection/animals/animals-wolf_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-wolf_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-giraffe",
    name: "Giraffe",
    description:
      "Anmutig ragt sie über die Bäume hinaus – ein sanfter Riese, der die Welt aus einer einzigartigen Perspektive sieht.",
    previewSource: require("@/assets/imageCollection/animals/animals-giraffe_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-giraffe_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-polar-bear",
    name: "Eisbär",
    description:
      "Auf den schimmernden Eisschollen ruht er majestätisch – ein Wächter der Arktis, stark und zugleich verletzlich.",
    previewSource: require("@/assets/imageCollection/animals/animals-polar-bear_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-polar-bear_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-kitten",
    name: "Kätzchen",
    description:
      "Mit neugierig geneigtem Kopf erkundet es die Welt – klein, verspielt und voller stiller Magie.",
    previewSource: require("@/assets/imageCollection/animals/animals-kitten_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-kitten_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-toucan",
    name: "Tukan",
    description:
      "Mit seinem leuchtenden Schnabel sitzt er stolz im Grünen – ein exotischer Bote voller Farben und Energie.",
    previewSource: require("@/assets/imageCollection/animals/animals-toucan_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-toucan_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-sea-lion",
    name: "Seelöwe",
    description:
      "Am Strand sonnt er sich gelassen mit erhobenem Kopf – ein verspielter Bewohner der Meere, voller Lebensfreude.",
    previewSource: require("@/assets/imageCollection/animals/animals-sea-lion_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-sea-lion_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-fox",
    name: "Fuchs",
    description:
      "Sein Blick ist wachsam und klug – ein stiller Wanderer der Wälder, voller List und geheimnisvoller Eleganz.",
    previewSource: require("@/assets/imageCollection/animals/animals-fox_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-fox_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-koala",
    name: "Koala",
    description:
      "Mit geschlossenen Augen lehnt er sich zurück – ein sanfter Träumer, der Ruhe und Gelassenheit verkörpert.",
    previewSource: require("@/assets/imageCollection/animals/animals-koala_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-koala_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-puffin",
    name: "Papageitaucher",
    description:
      "Mit seinem farbenfrohen Schnabel und dem stolzen Auftreten wirkt er wie ein kleiner Clown der Meere, charmant und unverwechselbar.",
    previewSource: require("@/assets/imageCollection/animals/animals-puffin_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-puffin_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-camels",
    name: "Kamele",
    description:
      "Die beiden Wüstenschiffe stehen Seite an Seite am Meer, als würden sie vertraulich plaudern, bereit ihre nächste Reise zu beginnen.",
    previewSource: require("@/assets/imageCollection/animals/animals-camels_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-camels_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-meerkat",
    name: "Erdmännchen",
    description:
      "Wachsam und stolz steht das kleine Erdmännchen aufrecht auf seinem Posten und überblickt die Umgebung wie ein aufmerksamer Wächter der Savanne.",
    previewSource: require("@/assets/imageCollection/animals/animals-meerkat_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-meerkat_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-elephants",
    name: "Elefanten",
    description:
      "Seite an Seite durchstreifen die mächtigen Elefanten die endlose Savanne, ihre Präsenz strahlt Ruhe, Stärke und Zusammenhalt aus.",
    previewSource: require("@/assets/imageCollection/animals/animals-elephants_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-elephants_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-penguins",
    name: "Pinguine",
    description:
      "Zwischen Felsen ruhen und wandern die Pinguine, ihre schwarz-weißen Körper kontrastieren lebendig mit dem hellen Gestein und dem weiten Himmel.",
    previewSource: require("@/assets/imageCollection/animals/animals-penguins_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-penguins_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-panda",
    name: "Panda",
    description:
      "Zwischen dichten Bäumen sitzt der Panda entspannt auf einer hölzernen Plattform, sein schwarz-weißes Fell leuchtet im satten Grün des Waldes.",
    previewSource: require("@/assets/imageCollection/animals/animals-panda_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-panda_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "animals-parrot",
    name: "Papagei",
    description:
      "Mit leuchtend roten Federn und blau-grünen Flügeln sitzt der Papagei auf einem Ast, während er neugierig seine Kralle zum Schnabel führt.",
    previewSource: require("@/assets/imageCollection/animals/animals-parrot_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/animals-parrot_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "plants-orchid",
    name: "Orchidee",
    description:
      "Auf einem Holztisch inmitten üppiger Pflanzenpracht erblüht eine elegante weiße Orchidee, deren Blüten im warmen Licht besonders strahlend wirken.",
    previewSource: require("@/assets/imageCollection/plants/plants-orchid_640.jpg"),
    fullSource: require("@/assets/imageCollection/plants/plants-orchid_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "plants",
  },
  {
    id: "plants-treeoflife",
    name: "Baum des Lebens",
    description:
      "Ein monumentaler Baum mit kräftigem Stamm und weit ausladender Krone erhebt sich majestätisch über einem Teich voller Seerosen und spiegelt sich im Wasser.",
    previewSource: require("@/assets/imageCollection/plants/plants-treeoflife_640.jpg"),
    fullSource: require("@/assets/imageCollection/plants/plants-treeoflife_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "plants",
  },
  {
    id: "plants-orange-tree",
    name: "Orangenbaum",
    description:
      "Leuchtend orangefarbene Früchte hängen zwischen glänzenden grünen Blättern eines Orangenbaums und strahlen unter dem klaren Himmel.",
    previewSource: require("@/assets/imageCollection/plants/plants-orange-tree_640.jpg"),
    fullSource: require("@/assets/imageCollection/plants/plants-orange-tree_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "plants",
  },
  {
    id: "plants-dandelion",
    name: "Löwenzahn",
    description:
      "Drei filigrane Pusteblumen stehen inmitten einer grünen Wiese, sanft beleuchtet vom warmen Licht der untergehenden Sonne.",
    previewSource: require("@/assets/imageCollection/plants/plants-dandelion_640.jpg"),
    fullSource: require("@/assets/imageCollection/plants/plants-dandelion_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "plants",
  },
  {
    id: "plants-poppy",
    name: "Mohnblume",
    description:
      "Ein Feld voller leuchtend roter Mohnblumen, die sich anmutig im Sonnenlicht wiegen und den Sommer in seiner ganzen Fülle einfangen.",
    previewSource: require("@/assets/imageCollection/plants/plants-poppy_640.jpg"),
    fullSource: require("@/assets/imageCollection/plants/plants-poppy_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "plants",
  },
  {
    id: "plants-cherryblossom",
    name: "Kirschblüte",
    description:
      "Zarte Kirschblüten in violettem Schimmer, die in der Abenddämmerung leuchten und eine ruhige, fast magische Atmosphäre schaffen.",
    previewSource: require("@/assets/imageCollection/plants/plants-cherryblossom_640.jpg"),
    fullSource: require("@/assets/imageCollection/plants/plants-cherryblossom_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "plants",
  },
  {
    id: "plants-sunflower",
    name: "Sonnenblume",
    description:
      "Strahlende Sonnenblume mit goldgelben Blütenblättern, die sich der Sonne entgegenstreckt und Lebensfreude ausstrahlt.",
    previewSource: require("@/assets/imageCollection/plants/plants-sunflower_640.jpg"),
    fullSource: require("@/assets/imageCollection/plants/plants-sunflower_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "plants",
  },
  {
    id: "plants-water-lily",
    name: "Seerose",
    description:
      "Zarte Seerose mit leuchtend rosa Blütenblättern, die anmutig auf der Wasseroberfläche schwimmt und Ruhe ausstrahlt.",
    previewSource: require("@/assets/imageCollection/plants/plants-water-lily_640.jpg"),
    fullSource: require("@/assets/imageCollection/plants/plants-water-lily_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "plants",
  },
  {
    id: "plants-lavender",
    name: "Lavendel",
    description:
      "Zarte Lavendelblüten in kräftigem Violett, die mit ihrem Duft Ruhe und Gelassenheit ausstrahlen und an Sommerabende in der Provence erinnern.",
    previewSource: require("@/assets/imageCollection/plants/plants-lavender_640.jpg"),
    fullSource: require("@/assets/imageCollection/plants/plants-lavender_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "plants",
  },
  {
    id: "landscapes-misty-forest",
    name: "Nebliger Waldpfad",
    description:
      "Ein schmaler Weg schlängelt sich durch einen stillen Wald, während dichter Nebel zwischen den hohen Bäumen hängt und eine geheimnisvolle Stimmung schafft.",
    previewSource: require("@/assets/imageCollection/landscapes/landscapes-misty-forest_640.jpg"),
    fullSource: require("@/assets/imageCollection/landscapes/landscapes-misty-forest_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "landscapes",
  },
  {
    id: "landscapes-sand-dunes",
    name: "Unendliche Dünen",
    description:
      "Sanft geschwungene Sanddünen breiten sich bis zum Horizont aus, während ein einzelner Wanderer seine Spuren im goldenen Licht der Sonne hinterlässt.",
    previewSource: require("@/assets/imageCollection/landscapes/landscapes-sand-dunes_640.jpg"),
    fullSource: require("@/assets/imageCollection/landscapes/landscapes-sand-dunes_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "landscapes",
  },
  {
    id: "landscapes-yosemite-valley",
    name: "Majestätisches Yosemite",
    description:
      "Vor der Kulisse des ikonischen Half Dome breiten sich dichte Wälder und weite Wiesen aus, auf denen Hirsche friedlich grasen – eine stille Szene voller Erhabenheit.",
    previewSource: require("@/assets/imageCollection/landscapes/landscapes-yosemite-valley_640.jpg"),
    fullSource: require("@/assets/imageCollection/landscapes/landscapes-yosemite-valley_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "landscapes",
  },
  {
    id: "landscapes-dolomites-ridge",
    name: "Dolomitenkamm im Blütenmeer",
    description:
      "Ein schmaler Grat zieht sich majestätisch durch die Dolomiten, während bunte Bergblumen im Vordergrund leuchten und die Szenerie in ein lebendiges Spiel von Farben und Formen tauchen.",
    previewSource: require("@/assets/imageCollection/landscapes/landscapes-dolomites-ridge_640.jpg"),
    fullSource: require("@/assets/imageCollection/landscapes/landscapes-dolomites-ridge_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "landscapes",
  },
  {
    id: "landscapes-sunset-meadow",
    name: "Sonnenuntergang über der Wiese",
    description:
      "Sanfte Grashalme wiegen sich im Abendwind, während die Sonne am Horizont in warmen Orangetönen versinkt und die Landschaft in ein leuchtendes Farbspiel taucht.",
    previewSource: require("@/assets/imageCollection/landscapes/landscapes-sunset-meadow_640.jpg"),
    fullSource: require("@/assets/imageCollection/landscapes/landscapes-sunset-meadow_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "landscapes",
  },
  {
    id: "landscapes-misty-mountains",
    name: "Neblige Berge",
    description:
      "Sanfte Bergketten verschwinden im Dunst, Schicht für Schicht. Eine stille Landschaft in Blau, die Ruhe und Unendlichkeit ausstrahlt.",
    previewSource: require("@/assets/imageCollection/landscapes/landscapes-misty-mountains_640.jpg"),
    fullSource: require("@/assets/imageCollection/landscapes/landscapes-misty-mountains_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "landscapes",
  },
  {
    id: "landscapes-desert-monoliths",
    name: "Wüstenmonolithen",
    description:
      "Majestätische Felstürme ragen aus der endlosen Wüste, vom warmen Licht der Sonne umhüllt. Ein einzelner Wanderer wirkt winzig inmitten dieser uralten Giganten.",
    previewSource: require("@/assets/imageCollection/landscapes/landscapes-desert-monoliths_640.jpg"),
    fullSource: require("@/assets/imageCollection/landscapes/landscapes-desert-monoliths_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "landscapes",
  },
  {
    id: "water-mountain-lake",
    name: "Bergsee",
    description:
      "Ein kristallklarer Bergsee spiegelt die umliegenden Wälder und Gipfel wider. Am Ufer wachsen wilde Blumen und Gräser, die die Ruhe des Wassers unterstreichen.",
    previewSource: require("@/assets/imageCollection/water/water-mountain-lake_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/water-mountain-lake_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "water-ocean-sunset",
    name: "Ozean bei Sonnenuntergang",
    description:
      "Am Horizont verschmilzt das dunkle Blau des Ozeans mit dem glühenden Orange der untergehenden Sonne. Dramatische Wolken verstärken die Stimmung, während im Vordergrund Pflanzen am Klippenrand sichtbar sind.",
    previewSource: require("@/assets/imageCollection/water/water-ocean-sunset_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/water-ocean-sunset_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "water-sunset-coast",
    name: "Sonnenuntergang an der Küste",
    description:
      "Die untergehende Sonne taucht den Himmel und das Meer in warmes Gold. Sanfte Wellen rollen an den Strand, während die Felsen im Abendlicht als dunkle Silhouetten erscheinen.",
    previewSource: require("@/assets/imageCollection/water/water-sunset-coast_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/water-sunset-coast_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "water-beach-path",
    name: "Pfad zum Strand",
    description:
      "Ein hölzerner Steg führt durch die sandigen Dünen direkt zum türkisfarbenen Meer. Sanfte Wellen glitzern in der Sonne, während der Himmel klar und blau erstrahlt – ein perfekter Moment am Ozean.",
    previewSource: require("@/assets/imageCollection/water/water-beach-path_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/water-beach-path_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "water-waterfall-forest",
    name: "Waldwasserfall",
    description:
      "Ein idyllischer Wasserfall stürzt in mehreren Kaskaden über moosbewachsene Felsen in ein klares Becken. Umrahmt von dichten Bäumen entsteht eine ruhige, fast magische Atmosphäre mitten in der Natur.",
    previewSource: require("@/assets/imageCollection/water/water-waterfall-forest_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/water-waterfall-forest_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "water-river-forest",
    name: "Waldfluss",
    description:
      "Ein klarer Fluss fließt ruhig durch einen dichten Wald. Zwischen moosbewachsenen Felsen spiegelt sich das Sonnenlicht im Wasser und verleiht der Szenerie eine friedliche Stimmung.",
    previewSource: require("@/assets/imageCollection/water/water-river-forest_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/water-river-forest_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "water-ocean-waves",
    name: "Meereswellen",
    description:
      "Von oben betrachtet treffen die Wellen mit weißem Schaum auf den Sandstrand und zeichnen klare Linien zwischen tiefem Blau und hellem Beige.",
    previewSource: require("@/assets/imageCollection/water/water-ocean-waves_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/water-ocean-waves_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "water-wave-sunset",
    name: "Welle im Abendlicht",
    description:
      "Eine kleine Welle bricht nah am Ufer, die Tropfen glitzern im goldenen Licht der untergehenden Sonne und verleihen der Szene Ruhe und Lebendigkeit zugleich.",
    previewSource: require("@/assets/imageCollection/water/water-wave-sunset_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/water-wave-sunset_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "water-beach-sunset",
    name: "Strand im Sonnenuntergang",
    description:
      "Die untergehende Sonne färbt den Himmel in warmen Rosa- und Orangetönen, während die Wellen sanft an den goldglänzenden Sandstrand rollen.",
    previewSource: require("@/assets/imageCollection/water/water-beach-sunset_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/water-beach-sunset_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "water-palm-beach",
    name: "Palmenstrand",
    description:
      "Sanfte Wellen treffen auf weißen Sand, während schlanke Palmen ihre Schatten auf das türkisfarbene Meer werfen und tropisches Urlaubsfeeling verbreiten.",
    previewSource: require("@/assets/imageCollection/water/water-palm-beach_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/water-palm-beach_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "water-palm-shadows",
    name: "Palmschatten am Strand",
    description:
      "Von oben fällt der Blick auf türkisfarbenes Wasser und den Sandstrand, wo die Schatten der Palmen geheimnisvolle Muster zeichnen und tropische Ruhe ausstrahlen.",
    previewSource: require("@/assets/imageCollection/water/water-palm-shadows_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/water-palm-shadows_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "sky-northern-lights",
    name: "Polarlichter über den Bergen",
    description:
      "Grün leuchtende Polarlichter tanzen über schneebedeckten Gipfeln und einem ruhigen Fjord, während ein Dorf unten in bunten Lichtern erstrahlt.",
    previewSource: require("@/assets/imageCollection/sky/sky-northern-lights_640.jpg"),
    fullSource: require("@/assets/imageCollection/sky/sky-northern-lights_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "sky",
  },
  {
    id: "sky-sunset-clouds",
    name: "Sonnenstrahlen durch Wolken",
    description:
      "Dramatische Sonnenstrahlen brechen durch dichte Wolken und tauchen den Himmel in ein Spiel aus Gold und Dunkelblau.",
    previewSource: require("@/assets/imageCollection/sky/sky-sunset-clouds_640.jpg"),
    fullSource: require("@/assets/imageCollection/sky/sky-sunset-clouds_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "sky",
  },
  {
    id: "sky-starry-mountain",
    name: "Sternenhimmel über dem Berg",
    description:
      "Ein klarer Nachthimmel voller Sterne wölbt sich über einem majestätischen Berg, dessen Spiegelbild im stillen See leuchtet.",
    previewSource: require("@/assets/imageCollection/sky/sky-starry-mountain_640.jpg"),
    fullSource: require("@/assets/imageCollection/sky/sky-starry-mountain_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "sky",
  },
  {
    id: "sky-cloudscape-bright",
    name: "Weite Wolkenlandschaft",
    description:
      "Eine endlose Wolkenformation breitet sich unter einem hellen Himmel aus – sanfte Schichten, die wie ein Meer aus Weiß und Blau wirken.",
    previewSource: require("@/assets/imageCollection/sky/sky-cloudscape-bright_640.jpg"),
    fullSource: require("@/assets/imageCollection/sky/sky-cloudscape-bright_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "sky",
  },
];

/**
 * Standard-Initialzustand der Landschaftssammlung
 * Das erste Bild wird automatisch vollständig freigeschaltet und als Favorit markiert
 * Das zweite Bild wird zum aktuellen Bild für die weitere Freischaltung
 * und hat bereits 8 von 9 Segmenten freigeschaltet
 */
export const getDefaultCollectionState = () => {
  const landscapes: Record<string, Landscape> = {};

  // Konvertiere Array in ein Record-Objekt und markiere das erste Bild als freigeschaltet
  initialLandscapes.forEach((landscape, index) => {
    if (index === 0) {
      // Das erste Bild vollständig freischalten
      const now = new Date().toISOString();

      // Alle Segmente als freigeschaltet markieren
      const unlockedSegments = Array.from({ length: 9 }, (_, segmentIndex) => ({
        id: segmentIndex,
        isUnlocked: true,
        unlockedAt: now,
      }));

      // Kopiere das Landschaftsobjekt und aktualisiere die Eigenschaften
      landscapes[landscape.id] = {
        ...landscape,
        segments: unlockedSegments,
        progress: 9,
        isComplete: true,
        isFavorite: true, // Als Favorit markieren
        completedAt: now,
      };
    } else if (index === 1) {
      // Das ZWEITE Bild fast vollständig freischalten - nur ein Segment bleibt übrig
      const now = new Date().toISOString();

      // Alle Segmente außer einem als freigeschaltet markieren
      // Wir lassen nur das letzte Segment (Index 8) unfreigeschaltet
      const almostUnlockedSegments = Array.from(
        { length: 9 },
        (_, segmentIndex) => ({
          id: segmentIndex,
          isUnlocked: segmentIndex < 8, // Die ersten 8 Segmente freischalten
          unlockedAt: segmentIndex < 8 ? now : undefined,
        })
      );

      // Kopiere das Landschaftsobjekt und aktualisiere die Eigenschaften
      landscapes[landscape.id] = {
        ...landscape,
        segments: almostUnlockedSegments,
        progress: 8, // 8 von 9 Segmenten sind bereits freigeschaltet
        isComplete: false,
        isFavorite: false,
      };
    } else if (index === 2) {
      // Das DRITTE Bild teilweise freischalten - nur 3 Segmente müssen noch freigeschaltet werden
      const now = new Date().toISOString();

      // Die ersten 6 Segmente als freigeschaltet markieren
      const partiallyUnlockedSegments = Array.from(
        { length: 9 },
        (_, segmentIndex) => ({
          id: segmentIndex,
          isUnlocked: segmentIndex < 6, // Die ersten 6 Segmente freischalten
          unlockedAt: segmentIndex < 6 ? now : undefined,
        })
      );

      // Kopiere das Landschaftsobjekt und aktualisiere die Eigenschaften
      landscapes[landscape.id] = {
        ...landscape,
        segments: partiallyUnlockedSegments,
        progress: 6, // 6 von 9 Segmenten sind bereits freigeschaltet
        isComplete: false,
        isFavorite: false,
      };
    } else if (index === 3) {
      // Das VIERTE Bild teilweise freischalten - nur 6 Segmente müssen noch freigeschaltet werden
      const now = new Date().toISOString();

      // Die ersten 3 Segmente als freigeschaltet markieren
      const barelyUnlockedSegments = Array.from(
        { length: 9 },
        (_, segmentIndex) => ({
          id: segmentIndex,
          isUnlocked: segmentIndex < 3, // Die ersten 3 Segmente freischalten
          unlockedAt: segmentIndex < 3 ? now : undefined,
        })
      );

      // Kopiere das Landschaftsobjekt und aktualisiere die Eigenschaften
      landscapes[landscape.id] = {
        ...landscape,
        segments: barelyUnlockedSegments,
        progress: 3, // 3 von 9 Segmente freigeschaltet
        isComplete: false,
        isFavorite: false,
      };
    } else {
      // Alle anderen Bilder bleiben unverändert
      landscapes[landscape.id] = landscape;
    }
  });

  // Als aktuelles Bild das ZWEITE Bild setzen (Index 1)
  // So beginnt der Nutzer mit der Freischaltung des zweiten Bildes
  const currentImageId =
    initialLandscapes.length > 1
      ? initialLandscapes[1].id
      : initialLandscapes[0].id;

  return {
    landscapes,
    favorites: [initialLandscapes[0].id], // Das erste Bild als Favorit hinzufügen
    currentImageId, // Das zweite Bild als aktuelles Bild setzen
    lastUsedFavoriteIndex: 0,
    lastChangedDate: new Date().toISOString(),
    version: CURRENT_COLLECTION_VERSION, // Aktuelle Versionsnummer
  };
};

/**
 * 🔢 Sortierlogik für die Galerie
 *
 * Reihenfolge:
 * 1) Aktives Bild (currentImageId)
 * 2) Alle freigeschalteten Favoriten
 * 3) Alle anderen freigeschalteten
 * 4) Alle angefangenen (progress 1..8), nach Fortschritt absteigend
 *    - Tiebreaker: zuletzt freigeschaltetes Segment (neuere zuerst), dann Name
 * 5) Alle restlichen (progress 0), jedes Mal neu zufällig gemischt
 */
type CollectionState = {
  landscapes: Record<string, Landscape>;
  favorites: string[];
  currentImageId?: string | null;
};

// Fortschritt robust bestimmen (Fallback über Segmente, falls progress fehlt)
const getProgress = (l: Landscape): number => {
  if (typeof l.progress === "number") return l.progress;
  const unlocked = l.segments?.filter((s) => s.isUnlocked).length ?? 0;
  return unlocked;
};

const getLastUnlockedAt = (l: Landscape): string | undefined => {
  const times = (l.segments || [])
    .filter((s) => s.isUnlocked && !!s.unlockedAt)
    .map((s) => s.unlockedAt as string);
  if (!times.length) return undefined;
  // ISO-Strings lexikografisch vergleichbar
  return times.sort().at(-1);
};

const byCompletedAtDescThenName = (a: Landscape, b: Landscape) => {
  const aDone = (a as any).completedAt as string | undefined;
  const bDone = (b as any).completedAt as string | undefined;
  if (aDone && bDone && aDone !== bDone) return aDone < bDone ? 1 : -1;
  if (a.name !== b.name) return a.name.localeCompare(b.name);
  return a.id.localeCompare(b.id);
};

const byProgressDescThenRecentUnlockThenName = (a: Landscape, b: Landscape) => {
  const ap = getProgress(a);
  const bp = getProgress(b);
  if (ap !== bp) return bp - ap;
  const aLast = getLastUnlockedAt(a);
  const bLast = getLastUnlockedAt(b);
  if (aLast && bLast && aLast !== bLast) return aLast < bLast ? 1 : -1;
  if (a.name !== b.name) return a.name.localeCompare(b.name);
  return a.id.localeCompare(b.id);
};

const shuffleInPlace = <T>(arr: T[]) => {
  // Fisher–Yates
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
};

const isUnlockedCompletely = (l: Landscape) =>
  l.isComplete || getProgress(l) >= 9;
const isStarted = (l: Landscape) =>
  !isUnlockedCompletely(l) && getProgress(l) > 0;

/**
 * Liefert die sortierte Liste für die Galerieansicht.
 * Rufe diese Funktion z.B. beim Öffnen des GalleryScreens auf,
 * damit Gruppe (5) jedes Mal neu gemischt wird.
 */
export const sortLandscapesForGallery = (
  state: CollectionState
): Landscape[] => {
  const all = Object.values(state.landscapes || {});
  const currentId = state.currentImageId || null;

  const active = currentId ? all.find((l) => l.id === currentId) : undefined;

  const completedFavorites = all.filter(
    (l) => l.id !== currentId && isUnlockedCompletely(l) && l.isFavorite
  );
  const completedOthers = all.filter(
    (l) => l.id !== currentId && isUnlockedCompletely(l) && !l.isFavorite
  );
  const started = all.filter((l) => l.id !== currentId && isStarted(l));
  const notStarted = all.filter(
    (l) =>
      l.id !== currentId && !isUnlockedCompletely(l) && getProgress(l) === 0
  );

  completedFavorites.sort(byCompletedAtDescThenName);
  completedOthers.sort(byCompletedAtDescThenName);
  started.sort(byProgressDescThenRecentUnlockThenName);
  shuffleInPlace(notStarted); // bei jedem Aufruf neu gemischt

  const result: Landscape[] = [];
  if (active) result.push(active);
  result.push(
    ...completedFavorites,
    ...completedOthers,
    ...started,
    ...notStarted
  );
  return result;
};
