import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import TrackCard from '../components/TrackCard';

export default function Biblioteca() {
  const { favorites, recentTracks, playTrack } = usePlayer();
  // Este estado define apenas qual LISTA aparece lá embaixo
  const [viewMode, setViewMode] = useState<'recentes' | 'curtidas'>('recentes');

  return (
    <LinearGradient colors={['#0f1123', '#1a1c3d']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
          <Text style={styles.mainTitle}>Biblioteca</Text>

          {/* --- ÁREA DOS BOTÕES FIXOS --- */}
          <View style={styles.buttonsContainer}>
            {/* BOTÃO RECENTES: Sempre visível */}
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
                <Ionicons 
                  name={viewMode === 'recentes' ? "chevron-down" : "chevron-forward"} 
                  size={20} 
                  color="white" 
                />
              </LinearGradient>
            </TouchableOpacity>

            {/* BOTÃO CURTIDAS: Sempre visível */}
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
                <Ionicons 
                  name={viewMode === 'curtidas' ? "chevron-down" : "chevron-forward"} 
                  size={20} 
                  color="white" 
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* --- LISTA QUE MUDA CONFORME O CLIQUE --- */}
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>
              {viewMode === 'recentes' ? 'Sua atividade recente' : 'Suas favoritas'}
            </Text>
            
            {viewMode === 'recentes' ? (
              recentTracks.map((item: any) => (
                <TrackCard key={`rec-${item.id}`} track={item} onPress={() => playTrack(item)} />
              ))
            ) : (
              favorites.map((item: any) => (
                <TrackCard key={`fav-${item.id}`} track={item} onPress={() => playTrack(item)} />
              ))
            )}

            {(viewMode === 'recentes' ? recentTracks.length : favorites.length) === 0 && (
              <Text style={styles.emptyText}>Nenhuma música encontrada nesta categoria.</Text>
            )}
          </View>

          {/* Grade de Gêneros */}
          <Text style={styles.sectionTitle}>Criar playlist por gênero</Text>
          <View style={styles.grid}>
            {['Rock', 'Pop', 'Jazz', 'Eletrônica', 'Clássica', 'Hip Hop'].map((genre, index) => (
              <TouchableOpacity key={index} style={styles.gridItem}>
                <LinearGradient colors={['#2a2d5a', '#1a1c3d']} style={styles.genreCard}>
                  <Text style={styles.genreText}>+ {genre}</Text>
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
  mainCard: { marginBottom: 12, borderRadius: 25, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  activeCard: { borderColor: 'white' }, // Apenas adiciona a borda no selecionado
  cardGradient: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  iconCircle: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  cardTextContainer: { marginLeft: 15, flex: 1 },
  cardTitle: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  cardSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  listSection: { marginTop: 10, minHeight: 150 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 15, marginBottom: 15 },
  emptyText: { color: '#6e7191', fontSize: 14, textAlign: 'center', marginTop: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: 15 },
  genreCard: { height: 75, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  genreText: { color: 'white', fontSize: 16, fontWeight: '600' }
});