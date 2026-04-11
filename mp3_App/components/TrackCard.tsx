import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JamendoTrack } from '../services/jamendoApi';
import { usePlayer } from '../context/PlayerContext';

// Função para gerar cor de fundo caso não tenha imagem de álbum
function stringToColor(str: string) {
  const colors = ['#4C1D95', '#1E3A5F', '#7C3AED', '#065F46', '#9D174D', '#1E40AF'];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

interface Props { 
  track: JamendoTrack; 
  showNumber?: number; 
}

const TrackCard: React.FC<Props> = ({ track, showNumber }) => {
  const { playTrack, currentTrack, isPlaying, pauseResume, queue, setQueue } = usePlayer();
  
  const isCurrent = currentTrack?.id === track.id;

  const handlePlay = async () => {
    // Se for a música atual, apenas pausa ou retoma
    if (isCurrent) {
      await pauseResume();
      return;
    }

    // Se não estiver na fila atual, podemos atualizar a fila (opcional)
    if (!queue.find(t => t.id === track.id)) {
      setQueue([...queue, track]);
    }

    // Toca a música selecionada
    await playTrack(track);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, isCurrent && styles.activeContainer]} 
      onPress={handlePlay} 
      activeOpacity={0.7}
    >
      {showNumber !== undefined && (
        <Text style={[styles.number, isCurrent && styles.activeNumber]}>
          {isCurrent && isPlaying ? '♪' : showNumber}
        </Text>
      )}

      <View style={[styles.thumb, { backgroundColor: stringToColor(track.id) }]}>
        {track.album_image ? (
          <Image source={{ uri: track.album_image }} style={styles.thumbImage} />
        ) : (
          <Ionicons name="musical-note" size={20} color="#fff" />
        )}
      </View>

      <View style={styles.info}>
        <Text 
          style={[styles.title, isCurrent && styles.activeTitle]} 
          numberOfLines={1}
        >
          {track.name}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist_name}
        </Text>
      </View>

      <View style={styles.playBtn}>
        <Ionicons
          name={isCurrent && isPlaying ? 'pause-circle' : 'play-circle'}
          size={38}
          color={isCurrent ? '#A78BFA' : '#334155'}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#1E293B', 
    borderRadius: 12,
    padding: 10, 
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeContainer: {
    borderColor: '#334155',
    backgroundColor: '#1e293bca',
  },
  number: { 
    width: 24, 
    color: '#64748B', 
    fontSize: 14, 
    fontWeight: '700', 
    textAlign: 'center', 
    marginRight: 8 
  },
  activeNumber: { color: '#A78BFA' },
  thumb: { 
    width: 50, 
    height: 50, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden', 
    marginRight: 12 
  },
  thumbImage: { width: 50, height: 50 },
  info: { flex: 1 },
  title: { color: '#F1F5F9', fontSize: 14, fontWeight: '700', marginBottom: 2 },
  activeTitle: { color: '#A78BFA' },
  artist: { color: '#94A3B8', fontSize: 12 },
  playBtn: { paddingLeft: 8 },
});

export default TrackCard;