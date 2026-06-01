import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import TrackCard from '../components/TrackCard';

export default function Home() {
  // Puxando os controles de reprodução do seu PlayerContext
  const { currentTrack, recentTracks, playTrack, isPlaying, togglePlayPause } = usePlayer();
  const { themeColors } = useTheme();

  // Função que gerencia o clique no Card de Destaque
  const handleCardPress = () => {
    if (currentTrack) {
      // Se já tem uma música no player, ela pausa ou despausa
      if (togglePlayPause) togglePlayPause();
    } else if (recentTracks && recentTracks.length > 0) {
      // Se não tem nada tocando, mas tem histórico, toca a última ouvida
      playTrack(recentTracks[0]);
    }
  };

  return (
    <LinearGradient colors={themeColors} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* CABEÇALHO */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Bem-vindo</Text>
            <Text style={styles.subtitleText}>O que você quer ouvir hoje?</Text>
          </View>

          {/* CARD DE MÚSICA ATUAL - AGORA TOTALMENTE FUNCIONAL */}
          <TouchableOpacity 
            activeOpacity={0.85} 
            style={styles.currentTrackCard}
            onPress={handleCardPress}
          >
            <LinearGradient 
              colors={['#8a2be2', '#4b0082']} 
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardInfo}>
                <View style={styles.albumArtPlaceholder}>
                   {currentTrack?.album_image ? (
                     <Image source={{ uri: currentTrack.album_image }} style={styles.albumArt} />
                   ) : (
                     <Ionicons name="musical-notes" size={30} color="white" />
                   )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.nowPlayingTitle} numberOfLines={1}>
                    {currentTrack ? currentTrack.name : 'Toque para iniciar'}
                  </Text>
                  <Text style={styles.nowPlayingArtist} numberOfLines={1}>
                    {currentTrack ? currentTrack.artist_name : 'Nenhuma faixa selecionada'}
                  </Text>
                </View>
              </View>

              {/* O ÍCONE MUDA DINAMICAMENTE ENTRE PLAY E PAUSE */}
              <View style={styles.playCircle}>
                <Ionicons 
                  name={isPlaying ? "pause" : "play"} 
                  size={32} 
                  color="#8a2be2" 
                  style={!isPlaying ? { marginLeft: 4 } : {}} 
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* LISTA DE RECENTES */}
          <Text style={styles.sectionTitle}>Tocadas recentemente</Text>
          
          <View style={styles.trackList}>
            {recentTracks && recentTracks.length > 0 ? (
              recentTracks.map((track: any) => (
                <TrackCard 
                  key={`home-recent-${track.id}`} 
                  track={track} 
                  onPress={() => playTrack(track)} 
                />
              ))
            ) : (
              <Text style={styles.emptyText}>As músicas que você ouvir aparecerão aqui.</Text>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  header: { marginBottom: 25 },
  welcomeText: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  subtitleText: { color: '#6e7191', fontSize: 16, marginTop: 4 },
  currentTrackCard: {
    height: 140,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  cardInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  albumArtPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  albumArt: { width: '100%', height: '100%' },
  textContainer: { marginLeft: 15, flex: 1 },
  nowPlayingTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  nowPlayingArtist: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 2 },
  playCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  trackList: { width: '100%' },
  emptyText: { color: '#6e7191', fontSize: 14, textAlign: 'center', marginTop: 20 },
});