import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/utils/theme';
import styles from './Timer.styles';

interface TimerProps {
  isRunning: boolean;
  initialTime?: number;
  onTimeUpdate?: (time: number) => void;
}

const Timer: React.FC<TimerProps> = ({
  isRunning,
  initialTime = 0,
  onTimeUpdate,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  const [time, setTime] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer-Logik
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          if (onTimeUpdate) onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  // Formatiere Zeit als MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.timerText, { color: colors.textPrimary }]}>
        {formatTime(time)}
      </Text>
    </View>
  );
};

export default Timer;