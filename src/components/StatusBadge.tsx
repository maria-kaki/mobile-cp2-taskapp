import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import type { TaskStatus, TaskPriority } from '../types/task';

interface StatusBadgeProps {
  status: TaskStatus;
}

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { colors } = useTheme();

  const config: Record<TaskStatus, { label: string; bg: string; text: string }> = {
    pendente: { label: 'Pendente', bg: '#fef3c7', text: '#92400e' },
    em_andamento: { label: 'Em Andamento', bg: '#dbeafe', text: '#1e3a8a' },
    concluida: { label: 'Concluída', bg: '#dcfce7', text: '#14532d' },
  };

  const c = config[status];

  return (
    <View style={{ backgroundColor: c.bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 }}>
      <Text style={{ color: c.text, fontSize: 11, fontWeight: '700' }}>{c.label}</Text>
    </View>
  );
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config: Record<TaskPriority, { label: string; bg: string; text: string; dot: string }> = {
    baixa: { label: 'Baixa', bg: '#f0fdf4', text: '#166534', dot: '#22c55e' },
    media: { label: 'Média', bg: '#fffbeb', text: '#92400e', dot: '#f59e0b' },
    alta: { label: 'Alta', bg: '#fef2f2', text: '#991b1b', dot: '#ef4444' },
  };

  const c = config[priority];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, gap: 4 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.dot }} />
      <Text style={{ color: c.text, fontSize: 11, fontWeight: '700' }}>{c.label}</Text>
    </View>
  );
}
