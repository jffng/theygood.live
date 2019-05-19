import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer  } from 'react-navigation';
import { Header, ThemeProvider } from 'react-native-elements';
import { Font, Constants, Location, Permissions } from 'expo';
import Events from './components/Events';
import EventDetail from './components/EventDetail';

class HomeScreen extends React.Component {
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

	static navigationOptions = {
		// header: null
		headerStyle: {
			backgroundColor: '#eee'
		}
	};

	componentWillMount() {
		if (Platform.OS === 'android' && !Constants.isDevice) {
			this.setState({
				errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
			});
		} else {
			this._getLocationAsync();
		}
	}

	async componentDidMount() {
		await Font.loadAsync({
			'authentic': require('./assets/fonts/AUTHENTICSans-60.otf'),
			'authentic-medium': require('./assets/fonts/AUTHENTICSans-90.otf'),
			'authentic-bold': require('./assets/fonts/AUTHENTICSans-130.otf'),
			'authentic-black': require('./assets/fonts/AUTHENTICSans-150.otf')
		});

		this.setState({ fontLoaded: true });
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
			{
				this.state.fontLoaded ? (
					<View>
						<View style={{ borderBottomWidth: 1, borderBottomColor: '#CED0CE' }}>
							<Text style={styles.loading}>{ text }</Text>
						</View>
						<Events data={this.state.data} navigation={this.props.navigation}/>
					</View>
				) : <View/>
			}
			</ThemeProvider>
		);
	}
}

const styles = StyleSheet.create({
	loading: {
		fontSize: 14,
		fontFamily: 'authentic',
		textAlign: 'left',
		margin: 14,
		marginTop: 20
	}
});

const AppNavigator = createStackNavigator({
	Home: {
		screen: HomeScreen,
	},
	EventDetail: {
		screen: EventDetail
	}
});

export default createAppContainer(AppNavigator);
