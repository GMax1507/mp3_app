import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const INFO = [
  { icon: 'musical-notes-outline', label: 'Powered by Jamendo API', sub: 'Música livre e legal' },
  { icon: 'phone-portrait-outline', label: 'Plataforma', sub: 'Android & iOS' },
  { icon: 'code-slash-outline', label: 'Tecnologia', sub: 'React Native + Expo' },
  { icon: 'shield-checkmark-outline', label: 'Licença', sub: 'Creative Commons' },
];

export default function AboutScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView 
        contentContainerStyle={s.content} 
        showsVerticalScrollIndicator={false}
      >
        <View style={s.logoWrap}>
          <View style={s.logo}>
            <Ionicons name="musical-note" size={44} color="#fff" />
          </View>
          <Text style={s.appName}>Sobre o App</Text>
        </View>

        <View style={s.card}>
          <Text style={s.desc}>
            O Music App é um projeto de streaming que utiliza a API do Jamendo 
            para oferecer músicas independentes de alta qualidade. Explore novos 
            artistas e gerencie sua biblioteca de forma simples e intuitiva.
          </Text>
        </View>

        <Text style={s.version}>Versão 1.0.0</Text>

        <View style={s.infoList}>
          {INFO.map((item) => (
            <View key={item.label} style={s.infoRow}>
              <View style={s.infoIcon}>
                <Ionicons name={item.icon as any} size={20} color="#A78BFA" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>{item.label}</Text>
                <Text style={s.infoSub}>{item.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F172A' },
  content: { paddingHorizontal: 24, paddingTop: 30, alignItems: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 90, height: 90, borderRadius: 22, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  appName: { color: '#F1F5F9', fontSize: 28, fontWeight: '800' },
  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#334155', width: '100%' },
  desc: { color: '#94A3B8', fontSize: 15, lineHeight: 24, textAlign: 'center' },
  version: { color: '#475569', fontSize: 13, marginBottom: 32, fontWeight: '600' },
  infoList: { width: '100%', gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#334155' },
  infoIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#312E81', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  infoLabel: { color: '#E2E8F0', fontSize: 14, fontWeight: '700' },
  infoSub: { color: '#64748B', fontSize: 12, marginTop: 2 },
});