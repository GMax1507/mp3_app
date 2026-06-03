import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TrackCardProps = {
  track: any;
  onPress: () => void;
};

export default function TrackCard({ track, onPress }: TrackCardProps) {
  
  // Função nativa de Compartilhamento Social
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Escute comigo a música "${track.name}" do artista ${track.artist_name} no meu MP3_APP! Link da faixa: ${track.audio || 'https://www.jamendo.com'}`,
        title: `Compartilhar: ${track.name}`,
      });
    } catch (error) {
      console.error('Erro ao compartilhar faixa:', error);
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Botão principal que toca a música ao clicar no card */}
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.clickableArea}>
        <View style={styles.albumArtPlaceholder}>
          {track.album_image ? (
            <Image source={{ uri: track.album_image }} style={styles.albumArt} />
          ) : (
            <Ionicons name="musical-notes" size={24} color="#8a2be2" />
          )}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.trackName} numberOfLines={1}>{track.name}</Text>
          <Text style={styles.artistName} numberOfLines={1}>{track.artist_name || 'Jamendo Music'}</Text>
        </View>
      </TouchableOpacity>

      {/* ÍCONE DE COMPARTILHAMENTO SOCIAL (Ao lado do Play) */}
      <TouchableOpacity onPress={handleShare} style={styles.shareActionBtn}>
        <Ionicons name="share-social-outline" size={20} color="#6e7191" />
      </TouchableOpacity>

      {/* Ícone Indicativo de Play */}
      <TouchableOpacity onPress={onPress} style={styles.playActionBtn}>
        <Ionicons name="play-circle" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.01)',
  },
  clickableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  albumArtPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  albumArt: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    marginLeft: 14,
    flex: 1,
    paddingRight: 10,
  },
  trackName: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  artistName: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 3,
  },
  shareActionBtn: {
    padding: 8,
    marginRight: 4,
  },
  playActionBtn: {
    padding: 4,
  },
});