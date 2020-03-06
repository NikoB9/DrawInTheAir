/*
 * Ressource utile
 * https://stackoverflow.com/questions/38098217/how-to-access-image-pixel-data-in-react-native
 * */

import {
  Button,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  NativeModules,
} from 'react-native';
import React, {Component} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import BluetoothSerial from 'react-native-bluetooth-serial';
import Toast from 'react-native-simple-toast';

class ModalCropPicGalleryBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profil: require('../Icons/images-solid-79x70.png'),
      path: '',
    };
    // this.setState est appelé dans un callback dans showImagePicker, pensez donc bien à binder la fonction _profilClicked
    this._profilClicked = this._profilClicked.bind(this);
  }

  _profilClicked() {
    ImagePicker.openPicker({
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
        });
      })
      .catch(e => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  }

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

          alert(pixtosend);
        })
        .catch(err => {
          console.error(err);
        });
      if (this.props.connectedDevice != '') {
        BluetoothSerial.write('x image : ' + image + '$')
          .then(res => {
            Toast.show("L'envoie s'est déroulé avec succès");
            console.log(res);
          })
          .catch(err => Toast.show(err.message));
      } else {
        Toast.show("L'envoie a échoué. Veuillez vous connecter à un appareil");
      }
      console.log(image);
    }
  };

  render() {
    return (
      <View>
        <View style={styles.ModalBody}>
          <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={this._profilClicked}>
            <Image style={styles.avatar} source={this.state.profil} />
          </TouchableOpacity>
        </View>

        <View style={styles.ModalFooter}>
          <View style={styles.buttonContainer}>
            <Button
              title="Envoyer"
              onPress={() => {
                this.submit(this.state.path);
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    width: '100%',
  },
  spaceDivider: {
    width: 15,
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
  touchableOpacity: {
    margin: 5,
    width: 250, // Pensez bien à définir une largeur ici, sinon toute la largeur de l'écran sera cliquable
    height: 175,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 250,
    height: 175,
    borderColor: '#9B9B9B',
  },
});

export default ModalCropPicGalleryBody;
