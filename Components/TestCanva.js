import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';

import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';

export default class TestCanva extends Component {
  constructor(props) {
    super(props);

    this.state = {
      example: 0,
      color: '#FF0000',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.example === 1 && (
          <View style={{flex: 1, flexDirection: 'row'}}>
            <RNSketchCanvas
              containerStyle={{backgroundColor: 'transparent', flex: 1}}
              canvasStyle={{backgroundColor: 'transparent', flex: 1}}
              onStrokeEnd={data => {}}
              closeComponent={
                <View style={styles.functionButton}>
                  <Text style={{color: 'white'}}>Close</Text>
                </View>
              }
              onClosePressed={() => {
                this.setState({example: 0});
              }}
              undoComponent={
                <View style={styles.functionButton}>
                  <Text style={{color: 'white'}}>Undo</Text>
                </View>
              }
              onUndoPressed={id => {
                // Alert.alert('do something')
              }}
              clearComponent={
                <View style={styles.functionButton}>
                  <Text style={{color: 'white'}}>Clear</Text>
                </View>
              }
              onClearPressed={() => {
                // Alert.alert('do something')
              }}
              eraseComponent={
                <View style={styles.functionButton}>
                  <Text style={{color: 'white'}}>Eraser</Text>
                </View>
              }
              strokeComponent={color => (
                <View
                  style={[{backgroundColor: color}, styles.strokeColorButton]}
                />
              )}
              strokeSelectedComponent={(color, index, changed) => {
                return (
                  <View
                    style={[
                      {backgroundColor: color, borderWidth: 2},
                      styles.strokeColorButton,
                    ]}
                  />
                );
              }}
              strokeWidthComponent={w => {
                return (
                  <View style={styles.strokeWidthButton}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        marginHorizontal: 2.5,
                        width: Math.sqrt(w / 3) * 10,
                        height: Math.sqrt(w / 3) * 10,
                        borderRadius: (Math.sqrt(w / 3) * 10) / 2,
                      }}
                    />
                  </View>
                );
              }}
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              saveComponent={
                <View style={styles.functionButton}>
                  <Text style={{color: 'white'}}>Save</Text>
                </View>
              }
              savePreference={() => {
                return {
                  folder: 'DrawInTheAir',
                  filename:
                    'dessinDrawInTheAir' +
                    String(Math.ceil(Math.random() * 100000000)),
                  transparent: false,
                  imageType: 'png',
                };
              }}
              onSketchSaved={(success, path) => {
                Alert.alert(
                  success ? 'Image saved!' : 'Failed to save image!',
                  path,
                );
              }}
              onPathsChange={pathsCount => {
                console.log('pathsCount', pathsCount);
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#39579A',
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: '#39579A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

AppRegistry.registerComponent('TestCanva', () => TestCanva);
