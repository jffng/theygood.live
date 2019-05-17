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
        title={item.name}
		titleStyle={{ fontFamily: 'authentic-medium' }}
        containerStyle={{ alignItems: 'flex-start', marginTop: 10, marginBottom: 10 }}
        subtitle={ date }
        rightTitle={ item.venue }
        rightSubtitle={ distance }
        rightTitleStyle={{ textAlign: 'right' }}
        onPress={() => this.props.navigation.navigate('EventDetail', {
          data: item
        })}
      />
    );
  }
}
