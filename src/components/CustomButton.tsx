import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function CustomButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: CustomButtonProps) {
  const { colors } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: disabled || loading ? 0.6 : 1,
    };

    if (fullWidth) base.width = '100%';

    switch (variant) {
      case 'primary':
        return { ...base, backgroundColor: colors.primary };
      case 'secondary':
        return { ...base, backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border };
      case 'danger':
        return { ...base, backgroundColor: colors.error };
      case 'ghost':
        return { ...base, backgroundColor: 'transparent' };
      default:
        return { ...base, backgroundColor: colors.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return { color: '#fff', fontWeight: '700', fontSize: 16 };
      case 'secondary':
        return { color: colors.text, fontWeight: '600', fontSize: 16 };
      case 'danger':
        return { color: '#fff', fontWeight: '700', fontSize: 16 };
      case 'ghost':
        return { color: colors.primary, fontWeight: '600', fontSize: 16 };
      default:
        return { color: '#fff', fontWeight: '700', fontSize: 16 };
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}
