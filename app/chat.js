// app/chat.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

import MessageBubble from '../components/MessageBubble';

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);

  // Load user + history chat saat pertama kali masuk ke screen
  useEffect(() => {
    const init = async () => {
      try {
        // cek user login
        const savedUser = await AsyncStorage.getItem('user');
        if (!savedUser) {
          router.replace('/');
          return;
        }

        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // load history chat (global group chat di perangkat ini)
        const savedMessages = await AsyncStorage.getItem('messages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (e) {
        console.log('Error init chat:', e);
      }
    };

    init();
  }, []);

  // Setiap messages berubah → simpan ke AsyncStorage (offline mode)
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem('messages', JSON.stringify(messages));
      } catch (e) {
        console.log('Error saving messages:', e);
      }
    };

    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      image: null,
      sender: user?.email,
      createdAt: new Date().toISOString(),
    };

    // pesan baru di prepend (biar FlatList inverted tetap benar)
    setMessages(prev => [newMessage, ...prev]);
    setInput('');
  };

  const handlePickImage = async () => {
    // minta izin akses galeri
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Izin akses gallery diperlukan!');
      return;
    }

    // buka galeri
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      const newMessage = {
        id: Date.now().toString(),
        text: '',
        image: imageUri,
        sender: user?.email,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [newMessage, ...prev]);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#075E54' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Simple Chat</Text>
              <Text style={styles.headerSub}>
                Login sebagai: {user?.email}
              </Text>
            </View>

            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logout}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* List chat */}
          <FlatList
            style={styles.chatList}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isOwn={item.sender === user?.email}
              />
            )}
            inverted={true} // supaya pesan terbaru di bawah
          />

          {/* Input bar */}
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={handlePickImage}
            >
              <Text style={{ fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Ketik pesan..."
              value={input}
              onChangeText={setInput}
            />

            <Button title="Send" onPress={handleSend} />
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e5ddd5' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#075E54',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  headerSub: { color: '#e0e0e0', fontSize: 12, marginTop: 2 },
  logout: { color: 'white', fontWeight: 'bold' },

  chatList: { flex: 1, paddingHorizontal: 8 },

  inputRow: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  imageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
  },
});
