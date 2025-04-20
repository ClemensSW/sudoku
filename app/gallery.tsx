import React, { useEffect } from "react";
import GalleryScreen from "@/screens/GalleryScreen/GalleryScreen";
import { useNavigation } from "@/utils/NavigationContext";

export default function GalleryRoute() {
  // Verwende den NavigationContext mit der korrekten Methode
  const { hideNavigation, showNavigationOn } = useNavigation();
  
  // Blende die Navigationsleiste aus, wenn die Galerie geöffnet wird
  useEffect(() => {
    // Verberge die Navigation beim Öffnen der Galerie
    hideNavigation();
    
    // Beim Verlassen der Seite die Navigationsleiste wieder anzeigen
    return () => {
      // Zeige die Navigation nur auf Hauptpfaden an
      showNavigationOn(["/", "/index", "/duo", "/leistung"]);
    };
  }, [hideNavigation, showNavigationOn]);

  return <GalleryScreen />;
}