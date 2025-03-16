import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { usePathname } from "expo-router";

// Interface für den Navigationskontext
interface NavigationContextType {
  showNavigation: boolean;
  setShowNavigation: (show: boolean) => void;
  hideNavigation: () => void;
  showNavigationOn: (paths: string[]) => void;
}

// Erstelle den Kontext mit Standardwerten
const NavigationContext = createContext<NavigationContextType>({
  showNavigation: true,
  setShowNavigation: () => {},
  hideNavigation: () => {},
  showNavigationOn: () => {},
});

// Provider-Komponente für den Kontext
export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [showNavigation, setShowNavigation] = useState(true);
  const pathname = usePathname();

  // Hilfsfunktion zum Ausblenden der Navigation
  const hideNavigation = () => {
    setShowNavigation(false);
  };

  // Hilfsfunktion, um die Navigation nur auf bestimmten Pfaden anzuzeigen
  const showNavigationOn = (allowedPaths: string[]) => {
    if (pathname && allowedPaths.includes(pathname)) {
      setShowNavigation(true);
    } else {
      setShowNavigation(false);
    }
  };

  // Automatisch die Navigation auf Hauptpfaden anzeigen
  useEffect(() => {
    const mainPaths = ["/", "/index", "/duo", "/leistung"];
    showNavigationOn(mainPaths);

    // Debug-Ausgabe
    console.log(
      `[NavigationContext] Pathname: "${pathname}", Show Navigation: ${mainPaths.includes(
        pathname ? pathname : ""
      )}`
    );
  }, [pathname]);

  return (
    <NavigationContext.Provider
      value={{
        showNavigation,
        setShowNavigation,
        hideNavigation,
        showNavigationOn,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

// Hook für den einfachen Zugriff auf den Navigationskontext
export const useNavigation = () => useContext(NavigationContext);
