import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import TrackCard from '../components/TrackCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GENRES = [
  { id: 'rock', name: 'Rock', color: ['#4c3a80', '#2a1e4d'] },
  { id: 'pop', name: 'Pop', color: ['#803a6c', '#4d1e3d'] },
  { id: 'jazz', name: 'Jazz', color: ['#3a4a80', '#1e284d'] },
  { id: 'electronic', name: 'Eletrônica', color: ['#3a7a80', '#1e484d'] },
  { id: 'classical', name: 'Clássica', color: ['#3a8062', '#1e4d3a'] },
  { id: 'hiphop', name: 'Hip Hop', color: ['#806a3a', '#4d3d1e'] },
];

export default function Biblioteca() {
  const { favorites, recentTracks, playTrack, currentTrack } = usePlayer();
  
  // viewMode agora suporta o modo 'genero'
  const [viewMode, setViewMode] = useState<'recentes' | 'curtidas' | 'genero'>('recentes');
  const [selectedGenre, setSelectedGenre] = useState<any>(null);
  const [genrePlaylists, setGenrePlaylists] = useState<any>({});

  // Carregar playlists ao iniciar
  useEffect(() => {
    loadPlaylists();
  }, []);

  async function loadPlaylists() {
    const saved = await AsyncStorage.getItem('@genre_playlists');
    if (saved) setGenrePlaylists(JSON.parse(saved));
  }

  // Adicionar música atual ao gênero (clique longo)
  async function addToGenrePlaylist(genreId: string) {
    if (!currentTrack) {
      Alert.alert("Aviso", "Toque uma música primeiro para adicioná-la!");
      return;
    }
    const currentList = genrePlaylists[genreId] || [];
    if (currentList.find((t: any) => t.id === currentTrack.id)) {
      Alert.alert("Aviso", "Esta música já está nesta playlist.");
      return;
    }
    const updated = { ...genrePlaylists, [genreId]: [...currentList, currentTrack] };
    setGenrePlaylists(updated);
    await AsyncStorage.setItem('@genre_playlists', JSON.stringify(updated));
    Alert.alert("Sucesso", `Adicionada à playlist ${genreId}`);
  }

  // Remover música da playlist de gênero
  async function removeFromGenrePlaylist(trackId: string) {
    if (!selectedGenre) return;
    const updatedList = genrePlaylists[selectedGenre.id].filter((t: any) => t.id !== trackId);
    const updated = { ...genrePlaylists, [selectedGenre.id]: updatedList };
    setGenrePlaylists(updated);
    await AsyncStorage.setItem('@genre_playlists', JSON.stringify(updated));
  }

  return (
    <LinearGradient colors={['#0f1123', '#1a1c3d']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
          <Text style={styles.mainTitle}>Biblioteca</Text>

          {/* --- BOTÕES FIXOS: NUNCA SOMEM --- */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setViewMode('recentes')}
              style={[styles.mainCard, viewMode === 'recentes' && styles.activeCard]}
            >
              <LinearGradient colors={['#6a5ae0', '#a044ff']} style={styles.cardGradient}>
                <View style={styles.iconCircle}>
                  <Ionicons name="time" size={24} color="white" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Tocadas recentemente</Text>
                  <Text style={styles.cardSub}>{recentTracks.length} músicas</Text>
                </View>
                <Ionicons name={viewMode === 'recentes' ? "chevron-down" : "chevron-forward"} size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setViewMode('curtidas')}
              style={[styles.mainCard, viewMode === 'curtidas' && styles.activeCard]}
            >
              <LinearGradient colors={['#ff44a0', '#e05a5a']} style={styles.cardGradient}>
                <View style={styles.iconCircle}>
                  <Ionicons name="heart" size={24} color="white" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>Músicas curtidas</Text>
                  <Text style={styles.cardSub}>{favorites.length} músicas</Text>
                </View>
                <Ionicons name={viewMode === 'curtidas' ? "chevron-down" : "chevron-forward"} size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* --- LISTA DINÂMICA --- */}
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>
              {viewMode === 'recentes' ? 'Sua atividade recente' : 
               viewMode === 'curtidas' ? 'Suas favoritas' : `Playlist: ${selectedGenre?.name}`}
            </Text>
            
            {viewMode === 'recentes' && recentTracks.map((item: any) => (
              <TrackCard key={`rec-${item.id}`} track={item} onPress={() => playTrack(item)} />
            ))}

            {viewMode === 'curtidas' && favorites.map((item: any) => (
              <TrackCard key={`fav-${item.id}`} track={item} onPress={() => playTrack(item)} />
            ))}

            {viewMode === 'genero' && (genrePlaylists[selectedGenre?.id] || []).map((item: any) => (
              <View key={`gen-${item.id}`} style={styles.deleteRow}>
                <View style={{ flex: 1 }}>
                  <TrackCard track={item} onPress={() => playTrack(item)} />
                </View>
                <TouchableOpacity onPress={() => removeFromGenrePlaylist(item.id)} style={styles.trashBtn}>
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}

            {(viewMode === 'genero' && (!genrePlaylists[selectedGenre?.id] || genrePlaylists[selectedGenre?.id].length === 0)) && (
               <Text style={styles.emptyText}>Pressione e segure um gênero abaixo para adicionar a música atual.</Text>
            )}
          </View>

          {/* --- GRADE DE GÊNEROS --- */}
          <Text style={styles.sectionTitle}>Criar playlist por gênero</Text>
          <View style={styles.grid}>
            {GENRES.map((genre) => (
              <TouchableOpacity 
                key={genre.id} 
                style={styles.gridItem}
                onPress={() => { setSelectedGenre(genre); setViewMode('genero'); }}
                onLongPress={() => addToGenrePlaylist(genre.id)}
              >
                <LinearGradient colors={genre.color} style={styles.genreCard}>
                  <Text style={styles.genreText}>+ {genre.name}</Text>
                  <Text style={styles.genreCount}>{(genrePlaylists[genre.id] || []).length} músicas</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  mainTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', marginVertical: 20 },
  buttonsContainer: { marginBottom: 10 },
  mainCard: { marginBottom: 12, borderRadius: 25, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent', opacity: 0.8 },
  activeCard: { borderColor: 'white', opacity: 1 },
  cardGradient: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  iconCircle: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  cardTextContainer: { marginLeft: 15, flex: 1 },
  cardTitle: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  cardSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  listSection: { marginTop: 10, minHeight: 150 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 15, marginBottom: 15 },
  emptyText: { color: '#6e7191', fontSize: 14, textAlign: 'center', marginTop: 20 },
  deleteRow: { flexDirection: 'row', alignItems: 'center' },
  trashBtn: { padding: 10, backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: 10, marginLeft: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: 15 },
  genreCard: { height: 85, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  genreText: { color: 'white', fontSize: 16, fontWeight: '600' },
  genreCount: { color: 'rgba(255,255,255,0.5)', fontSize: 11 }
});