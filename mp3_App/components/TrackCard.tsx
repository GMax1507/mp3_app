import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy'; // Usando a mesma API estável do seu context

type TrackCardProps = {
  track: any;
  onPress: () => void;
};

export default function TrackCard({ track, onPress }: TrackCardProps) {
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Efeito para verificar se a música específica já está salva no dispositivo
  useEffect(() => {
    checkIfDownloaded();
  }, [track.id]);

  async function checkIfDownloaded() {
    try {
      const localUri = `${FileSystem.documentDirectory}track_${track.id}.mp3`;
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      setIsDownloaded(fileInfo.exists);
    } catch (error) {
      setIsDownloaded(false);
    }
  }

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
          
          <View style={styles.artistRow}>
            <Text style={styles.artistName} numberOfLines={1}>
              {track.artist_name || 'Jamendo Music'}
            </Text>
            
            {/* SINAL INDICATIVO DE MÚSICA BAIXADA (OFFLINE) */}
            {isDownloaded && (
              <View style={styles.badgeOffline}>
                <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                <Text style={styles.badgeText}>Disponível Offline</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Ícone de Compartilhar */}
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
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    flexWrap: 'wrap',
  },
  artistName: {
    color: '#94a3b8',
    fontSize: 12,
    marginRight: 8,
  },
  // Estilo do indicador verde de download
  badgeOffline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
  shareActionBtn: {
    padding: 8,
    marginRight: 4,
  },
  playActionBtn: {
    padding: 4,
  },
});