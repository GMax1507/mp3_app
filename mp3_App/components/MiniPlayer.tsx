import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet,
  Modal, SafeAreaView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { usePlayer } from '../context/PlayerContext';

const MiniPlayer: React.FC = () => {
  const { 
    currentTrack, isPlaying, position, duration, 
    pauseResume, nextTrack, prevTrack, seekTo, 
    toggleLike, isLiked 
  } = usePlayer();
  
  const [expanded, setExpanded] = useState(false);

  // Se não tiver música, o componente não renderiza nada
  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const progress = duration > 0 ? position / duration : 0;

  const fmt = (ms: number) => { 
    if (!ms || isNaN(ms)) return "0:00";
    const s = Math.floor(ms / 1000); 
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; 
  };

  return (
    <View style={styles.container}>
      {/* BARRA MINI */}
      <TouchableOpacity 
        style={styles.bar} 
        onPress={() => setExpanded(true)} 
        activeOpacity={0.9}
      >
        <View style={styles.thumb}>
          {currentTrack.album_image ? (
            <Image source={{ uri: currentTrack.album_image }} style={styles.thumbImg} />
          ) : (
            <View style={styles.fallbackThumb}>
              <Ionicons name="musical-note" size={16} color="#fff" />
            </View>
          )}
        </View>
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.name}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist_name}</Text>
        </View>
        
        <TouchableOpacity onPress={() => pauseResume()} style={styles.btn}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={26} color="#A78BFA" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => nextTrack()} style={styles.btn}>
          <Ionicons name="play-skip-forward" size={22} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </TouchableOpacity>

      {/* PLAYER EXPANDIDO */}
      <Modal visible={expanded} animationType="slide" onRequestClose={() => setExpanded(false)}>
        <SafeAreaView style={styles.fullScreen}>
          <View style={styles.fullHeader}>
            <TouchableOpacity onPress={() => setExpanded(false)}>
              <Ionicons name="chevron-down" size={30} color="#94A3B8" />
            </TouchableOpacity>
            <Text style={styles.fullHeaderTitle}>TOCANDO AGORA</Text>
            <View style={{ width: 30 }} />
          </View>

          <View style={styles.albumWrap}>
            <Image 
              source={{ uri: currentTrack.album_image || 'https://via.placeholder.com/300' }} 
              style={styles.albumImg} 
            />
          </View>

          <View style={styles.infoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fullTitle} numberOfLines={1}>{currentTrack.name}</Text>
              <Text style={styles.fullArtist}>{currentTrack.artist_name}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleLike(currentTrack)}>
              <Ionicons 
                name={liked ? 'heart' : 'heart-outline'} 
                size={30} 
                color={liked ? '#F43F5E' : '#64748B'} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.sliderWrap}>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={duration > 0 ? duration : 1}
              value={position || 0}
              onSlidingComplete={seekTo}
              minimumTrackTintColor="#A78BFA"
              maximumTrackTintColor="#334155"
              thumbTintColor="#A78BFA"
            />
            <View style={styles.timeRow}>
              <Text style={styles.time}>{fmt(position)}</Text>
              <Text style={styles.time}>{fmt(duration)}</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={() => prevTrack()}>
              <Ionicons name="play-skip-back" size={40} color="#F1F5F9" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playBtn} onPress={() => pauseResume()}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => nextTrack()}>
              <Ionicons name="play-skip-forward" size={40} color="#F1F5F9" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  bar: {
    marginHorizontal: 10,
    marginBottom: 5,
    backgroundColor: '#1E293B', 
    borderRadius: 12,
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 8,
    borderWidth: 1, 
    borderColor: '#334155',
  },
  thumb: { width: 45, height: 45, borderRadius: 8, overflow: 'hidden', marginRight: 12 },
  thumbImg: { width: 45, height: 45 },
  fallbackThumb: { width: 45, height: 45, backgroundColor: '#4C1D95', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  title: { color: '#F1F5F9', fontSize: 14, fontWeight: '700' },
  artist: { color: '#94A3B8', fontSize: 12 },
  btn: { padding: 10 },
  progressBg: { position: 'absolute', bottom: 0, left: 10, right: 10, height: 2, backgroundColor: '#334155' },
  progressFill: { height: '100%', backgroundColor: '#A78BFA' },
  fullScreen: { flex: 1, backgroundColor: '#0F172A', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  fullHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  fullHeaderTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  albumWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  albumImg: { width: 300, height: 300, borderRadius: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, marginBottom: 20 },
  fullTitle: { color: '#F1F5F9', fontSize: 24, fontWeight: '800' },
  fullArtist: { color: '#A78BFA', fontSize: 18 },
  sliderWrap: { paddingHorizontal: 25, marginBottom: 30 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  time: { color: '#64748B', fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 40, paddingBottom: 50 },
  playBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center' },
});

export default MiniPlayer;