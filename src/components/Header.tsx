import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useResponsive } from '../hooks/useResponsive';

interface HeaderProps { title?: string; }

export function Header({ title }: HeaderProps) {
  const { colors } = useTheme();
  const { user, logout, treatment } = useAuth();
  const { horizontalPadding, fontSize } = useResponsive();

  return (
    <View style={{
      backgroundColor: colors.surface,
      paddingHorizontal: horizontalPadding, paddingVertical: 14,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      borderBottomWidth: 1, borderBottomColor: colors.border,
    }}>
      <View style={{ flex: 1 }}>
        {title ? (
          <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '700' }}>{title}</Text>
        ) : (
          <>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '500' }}>Olá, {treatment}</Text>
            <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700' }} numberOfLines={1}>{user?.name ?? ''}</Text>
          </>
        )}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{
          backgroundColor: user?.role === 'admin' ? colors.primaryLight : colors.surfaceVariant,
          paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
        }}>
          <Text style={{ color: user?.role === 'admin' ? colors.primary : colors.textSecondary, fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase' }}>
            {user?.role ?? ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          style={{ backgroundColor: colors.surfaceVariant, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
          activeOpacity={0.7}
        >
          <Text style={{ color: colors.error, fontSize: fontSize.sm, fontWeight: '600' }}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
