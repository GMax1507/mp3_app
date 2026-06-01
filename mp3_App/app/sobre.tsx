import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, PALETTES } from '../context/ThemeContext'; // Importando o controle de temas

export default function Sobre() {
  // Consumindo o tema atual e a função para mudar o tema
  const { themeColors, currentTheme, changeTheme } = useTheme();

  // Nomes amigáveis para exibir na tela para cada paleta
  const themeNames: Record<string, string> = {
    purpleNeon: 'Roxo Neon',
    blueMidnight: 'Azul Noturno',
    cyberpunk: 'Cyberpunk',
    deepBlack: 'Preto AMOLED',
  };

  return (
    // Agora o LinearGradient usa as cores dinâmicas vindas do contexto!
    <LinearGradient colors={themeColors} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* IDENTIDADE VISUAL DO APP */}
          <View style={styles.logoContainer}>
            {/* Sua logo oficial (barras de áudio brancas) */}
            <Image 
              source={require('../assets/icon.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={styles.appName}>MP3_APP</Text>
            <Text style={styles.version}>Versão 1.2 (Beta)</Text>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Sobre o Desenvolvedor</Text>
            <Text style={styles.description}>
              Aplicativo desenvolvido por Gabriel Cunha Maximiano para a disciplina de Linguagem de Técnicas de Programação IV (LTP4), sob a orientação do Professor Marcos no IFTO.
            </Text>
          </View>

          {/* SEÇÃO DE CUSTOMIZAÇÃO DE INTERFACE */}
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Customização da Interface</Text>
            <Text style={styles.subDescription}>
              Escolha uma paleta de cores para aplicar em todo o aplicativo:
            </Text>

            <View style={styles.themesGrid}>
              {(Object.keys(PALETTES) as Array<keyof typeof PALETTES>).map((key) => {
                const isSelected = currentTheme === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.themeButton,
                      isSelected && styles.themeButtonSelected
                    ]}
                    onPress={() => changeTheme(key)}
                  >
                    {/* Pequena prévia visual do gradiente dentro do botão */}
                    <LinearGradient
                      colors={PALETTES[key]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.previewCircle}
                    />
                    <Text style={[styles.themeLabel, isSelected && styles.themeLabelSelected]}>
                      {themeNames[key]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', paddingBottom: 100 },
  logoContainer: { alignItems: 'center', marginVertical: 30 },
  logo: { width: 100, height: 100, marginBottom: 15 },
  appName: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  version: { color: '#6e7191', fontSize: 14, marginTop: 5 },
  cardInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)'
  },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { color: '#cbd5e1', fontSize: 14, lineHeight: 22, textAlign: 'justify' },
  subDescription: { color: '#6e7191', fontSize: 13, marginBottom: 15 },
  themesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  themeButton: {
    width: '48%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  themeButtonSelected: { borderColor: '#8a2be2', backgroundColor: 'rgba(138, 43, 226, 0.1)' },
  previewCircle: { width: 40, height: 40, borderRadius: 20, marginBottom: 8 },
  themeLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '500' },
  themeLabelSelected: { color: 'white', fontWeight: 'bold' }
});