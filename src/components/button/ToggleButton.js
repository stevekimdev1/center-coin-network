import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';

import ScalableImage from 'react-native-scalable-image';

export default class ToggleButton extends Component {
  render() {
    const { onoff, size } = this.props;
    return (
      <TouchableHighlight
        onPress={() => {
          this.props.onChange();
        }}
        hitSlop={{ top: 7, right: 7, bottom: 7, left: 7 }}
        underlayColor="#fefefe">
        {onoff ? (
          <ScalableImage
            source={require('../../img/common/lockon.png')}
            width={size ? size : 45}
          />
        ) : (
          <ScalableImage
            source={require('../../img/common/lockoff.png')}
            width={size ? size : 45}
          />
        )}
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({});
