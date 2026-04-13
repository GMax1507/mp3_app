import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { jamendoApi, JamendoTrack } from '../services/jamendoApi';
import TrackCard from '../components/TrackCard';
import { usePlayer } from '../context/PlayerContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const [tracks, setTracks] = useState<JamendoTrack[]>([]);
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = usePlayer();

  useEffect(() => {
    jamendoApi.getPopularTracks(10).then(setTracks);
  }, []);

  return (
    <LinearGradient colors={['#0f1123', '#1a1c3d']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.greeting}>Bem-vindo</Text>
            <Text style={styles.subGreeting}>O que você quer ouvir hoje?</Text>
          </View>

          {/* CARD DE DESTAQUE DINÂMICO */}
          <LinearGradient colors={['#6a5ae0', '#a044ff']} style={styles.featuredCard}>
             <View style={styles.featuredInfo}>
                <Image 
                  source={{ uri: currentTrack?.album_image || 'https://via.placeholder.com/150' }} 
                  style={styles.featuredImg} 
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.featuredTitle} numberOfLines={1}>
                    {currentTrack?.name || "Selecione uma música"}
                  </Text>
                  <Text style={styles.featuredArtist}>
                    {currentTrack?.artist_name || "Jamendo Music"}
                  </Text>
                  
                  {/* Barra de Progresso Simbólica */}
                  <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: isPlaying ? '60%' : '10%' }]} />
                  </View>
                </View>
                
                <TouchableOpacity onPress={togglePlayPause} style={styles.mainPlayBtn}>
                  <Ionicons name={isPlaying ? "pause" : "play"} size={30} color="#6a5ae0" />
                </TouchableOpacity>
             </View>
          </LinearGradient>

          <Text style={styles.sectionTitle}>Tocadas recentemente</Text>
          {tracks.map(item => (
            <TrackCard key={item.id} track={item} onPress={() => playTrack(item)} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { padding: 25, marginTop: 10 },
  greeting: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  subGreeting: { color: '#a0a3bd', fontSize: 16 },
  featuredCard: { margin: 20, borderRadius: 25, padding: 20 },
  featuredInfo: { flexDirection: 'row', alignItems: 'center' },
  featuredImg: { width: 80, height: 80, borderRadius: 15, backgroundColor: '#3d4185' },
  featuredTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  featuredArtist: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginLeft: 15 },
  progressContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginLeft: 15, marginTop: 10, width: '80%' },
  progressBar: { height: 4, backgroundColor: 'white', borderRadius: 2 },
  mainPlayBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 25, marginBottom: 10 }
});