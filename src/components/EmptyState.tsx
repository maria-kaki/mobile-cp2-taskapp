import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = '📋', title, subtitle, action }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingVertical: 60 }}>
      <Text style={{ fontSize: 64, marginBottom: 16 }}>{icon}</Text>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={{ color: colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
          {subtitle}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: 24 }}>{action}</View> : null}
    </View>
  );
}
