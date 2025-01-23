// src/components/CompassRose.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { getDirectionText, CompassDirection } from '../utils/directions';

interface CompassRoseProps {
  angle: number;
  onDirectionChange?: (direction: CompassDirection) => void;
}

const CompassRose: React.FC<CompassRoseProps> = ({ angle, onDirectionChange }) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const prevDirection = useRef('');
  const currentRotation = useRef(0);

  // Track rotation value properly
  rotationAnim.addListener(({ value }) => {
    currentRotation.current = value % 360;
  });

  useEffect(() => {
    // Normalize angles to 0-360 range
    const normalizedAngle = ((angle % 360) + 360) % 360;
    
    // Calculate shortest rotation path
    const shortestRotation = (normalizedAngle - currentRotation.current + 540) % 360 - 180;
    const targetRotation = currentRotation.current + shortestRotation;

    Animated.timing(rotationAnim, {
      toValue: targetRotation,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Handle direction changes
    const newDirection = getDirectionText(normalizedAngle);
    if (newDirection !== prevDirection.current) {
      prevDirection.current = newDirection;
      onDirectionChange?.(newDirection);
    }
  }, [angle, onDirectionChange]);

  //Have to change the compass image to something else not looking good 

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/compass.png')}
        style={[
          styles.compass,
          {
            transform: [{
              rotate: rotationAnim.interpolate({
                inputRange: [0, 360],
                outputRange: ['360deg', '0deg'] // Counter-clockwise rotation
              })
            }]
          }
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
  },
  compass: {
    width: '100%',
    height: '100%',
  },
});

export default CompassRose;