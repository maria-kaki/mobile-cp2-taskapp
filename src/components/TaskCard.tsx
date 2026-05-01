import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useResponsive } from '../hooks/useResponsive';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { formatShortDate } from '../utils/formatDate';
import type { Task } from '../types/task';

interface TaskCardProps { task: Task; onPress: () => void; }

export function TaskCard({ task, onPress }: TaskCardProps) {
  const { colors } = useTheme();
  const { fontSize } = useResponsive();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={{
          backgroundColor: colors.surface, borderRadius: 16, padding: 16,
          marginHorizontal: 16, marginVertical: 6,
          borderWidth: 1, borderColor: colors.border,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 3,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
          <Text style={{ fontSize: 28, marginRight: 12 }}>{task.categoryIcon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700', marginBottom: 2 }} numberOfLines={1}>
              {task.title}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '500' }}>{task.category}</Text>
          </View>
        </View>
        {task.description ? (
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: 12, lineHeight: 18 }} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Criado: {formatShortDate(task.createdAt)}</Text>
          <Text style={{ color: colors.textMuted, fontSize: fontSize.xs }}>Atualizado: {formatShortDate(task.updatedAt)}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
