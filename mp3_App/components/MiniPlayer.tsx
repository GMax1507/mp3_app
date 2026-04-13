import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, favorites, toggleFavorite } = usePlayer();

  if (!currentTrack) return null;

  // Verifica se a música atual está na lista de favoritos
  const isLiked = favorites.some((f: any) => f.id === currentTrack.id);

  return (
    <View style={styles.outerContainer}>
      <LinearGradient colors={['#2a2d5a', '#1a1c3d']} style={styles.container}>
        <Image source={{ uri: currentTrack.album_image }} style={styles.thumb} />
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.name}</Text>
          <Text style={styles.artist}>{currentTrack.artist_name}</Text>
        </View>

        <View style={styles.controls}>
          {/* BOTÃO CURTIR FUNCIONAL */}
          <TouchableOpacity 
            style={styles.heartBtn} 
            onPress={() => toggleFavorite(currentTrack)}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={26} 
              color={isLiked ? "#ff44a0" : "white"} 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayPause}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { position: 'absolute', bottom: 90, width: '100%', alignItems: 'center', zIndex: 10 },
  container: { width: '90%', flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 20, elevation: 5 },
  thumb: { width: 45, height: 45, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12 },
  title: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  artist: { color: '#a0a3bd', fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', paddingRight: 5 },
  heartBtn: { marginRight: 15 }
});