// screens/DuoScreen/DuoScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  FadeInUp,
  ZoomIn,
  SlideInUp,
  Easing,
} from "react-native-reanimated";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { Difficulty } from "@/utils/sudoku";

const { width, height } = Dimensions.get("window");

// Demo puzzle numbers for animation
const DEMO_NUMBERS = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const DuoScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  
  // Reference to scroll view for programmatic scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  // Reference to the features section
  const featuresRef = useRef<View>(null);
  
  // Configuration
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");
  
  // Animations
  const boardRotation = useSharedValue(0);
  const boardScale = useSharedValue(1);
  const player1Opacity = useSharedValue(0);
  const player2Opacity = useSharedValue(0);
  const middleCellScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const activeNumberIndex = useSharedValue(0);
  const scrollHintOpacity = useSharedValue(1);
  
  // Start animations when component mounts
  useEffect(() => {
    // Board subtle floating animation
    boardRotation.value = withRepeat(
      withSequence(
        withTiming(0.01, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-0.01, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    
    boardScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    
    // Players highlight animation sequence
    player1Opacity.value = 0;
    player2Opacity.value = 0;
    
    setTimeout(() => {
      player1Opacity.value = withTiming(1, { duration: 1000 });
      
      setTimeout(() => {
        player1Opacity.value = withTiming(0.3, { duration: 800 });
        player2Opacity.value = withTiming(1, { duration: 1000 });
        
        setTimeout(() => {
          player2Opacity.value = withTiming(0.3, { duration: 800 });
          middleCellScale.value = withSequence(
            withTiming(1.3, { duration: 600 }),
            withTiming(1, { duration: 500 })
          );
        }, 2500);
      }, 2500);
    }, 1000);
    
    // Numbers filling animation
    const runNumberAnimation = () => {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          activeNumberIndex.value = i % 9;
        }, i * 400);
      }
    };
    
    setTimeout(runNumberAnimation, 1000);
    setInterval(runNumberAnimation, 10000);
    
    // Button pulsing animation
    buttonScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    
    // Scroll hint animation
    scrollHintOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
    
  }, []);
  
  // Animated styles
  const boardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: boardScale.value },
        { rotate: `${boardRotation.value}rad` }
      ]
    };
  });
  
  const player1Style = useAnimatedStyle(() => {
    return {
      opacity: player1Opacity.value
    };
  });
  
  const player2Style = useAnimatedStyle(() => {
    return {
      opacity: player2Opacity.value
    };
  });
  
  const middleCellStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: middleCellScale.value }]
    };
  });
  
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const scrollHintStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollHintOpacity.value
    };
  });
  
  // Handle scroll to features
  const scrollToFeatures = () => {
    triggerHaptic("light");
    if (scrollViewRef.current && featuresRef.current) {
      scrollViewRef.current.scrollTo({ y: height * 0.9, animated: true });
    }
  };
  
  // Handle difficulty selection
  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    triggerHaptic("light");
  };
  
  // Start game with selected difficulty
  const handleStartGame = () => {
    triggerHaptic("medium");
    setShowDifficultyModal(true);
  };
  
  const handleStartWithDifficulty = () => {
    setShowDifficultyModal(false);
    // Navigate to the duo game with selected difficulty
    router.replace({
      pathname: "/duo-game",
      params: { difficulty: selectedDifficulty },
    });
  };
  
  // Handle settings
  const handleSettingsPress = () => {
    triggerHaptic("light");
    router.push("/settings");
  };
  
  // Render a demo board cell
  const renderDemoCell = (row: number, col: number) => {
    const isP1Area = row > 4 || (row === 4 && col > 4);
    const isP2Area = row < 4 || (row === 4 && col < 4);
    const isMiddleCell = row === 4 && col === 4;
    const value = DEMO_NUMBERS[row][col];
    const isActive = activeNumberIndex.value === col;
    
    return (
      <View 
        style={[
          styles.demoCell,
          isMiddleCell && styles.middleCell,
          isP1Area && styles.player1Cell,
          isP2Area && styles.player2Cell,
          isActive && styles.activeCell
        ]}
      >
        {isMiddleCell ? (
          // Yin Yang icon in the middle
          <View style={styles.yinYangContainer}>
            <View style={styles.yinYang}>
              <View style={styles.yinYangLeft} />
              <View style={styles.yinYangRight}>
                <View style={styles.yinDot} />
              </View>
              <View style={styles.yangDot} />
            </View>
          </View>
        ) : (
          value > 0 && (
            <Text 
              style={[
                styles.demoCellText,
                { color: colors.textPrimary },
                isP2Area && styles.rotatedText
              ]}
            >
              {value}
            </Text>
          )
        )}
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />
      
      {/* Decorative background elements */}
      <Image 
        source={require('@/assets/images/background/mountains_blue.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Header with settings button */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
              ZWEI SPIELER MODUS
            </Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Sudoku Duo
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.settingsButton, { backgroundColor: colors.surface }]}
            onPress={handleSettingsPress}
          >
            <Feather name="settings" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* First "screen" - Main info and CTA */}
          <View style={[styles.mainScreen, { minHeight: height - insets.top - 200 }]}>
            {/* Interactive board visualization */}
            <Animated.View
              style={[styles.boardContainer, boardAnimatedStyle]}
              entering={FadeIn.duration(1000)}
            >
              <View style={styles.playerIndicator}>
                <Animated.View 
                  style={[
                    styles.playerTag, 
                    { backgroundColor: colors.warning },
                    player2Style
                  ]}
                >
                  <Feather name="user" size={14} color="#fff" style={styles.playerIcon} />
                  <Text style={styles.playerText}>SPIELER 2</Text>
                </Animated.View>
              </View>
              
              <View 
                style={[
                  styles.demoBoard, 
                  { 
                    backgroundColor: theme.isDark ? 
                      "rgba(255,255,255,0.05)" : 
                      "rgba(0,0,0,0.02)",
                    borderColor: theme.isDark ?
                      "rgba(255,255,255,0.1)" :
                      "rgba(0,0,0,0.1)"
                  }
                ]}
              >
                {/* Player 2 area highlight overlay */}
                <Animated.View 
                  style={[
                    styles.areaOverlay,
                    styles.topArea,
                    { backgroundColor: `${colors.warning}30` },
                    player2Style
                  ]}
                />
                
                {/* Player 1 area highlight overlay */}
                <Animated.View 
                  style={[
                    styles.areaOverlay, 
                    styles.bottomArea, 
                    { backgroundColor: `${colors.primary}30` },
                    player1Style
                  ]}
                />
                
                {/* Middle cell highlight */}
                <Animated.View 
                  style={[
                    styles.areaOverlay,
                    styles.middlePoint,
                    { backgroundColor: `${colors.success}40` },
                    middleCellStyle
                  ]}
                />
                
                {/* Divider line */}
                <View 
                  style={[
                    styles.divider, 
                    { backgroundColor: theme.isDark ? 
                      "rgba(255,255,255,0.15)" : 
                      "rgba(0,0,0,0.1)" 
                    }
                  ]} 
                />
                
                {/* Board grid for visualization */}
                <View style={styles.grid}>
                  {DEMO_NUMBERS.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.demoRow}>
                      {row.map((_, colIndex) => (
                        renderDemoCell(rowIndex, colIndex)
                      ))}
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.playerIndicator}>
                <Animated.View 
                  style={[
                    styles.playerTag, 
                    { backgroundColor: colors.primary },
                    player1Style
                  ]}
                >
                  <Feather name="user" size={14} color="#fff" style={styles.playerIcon} />
                  <Text style={styles.playerText}>SPIELER 1</Text>
                </Animated.View>
              </View>
            </Animated.View>
            
            {/* Start button */}
            <Animated.View 
              style={[styles.buttonContainer, buttonAnimatedStyle]}
              entering={SlideInUp.delay(600).duration(500)}
            >
              <TouchableOpacity
                style={[
                  styles.startButton,
                  { backgroundColor: colors.primary }
                ]}
                onPress={handleStartGame}
                activeOpacity={0.8}
              >
                <Feather name="play" size={24} color="#FFF" style={{ marginRight: 12 }} />
                <Text style={styles.startButtonText}>Jetzt spielen</Text>
              </TouchableOpacity>
            </Animated.View>
            
            {/* Scroll indicator */}
            <Animated.View 
              style={[styles.scrollIndicator, scrollHintStyle]}
              entering={FadeIn.delay(1200).duration(600)}
            >
              <TouchableOpacity onPress={scrollToFeatures} style={styles.scrollButton}>
                <Text style={[styles.scrollText, { color: colors.textSecondary }]}>
                  Mehr erfahren
                </Text>
                <Feather name="chevron-down" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          {/* Second "screen" - Features explanation */}
          <View ref={featuresRef} style={styles.featuresScreen}>
            {/* Feature highlights in cards */}
            <View style={styles.featuresContainer}>
              <Text style={[styles.featuresTitle, { color: colors.textPrimary }]}>
                So funktioniert's
              </Text>
              
              <Animated.View 
                style={[
                  styles.featureCard, 
                  { backgroundColor: colors.surface }
                ]}
                entering={FadeInUp.delay(300).duration(500)}
              >
                <View 
                  style={[
                    styles.featureIcon, 
                    { backgroundColor: `${colors.primary}15` }
                  ]}
                >
                  <Feather name="users" size={22} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                    Gemeinsam spielen
                  </Text>
                  <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                    Ein Gerät, zwei Spieler - wer löst sein Gebiet zuerst?
                  </Text>
                </View>
              </Animated.View>
              
              <Animated.View 
                style={[
                  styles.featureCard, 
                  { backgroundColor: colors.surface }
                ]}
                entering={FadeInUp.delay(400).duration(500)}
              >
                <View 
                  style={[
                    styles.featureIcon, 
                    { backgroundColor: `${colors.warning}15` }
                  ]}
                >
                  <Feather name="rotate-ccw" size={22} color={colors.warning} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                    Intelligentes Layout
                  </Text>
                  <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                    Zahlen für Spieler 2 werden automatisch gedreht
                  </Text>
                </View>
              </Animated.View>
              
              <Animated.View 
                style={[
                  styles.featureCard, 
                  { backgroundColor: colors.surface }
                ]}
                entering={FadeInUp.delay(500).duration(500)}
              >
                <View 
                  style={[
                    styles.featureIcon, 
                    { backgroundColor: `${colors.success}15` }
                  ]}
                >
                  <Feather name="target" size={22} color={colors.success} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                    Strategie & Teamwork
                  </Text>
                  <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                    Wettbewerb oder Zusammenarbeit - ihr entscheidet!
                  </Text>
                </View>
              </Animated.View>
              
              <Animated.View 
                style={[
                  styles.featureCard, 
                  { backgroundColor: colors.surface }
                ]}
                entering={FadeInUp.delay(600).duration(500)}
              >
                <View 
                  style={[
                    styles.featureIcon, 
                    { backgroundColor: `${colors.secondary}15` }
                  ]}
                >
                  <Feather name="refresh-cw" size={22} color={colors.secondary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                    Perfekt für Spieleabende
                  </Text>
                  <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>
                    Völlig neues Sudoku-Erlebnis mit deinen Freunden
                  </Text>
                </View>
              </Animated.View>
            </View>
            
            {/* Start button (duplicate at bottom) */}
            <Animated.View 
              style={[styles.buttonContainer, { marginTop: 20, marginBottom: 40 }]}
              entering={FadeInUp.delay(700).duration(500)}
            >
              <TouchableOpacity
                style={[
                  styles.startButton,
                  { backgroundColor: colors.primary }
                ]}
                onPress={handleStartGame}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Spiel starten</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
      
      {/* Difficulty selection modal */}
      {showDifficultyModal && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDifficultyModal(false)}
        >
          <BlurView
            intensity={20}
            tint={theme.isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
          
          <Animated.View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card }
            ]}
            entering={ZoomIn.duration(300)}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Schwierigkeit
            </Text>
            
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Wähle die passende Herausforderung
            </Text>
            
            <View style={styles.difficultyContainer}>
              {["easy", "medium", "hard", "expert"].map((diff) => {
                const difficulty = diff as Difficulty;
                const isSelected = selectedDifficulty === difficulty;
                
                // German labels
                const labels: Record<Difficulty, string> = {
                  easy: "Leicht",
                  medium: "Mittel",
                  hard: "Schwer",
                  expert: "Experte"
                };
                
                return (
                  <TouchableOpacity
                    key={diff}
                    style={[
                      styles.difficultyButton,
                      isSelected && {
                        backgroundColor: `${colors.primary}15`,
                        borderColor: colors.primary
                      },
                      {
                        borderColor: isSelected ? 
                          colors.primary : 
                          theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                      }
                    ]}
                    onPress={() => handleDifficultyChange(difficulty)}
                  >
                    <Text 
                      style={[
                        styles.difficultyText,
                        { 
                          color: isSelected ? 
                            colors.primary : 
                            colors.textPrimary 
                        }
                      ]}
                    >
                      {labels[difficulty]}
                    </Text>
                    
                    {isSelected && (
                      <Feather name="check" size={18} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: colors.primary }
              ]}
              onPress={handleStartWithDifficulty}
            >
              <Text style={styles.modalButtonText}>
                Spiel starten
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom navigation
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  // Main Screen
  mainScreen: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  // Board Visualization
  boardContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
    marginTop: 20,
  },
  playerIndicator: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  playerIcon: {
    marginRight: 6,
  },
  playerText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  demoBoard: {
    width: width * 0.8,
    height: width * 0.8,
    maxWidth: 350,
    maxHeight: 350,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  areaOverlay: {
    position: 'absolute',
    zIndex: 1,
  },
  topArea: {
    top: 0,
    left: 0,
    right: 0,
    height: '47.5%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bottomArea: {
    bottom: 0,
    left: 0,
    right: 0,
    height: '47.5%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  middlePoint: {
    top: '48.5%',
    left: '48.5%',
    width: '11%',
    height: '11%',
    borderRadius: 10,
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 3,
  },
  divider: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    right: '5%',
    height: 1.5,
    zIndex: 2,
  },
  grid: {
    flex: 1,
    position: 'relative',
    zIndex: 0,
  },
  demoRow: {
    flex: 1,
    flexDirection: 'row',
  },
  demoCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(150,150,150,0.2)',
  },
  middleCell: {
    borderWidth: 1.5,
    borderColor: 'rgba(150,150,150,0.4)',
    zIndex: 2,
  },
  player1Cell: {
    backgroundColor: 'rgba(76, 99, 230, 0.05)',
  },
  player2Cell: {
    backgroundColor: 'rgba(255, 193, 7, 0.05)',
  },
  activeCell: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  demoCellText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rotatedText: {
    transform: [{ rotate: '180deg' }]
  },
  
  // Yin Yang
  yinYangContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yinYang: {
    width: 25,
    height: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#FFF',
    position: 'relative',
    overflow: 'hidden',
  },
  yinYangLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  yinYangRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#FFF',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  yangDot: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '12.5%',
    height: '12.5%',
    backgroundColor: '#FFF',
    borderRadius: 25,
  },
  yinDot: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '12.5%',
    height: '12.5%',
    backgroundColor: '#000',
    borderRadius: 25,
  },
  
  // Button Styles
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  
  // Scroll Indicator
  scrollIndicator: {
    marginTop: 30,
    alignItems: 'center',
    padding: 12,
  },
  scrollButton: {
    alignItems: 'center',
  },
  scrollText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  
  // Features Screen
  featuresScreen: {
    minHeight: height * 0.9,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  featureIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Modal Styles
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '85%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  difficultyContainer: {
    width: '100%',
    marginBottom: 24,
  },
  difficultyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DuoScreen;