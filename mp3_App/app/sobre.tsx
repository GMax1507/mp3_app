import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Sobre() {
  return (
    <LinearGradient colors={['#0f1123', '#1a1c3d']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          
          {/* USANDO SUA LOGO OFICIAL */}
          <Image 
            source={require('../assets/icon.png')} 
            style={styles.logo} 
          />
          
          <Text style={styles.title}>Music App</Text>
          
          <Text style={styles.description}>
            Seu aplicativo de streaming definitivo. Desfrute de uma experiência auditiva premium com qualidade de som excepcional.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.version}>Versão 1.0.0</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  logo: { 
    width: 150, 
    height: 150, 
    borderRadius: 35, // Bordas arredondadas para combinar com seus cards
    marginBottom: 25 
  },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
  description: { 
    color: 'rgba(255,255,255,0.7)', 
    textAlign: 'center', 
    fontSize: 16, 
    lineHeight: 24 
  },
  footer: { marginTop: 40 },
  version: { color: 'rgba(255,255,255,0.3)', fontSize: 14 }
});