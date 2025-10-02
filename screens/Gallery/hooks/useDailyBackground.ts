import { useState, useEffect, useCallback } from "react";
import { Landscape } from "@/screens/Gallery/utils/landscapes/types";
import { getDailyBackground } from "@/screens/Gallery/utils/landscapes/storage";

/**
 * Custom Hook zum Verwalten des täglichen Hintergrundbildes auf der Startseite
 * Lädt automatisch ein freischaltetes Bild und rotiert täglich durch die Favoriten
 */
export const useDailyBackground = () => {
  const [backgroundImage, setBackgroundImage] = useState<Landscape | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lade das tägliche Hintergrundbild
  const loadDailyBackground = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const image = await getDailyBackground();
      setBackgroundImage(image);
    } catch (err) {
      console.error("Fehler beim Laden des Hintergrundbildes:", err);
      setError("Hintergrundbild konnte nicht geladen werden");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Lade das Hintergrundbild beim ersten Rendern
  useEffect(() => {
    loadDailyBackground();

    // Optional: Prüfe regelmäßig auf Mitternachts-Übergang für Bildwechsel
    // Dies ist nur relevant, wenn die App über Mitternacht hinweg geöffnet bleibt
    const checkInterval = setInterval(() => {
      const now = new Date();
      // Überprüfe nur in der Nähe von Mitternacht (23:59 - 00:01)
      if (now.getHours() === 0 && now.getMinutes() <= 1) {
        loadDailyBackground();
      }
    }, 60000); // Alle 60 Sekunden überprüfen

    return () => clearInterval(checkInterval);
  }, [loadDailyBackground]);

  return {
    backgroundImage,
    isLoading,
    error,
    reloadBackground: loadDailyBackground,
  };
};
