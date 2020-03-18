import React, {Component} from 'react';
import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  NativeModules,
} from 'react-native';

import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-crop-picker';
import BluetoothSerial from 'react-native-bluetooth-serial';

class ModalDraw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profil: '',
      path: '',
      pictureChoosen: false,
    };
  }

  profilClicked = p => {
    console.log(p.substring(1));
    console.log(p);
    ImagePicker.openPicker({
      path: 'storage/emulated/0/Pictures/AirDrawing/',
      width: 50,
      height: 35,
      cropping: true,
      cropperCircleOverlay: false,
      sortOrder: 'none',
      compressImageMaxWidth: 50,
      compressImageMaxHeight: 35,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    })
        .then(image => {
          console.log('received image', image);
          let requireSource = {uri: image.path};
          this.setState({
            profil: requireSource,
            path: image.path,
            pictureChoosen: true,
          });
        })
        .catch(e => {
          console.log(e);
          Alert.alert(e.message ? e.message : e);
        });
  };

  submit = image => {
    if (image != '') {
      image = image.substring(8);
      console.log(image);
      NativeModules.Bitmap.getPixels(image)
          .then(image => {
            console.log('Width : ' + image.width);
            console.log('Height : ' + image.height);

            var pixtosend = [];

            for (let y = 0; y < image.height; y++) {
              for (let x = 0; x < image.width; x++) {
                const offset = image.width * y + x;
                const pixel = image.pixels[offset];
                const r = pixel.substring(2, 4);
                const g = pixel.substring(4, 6);
                const b = pixel.substring(6);
                pixtosend.push(parseInt(g, 16));
                pixtosend.push(parseInt(b, 16));
                pixtosend.push(parseInt(r, 16));
              }
            }

            if (this.props.connectedDevice != '') {
              BluetoothSerial.write('x')
                  .then(res => {
                    //Toast.show("L'envoie s'est déroulé avec succès");
                    //console.log(res);
                  })
                  .catch(err => Toast.show(err.message));

              for (const data of pixtosend) {
                BluetoothSerial.write(data)
                    .then(res => {
                      //Toast.show("L'envoie s'est déroulé avec succès");
                      //console.log(res);
                    })
                    .catch(err => Toast.show(err.message));
              }

              BluetoothSerial.write('$')
                  .then(res => {
                    //Toast.show("L'envoie s'est déroulé avec succès");
                    //console.log(res);
                  })
                  .catch(err => Toast.show(err.message));
            } else {
              Toast.show(
                  "L'envoie a échoué. Veuillez vous connecter à un appareil",
              );
            }
          })
          .catch(err => {
            console.error(err);
          });
      console.log(image);
    }
  };

  render() {
    return (
        <View>
          <View style={styles.ModalBody}>
            <View style={styles.container}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <RNSketchCanvas
                    containerStyle={{backgroundColor: 'transparent', flex: 1}}
                    canvasStyle={{backgroundColor: 'transparent', flex: 1}}
                    onStrokeEnd={data => {}}
                    undoComponent={
                      <View style={styles.functionButton}>
                        <Text style={{color: 'white'}}>Retour</Text>
                      </View>
                    }
                    onUndoPressed={id => {
                      // Alert.alert('do something')
                    }}
                    clearComponent={
                      <View style={styles.functionButton}>
                        <Text style={{color: 'white'}}>Effacer</Text>
                      </View>
                    }
                    onClearPressed={() => {
                      // Alert.alert('do something')
                    }}
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
                        <Text style={{color: 'white'}}>Enregistrer</Text>
                      </View>
                    }
                    savePreference={() => {
                      return {
                        folder: 'AirDrawing',
                        filename:
                            'dessin_AirDrawing' +
                            String(Math.ceil(Math.random() * 100000000)),
                        transparent: false,
                        imageType: 'png',
                      };
                    }}
                    onSketchSaved={(success, path) => {
                      Toast.show(success ? 'Image enregistrée!' : 'Erreur!');
                      //console.log(path);
                      this.setState({path: path});
                    }}
                    onPathsChange={pathsCount => {
                      console.log('pathsCount', pathsCount);
                    }}
                />
              </View>
            </View>
          </View>

          <View style={styles.ModalFooter}>
            <View style={styles.buttonContainer}>
              {!this.state.pictureChoosen ? (
                  <Button
                      title="Recadrer"
                      onPress={() => {
                        this.profilClicked(this.state.path);
                      }}
                  />
              ) : (
                  <Button
                      title="Envoyer"
                      onPress={() => {
                        this.submit(this.state.path);
                      }}
                  />
              )}
            </View>
          </View>
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
    width: 90,
    backgroundColor: '#39579A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    width: '100%',
  },
  ModalBody: {
    height: '90%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ModalFooter: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModalDraw;

AppRegistry.registerComponent('ModalDraw', () => ModalDraw);
