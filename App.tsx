import { StyleSheet, View, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BuilderScreen from './BuilderScreen';

// The Builder render-html layer nests a list inside a ScrollView.
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

export default function App() {
  return (
    <View style={styles.container}>
      <BuilderScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
});
