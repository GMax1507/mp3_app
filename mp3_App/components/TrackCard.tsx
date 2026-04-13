import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function TrackCard({ track, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.wrapper}>
      <LinearGradient colors={['#2a2d5a', '#1a1c3d']} style={styles.card}>
        <Image source={{ uri: track.album_image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{track.name}</Text>
          <Text style={styles.artist}>{track.artist_name}</Text>
        </View>
        <TouchableOpacity style={styles.playCircle}>
          <Ionicons name="play" size={18} color="black" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 20, marginVertical: 6 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 20 },
  image: { width: 50, height: 50, borderRadius: 12 },
  info: { marginLeft: 15, flex: 1 },
  title: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  artist: { color: '#a0a3bd', fontSize: 12, marginTop: 2 },
  playCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }
});