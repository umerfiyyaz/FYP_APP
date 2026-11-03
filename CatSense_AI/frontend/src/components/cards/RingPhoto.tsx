import type { ReactNode } from 'react';
import { Image, ImageSourcePropType, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { PressScale } from '@/components/animations/PressScale';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/theme';

type Props = {
  source: ImageSourcePropType;
  size?: number;
  onCamera?: () => void;
  /** orange = filled orange button (cat profile), dark = frosted dark button (profile). */
  cameraTone?: 'orange' | 'dark';
  /** Overlay at the bottom centre (e.g. the "Purring" pill). */
  badge?: ReactNode;
};

/** Cat photo with the orange->mint gradient ring and an optional camera button. */
export function RingPhoto({ source, size = 148, onCamera, cameraTone = 'dark', badge }: Props) {
  const ring = 4;
  return (
    <View style={{ width: size, height: size }}>
      <LinearGradient
        colors={[colors.primaryContainer, colors.secondary, colors.tertiaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: size, height: size, borderRadius: size / 2, padding: ring }}
      >
        <Image
          source={source}
          style={{ width: '100%', height: '100%', borderRadius: size / 2, backgroundColor: colors.surfaceContainerHigh }}
          resizeMode="cover"
        />
      </LinearGradient>
      {badge ? (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: -6, alignItems: 'center' }}>{badge}</View>
      ) : null}
      {onCamera ? (
        <PressScale
          onPress={onCamera}
          accessibilityRole="button"
          accessibilityLabel="Change photo"
          style={{
            position: 'absolute',
            right: 2,
            bottom: 6,
            width: 38,
            height: 38,
            borderRadius: 19,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: cameraTone === 'orange' ? colors.primaryContainer : colors.surfaceContainerHigh,
            borderWidth: 3,
            borderColor: colors.surfaceContainer,
          }}
        >
          <Icon name="photo-camera" size={18} color={cameraTone === 'orange' ? colors.onPrimary : colors.onSurface} />
        </PressScale>
      ) : null}
    </View>
  );
}