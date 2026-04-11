import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  Image, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jamendoApi, JamendoTrack } from '../services/jamendoApi';
import { usePlayer } from '../context/PlayerContext';
import TrackCard from '../components/TrackCard';

export default function HomeScreen() {
  const [featured, setFeatured] = useState<JamendoTrack | null>(null);
  const [tracks, setTracks] = useState<JamendoTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Pegando as funções do Contexto
  const { 
    currentTrack, 
    isPlaying, 
    position, 
    duration, 
    pauseResume, 
    playTrack, 
    setQueue, 
    toggleLike, 
    isLiked 
  } = usePlayer();

  const load = useCallback(async () => {
    try {
      const [top, recent] = await Promise.all([
        jamendoApi.getPopularTracks(1),
        jamendoApi.getPopularTracks(10),
      ]);
      if (top[0]) setFeatured(top[0]);
      setTracks(recent);
      setQueue(recent);
    } catch (error) {
      console.error("Erro ao carregar músicas:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [setQueue]);

  useEffect(() => { 
    load(); 
  }, [load]);

  const display = currentTrack || featured;
  
  // Cálculo de progresso seguro (evita NaN)
  const progress = duration > 0 ? position / duration : 0;
  
  // Formatação de tempo segura
  const fmt = (ms: number) => { 
    if (!ms || isNaN(ms)) return "0:00";
    const s = Math.floor(ms / 1000); 
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; 
  };

  if (loading) return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}>
        <ActivityIndicator size="large" color="#A78BFA" />
        <Text style={s.loadTxt}>Carregando músicas...</Text>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => { setRefreshing(true); load(); }} 
            tintColor="#A78BFA" 
          />
        }
      >
        <View style={s.header}>
          <View>
            <Text style={s.title}>Bem-vindo</Text>
            <Text style={s.sub}>O que você quer ouvir hoje?</Text>
          </View>
          <View style={s.avatar}>
            <Ionicons name="person" size={20} color="#A78BFA" />
          </View>
        </View>

        {display && (
          <View style={s.card}>
            <View style={s.cardRow}>
              <View style={[s.cardThumb, { backgroundColor: '#4C1D95' }]}>
                {display.album_image
                  ? <Image source={{ uri: display.album_image }} style={s.cardThumbImg} />
                  : <Ionicons name="musical-note" size={28} color="#A78BFA" />}
              </View>
              <View style={s.cardInfo}>
                <Text style={s.cardTitle} numberOfLines={1}>{display.name}</Text>
                <Text style={s.cardArtist} numberOfLines={1}>{display.artist_name}</Text>
                
                <View style={s.progBg}>
                  <View style={[s.progFill, { width: `${progress * 100}%` }]} />
                </View>
                
                <View style={s.timeRow}>
                  <Text style={s.time}>{fmt(position)}</Text>
                  <Text style={s.time}>{fmt(duration || (display.duration ? display.duration * 1000 : 0))}</Text>
                </View>
              </View>
            </View>

            <View style={s.controls}>
              <TouchableOpacity onPress={() => toggleLike(display)}>
                <Ionicons 
                  name={isLiked(display.id) ? 'heart' : 'heart-outline'} 
                  size={22} 
                  color={isLiked(display.id) ? '#F43F5E' : '#64748B'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Ionicons name="play-skip-back" size={22} color="#94A3B8" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={s.playBtn} 
                onPress={() => currentTrack ? pauseResume() : playTrack(display)}
              >
                <Ionicons 
                  name={currentTrack && isPlaying ? 'pause' : 'play'} 
                  size={28} 
                  color="#fff" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Ionicons name="play-skip-forward" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={s.sectionTitle}>Tocadas recentemente</Text>
        
        {tracks.map((t, i) => (
          <TrackCard key={t.id} track={t} showNumber={i + 1} />
        ))}

        {/* Espaço extra para a lista não ficar atrás do MiniPlayer */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F172A' },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadTxt: { color: '#94A3B8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: '#F1F5F9', fontSize: 26, fontWeight: '700' },
  sub: { color: '#64748B', fontSize: 14, marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 28, borderWidth: 1, borderColor: '#334155' },
  cardRow: { flexDirection: 'row', marginBottom: 16 },
  cardThumb: { width: 64, height: 64, borderRadius: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginRight: 14 },
  cardThumbImg: { width: 64, height: 64 },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardTitle: { color: '#F1F5F9', fontSize: 16, fontWeight: '700', marginBottom: 3 },
  cardArtist: { color: '#94A3B8', fontSize: 13, marginBottom: 10 },
  progBg: { height: 4, backgroundColor: '#334155', borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  progFill: { height: '100%', backgroundColor: '#A78BFA', borderRadius: 2 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  time: { color: '#64748B', fontSize: 11 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  playBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: '700', marginBottom: 14 },
});