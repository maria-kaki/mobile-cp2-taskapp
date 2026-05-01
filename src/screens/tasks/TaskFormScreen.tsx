import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { useTasks } from '../../hooks/useTasks';
import { useResponsive } from '../../hooks/useResponsive';
import { api } from '../../services/api';
import type { TaskFormScreenProps } from '../../types/navigation';
import type { TaskStatus, TaskPriority, Category } from '../../types/task';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pendente', label: '⏳ Pendente' },
  { value: 'em_andamento', label: '🔄 Em Andamento' },
  { value: 'concluida', label: '✅ Concluída' },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'baixa', label: '🟢 Baixa' },
  { value: 'media', label: '🟡 Média' },
  { value: 'alta', label: '🔴 Alta' },
];

export function TaskFormScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<TaskFormScreenProps['navigation']>();
  const route = useRoute<TaskFormScreenProps['route']>();
  const { createTask, updateTask, getTaskById } = useTasks();
  const { horizontalPadding, fontSize, isMobile } = useResponsive();

  const taskId = route.params?.taskId;
  const isEditing = !!taskId;
  const existingTask = taskId ? getTaskById(taskId) : undefined;

  const [title, setTitle] = useState(existingTask?.title ?? '');
  const [description, setDescription] = useState(existingTask?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(existingTask?.status ?? 'pendente');
  const [priority, setPriority] = useState<TaskPriority>(existingTask?.priority ?? 'media');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError(false);
    try {
      const cats = await api.getCategories();
      setCategories(cats);
      // Ao editar, pré-seleciona a categoria existente
      if (existingTask) {
        const found = cats.find((c) => c.name === existingTask.category);
        if (found) setSelectedCategory(found);
      }
    } catch {
      setCategoriesError(true);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    fetchCategories();
  }, []);

  const validateTitle = (val: string) => {
    const newErrors = { ...errors };
    if (!val.trim()) newErrors.title = 'O título é obrigatório.';
    else if (val.trim().length < 3) newErrors.title = 'Mínimo de 3 caracteres.';
    else delete newErrors.title;
    setErrors(newErrors);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'O título é obrigatório.';
    else if (title.trim().length < 3) newErrors.title = 'Mínimo de 3 caracteres.';
    if (!selectedCategory) newErrors.category = 'Selecione uma categoria.';
    setErrors(newErrors);
    setTouched({ title: true, category: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (isEditing && taskId) {
        await updateTask(taskId, {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          category: selectedCategory!.name,
          categoryIcon: selectedCategory!.icon ?? '📌',
        });
        Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!');
      } else {
        await createTask({
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          category: selectedCategory!.name,
          categoryIcon: selectedCategory!.icon ?? '📌',
        });
        Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
      }
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={colors.background === '#0f172a' ? 'light-content' : 'dark-content'} />

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
        <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '700', flex: 1 }}>
          {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: horizontalPadding,
          paddingBottom: 80,
          alignItems: isMobile ? undefined : 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim, width: '100%', maxWidth: isMobile ? undefined : 680 }}>

          <CustomInput
            label="Título *"
            placeholder="Ex: Estudar para a prova"
            value={title}
            onChangeText={(v) => { setTitle(v); if (touched.title) validateTitle(v); }}
            onBlur={() => { setTouched((t) => ({ ...t, title: true })); validateTitle(title); }}
            error={touched.title ? errors.title : ''}
          />

          <CustomInput
            label="Descrição"
            placeholder="Descreva a tarefa..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />

          {/* Status */}
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: 8 }}>
            Status
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setStatus(opt.value)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
                  backgroundColor: status === opt.value ? colors.primary : colors.surface,
                  borderWidth: 1.5, borderColor: status === opt.value ? colors.primary : colors.border,
                }}
              >
                <Text style={{ color: status === opt.value ? '#fff' : colors.text, fontWeight: '600', fontSize: fontSize.sm }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Prioridade */}
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: 8 }}>
            Prioridade
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {PRIORITY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setPriority(opt.value)}
                style={{
                  flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
                  backgroundColor: priority === opt.value ? colors.primary : colors.surface,
                  borderWidth: 1.5, borderColor: priority === opt.value ? colors.primary : colors.border,
                }}
              >
                <Text style={{ color: priority === opt.value ? '#fff' : colors.text, fontWeight: '600', fontSize: fontSize.xs }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Categoria — vem da API */}
          <Text style={{ color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: 8 }}>
            Categoria *
          </Text>
          {errors.category && touched.category ? (
            <Text style={{ color: colors.error, fontSize: fontSize.xs, marginBottom: 8 }}>
              ⚠️ {errors.category}
            </Text>
          ) : null}

          {categoriesLoading ? (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <ActivityIndicator color={colors.primary} size="small" />
              <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginTop: 8 }}>
                Carregando categorias...
              </Text>
            </View>
          ) : categoriesError ? (
            <TouchableOpacity
              onPress={fetchCategories}
              style={{
                padding: 14, borderRadius: 10, borderWidth: 1,
                borderColor: colors.error, alignItems: 'center', marginBottom: 16,
              }}
            >
              <Text style={{ color: colors.error, fontSize: fontSize.sm, fontWeight: '600' }}>
                Erro ao carregar. Toque para tentar novamente.
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory?.name === cat.name;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setErrors((e) => { const n = { ...e }; delete n.category; return n; });
                    }}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 6,
                      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
                      backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                      borderWidth: 1.5, borderColor: isSelected ? colors.primary : colors.border,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
                    <Text style={{ color: isSelected ? colors.primary : colors.text, fontWeight: '600', fontSize: fontSize.sm }}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <CustomButton
            title={isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
            onPress={handleSave}
            loading={saving}
            fullWidth
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
