import React, {Component} from 'react';
import {View} from 'react-native';
import Drawer from 'react-native-drawer';

class ModalDraw extends Component {
  closeControlPanel = () => {
    this._drawer.close();
  };
  openControlPanel = () => {
    this._drawer.open();
  };
  render() {
    return (
      <View>
        //Parallax Effect (slack style)
        <Drawer
          type="static"
          openDrawerOffset={100}
          tweenHandler={Drawer.tweenPresets.parallax}>
          <View />
        </Drawer>
        //Material Design Style Drawer
        <Drawer
          type="overlay"
          tapToClose={true}
          openDrawerOffset={0.2} // 20% gap on the right side of drawer
          panCloseMask={0.2}
          closedDrawerOffset={-3}
          tweenHandler={ratio => ({
            main: {opacity: (2 - ratio) / 2},
          })}>
          <View />
        </Drawer>
      </View>
    );
  }
}

export default ModalDraw;
