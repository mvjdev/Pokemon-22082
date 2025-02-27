import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export function useOrientation(orientationPreference: 'system' | 'portrait' | 'landscape') {
  const [orientation, setOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>(getOrientation());

  function getOrientation() {
    const { width, height } = Dimensions.get('window');
    return width > height ? 'LANDSCAPE' : 'PORTRAIT';
  }

  useEffect(() => {
    async function updateOrientation() {
      try {
        if (orientationPreference === 'portrait') {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        } else if (orientationPreference === 'landscape') {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        } else {
          await ScreenOrientation.unlockAsync();
        }
      } catch (error) {
        console.error('Error setting orientation:', error);
      }
    }

    updateOrientation();

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const { width, height } = window;
      setOrientation(width > height ? 'LANDSCAPE' : 'PORTRAIT');
    });

    return () => {
      subscription.remove();
      ScreenOrientation.unlockAsync().catch(console.error);
    };
  }, [orientationPreference]);

  if (orientationPreference === 'portrait') return 'PORTRAIT';
  if (orientationPreference === 'landscape') return 'LANDSCAPE';

  return orientation;
}
