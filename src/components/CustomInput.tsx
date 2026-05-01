import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export function CustomInput({
  label,
  error,
  containerStyle,
  rightIcon,
  onRightIconPress,
  ...rest
}: CustomInputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label ? (
        <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: error ? colors.error : focused ? colors.primary : colors.border,
          paddingHorizontal: 14,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 13,
            fontSize: 16,
            color: colors.text,
          }}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text style={{ color: colors.error, fontSize: 12, marginTop: 4, marginLeft: 4 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
