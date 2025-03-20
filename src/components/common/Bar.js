import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import color from '../../res/color';
import LinearGradient from 'react-native-linear-gradient';

class Bar extends Component {
  constructor(props) {
    super(props);
  }

  renderGradient() {
    return (
      <View style={{ justifyContent: 'center' }}>
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={[color.gradientColor, color.mainColor]}
          style={{
            borderRadius: 10,
            height: 5,
            width: 50
          }}
        ></LinearGradient>
        <Text
          style={{ color: color.mainColor, marginTop: 10, textAlign: 'center' }}
        >
          {this.props.text}
        </Text>
      </View>
    );
  }

  renderBasic() {
    return (
      <View style={{ justifyContent: 'center' }}>
        <View
          style={{
            backgroundColor: color.lightgray,
            borderRadius: 10,
            height: 5,
            width: 50
          }}
        />
        <Text
          style={{
            color: color.lightgray,
            marginTop: 10,
            textAlign: 'center'
          }}
        >
          {this.props.text}
        </Text>
      </View>
    );
  }

  render() {
    return this.props.gradient === true ? this.renderGradient() : this.renderBasic();
  }
}
export default Bar;
