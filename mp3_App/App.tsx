import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, TextInput } from 'react-native';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{ fontSize: 20 }}>🎧 Biblioteca</Text>

      <Button
        title="Ir para Download"
        onPress={() => navigation.navigate('Download')}
      />
    </View>
  );
}

function DownloadScreen() {
  const [link, setLink] = useState('');

  async function baixarMusica() {
    if (!link) {
      alert("Cole um link primeiro!");
      return;
    }

    try {
      const nomeArquivo = "musica.mp3";
      const caminho = FileSystem.documentDirectory + nomeArquivo;

      console.log("Baixando de:", link);

      const download = await FileSystem.downloadAsync(link, caminho);

      alert("Sucesso: " + download.uri);
    } catch (erro) {
      console.log("ERRO DETALHADO:", erro);
      alert("Erro completo: " + JSON.stringify(erro));
    }
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    }}>
      <Text style={{ fontSize: 20 }}>📥 Baixar Música</Text>

      <TextInput
        placeholder="Cole o link da música"
        value={link}
        onChangeText={setLink}
        style={{
          borderWidth: 1,
          width: '100%',
          marginVertical: 10,
          padding: 10
        }}
      />

      <Button
        title="Baixar"
        onPress={baixarMusica}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Download" component={DownloadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}