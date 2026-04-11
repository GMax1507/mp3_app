import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { JamendoTrack } from '../services/jamendoApi';
import { Alert } from 'react-native';

interface PlayerContextType {
  currentTrack: JamendoTrack | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  likedTracks: JamendoTrack[];
  recentTracks: JamendoTrack[];
  queue: JamendoTrack[];
  playTrack: (track: JamendoTrack) => Promise<void>;
  pauseResume: () => Promise<void>;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (millis: number) => void;
  toggleLike: (track: JamendoTrack) => void;
  isLiked: (trackId: string) => boolean;
  setQueue: (tracks: JamendoTrack[]) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be inside PlayerProvider');
  return ctx;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<JamendoTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likedTracks, setLikedTracks] = useState<JamendoTrack[]>([]);
  const [recentTracks, setRecentTracks] = useState<JamendoTrack[]>([]);
  const [queue, setQueue] = useState<JamendoTrack[]>([]);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Verifica se o módulo nativo está disponível para evitar o erro ExponentAV
        if (Audio) {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false, // Desativado temporariamente para evitar erro de permissão
            shouldDuckAndroid: true,
          });
        }
      } catch (e) {
        console.log("Erro ao configurar áudio nativo:", e);
      }
    };
    setupAudio();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const playTrack = useCallback(async (track: JamendoTrack) => {
    try {
      if (!track.audio) {
        Alert.alert("Erro", "Esta música não possui um link de áudio válido.");
        return;
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audio },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);
            
            // Tocar próxima música automaticamente ao acabar
            if (status.didJustFinish) {
              nextTrack();
            }
          }
        }
      );

      soundRef.current = sound;
      setCurrentTrack(track);
      setIsPlaying(true);
      setRecentTracks(prev => [track, ...prev.filter(t => t.id !== track.id)].slice(0, 20));
    } catch (e) {
      console.error('playTrack error:', e);
      Alert.alert("Erro de Reprodução", "Não foi possível carregar o áudio. Tente novamente.");
    }
  }, []);

  const pauseResume = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch (e) {
      console.error("Erro ao pausar/retomar:", e);
    }
  }, [isPlaying]);

  const seekTo = useCallback(async (millis: number) => {
    try {
      await soundRef.current?.setPositionAsync(millis);
    } catch (e) {
      console.error("Erro ao avançar áudio:", e);
    }
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    const next = queue[(idx + 1) % queue.length];
    if (next) playTrack(next);
  }, [currentTrack, queue, playTrack]);

  const prevTrack = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    const prev = queue[(idx - 1 + queue.length) % queue.length];
    if (prev) playTrack(prev);
  }, [currentTrack, queue, playTrack]);

  const toggleLike = useCallback((track: JamendoTrack) => {
    setLikedTracks(prev =>
      prev.find(t => t.id === track.id)
        ? prev.filter(t => t.id !== track.id)
        : [track, ...prev]
    );
  }, []);

  const isLiked = useCallback((id: string) => likedTracks.some(t => t.id === id), [likedTracks]);

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, position, duration,
      likedTracks, recentTracks, queue,
      playTrack, pauseResume, nextTrack, prevTrack,
      seekTo, toggleLike, isLiked, setQueue,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};