import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { MapView  } from 'expo';

export default class EventDetail extends React.Component {
	constructor(props){
		super(props);
		this.state = {  };
		this.renderArtists = this.renderArtists.bind(this);
		this.fetchDetails = this.fetchDetails.bind(this);
	}

	static navigationOptions = {
		headerStyle: {
			backgroundColor: '#eee'
		}
	}

	componentWillMount() {
		this.fetchDetails();
	}

	fetchDetails() {
		const { eventId } = this.props.navigation.state.params.data;
		const endpoint = `https://theygood.live/api/events/detail/${ eventId }`
		this.setState({ loading: true });

		fetch( endpoint )
			.then(res => res.json())
			.then(res => {
			this.setState({
				data: res.event,
				error: res.error || null,
				loading: false,
				refreshing: false
			});
		})
		.catch(error => {
			this.setState({ error, loading: false })
		});
	}

	renderArtists() {
		const { artists } = this.state.data;
		let artistNodes = [];
		artists ? artists.forEach( artist => artistNodes.push( <Text style={ styles.artist } key={ artist }>{ artist }</Text> ) ) : false
		return artistNodes;
	}

	render(){
		const { data } = this.state;
		return (
			<ThemeProvider>
				{
					this.state.loading ? <Text>Loading...</Text> : 
					<View style={{ margin: 12 }}>
						<Text style={ styles.label }>Event</Text>
						<Text style={ styles.name }>{ data.name }</Text>
						<Text style={ styles.label }>Venue</Text>
						<Text style={ styles.venue }>{ data.venue }</Text>
						<Text style={ styles.label }>Artists</Text>
						{
							this.renderArtists()
						}
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
				}
			</ThemeProvider>
		);
	}
}

const styles = StyleSheet.create({
	name: {
		fontFamily: 'authentic',
		fontSize: 36,
		marginBottom: 8
	},
	venue: {
		fontFamily: 'authentic',
		fontSize: 28,
		marginBottom: 8
	},
	artist: {
		fontFamily: 'authentic',
		fontSize: 28,
		marginBottom: 8
	},
	label: {
		fontFamily: 'authentic',
		fontSize: 20,
		color: '#444'
	},
});
