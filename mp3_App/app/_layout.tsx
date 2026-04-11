import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
// Certifique-se de que estes arquivos existam nas pastas indicadas
import { PlayerProvider } from '../context/PlayerContext';
import MiniPlayer from '../components/MiniPlayer';

// Definindo os tipos dos ícones para o TypeScript não reclamar
type IconName = keyof typeof Ionicons.glyphMap;

export default function RootLayout() {
  return (
    <PlayerProvider>
      <View style={styles.container}>
        <Tabs
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#A78BFA',
            tabBarInactiveTintColor: '#6B7280',
            tabBarLabelStyle: styles.tabLabel,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: IconName;

              // Mapeamento de ícones baseado no nome da rota
              const icons: Record<string, { active: IconName; inactive: IconName }> = {
                index: { active: 'home', inactive: 'home-outline' },
                buscar: { active: 'search', inactive: 'search-outline' },
                biblioteca: { active: 'library', inactive: 'library-outline' },
                sobre: { active: 'information-circle', inactive: 'information-circle-outline' },
              };

              const currentIcon = icons[route.name] || icons.index;
              iconName = focused ? currentIcon.active : currentIcon.inactive;

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tabs.Screen name="index" options={{ title: 'Início' }} />
          <Tabs.Screen name="buscar" options={{ title: 'Buscar' }} />
          <Tabs.Screen name="biblioteca" options={{ title: 'Biblioteca' }} />
          <Tabs.Screen name="sobre" options={{ title: 'Sobre' }} />
        </Tabs>

        {/* MiniPlayer posicionado acima da TabBar */}
        <View style={styles.miniPlayerWrapper} pointerEvents="box-none">
          <MiniPlayer />
        </View>
      </View>
    </PlayerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  tabBar: {
    backgroundColor: '#1E293B',
    borderTopColor: '#334155',
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 5,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  miniPlayerWrapper: {
    position: 'absolute',
    bottom: 60, // Altura da TabBar para não ficar por cima
    left: 0,
    right: 0,
    pointerEvents: 'box-none',
  },
});