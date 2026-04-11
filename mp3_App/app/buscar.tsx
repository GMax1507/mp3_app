import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  SafeAreaView, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jamendoApi, JamendoTrack } from '../services/jamendoApi';
import TrackCard from '../components/TrackCard';
import { usePlayer } from '../context/PlayerContext';

// Simulação de buscas recentes (Pode ser expandido depois com AsyncStorage)
const RECENT = [
  { id: 'r1', name: 'Summer Vibes', sub: 'Pop' },
  { id: 'r2', name: 'Lofi Hip Hop', sub: 'Relax' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JamendoTrack[]>([]);
  const [recommended, setRecommended] = useState<JamendoTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [recLoading, setRecLoading] = useState(true);
  const { setQueue } = usePlayer();

  // Carrega recomendações ao abrir a tela
  useEffect(() => {
    jamendoApi.getRecommendedTracks(6).then(t => { 
      setRecommended(t); 
      setRecLoading(false); 
    });
  }, []);

  // Função de busca com lógica para evitar excesso de requisições
  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    
    if (text.trim().length < 2) { 
      setResults([]); 
      return; 
    }

    setLoading(true);
    try {
      const tracks = await jamendoApi.searchTracks(text, 20);
      setResults(tracks);
      // Atualiza a fila apenas com os resultados da busca
      if (tracks.length > 0) setQueue(tracks);
    } catch (e) {
      console.error("Erro na busca:", e);
    } finally {
      setLoading(false);
    }
  }, [setQueue]);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView 
        contentContainerStyle={s.content} 
        keyboardShouldPersistTaps="handled" 
        showsVerticalScrollIndicator={false}
      >
        <View style={s.bar}>
          <Ionicons name="search" size={20} color="#64748B" style={{ marginRight: 10 }} />
          <TextInput
            style={s.input} 
            placeholder="Artistas, músicas ou álbuns..." 
            placeholderTextColor="#4B5563"
            value={query} 
            onChangeText={handleSearch} 
            returnKeyType="search" 
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); }}>
              <Ionicons name="close-circle" size={20} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={s.loadingArea}>
            <ActivityIndicator color="#A78BFA" size="large" />
            <Text style={s.emptyTxt}>Buscando as melhores músicas...</Text>
          </View>
        )}

        {/* Resultados da Busca */}
        {!loading && results.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Resultados para "{query}"</Text>
            {results.map(t => <TrackCard key={t.id} track={t} />)}
          </>
        )}

        {/* Estado Vazio (Busca sem resultados) */}
        {!loading && query.length >= 2 && results.length === 0 && (
          <View style={s.center}>
            <Ionicons name="search-outline" size={60} color="#334155" />
            <Text style={s.emptyTxt}>Não encontramos nada para "{query}"</Text>
            <Text style={s.subEmpty}>Tente buscar por outro termo.</Text>
          </View>
        )}

        {/* Tela Inicial da Busca (Recentes e Recomendadas) */}
        {query.length < 2 && (
          <>
            <Text style={s.sectionTitle}>Buscas recentes</Text>
            {RECENT.map(item => (
              <TouchableOpacity key={item.id} style={s.recentItem} onPress={() => handleSearch(item.name)}>
                <View style={s.recentThumb}>
                  <Ionicons name="time-outline" size={18} color="#94A3B8" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.recentTitle}>{item.name}</Text>
                  <Text style={s.recentSub}>{item.sub}</Text>
                </View>
                <Ionicons name="arrow-forward-outline" size={20} color="#334155" />
              </TouchableOpacity>
            ))}

            <Text style={[s.sectionTitle, { marginTop: 20 }]}>Recomendadas para você</Text>
            {recLoading ? (
              <ActivityIndicator color="#A78BFA" />
            ) : (
              recommended.map(t => <TrackCard key={t.id} track={t} />)
            )}
          </>
        )}
        
        {/* Espaço para o MiniPlayer não cobrir o conteúdo */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F172A' },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  bar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1E293B', 
    borderRadius: 12, 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    marginBottom: 24, 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  input: { flex: 1, color: '#F1F5F9', fontSize: 16, paddingVertical: 8 },
  sectionTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  recentItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1E293B', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 10 
  },
  recentThumb: { 
    width: 44, 
    height: 44, 
    borderRadius: 8, 
    backgroundColor: '#334155', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  recentTitle: { color: '#F1F5F9', fontSize: 14, fontWeight: '600' },
  recentSub: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  loadingArea: { paddingVertical: 40, alignItems: 'center', gap: 15 },
  emptyTxt: { color: '#F1F5F9', fontSize: 16, fontWeight: '600', marginTop: 15 },
  subEmpty: { color: '#64748B', fontSize: 14, marginTop: 5 },
});