import {
  Button,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
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
      width: 150,
      height: 120,
      cropping: true,
      cropperCircleOverlay: false,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
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
    console.log(image);
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
    width: 100, // Pensez bien à définir une largeur ici, sinon toute la largeur de l'écran sera cliquable
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 120,
    borderColor: '#9B9B9B',
    borderWidth: 2,
  },
});

export default ModalCropPicGalleryBody;
