import React from 'react';
import moment from 'moment';
import { ListItem } from 'react-native-elements';

export default class Event extends React.PureComponent {
  render(){
    const { item } = this.props;
    const distance = `${Math.round(item.distance / 100) / 10}km`;
    const date = moment(item.startTimeUTC).format("LT");
    return (
      <ListItem
		chevron={ true }
        containerStyle={{ alignItems: 'flex-start', marginTop: 10, marginBottom: 10, backgroundColor: 'transparent' }}
        onPress={ () => this.props.navigation.navigate( 'EventDetail', {
			data: item
        })}
        subtitle={ date + ' at ' + item.venue }
        title={ item.name }
		titleStyle={{ fontFamily: 'authentic', fontSize: 22 }}
        rightTitle={ distance }
        rightTitleStyle={{ textAlign: 'right' }}
		underlayColor={ '#eee' }
      />
    );
  }
}
