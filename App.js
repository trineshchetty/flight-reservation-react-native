
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Routes from "./src/navigation/Routes"



export default function App() {
  return (
    <Routes />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
