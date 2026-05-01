# Taskapp
Aplicativo de gerenciamento de tarefas desenvolvido em React Native com Expo. O app permite criar, visualizar e organizar tarefas do dia a dia, com interface intuitiva e navegação fluida. Projeto desenvolvido como Checkpoint 2 da disciplina de Desenvolvimento Mobile.

**Grupo:**
- Fabiano Zague - 555524
- Lorran dos Santos - 558982
- Maria Clara - 557478
- Pedro Certo - 556268
- Vinicius Matareli - 555200

## Como rodar o projeto

Execute os comandos abaixo **na ordem indicada**:

```bash
# 1. Instalar dependências do projeto
npm install

# 2. Instalar suporte a áreas seguras (notch, barra de status, etc.)
npm i react-native-safe-area-context

# 3. Instalar plugin de resolução de módulos (paths absolutos)
npm install --save-dev babel-plugin-module-resolver

# 4. Instalar runtime do Metro para Expo
npx expo install @expo/metro-runtime

# 5. Instalar suporte à versão web
npx expo install react-dom react-native-web
```

## Executando

**No navegador (Web):**
```bash
npx expo start --web --clear
```

**No Android Studio:**
```bash
npx expo start
```
> Com o emulador Android aberto, pressione **A** no terminal para abrir o app no Android Studio.

## 🛠️ Tecnologias

- React Native
- Expo
- React Native Web
