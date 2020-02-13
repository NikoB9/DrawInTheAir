// Components/ImageFromGallery.js
import React from 'react';
import ImagePicker from 'react-native-image-picker';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
class ImageFromGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profil: require('../Icons/images-solid-79x70.png'),
    };
    // this.setState est appelé dans un callback dans showImagePicker, pensez donc bien à binder la fonction _profilClicked
    this._profilClicked = this._profilClicked.bind(this);
  }

  _profilClicked() {
    ImagePicker.showImagePicker({}, response => {
      if (response.didCancel) {
        console.log("L'utilisateur a annulé");
      } else if (response.error) {
        console.log('Erreur : ', response.error);
      } else {
        console.log('Photo : ', response.uri);
        let requireSource = {uri: response.uri};
        this.setState({
          profil: requireSource,
        });
      }
    });
  }
  render() {
    return (
      <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={this._profilClicked}>
        <Image style={styles.avatar} source={this.state.profil} />
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
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

export default ImageFromGallery;
