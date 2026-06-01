import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext'; // 1. Importando o contexto do tema global
import TrackCard from '../components/TrackCard';
import { jamendoApi } from '../services/jamendoApi';

export default function Busca() {
  const { playTrack } = usePlayer();
  const { themeColors } = useTheme(); // 2. Capturando as cores do gradiente escolhido
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);

  // Efeito que roda toda vez que o usuário digita algo
  useEffect(() => {
    // Se o usuário apagar o campo, exibe as populares novamente de forma limpa
    if (searchQuery.trim() === '') {
      async function loadInitialTracks() {
        setLoading(true);
        try {
          const popular = await jamendoApi.getPopularTracks(20);
          setTracks(popular || []);
        } catch (error) {
          console.error("Erro ao carregar populares:", error);
        } finally {
          setLoading(false);
        }
      }
      loadInitialTracks();
      return;
    }

    // Debounce de 600ms para a busca em tempo real na API Jamendo
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await jamendoApi.searchTracks(searchQuery);
        setTracks(searchResults || []);
      } catch (error) {
        console.error("Erro ao pesquisar na API Jamendo:", error);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    // 3. O LinearGradient agora usa o array dinâmico themeColors
    <LinearGradient colors={themeColors} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.mainTitle}>Buscar</Text>

          {/* BARRA DE PESQUISA */}
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color="#6e7191" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="O que você quer ouvir hoje?"
              placeholderTextColor="#6e7191"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#6e7191" />
              </TouchableOpacity>
            )}
          </View>

          {/* EXIBIÇÃO DE LOADING OU RESULTADOS */}
          {loading ? (
            <ActivityIndicator size="large" color="#8a2be2" style={{ marginTop: 50 }} />
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>
                {searchQuery ? 'Resultados globais' : 'Recomendadas para você'}
              </Text>

              {tracks.map((item: any) => (
                <TrackCard 
                  key={`search-${item.id}`} 
                  track={item} 
                  onPress={() => playTrack(item)} 
                />
              ))}

              {tracks.length === 0 && (
                <Text style={styles.emptyText}>Nenhuma música correspondente encontrada no Jamendo.</Text>
              )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  mainTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', marginVertical: 20 },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // Mudança leve para combinar melhor com qualquer cor de fundo
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, color: 'white', fontSize: 16 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  emptyText: { color: '#6e7191', fontSize: 14, textAlign: 'center', marginTop: 30 }
});