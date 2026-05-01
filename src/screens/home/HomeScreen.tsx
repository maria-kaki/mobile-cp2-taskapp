import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, StatusBar, Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Header } from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { useResponsive } from '../../hooks/useResponsive';
import { api } from '../../services/api';
import type { TabParamList } from '../../types/navigation';

type Nav = BottomTabNavigationProp<TabParamList>;
interface Quote { content: string; author: string; }

export function HomeScreen() {
  const { colors } = useTheme();
  const { user, treatment } = useAuth();
  const { totalCount, pendingCount, inProgressCount, completedCount } = useTasks();
  const navigation = useNavigation<Nav>();
  const { horizontalPadding, fontSize, isMobile, isTablet } = useResponsive();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    setQuoteError(false);
    try {
      const q = await api.getMotivationalQuote();
      setQuote(q);
    } catch {
      setQuoteError(true);
    } finally {
      setQuoteLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setQuoteLoading(true);
    await fetchQuote();
    setRefreshing(false);
  };

  const stats = [
    { label: 'Total',        value: totalCount,       color: colors.primary },
    { label: 'Pendentes',    value: pendingCount,      color: colors.warning },
    { label: 'Em Andamento', value: inProgressCount,   color: colors.info    },
    { label: 'Concluídas',   value: completedCount,    color: colors.success },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={colors.background === '#0f172a' ? 'light-content' : 'dark-content'} />
      <Header />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={{
          paddingBottom: 32,
          alignItems: isMobile ? undefined : 'center',
        }}
      >
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          width: '100%',
          maxWidth: isMobile ? undefined : 680,
          paddingHorizontal: horizontalPadding,
        }}>

          {/* Boas-vindas */}
          <View style={{ paddingTop: 24, marginBottom: 20 }}>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, fontWeight: '500' }}>
              Bem-vindo(a),
            </Text>
            <Text style={{ color: colors.text, fontSize: fontSize.xxl, fontWeight: '800', letterSpacing: -0.5 }}>
              {treatment} {user?.name} 👋
            </Text>
          </View>

          {/* Frase do dia */}
          <View style={{
            backgroundColor: colors.primary, borderRadius: 20, padding: 20,
            marginBottom: 24,
            shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: fontSize.xs, fontWeight: '600', marginBottom: 8 }}>
              💡 FRASE DO DIA
            </Text>
            {quoteLoading ? (
              <ActivityIndicator color="#fff" />
            ) : quoteError ? (
              <TouchableOpacity onPress={fetchQuote}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: fontSize.md }}>
                  Erro ao carregar. Toque para tentar novamente.
                </Text>
              </TouchableOpacity>
            ) : quote ? (
              <>
                <Text style={{ color: '#fff', fontSize: fontSize.md, fontWeight: '600', lineHeight: 22, marginBottom: 10 }}>
                  "{quote.content}"
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: fontSize.sm }}>
                  — {quote.author}
                </Text>
              </>
            ) : null}
          </View>

          {/* Resumo */}
          <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: 14 }}>
            Resumo das tarefas
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            {stats.map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  minWidth: isTablet ? '20%' : '44%',
                  backgroundColor: colors.surface,
                  borderRadius: 16, padding: 16,
                  borderWidth: 1, borderColor: colors.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: stat.color, fontSize: isTablet ? 36 : 28, fontWeight: '800' }}>
                  {stat.value}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '500', marginTop: 4 }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Ações rápidas */}
          <Text style={{ color: colors.text, fontSize: fontSize.lg, fontWeight: '700', marginBottom: 14 }}>
            Ações rápidas
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Tasks')}
            activeOpacity={0.8}
            style={{
              backgroundColor: colors.surface, borderRadius: 16, padding: 18,
              flexDirection: 'row', alignItems: 'center',
              borderWidth: 1, borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 24, marginRight: 14 }}>📝</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700' }}>Ver Tarefas</Text>
              <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 }}>
                {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
              </Text>
            </View>
            <Text style={{ color: colors.textMuted, fontSize: 18 }}>›</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </View>
  );
}
