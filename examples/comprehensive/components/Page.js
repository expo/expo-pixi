import React from 'react';

import Examples from '../Examples';
import List from './List';
import PixiBaseView from './PixiBaseView';

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

class Page extends React.Component {
  static navigationOptions = ({ navigation: { state: { params } } }) => ({
    title: (params || {}).title || 'Pixi.js',
  });

  get data() {
    return (this.props.navigation.state.params || {}).data || Examples;
  }

  onPress = item => {
    const { data } = this;
    const nextData = data[item];
    this.props.navigation.navigate('Page', {
      data: nextData,
      title: item,
    });
  };

  render() {
    const { data } = this;
    const shouldRenderPage = isFunction(data.default || {});
    if (shouldRenderPage) {
      return <PixiBaseView app={data.default} />;
    } else {
      const input = Object.keys(data);
      return <List data={input} onPress={this.onPress} />;
    }
  }
}

export default Page;
