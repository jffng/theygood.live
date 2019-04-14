import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { MapView  } from 'expo';

export default class EventDetail extends React.PureComponent {
  render(){
    const { data } = this.props.navigation.state.params
    return (
      <ThemeProvider>
        <View style={{ margin: 12 }}>
          <Text style={styles.name}>{ data ? data.name : null }</Text>
          <MapView 
            style={{ flex: 1 }}
            initialRegion={{
              latitude: data.latitude,
              longitude: data.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          />
        </View>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    fontWeight: 'bold',
    fontSize: 22
  }
})
