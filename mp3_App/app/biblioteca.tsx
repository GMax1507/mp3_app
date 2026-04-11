import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Modal, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jamendoApi, JamendoTrack } from '../services/jamendoApi';
import { usePlayer } from '../context/PlayerContext';
import TrackCard from '../components/TrackCard';

const GENRES = [
  { label: 'Rock',      tag: 'rock',       color: '#7C3AED' },
  { label: 'Pop',       tag: 'pop',        color: '#1D4ED8' },
  { label: 'Jazz',      tag: 'jazz',       color: '#065F46' },
  { label: 'Eletrônica',tag: 'electronic', color: '#0369A1' },
  { label: 'Clássica',  tag: 'classical',  color: '#9D174D' },
  { label: 'Hip Hop',   tag: 'hiphop',     color: '#92400E' },
];

export default function LibraryScreen() {
  const { likedTracks, recentTracks, setQueue } = usePlayer();
  const [modal, setModal] = useState(false);
  const [genreLabel, setGenreLabel] = useState('');
  const [genreTracks, setGenreTracks] = useState<JamendoTrack[]>([]);
  const [loading, setLoading] = useState(false);

  const openGenre = async (tag: string, label: string) => {
    setGenreLabel(label); setModal(true); setLoading(true);
    const tracks = await jamendoApi.getTracksByGenre(tag, 15);
    setGenreTracks(tracks); setQueue(tracks); setLoading(false);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.pageTitle}>Visualizar</Text>

        <TouchableOpacity style={[s.collCard, { backgroundColor: '#312E81' }]} activeOpacity={0.8}>
          <View style={s.collIcon}><Ionicons name="musical-note" size={24} color="#fff" /></View>
          <View>
            <Text style={s.collTitle}>Tocadas recentemente</Text>
            <Text style={s.collSub}>{recentTracks.length} músicas</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[s.collCard, { backgroundColor: '#831843' }]} activeOpacity={0.8}>
          <View style={[s.collIcon, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <Ionicons name="heart" size={24} color="#F43F5E" />
          </View>
          <View>
            <Text style={s.collTitle}>Músicas curtidas</Text>
            <Text style={s.collSub}>{likedTracks.length} músicas</Text>
          </View>
        </TouchableOpacity>

        <Text style={s.sectionTitle}>Criar playlist por gênero</Text>
        <View style={s.grid}>
          {GENRES.map(g => (
            <TouchableOpacity key={g.tag} style={[s.genreBtn, { backgroundColor: g.color + '33', borderColor: g.color + '66' }]} onPress={() => openGenre(g.tag, g.label)} activeOpacity={0.7}>
              <Ionicons name="add" size={18} color="#A78BFA" />
              <Text style={s.genreLabel}>{g.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={s.modalSafe}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{genreLabel}</Text>
            <TouchableOpacity style={s.closeBtn} onPress={() => setModal(false)}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
            {loading
              ? <View style={s.center}><ActivityIndicator size="large" color="#A78BFA" /><Text style={{ color: '#94A3B8', marginTop: 12 }}>Carregando...</Text></View>
              : genreTracks.map(t => <TrackCard key={t.id} track={t} />)}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F172A' },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  pageTitle: { color: '#F1F5F9', fontSize: 24, fontWeight: '700', marginBottom: 20 },
  collCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 18, marginBottom: 12, gap: 16 },
  collIcon: { width: 48, height: 48, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  collTitle: { color: '#F1F5F9', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  collSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  sectionTitle: { color: '#F1F5F9', fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  genreBtn: { flexDirection: 'row', alignItems: 'center', width: '47%', paddingVertical: 16, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, gap: 8 },
  genreLabel: { color: '#E2E8F0', fontSize: 14, fontWeight: '600' },
  modalSafe: { flex: 1, backgroundColor: '#0F172A' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  modalTitle: { color: '#F1F5F9', fontSize: 20, fontWeight: '700' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', paddingVertical: 60 },
});