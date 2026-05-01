import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import type { TaskStatus } from '../types/task';

type FilterOption = 'todas' | TaskStatus;

interface FilterBarProps {
  current: FilterOption;
  onChange: (f: FilterOption) => void;
  counts: {
    todas: number;
    pendente: number;
    em_andamento: number;
    concluida: number;
  };
}

const options: { value: FilterOption; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluida', label: 'Concluídas' },
];

export function FilterBar({ current, onChange, counts }: FilterBarProps) {
  const { colors } = useTheme();

  return (
    <View style={{ height: 56, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: 'row',
          gap: 8,
          alignItems: 'center',
        }}
        style={{ flex: 1 }}
      >
        {options.map((opt) => {
          const isActive = current === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
                height: 34,
                backgroundColor: isActive ? colors.primary : colors.surface,
                borderWidth: 1.5,
                borderColor: isActive ? colors.primary : colors.border,
              }}
            >
              <Text style={{
                color: isActive ? '#fff' : colors.textSecondary,
                fontWeight: '600',
                fontSize: 13,
                ...(Platform.OS === 'web' ? { userSelect: 'none' } as object : {}),
              }}>
                {opt.label}
              </Text>
              <View style={{
                backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : colors.surfaceVariant,
                borderRadius: 10,
                paddingHorizontal: 6,
                paddingVertical: 1,
                minWidth: 20,
                alignItems: 'center',
              }}>
                <Text style={{
                  color: isActive ? '#fff' : colors.textMuted,
                  fontSize: 11,
                  fontWeight: '700',
                }}>
                  {counts[opt.value]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
