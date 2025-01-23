import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface SingleHaptic {
  style: Haptics.ImpactFeedbackStyle;
  duration: number;
}

export type HapticPattern = SingleHaptic | Array<{
  type: Haptics.NotificationFeedbackType | Haptics.ImpactFeedbackStyle;
  delay: number;
}>;

export const PirateHaptics = {
  RUMBLE_SHORT: {
    style: Haptics.ImpactFeedbackStyle.Heavy,
    duration: 50
  },
  RUMBLE_LONG: {
    style: Haptics.ImpactFeedbackStyle.Medium,
    duration: 100
  },
  TREASURE_FOUND: [
    { type: Haptics.NotificationFeedbackType.Success, delay: 0 },
    { type: Haptics.ImpactFeedbackStyle.Light, delay: 100 },
    { type: Haptics.ImpactFeedbackStyle.Heavy, delay: 200 }
  ]
} as const;

export async function triggerHaptic(pattern: HapticPattern) {
  if (Platform.OS === 'android') {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return;
  }

  try {
    if (Array.isArray(pattern)) {
      for (const { type, delay } of pattern) {
        if (type in Haptics.NotificationFeedbackType) {
          await Haptics.notificationAsync(type as Haptics.NotificationFeedbackType);
        } else {
          await Haptics.impactAsync(type as Haptics.ImpactFeedbackStyle);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } else {
      await Haptics.impactAsync(pattern.style);
      await new Promise(resolve => setTimeout(resolve, pattern.duration));
    }
  } catch (error) {
    console.error('Haptic failed:', error);
  }
}

export async function triggerDirectionHaptic(direction: string) {
  const isCardinal = ['Nor\'', 'Sou\'', 'East', 'West'].includes(direction);
  
  if (direction === 'Nor\'') {
    await triggerHaptic(PirateHaptics.RUMBLE_LONG);
  } else if (isCardinal) {
    await triggerHaptic(PirateHaptics.RUMBLE_SHORT);
  } else {
    await Haptics.selectionAsync();
  }
}