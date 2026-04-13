import { Tabs } from 'expo-router';
import { PlayerProvider } from '../context/PlayerContext';
import MiniPlayer from '../components/MiniPlayer';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <PlayerProvider>
      <Tabs screenOptions={{ 
        headerShown: false,
        tabBarStyle: { backgroundColor: '#121212', borderTopColor: '#333' },
        tabBarActiveTintColor: '#1DB954', // Cor verde estilo Spotify
      }}>
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Início',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
          }} 
        />
        <Tabs.Screen 
          name="buscar" 
          options={{ 
            title: 'Buscar',
            tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />
          }} 
        />
        <Tabs.Screen 
          name="biblioteca" 
          options={{ 
            title: 'Sua Biblioteca',
            tabBarIcon: ({ color }) => <Ionicons name="library" size={24} color={color} />
          }} 
        />
      </Tabs>
      <MiniPlayer />
    </PlayerProvider>
  );
}