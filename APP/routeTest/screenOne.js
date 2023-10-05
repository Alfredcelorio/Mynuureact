import { View, Text } from 'react-native';

export default function ScreenOne({ route }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Vista Uno</Text>
        <Text>Prop recibida: qwe</Text>
      </View>
    );
  }