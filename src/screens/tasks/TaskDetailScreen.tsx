import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, StatusBar, Animated, Platform, Modal, Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBadge, PriorityBadge } from '../../components/StatusBadge';
import { CustomButton } from '../../components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { useTasks } from '../../hooks/useTasks';
import { useResponsive } from '../../hooks/useResponsive';
import { formatDate } from '../../utils/formatDate';
import type { TaskDetailScreenProps } from '../../types/navigation';

// Modal de confirmação customizado — funciona em web E mobile
function ConfirmDeleteModal({
  visible,
  taskTitle,
  onConfirm,
  onCancel,
  deleting,
}: {
  visible: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  const { colors } = useTheme();
  const { fontSize } = useResponsive();

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.55)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
        onPress={onCancel}
      >
        <Pressable
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 24,
            width: '100%',
            maxWidth: 400,
            borderWidth: 1,
            borderColor: colors.border,
          }}
          onPress={() => {}} // impede fechar ao clicar dentro
        >
          <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: 10 }}>
            Excluir Tarefa
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.md, lineHeight: 22, marginBottom: 24 }}>
            Tem certeza que deseja excluir "{taskTitle}"? Esta ação não pode ser desfeita.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={deleting}
              style={{
                flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center',
                backgroundColor: colors.surfaceVariant,
                borderWidth: 1, borderColor: colors.border,
              }}
            >
              <Text style={{ color: colors.text, fontWeight: '600', fontSize: fontSize.md }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={deleting}
              style={{
                flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center',
                backgroundColor: colors.error,
                opacity: deleting ? 0.6 : 1,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: fontSize.md }}>
                {deleting ? 'Excluindo...' : 'Excluir'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function TaskDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<TaskDetailScreenProps['navigation']>();
  const route = useRoute<TaskDetailScreenProps['route']>();
  const { getTaskById, deleteTask } = useTasks();
  const { horizontalPadding, fontSize, isMobile } = useResponsive();

  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const task = getTaskById(route.params.taskId);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!task) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.text, fontSize: fontSize.lg }}>Tarefa não encontrada.</Text>
      </View>
    );
  }

  const handleDeletePress = () => {
    if (Platform.OS === 'web') {
      // Na web, Alert.alert não dispara onPress — usa Modal customizado
      setShowModal(true);
    } else {
      // Mobile usa Alert nativo do sistema
      Alert.alert(
        'Excluir Tarefa',
        `Tem certeza que deseja excluir "${task.title}"? Esta ação não pode ser desfeita.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Excluir', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setShowModal(false);
    await deleteTask(task.id);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={colors.background === '#0f172a' ? 'light-content' : 'dark-content'} />

      <ConfirmDeleteModal
        visible={showModal}
        taskTitle={task.title}
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
        deleting={deleting}
      />

      {/* Nav bar */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: horizontalPadding, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: colors.border,
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
          <Text style={{ color: colors.primary, fontSize: fontSize.md, fontWeight: '600' }}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '700', flex: 1 }}>Detalhe</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
          style={{ backgroundColor: colors.primaryLight, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 }}
        >
          <Text style={{ color: colors.primary, fontWeight: '700', fontSize: fontSize.sm }}>Editar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{
        padding: horizontalPadding, paddingBottom: 40,
        alignItems: isMobile ? undefined : 'center',
      }}>
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          width: '100%',
          maxWidth: isMobile ? undefined : 680,
        }}>
          {/* Título + ícone */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 48, marginRight: 16 }}>{task.categoryIcon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '800', lineHeight: 28 }}>
                {task.title}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: 4 }}>
                {task.category}
              </Text>
            </View>
          </View>

          {/* Badges */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </View>

          {/* Descrição */}
          {task.description ? (
            <View style={{
              backgroundColor: colors.surface, borderRadius: 14, padding: 16,
              marginBottom: 16, borderWidth: 1, borderColor: colors.border,
            }}>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600', marginBottom: 6 }}>
                DESCRIÇÃO
              </Text>
              <Text style={{ color: colors.text, fontSize: fontSize.md, lineHeight: 22 }}>
                {task.description}
              </Text>
            </View>
          ) : null}

          {/* Datas */}
          <View style={{
            backgroundColor: colors.surface, borderRadius: 14, padding: 16,
            marginBottom: 24, borderWidth: 1, borderColor: colors.border, gap: 10,
          }}>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600', marginBottom: 4 }}>
              DATAS
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>Criado em</Text>
              <Text style={{ color: colors.text, fontSize: fontSize.sm, fontWeight: '600' }}>
                {formatDate(task.createdAt)}
              </Text>
            </View>
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm }}>Atualizado em</Text>
              <Text style={{ color: colors.text, fontSize: fontSize.sm, fontWeight: '600' }}>
                {formatDate(task.updatedAt)}
              </Text>
            </View>
          </View>

          {/* Botão excluir */}
          <CustomButton
            title="Excluir Tarefa"
            onPress={handleDeletePress}
            variant="danger"
            loading={deleting}
            fullWidth
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
