import { PropTypes } from 'prop-types';
import React from 'react';
import { PanResponder, View } from 'react-native';

/* global Alert */

export default class TouchableView extends React.Component {
  static propTypes = {
    onTouchesBegan: PropTypes.func.isRequired,
    onTouchesMoved: PropTypes.func.isRequired,
    onTouchesEnded: PropTypes.func.isRequired,
    onTouchesCancelled: PropTypes.func.isRequired,
  };

  _panResponder;
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: ({ nativeEvent }, gestureState) =>
        this.props.onTouchesBegan({ ...nativeEvent, gestureState }),
      onPanResponderMove: ({ nativeEvent }, gestureState) =>
        this.props.onTouchesMoved({ ...nativeEvent, gestureState }),
      onPanResponderRelease: ({ nativeEvent }, gestureState) =>
        this.props.onTouchesEnded({ ...nativeEvent, gestureState }),
      onPanResponderTerminate: ({ nativeEvent }, gestureState) =>
        this.props.onTouchesCancelled
          ? this.props.onTouchesCancelled({ ...nativeEvent, gestureState })
          : this.props.onTouchesEnded({ ...nativeEvent, gestureState }),
    });
  }

  render() {
    return <View {...this.props} {...this._panResponder.panHandlers} />;
  }
}
