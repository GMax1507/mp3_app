import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { jamendoApi, JamendoTrack } from '../services/jamendoApi';
import TrackCard from '../components/TrackCard';
import { usePlayer } from '../context/PlayerContext';

export default function Buscar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JamendoTrack[]>([]);
  const [recommended, setRecommended] = useState<JamendoTrack[]>([]);
  const { playTrack } = usePlayer();

  useEffect(() => {
    // Carrega recomendações iniciais
    jamendoApi.getRecommendedTracks(5).then(setRecommended);
  }, []);

  const handleSearch = async () => {
    if (query.trim()) {
      const data = await jamendoApi.searchTracks(query);
      setResults(data);
    }
  };

  return (
    <LinearGradient colors={['#0f1123', '#1a1c3d']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color="#6e7191" style={styles.searchIcon} />
            <TextInput
              placeholder="Buscar músicas..."
              placeholderTextColor="#6e7191"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
            />
          </View>

          <Text style={styles.sectionTitle}>
            {results.length > 0 ? 'Resultados' : 'Recomendadas para você'}
          </Text>

          {(results.length > 0 ? results : recommended).map((item) => (
            <TrackCard key={item.id} track={item} onPress={() => playTrack(item)} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: 55,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: 'white', fontSize: 16 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 25, marginVertical: 15 }
});