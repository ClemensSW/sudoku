// Witzige und motivierende Nachrichten für den Support-Shop

// Banner-Nachrichten
export const bannerMessages = [
    {
      title: "Kostenlos gespielt, freiwillig unterstützt",
      subtitle: "Dein Beitrag hält die App werbefrei und mich bei Laune 😄"
    },
    {
      title: "Sudoku ohne nervige Werbung",
      subtitle: "Mit deiner Unterstützung bleibt das auch so! 🙌"
    },
    {
      title: "Kein Abo-Zwang, aber viel Freude",
      subtitle: "Freiwillige Unterstützung für mehr Sudoku-Spaß"
    }
  ];
  
  // Zufällige Banner-Nachricht auswählen
  export const getRandomBannerMessage = () => {
    const randomIndex = Math.floor(Math.random() * bannerMessages.length);
    return bannerMessages[randomIndex];
  };
  
  // Humorvolle Beschreibungen für Produkte
  export const productDescriptions = {
    sudoku_coffee: [
      "Ein Kaffee für neue Rätsel-Ideen",
      "Espresso gleich mehr kreative Energie",
      "Koffein für besseren Code"
    ],
    sudoku_breakfast: [
      "Gehirnnahrung für neue Features",
      "Kein Hunger gleich weniger Bugs",
      "Gutes Frühstück, guter Code!"
    ],
    sudoku_lunch: [
      "Power für die grauen Zellen",
      "Mittagspause gleich neue Ideen",
      "Eine Mahlzeit für neue Features"
    ],
    sudoku_feast: [
      "Ein Fest für die ganze Familie",
      "Großzügigkeit gleich viele Updates",
      "Königliche Unterstützung!"
    ]
  };
  
  // Zufällige Produktbeschreibung auswählen
  export const getRandomProductDescription = (productId: string) => {
    const descriptions = productDescriptions[productId as keyof typeof productDescriptions] || [];
    if (descriptions.length === 0) return "";
    
    const randomIndex = Math.floor(Math.random() * descriptions.length);
    return descriptions[randomIndex];
  };
  
  // Kaufbestätigungsnachrichten
  export const purchaseConfirmMessages = [
    {
      title: "Vielen Dank für deine Unterstützung!",
      message: "Dein Beitrag hilft dabei, die App kontinuierlich zu verbessern. Du bist super! 🎉"
    },
    {
      title: "Wow, du bist großartig!",
      message: "Mit deiner Unterstützung kann ich weiterhin an coolen Features arbeiten. Danke! 🙏"
    },
    {
      title: "High Five! ✋",
      message: "Danke für deine Unterstützung! Jetzt habe ich noch mehr Motivation, die App zu verbessern."
    },
    {
      title: "Jubel, Trubel, Heiterkeit! 🎊",
      message: "Deine Unterstützung sorgt für gute Laune und neue Sudoku-Features!"
    }
  ];
  
  // Zufällige Kaufbestätigungsnachricht auswählen
  export const getRandomConfirmMessage = () => {
    const randomIndex = Math.floor(Math.random() * purchaseConfirmMessages.length);
    return purchaseConfirmMessages[randomIndex];
  };
  
  // Kaufanimationen
  export const purchaseAnimations = [
    "confetti", 
    "thumbsUp", 
    "heart",
    "stars"
  ];
  
  // Zufällige Kaufanimation auswählen
  export const getRandomAnimation = () => {
    const randomIndex = Math.floor(Math.random() * purchaseAnimations.length);
    return purchaseAnimations[randomIndex];
  };
  
  // Spaßige Fakten für den Ladebildschirm
  export const funFacts = [
    "Wusstest du? Die Entwicklung dieser App kostet ungefähr 178 Tassen Kaffee pro Jahr!",
    "Für jede Stunde Coding werden durchschnittlich 2,4 Snacks verspeist.",
    "Die Anzahl der Bugfixes ist direkt proportional zum Kaffeekonsum des Entwicklers.",
    "Diese App wurde mit Liebe, etwas Magie und viel zu viel Koffein programmiert.",
    "Studien zeigen: Glückliche Entwickler erstellen bessere Apps. Du machst mich gerade sehr glücklich!"
  ];
  
  // Zufälligen Fakt auswählen
  export const getRandomFunFact = () => {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    return funFacts[randomIndex];
  };