import React, { useEffect } from "react";
import Gallery from "@/screens/Gallery/Gallery";
import { useNavigation } from "@/utils/NavigationContext";

export default function GalleryRoute() {
  // Use the NavigationContext with the correct method
  const { hideNavigation } = useNavigation();
  
  // Hide the navigation bar when the gallery is opened
  useEffect(() => {
    // Hide navigation immediately
    hideNavigation();
    
    // No need for cleanup as we're not resetting navigation on unmount
    // The receiving screen will control its own navigation state
  }, [hideNavigation]);

  return <Gallery />;
}