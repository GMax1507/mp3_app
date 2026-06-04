import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 1. Alterado o import para usar a API estável legada compatível com SDK 54+
import * as FileSystem from 'expo-file-system/legacy';

const PlayerContext = createContext<any>(null);

export const PlayerProvider = ({ children }: any) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recentTracks, setRecentTracks] = useState<any[]>([]);

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

  // Gera o caminho local permanente do arquivo de áudio
  const getLocalTrackUri = (trackId: string) => {
    return `${FileSystem.documentDirectory}track_${trackId}.mp3`;
  };

  // Função principal de reprodução
  async function playTrack(track: any) {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const localUri = getLocalTrackUri(track.id);
      
      // Valida se o arquivo já existe fisicamente no celular usando a API estável
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      
      let sourceUri = track.audio;

      if (fileInfo.exists) {
        sourceUri = localUri;
        console.log("SUCESSO: Tocando música localmente em modo OFFLINE!");
      } else {
        console.log("Tocando via streaming ONLINE e baixando cache...");
        downloadTrackInBackground(track);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: sourceUri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);

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

  // Realiza o download em background para persistência física do arquivo
  async function downloadTrackInBackground(track: any) {
    try {
      const localUri = getLocalTrackUri(track.id);
      const fileInfo = await FileSystem.getInfoAsync(localUri);

      if (!fileInfo.exists && track.audio) {
        console.log(`Iniciando download de: ${track.name}`);
        await FileSystem.downloadAsync(track.audio, localUri);
        console.log(`Concluído! ${track.name} está pronta para uso offline.`);
      }
    } catch (err) {
      console.log("Erro no download em background:", err);
    }
  }

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

  async function toggleFavorite(track: any) {
    const currentFavs = favorites || [];
    const isFav = currentFavs.find(f => f.id === track.id);
    let newFavorites;

    if (isFav) {
      newFavorites = currentFavs.filter(f => f.id !== track.id);
    } else {
      newFavorites = [...currentFavs, track];
      downloadTrackInBackground(track);
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