// app/index.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// 🔥 Firebase Auth
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // untuk cek user + proses login
  const [username, setUsername] = useState(''); // dipakai sebagai email
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          router.replace('/chat');
          return;
        }
      } catch (err) {
        console.log('Error membaca user dari AsyncStorage:', err);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Email dan password wajib diisi');
      return;
    }

    setLoading(true);

    try {
      // username diisi dengan email Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username.trim(),
        password
      );

      const user = userCredential.user;

      // Simpan user ke AsyncStorage supaya tetap login
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({
          uid: user.uid,
          email: user.email,
        })
      );

      router.replace('/chat');
    } catch (error) {
      console.log('Login error:', error);
      let message = 'Login gagal. Periksa email dan password Anda.';

      if (error.code === 'auth/invalid-email') {
        message = 'Format email tidak valid.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'User tidak ditemukan. Coba daftar di Firebase Auth.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Password salah.';
      }

      Alert.alert('Login gagal', message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.full, styles.loadingBg]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.full}>
      <KeyboardAvoidingView
        style={styles.full}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header text */}
          <View style={styles.headerTop}>
            <Text style={styles.appName}>Simple Chat</Text>
            <Text style={styles.appTagline}>
              Aplikasi chat sederhana untuk tanya jawab di kelas
            </Text>
          </View>

          {/* Card login */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Masuk</Text>
            <Text style={styles.cardSubtitle}>
              Login dengan email yang terdaftar di Firebase.
            </Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan email"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              placeholderTextColor="#9CA3AF"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={[
                styles.button,
                (!username || !password) && { opacity: 0.6 },
              ]}
              onPress={handleLogin}
              disabled={!username || !password}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>
              Pastikan email & password sudah dibuat di Firebase Authentication.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: '#075E54', // hijau tua, selaras dengan header chat
  },
  loadingBg: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  headerTop: {
    marginBottom: 24,
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ECFDF5',
    letterSpacing: 0.5,
  },
  appTagline: {
    marginTop: 6,
    fontSize: 13,
    color: '#D1FAE5',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  button: {
    marginTop: 18,
    backgroundColor: '#0EA5E9',
    paddingVertical: 11,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  hint: {
    marginTop: 12,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
