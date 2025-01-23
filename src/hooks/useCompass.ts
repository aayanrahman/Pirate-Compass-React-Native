import { useEffect, useState } from 'react';
import { Magnetometer } from 'expo-sensors';
import { triggerDirectionHaptic, PirateHaptics } from '../utils/haptics';
import { getDirectionText } from '../utils/directions';

export const useCompass = () => {
  const [angle, setAngle] = useState(0);
  const [direction, setDirection] = useState('');

  useEffect(() => {
    const updateCompass = ({ x, y }: { x: number; y: number }) => {
      // 1. Get raw magnetometer angle
      const rawAngle = Math.atan2(y, x) * (180 / Math.PI);
      
      // 2. Convert to true compass heading (0° = North)
      const compassHeading = (360 - rawAngle + 90) % 360;
      
      // 3. Force counter-clockwise rotation
      const finalAngle = (360 - compassHeading) % 360;

      const newDirection = getDirectionText(finalAngle);
      setAngle(finalAngle);
      setDirection(newDirection);
    };

    Magnetometer.setUpdateInterval(100);
    const subscription = Magnetometer.addListener(updateCompass);
    
    return () => subscription.remove();
  }, []);

  return { angle, direction };
};