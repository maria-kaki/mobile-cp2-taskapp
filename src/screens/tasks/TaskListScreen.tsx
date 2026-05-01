import React, { useRef, useEffect } from 'react';
import { View, FlatList, StatusBar, TouchableOpacity, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../../components/Header';
import { TaskCard } from '../../components/TaskCard';
import { FilterBar } from '../../components/FilterBar';
import { EmptyState } from '../../components/EmptyState';
import { CustomButton } from '../../components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { useTasks } from '../../hooks/useTasks';
import type { TaskStackParamList } from '../../types/navigation';

type Nav = NativeStackNavigationProp<TaskStackParamList>;

function AnimatedTaskCard({ task, onPress, index }: { task: Parameters<typeof TaskCard>[0]['task']; onPress: () => void; index: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, delay: index * 60, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TaskCard task={task} onPress={onPress} />
    </Animated.View>
  );
}

export function TaskListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const { filteredTasks, filter, setFilter, totalCount, pendingCount, inProgressCount, completedCount } = useTasks();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={colors.background === '#0f172a' ? 'light-content' : 'dark-content'} />
      <Header title="Tarefas" />
      <FilterBar
        current={filter}
        onChange={setFilter}
        counts={{ todas: totalCount, pendente: pendingCount, em_andamento: inProgressCount, concluida: completedCount }}
      />
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <AnimatedTaskCard
            task={item}
            index={index}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
          />
        )}
        contentContainerStyle={filteredTasks.length === 0 ? { flex: 1 } : { paddingBottom: 100 }}
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title="Nenhuma tarefa encontrada"
            subtitle={filter === 'todas' ? 'Crie sua primeira tarefa usando o botão abaixo.' : 'Não há tarefas com o filtro selecionado.'}
            action={filter === 'todas' ? <CustomButton title="+ Nova Tarefa" onPress={() => navigation.navigate('TaskForm', {})} /> : undefined}
          />
        }
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('TaskForm', {})}
        activeOpacity={0.85}
        style={{
          position: 'absolute', bottom: 24, right: 24,
          backgroundColor: colors.primary,
          width: 58, height: 58, borderRadius: 29,
          alignItems: 'center', justifyContent: 'center',
          shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.45, shadowRadius: 12, elevation: 8,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 28, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
