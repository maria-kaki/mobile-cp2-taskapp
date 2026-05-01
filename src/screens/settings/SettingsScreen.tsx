import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StatusBar, Animated } from 'react-native';
import { Header } from '../../components/Header';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useResponsive } from '../../hooks/useResponsive';
import type { TreatmentPrefix } from '../../types/user';

const TREATMENT_OPTIONS: TreatmentPrefix[] = ['Sr.', 'Sra.', 'Srta.'];

export function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, treatment, setTreatment } = useAuth();
  const { horizontalPadding, fontSize, isMobile } = useResponsive();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={colors.background === '#0f172a' ? 'light-content' : 'dark-content'} />
      <Header title="Configurações" />

      <ScrollView contentContainerStyle={{
        padding: horizontalPadding, paddingBottom: 40,
        alignItems: isMobile ? undefined : 'center',
      }}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%', maxWidth: isMobile ? undefined : 680, gap: 16 }}>

          {/* Perfil */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', marginBottom: 14, textTransform: 'uppercase' }}>
              Perfil
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24 }}>{user?.role === 'admin' ? '👑' : '👤'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700' }}>{user?.name}</Text>
                <Text style={{ color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 }}>@{user?.username}</Text>
              </View>
              <View style={{
                backgroundColor: user?.role === 'admin' ? colors.primaryLight : colors.surfaceVariant,
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
              }}>
                <Text style={{ color: user?.role === 'admin' ? colors.primary : colors.textSecondary, fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase' }}>
                  {user?.role}
                </Text>
              </View>
            </View>
          </View>

          {/* Tratamento */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', marginBottom: 14, textTransform: 'uppercase' }}>
              Preferência de Tratamento
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {TREATMENT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setTreatment(opt)}
                  style={{
                    flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center',
                    backgroundColor: treatment === opt ? colors.primary : colors.surfaceVariant,
                    borderWidth: 1.5, borderColor: treatment === opt ? colors.primary : colors.border,
                  }}
                >
                  <Text style={{ color: treatment === opt ? '#fff' : colors.textSecondary, fontWeight: '700', fontSize: fontSize.md }}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tema */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', marginBottom: 14, textTransform: 'uppercase' }}>
              Aparência
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 24 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
                <View>
                  <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '600' }}>
                    Tema {theme === 'dark' ? 'Escuro' : 'Claro'}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginTop: 2 }}>Salvo automaticamente</Text>
                </View>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Info */}
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>✅</Text>
            <Text style={{ color: colors.text, fontSize: fontSize.md, fontWeight: '700' }}>TaskApp</Text>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.xs, marginTop: 4 }}>Versão 1.0.0</Text>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}
