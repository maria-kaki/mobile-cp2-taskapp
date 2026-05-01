import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { useResponsive } from '../../hooks/useResponsive';
import type { RootStackParamList } from '../../types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function LoginScreen() {
  const { colors } = useTheme();
  const { login } = useAuth();
  const navigation = useNavigation<Nav>();
  const { horizontalPadding, fontSize, isMobile } = useResponsive();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({ username: false, password: false });

  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(formAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validateUsername = (val: string) => {
    setUsernameError(!val.trim() ? 'O usuário é obrigatório.' : '');
  };

  const validatePassword = (val: string) => {
    if (!val.trim()) setPasswordError('A senha é obrigatória.');
    else if (val.length < 3) setPasswordError('Mínimo de 3 caracteres.');
    else setPasswordError('');
  };

  const handleLogin = async () => {
    setTouched({ username: true, password: true });
    validateUsername(username);
    validatePassword(password);
    if (!username.trim() || !password.trim() || password.length < 3) {
      shakeForm();
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await login(username.trim(), password.trim());
      if (!result.success) {
        setError(result.error ?? 'Erro ao fazer login.');
        shakeForm();
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={colors.background === '#0f172a' ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: horizontalPadding,
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: '100%', maxWidth: isMobile ? 480 : 560 }}>
          <Animated.View
            style={{
              alignItems: 'center',
              marginBottom: 40,
              opacity: logoAnim,
              transform: [{ translateY: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
            }}
          >
            <View
              style={{
                width: 80, height: 80, borderRadius: 24,
                backgroundColor: colors.primary,
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
              }}
            >
              <Text style={{ fontSize: 36 }}>✅</Text>
            </View>
            <Text style={{ color: colors.text, fontSize: fontSize.hero, fontWeight: '800', letterSpacing: -0.5 }}>
              TaskApp
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: fontSize.md, marginTop: 6 }}>
              Gerencie suas tarefas com eficiência
            </Text>
          </Animated.View>

          <Animated.View
            style={{
              opacity: formAnim,
              transform: [
                { translateX: shakeAnim },
                { translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
              ],
            }}
          >
            <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.text, fontSize: fontSize.xl, fontWeight: '700', marginBottom: 20 }}>Entrar</Text>

              <CustomInput
                label="Usuário"
                placeholder="Digite seu usuário"
                value={username}
                onChangeText={(v) => { setUsername(v); if (touched.username) validateUsername(v); }}
                onBlur={() => { setTouched((t) => ({ ...t, username: true })); validateUsername(username); }}
                error={touched.username ? usernameError : ''}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <CustomInput
                label="Senha"
                placeholder="Digite sua senha"
                value={password}
                onChangeText={(v) => { setPassword(v); if (touched.password) validatePassword(v); }}
                onBlur={() => { setTouched((t) => ({ ...t, password: true })); validatePassword(password); }}
                error={touched.password ? passwordError : ''}
                secureTextEntry={!showPassword}
                rightIcon={<Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>}
                onRightIconPress={() => setShowPassword((s) => !s)}
              />

              {error ? (
                <View style={{ backgroundColor: '#fef2f2', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#fecaca' }}>
                  <Text style={{ color: colors.error, fontSize: fontSize.sm, fontWeight: '500' }}>⚠️ {error}</Text>
                </View>
              ) : null}

              <CustomButton title="Entrar" onPress={handleLogin} loading={loading} fullWidth />
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
