import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definição das paletas de cores disponíveis (Gradientes)
export const PALETTES = {
  purpleNeon: ['#0f1123', '#1a1c3d'], // O padrão atual do seu app
  blueMidnight: ['#040a12', '#0a192f'], // Azul escuro profundo
  cyberpunk: ['#120118', '#2a043a'], // Roxo com fundo avermelhado/neon
  deepBlack: ['#000000', '#111111'], // Totalmente escuro / AMOLED
};

type ThemeContextType = {
  currentTheme: string;
  themeColors: string[];
  changeTheme: (themeName: keyof typeof PALETTES) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<keyof typeof PALETTES>('purpleNeon');

  // Carrega o tema salvo no AsyncStorage assim que o app inicia
  useEffect(() => {
    async function loadSavedTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem('@mp3app:theme');
        if (savedTheme && savedTheme in PALETTES) {
          setCurrentTheme(savedTheme as keyof typeof PALETTES);
        }
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
      }
    }
    loadSavedTheme();
  }, []);

  // Função para mudar o tema e salvar a escolha localmente
  const changeTheme = async (themeName: keyof typeof PALETTES) => {
    try {
      setCurrentTheme(themeName);
      await AsyncStorage.setItem('@mp3app:theme', themeName);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themeColors: PALETTES[currentTheme],
      changeTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}