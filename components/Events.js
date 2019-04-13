import React from 'react';
import Event from './Event';
import { View, FlatList } from 'react-native';

export default class Events extends React.Component {
  keyExtractor = ( item, index ) => item.name;

  renderSeparator = () => {
    return (
      <View style={{
        height: 1,
        width: '100%',
        backgroundColor: '#CED0CE',
      }}
      />
    );
  };

  renderItem = ({item}) => {
    return ( <Event item={item}/> )
  }

  render (){
    return (
      <FlatList
        data={this.props.data}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={this.renderSeparator}
      />
    )
  } 
}
