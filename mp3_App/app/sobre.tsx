import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Sobre() {
  return (
    <LinearGradient colors={['#0f1123', '#1a1c3d']} style={styles.container}>
      <LinearGradient colors={['#a044ff', '#6a5ae0']} style={styles.logoContainer}>
         <Image source={require('../assets/icon.png')} style={styles.logoIcon} />
      </LinearGradient>
      
      <Text style={styles.title}>Sobre</Text>
      <Text style={styles.description}>
        Music App é um aplicativo de streaming de música que oferece milhões de faixas, 
        playlists personalizadas e descoberta musical baseada em seus gostos. 
        Desfrute de uma experiência auditiva premium com qualidade de som excepcional.
      </Text>
      
      <Text style={styles.version}>Versão 1.0.0</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  logoContainer: { width: 120, height: 120, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  logoIcon: { width: 60, height: 60, tintColor: 'white' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  description: { color: '#a0a3bd', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  version: { color: '#5e617d', marginTop: 40 }
});