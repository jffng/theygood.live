import React from 'react';
import { View, ScrollView, Text, StyleSheet, Linking } from 'react-native';
import { Button, ThemeProvider, Divider } from 'react-native-elements';
import { MapView } from 'expo';
import openMap from 'react-native-open-maps';

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
		const mapOptions = {
			query: data ? data.venue + ', ' + data.address + ', ' + data.city : null,
			travelType: 'walk',
			provider: 'google'
		};
		return (
			<ThemeProvider>
				{
					this.state.loading ? <Text>Loading...</Text> : 
					<ScrollView style={{ marginLeft: 12, marginRight: 12 }}>
						<Text style={ styles.label }>Event</Text>
						<Text style={ styles.name }>{ data.name }</Text>
						<Divider style={{ backgroundColor: '#CED0CE' }} />
						<Text style={ styles.label }>Artists</Text>
						{
							this.renderArtists()
						}
						<Divider style={{ backgroundColor: '#CED0CE' }} />
						<Text style={ styles.label }>Cover / Tickets</Text>
						<Button title={ data.isSoldOut ? 'Sold Out' : data.priceAsString } type="clear" containerStyle={{ alignItems: "flex-start" }} buttonStyle={{ padding: 0, marginBottom: 0 }} titleStyle={ styles.venue } onPress={ () => Linking.openURL( data.ticketsURL || data.url ) } />
						<Text style={ styles.venue }>{  }</Text>
						<Divider style={{ backgroundColor: '#CED0CE' }} />
						<Text style={ styles.label }>Venue</Text>
						<Button title={ data.venue } type="clear" containerStyle={{ alignItems: "flex-start" }} buttonStyle={{ padding: 0, marginBottom: 8 }} titleStyle={ styles.venue } onPress={ () => openMap( mapOptions ) } />
						<Divider style={{ backgroundColor: '#CED0CE' }} />
						<Text style={ styles.label }>Description</Text>
						<Text style={ styles.description }>{ data.description }</Text>
					</ScrollView>
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
		textAlign: 'left'
	},
	artist: {
		fontFamily: 'authentic',
		fontSize: 28,
		marginBottom: 8
	},
	description: {
		fontFamily: 'authentic',
		fontSize: 22,
		marginBottom: 8
	},
	label: {
		fontFamily: 'authentic',
		fontSize: 20,
		marginTop: 12,
		marginBottom: 4,
		color: '#444'
	},
});
