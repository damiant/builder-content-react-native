import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Content, fetchOneEntry, type BuilderContent } from '@builder.io/sdk-react-native';
import 'react-native-url-polyfill/auto';

// Builder Public API Key
const BUILDER_API_KEY = '0a29d55118874a9b8f7cc38a47887fe6';
const MODEL_NAME = 'page';

export default function BuilderScreen() {
  const [content, setContent] = useState<BuilderContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOneEntry({
      model: MODEL_NAME,
      apiKey: BUILDER_API_KEY,
      userAttributes: {
        // Pass attributes for targeting if necessary
        urlPath: '/',
      },
    })
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching Builder Content: ', err);
        setError(String(err?.message ?? err));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Loading Builder content...</Text>
      </View>
    );
  }

  if (!content) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No Builder content found</Text>
        {error ? <Text style={styles.muted}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Content
        model={MODEL_NAME}
        apiKey={BUILDER_API_KEY}
        content={content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', gap: 12 },
  title: { fontSize: 18, fontWeight: '600' },
  muted: { color: '#666' },
});
