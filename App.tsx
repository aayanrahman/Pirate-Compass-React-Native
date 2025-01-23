// App.tsx
import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground, Text } from 'react-native';
import { useCompass } from './src/hooks/useCompass';
import useSound from './src/hooks/useSound';
import CompassRose from './src/components/compassRose';
import { useLoadFonts } from './src/hooks/useFonts';
import { getDirectionText, formatDirectionDisplay, CompassDirection } from './src/utils/directions';

interface CompassHeadingProps {
  angle: number;
  direction: string;
}

const CompassHeading: React.FC<CompassHeadingProps> = ({ angle, direction }) => (
  <View style={styles.headingContainer}>
    <Text style={styles.directionText}>{direction}</Text>
    <Text style={styles.angleText}>{angle.toFixed(1)}°</Text>
  </View>
);

const CoordinatesDisplay: React.FC = () => (
  <View style={styles.coordinatesContainer}>
    <Text style={styles.coordinatesText}>Ye Current Position</Text>
    {/* Add actual coordinates here if needed */}
  </View>
);

export default function App() {
  const { fontsLoaded, onLayoutRootView } = useLoadFonts();
  const { angle, direction } = useCompass();
  const { playCreak } = useSound();
  const prevDirection = React.useRef(direction);

  const handleDirectionChange = useCallback((newDirection: CompassDirection) => {
    if (newDirection !== prevDirection.current) {
      playCreak();
      prevDirection.current = newDirection;
    }
  }, [playCreak]);

  React.useEffect(() => {
    prevDirection.current = direction;
  }, [direction]);

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <ImageBackground 
      source={require('./assets/images/parchment.jpg')} 
      style={styles.container}
      resizeMode="cover"
      onLayout={onLayoutRootView}
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <CompassHeading angle={angle} direction={direction} />
      </View>

      <View style={styles.compassContainer}>
        <CompassRose angle={angle} onDirectionChange={handleDirectionChange} />
      </View>

      <View style={styles.footer}>
        <CoordinatesDisplay />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4D03F',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  headingContainer: {
    alignItems: 'center',
  },
  directionText: {
    fontFamily: 'Pirate-One',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  angleText: {
    fontSize: 24,
    color: '#795548',
  },
  compassContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  coordinatesContainer: {
    backgroundColor: 'rgba(121, 85, 72, 0.8)',
    padding: 15,
    borderRadius: 10,
  },
  coordinatesText: {
    fontFamily: 'Pirate-One',
    color: '#5D4037',
    fontSize: 18,
    fontWeight: 'bold',
  },
});