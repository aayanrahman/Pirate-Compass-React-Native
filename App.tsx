import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ImageBackground, Text } from 'react-native';
import { useCompass } from './src/hooks/useCompass';
import useSound from './src/hooks/useSound';
import CompassRose from './src/components/compassRose';
import { useLoadFonts } from './src/hooks/useFonts';
import { getDirectionText, CompassDirection } from './src/utils/directions';
import * as Location from 'expo-location';

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

const CoordinatesDisplay: React.FC<{ location?: Location.LocationObject; error?: string }> = ({ location, error }) => {
  const formatCoordinate = (value: number, isLat: boolean) => {
    const direction = isLat ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W');
    const degrees = Math.floor(Math.abs(value));
    const minutes = Math.floor((Math.abs(value) - degrees) * 60);
    const seconds = ((Math.abs(value) - degrees - minutes / 60) * 3600).toFixed(1);
    return `${degrees}°${minutes}'${seconds}" ${direction}`;
  };

  return (
    <View style={styles.coordinatesContainer}>
      <Text style={styles.coordinatesText}>Ye Current Position</Text>
      {location ? (
        <>
          <Text style={styles.coordinateValue}>
            {formatCoordinate(location.coords.latitude, true)}
          </Text>
          <Text style={styles.coordinateValue}>
            {formatCoordinate(location.coords.longitude, false)}
          </Text>
          <Text style={styles.altitudeText}>
            Elevation: {location.coords.altitude?.toFixed(1) || 'Unknown'}m
          </Text>
        </>
      ) : (
        <Text style={styles.errorText}>{error || 'Fetching location...'}</Text>
      )}
    </View>
  );
};

export default function App() {
  const { fontsLoaded, onLayoutRootView } = useLoadFonts();
  const { angle, direction } = useCompass();
  const { playCreak } = useSound();
  const prevDirection = React.useRef(direction);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleDirectionChange = useCallback(
    (newDirection: CompassDirection) => {
      if (newDirection !== prevDirection.current) {
        playCreak();
        prevDirection.current = newDirection;
      }
    },
    [playCreak]
  );

  useEffect(() => {
    prevDirection.current = direction;
  }, [direction]);

  // Fetch user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Optionally watch for updates
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );
        return () => subscription.remove();
      } catch (error) {
        setLocationError('Failed to fetch location');
      }
    })();
  }, []);

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
        <CoordinatesDisplay location={location || undefined} error={locationError || undefined} />
      </View>
    </ImageBackground>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5e8c7', // Subtle parchment-like color
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  headingContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  directionText: {
    fontFamily: 'Pirate-One',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3a2f1c',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  angleText: {
    fontSize: 24,
    color: '#614e35',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  compassContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Transparent overlay
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  coordinatesContainer: {
    backgroundColor: 'rgba(50, 25, 10, 0.9)', // Dark pirate scroll color
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    borderWidth: 2,
    borderColor: '#3a2f1c',
    elevation: 10, // Adds subtle depth for better visuals
  },
  coordinatesText: {
    fontFamily: 'Pirate-One',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  coordinateValue: {
    fontFamily: 'Pirate-One',
    color: '#ffd700', // Golden for elegance
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 4,
  },
  altitudeText: {
    fontFamily: 'Pirate-One',
    color: '#c0c0c0', // Silver for clarity
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Pirate-One',
    color: '#FF0000',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
