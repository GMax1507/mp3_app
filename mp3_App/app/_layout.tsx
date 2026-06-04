import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
// Importação dos componentes de Área Segura recomendados pela documentação
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PlayerProvider } from '../context/PlayerContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext'; 
import MiniPlayer from '../components/MiniPlayer';
import { Ionicons } from '@expo/vector-icons';

// Componente interno com as configurações de estilo baseadas na área segura
function NavigationTabs() {
  const { themeColors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: '#8a2be2', 
        tabBarInactiveTintColor: '#6e7191', 
        tabBarStyle: {
          backgroundColor: '#131424', 
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.05)',
          height: 65, // Aumentado levemente para melhor ergonomia de toque
          paddingBottom: 8,
          paddingTop: 8,
          position: 'absolute', 
          bottom: 0,
          left: 0,
          right: 0,
        },
      }}
    >
      {/* Tela Principal (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Tela de Busca */}
      <Tabs.Screen
        name="buscar"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      {/* Tela da Biblioteca */}
      <Tabs.Screen
        name="biblioteca"
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes" size={size} color={color} />
          ),
        }}
      />

      {/* Tela Sobre */}
      <Tabs.Screen
        name="sobre"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// Layout principal que envolve o app com os Providers e com a Área Segura
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* O SafeAreaView garante o recuo contra botões virtuais ou notches físicos */}
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'top']}>
        <ThemeProvider>
          <PlayerProvider>
            <View style={styles.container}>
              <StatusBar style="light" />
              
              {/* Renderiza a navegação por abas */}
              <NavigationTabs />
              
              {/* O MiniPlayer acompanha o novo alinhamento da barra de abas (altura 65) */}
              <View style={styles.playerWrapper}>
                <MiniPlayer />
              </View>
            </View>
          </PlayerProvider>
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000', // Garante que as áreas extras do sistema fiquem pretas
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  playerWrapper: {
    position: 'absolute',
    bottom: 65, // Ajustado para 65 para sincronizar perfeitamente com a nova altura da aba
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
});