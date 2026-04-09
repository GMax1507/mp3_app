import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

const Stack = createStackNavigator();

// --- TELA 1: PERMISSÃO (Botão Vermelho) ---
function PermissionScreen({ navigation }) {
  const askForPermission = async () => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  
  if (status === 'granted') {
    navigation.navigate('List');
  } else {
    Alert.alert(
      "Permissão Necessária", 
      "Clique em 'Fotos e vídeos' nas configurações e selecione 'Sempre permitir'. Se aparecer 'Música e Áudio', selecione também."
    );
  }
};

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, {backgroundColor: '#FF1A1A'}]}>
        <Text style={{color: 'white', fontSize: 40}}>🔒</Text>
      </View>
      <Text style={styles.title}>Solicitação de Acesso</Text>
      <Text style={{color: '#ccc', textAlign: 'center', marginBottom: 20}}>
        Para começar, precisamos de permissão para ler os arquivos de áudio do seu dispositivo.
      </Text>
      <TouchableOpacity style={styles.buttonRed} onPress={askForPermission}>
        <Text style={styles.buttonText}>Conceder Acesso</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- TELA 2: LISTA (Botão Verde) ---
function ListScreen({ navigation }) {
  const [songs, setSongs] = useState([]);

  const getAudioFiles = async () => {
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
    });
    setSongs(media.assets);
  };

  useEffect(() => {
    getAudioFiles();
  }, []);

  return (
    <View style={[styles.container, { justifyContent: 'flex-start', paddingTop: 60 }]}>
      <Text style={styles.title}>Minhas Músicas</Text>
      
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        style={{ width: '100%' }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.songCard}
            onPress={() => navigation.navigate('Player', { song: item })}
          >
            <View style={styles.albumArtPlaceholder} />
            <View>
              <Text style={styles.songTitle}>{item.filename}</Text>
              <Text style={styles.songArtist}>Arquivo Local</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// --- TELA 3: PLAYER (Botão Roxo) ---
function PlayerScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, {backgroundColor: '#A033FF'}]}>
        <Text style={{color: 'white', fontSize: 40}}>▶</Text>
      </View>
      <Text style={styles.title}>Agora Tocando</Text>
      <TouchableOpacity style={styles.buttonPurple} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Permission" component={PermissionScreen} />
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Player" component={PlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  songCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  albumArtPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: 'black',
    borderRadius: 8,
    marginRight: 15,
  },
  songTitle: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  songArtist: { color: '#666', fontSize: 14 }})