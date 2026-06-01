import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { PlayerProvider } from '../context/PlayerContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext'; // Importando o tema
import MiniPlayer from '../components/MiniPlayer';
import { Ionicons } from '@expo/vector-icons';

// Criamos um componente interno para aplicar o estilo correto baseado no tema ativo
function NavigationTabs() {
  const { themeColors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Esconde aquela barra superior padrão feia
        tabBarActiveTintColor: '#8a2be2', // Cor do ícone ativo (Roxo)
        tabBarInactiveTintColor: '#6e7191', // Cor do ícone inativo
        tabBarStyle: {
          backgroundColor: '#131424', // Cor de fundo da barra inferior
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.05)',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          position: 'absolute', // Deixa a barra flutuando sobre o gradiente da tela
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

// Layout principal que envolve o app com os Providers
export default function RootLayout() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          
          {/* Renderiza a navegação por abas que corrigimos */}
          <NavigationTabs />
          
          {/* O MiniPlayer continua fixo logo acima da barra de abas */}
          <View style={styles.playerWrapper}>
            <MiniPlayer />
          </View>
        </View>
      </PlayerProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  playerWrapper: {
    position: 'absolute',
    bottom: 60, // Posiciona o miniplayer exatamente ACIMA da barra de navegação (que tem altura 60)
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
});