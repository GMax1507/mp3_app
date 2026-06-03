import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlayerContext = createContext<any>(null);

export const PlayerProvider = ({ children }: any) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Inicializa como arrays vazios para evitar erros de leitura antes do carregamento do storage
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recentTracks, setRecentTracks] = useState<any[]>([]);

  // 1. Carrega os dados salvos no celular ao abrir o app
  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const savedFavs = await AsyncStorage.getItem('@favorites');
      const savedRecents = await AsyncStorage.getItem('@recent_tracks');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      if (savedRecents) setRecentTracks(JSON.parse(savedRecents));
    } catch (e) {
      console.log("Erro ao carregar dados", e);
    }
  }

  // 2. Função para dar Play e salvar nos Recentes (Com suporte ao Modo Offline)
  async function playTrack(track: any) {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      // Ativando o download prévio e cache local do streaming de áudio
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.audio },
        { 
          shouldPlay: true,
          // --- ATIVAÇÃO DO MODO OFFLINE ---
          // Força o ecossistema do Expo a baixar a faixa para o armazenamento temporário enquanto toca
          downloadFirst: true 
        }
      );

      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);

      // Lógica de Recentes: Adiciona no topo, remove se já existia e limita a 10 músicas
      const filteredRecents = (recentTracks || []).filter(t => t.id !== track.id);
      const newRecents = [track, ...filteredRecents].slice(0, 10);
      
      setRecentTracks(newRecents);
      await AsyncStorage.setItem('@recent_tracks', JSON.stringify(newRecents));

      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) setIsPlaying(false);
      });
    } catch (e) {
      console.log("Erro ao tocar música", e);
    }
  }

  // 3. Função Play/Pause
  async function togglePlayPause() {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }

  // 4. Função Curtir/Descurtir
  async function toggleFavorite(track: any) {
    const currentFavs = favorites || [];
    const isFav = currentFavs.find(f => f.id === track.id);
    let newFavorites;

    if (isFav) {
      newFavorites = currentFavs.filter(f => f.id !== track.id);
    } else {
      newFavorites = [...currentFavs, track];
    }

    setFavorites(newFavorites);
    await AsyncStorage.setItem('@favorites', JSON.stringify(newFavorites));
  }

  return (
    <PlayerContext.Provider value={{ 
      currentTrack, 
      isPlaying, 
      playTrack, 
      togglePlayPause, 
      favorites, 
      toggleFavorite,
      recentTracks 
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);