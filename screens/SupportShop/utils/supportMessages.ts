import i18next from 'i18next';

// Witzige und motivierende Nachrichten für den Support-Shop

// Zufällige Banner-Nachricht auswählen
export const getRandomBannerMessage = () => {
  const messages = i18next.t('supportShop:banner.messages', { returnObjects: true }) as Array<{ title: string; subtitle: string }>;
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

// Zufällige Produktbeschreibung auswählen
export const getRandomProductDescription = (productId: string) => {
  const descriptions = i18next.t(`supportShop:products.${productId}`, { returnObjects: true }) as string[];
  if (!descriptions || descriptions.length === 0) return "";

  const randomIndex = Math.floor(Math.random() * descriptions.length);
  return descriptions[randomIndex];
};

// Zufällige Kaufbestätigungsnachricht auswählen
export const getRandomConfirmMessage = () => {
  const messages = i18next.t('supportShop:purchase.confirmMessages', { returnObjects: true }) as Array<{ title: string; message: string }>;
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
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

// Zufälligen Fakt auswählen
export const getRandomFunFact = () => {
  const funFacts = i18next.t('supportShop:purchase.funFacts', { returnObjects: true }) as string[];
  const randomIndex = Math.floor(Math.random() * funFacts.length);
  return funFacts[randomIndex];
};