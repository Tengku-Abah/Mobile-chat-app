// components/MessageBubble.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function MessageBubble({ message, isOwn }) {
  return (
    <View
      style={[
        styles.row,
        isOwn ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwn ? styles.bubbleOwn : styles.bubbleOther,
        ]}
      >
        {message.image && (
          <Image source={{ uri: message.image }} style={styles.image} />
        )}

        {message.text ? <Text style={styles.text}>{message.text}</Text> : null}

        <Text style={styles.time}>
          {new Date(message.createdAt).toLocaleTimeString().slice(0, 5)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  bubbleOwn: {
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 14,
    color: '#111827',
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginBottom: 6,
  },
  time: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
