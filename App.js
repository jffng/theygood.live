import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { Constants, Location, Permissions } from 'expo';
import Events from './components/Events';

export default class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      error: null,
      refreshing: false,
      location: null
    }
  }

	componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    this.fetchEvents();
  };

  fetchEvents(){
    const { location, page } = this.state;
    const { latitude, longitude } = location.coords;
    // const endpoint = `https://theygood.live/api/events/nearby?lat=${latitude}&lng=${longitude}`;
    const endpoint = `https://theygood.live/api/events/nearby?lat=40.7142525&lng=-73.9558419`;
    this.setState({ loading: true });

    fetch(endpoint)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.events : [...this.state.data, ...res.events],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false })
      });
  }

  render() {
    let text;
    if ( this.state.loading === false && !this.state.location ){
      text = 'Getting your location...';
    } else if ( this.state.loading ){
      text = 'Finding music near you...';
    } else {
      text = `${this.state.data.length} events found near you`;
    }

    return (
      <ThemeProvider>
        <View style={{ borderBottomWidth: 1, borderBottomColor: '#CED0CE' }}>
          <Text style={styles.header}>TheyGood.Live</Text>
          <Text style={styles.loading}>{ text }</Text>
        </View>
        <Events data={this.state.data}/>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 42,
    textAlign: 'center',
    margin: 48,
    marginBottom: 14
  },
  loading: {
    fontSize: 22,
    textAlign: 'center',
    margin: 16
  }
});
