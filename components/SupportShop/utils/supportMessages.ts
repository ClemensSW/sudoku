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
      "Für einen Kaffee, der mich wach hält, während ich neue Rätsel erstelle",
      "Ein Espresso für mehr kreative Energie bei der Entwicklung",
      "Damit ich beim Programmieren nicht einschlafe"
    ],
    sudoku_breakfast: [
      "Ein leckeres Frühstück für Gehirnnahrung bei der App-Entwicklung",
      "Damit ich nicht mit leerem Magen Bugs jagen muss",
      "Wer gut frühstückt, programmiert besser!"
    ],
    sudoku_lunch: [
      "Für ein Mittagessen, das meine grauen Zellen versorgt",
      "Hungrige Entwickler machen mehr Fehler - danke für das Mittagessen!",
      "Eine vollwertige Mahlzeit für vollwertige Features"
    ],
    sudoku_feast: [
      "Ein Festmahl für den Entwickler und seine Familie",
      "So viel Großzügigkeit verdient ein königliches Mahl und viele neue Features",
      "Wow! Dafür gibt's nicht nur Essen, sondern gleich Updates für Wochen"
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