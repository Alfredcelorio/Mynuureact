import { View, Text } from 'react-native';

export default function ScreenTwo({ route }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Vista Dos</Text>
        <Text>Prop recibida: asd</Text>
      </View>
    );
  }