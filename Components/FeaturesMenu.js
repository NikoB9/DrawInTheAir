import React, {Component} from 'react';
//import rect in our project
import {
  StyleSheet,
  View,
  Image,
  Text,
  Modal,
  TouchableOpacity,
  Button,
} from 'react-native';
//import all the components we will need
import ModalTextBody from './ModalTextBody';
import ModalCropPicGalleryBody from './ModalCropPicGalleryBody';

export default class FeaturesMenu extends Component {
  state = {
    modalVisibleText: false,
    modalVisibleDraw: false,
    modalVisibleLibrary: false,
    modalVisibleGalery: false,
  };

  setModalTextVisible(visible) {
    this.setState({modalVisibleText: visible});
  }

  setModalDrawVisible(visible) {
    this.setState({modalVisibleDraw: visible});
  }

  setModalLibraryVisible(visible) {
    this.setState({modalVisibleLibrary: visible});
  }

  setModalGaleryVisible(visible) {
    this.setState({modalVisibleGalery: visible});
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisibleText}
          position={'center'}
          onRequestClose={() => {
            this.setModalTextVisible(!this.state.modalVisibleText);
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.ModalInsideView}>
              <TouchableOpacity
                style={styles.touchableCloseIcon}
                onPress={() => {
                  this.setModalTextVisible(!this.state.modalVisibleText);
                }}>
                <Image
                  style={styles.closeIcon}
                  source={require('../Icons/close.png')}
                />
              </TouchableOpacity>
              <ModalTextBody />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisibleDraw}
          position={'center'}
          onRequestClose={() => {
            this.setModalDrawVisible(!this.state.modalVisibleDraw);
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.ModalInsideView}>
              <View style={styles.ModalBody}>
                <Text>POPUP POUR LE DESSIN EN COURS DE CREATION</Text>
              </View>

              <View style={styles.ModalFooter}>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Envoyer"
                    onPress={() => {
                      this.setModalDrawVisible(!this.state.modalVisibleDraw);
                    }}
                  />
                  <View style={styles.spaceDivider} />
                  <Button
                    title="Annuler"
                    color="red"
                    onPress={() => {
                      this.setModalDrawVisible(!this.state.modalVisibleDraw);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisibleLibrary}
          position={'center'}
          onRequestClose={() => {
            this.setModalLibraryVisible(!this.state.modalVisibleLibrary);
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.ModalInsideView}>
              <View style={styles.ModalBody}>
                <Text>POPUP POUR LA BIBLIOTHEQUE EN COURS DE CREATION</Text>
              </View>

              <View style={styles.ModalFooter}>
                <View style={styles.buttonContainer}>
                  <Button
                    title="Envoyer"
                    onPress={() => {
                      this.setModalLibraryVisible(
                        !this.state.modalVisibleLibrary,
                      );
                    }}
                  />
                  <View style={styles.spaceDivider} />
                  <Button
                    title="Annuler"
                    color="red"
                    onPress={() => {
                      this.setModalLibraryVisible(
                        !this.state.modalVisibleLibrary,
                      );
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisibleGalery}
          position={'center'}
          onRequestClose={() => {
            this.setModalGaleryVisible(!this.state.modalVisibleGalery);
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.ModalInsideView}>
              <TouchableOpacity
                style={styles.touchableCloseIcon}
                onPress={() => {
                  this.setModalGaleryVisible(!this.state.modalVisibleGalery);
                }}>
                <Image
                  style={styles.closeIcon}
                  source={require('../Icons/close.png')}
                />
              </TouchableOpacity>
              <ModalCropPicGalleryBody />
            </View>
          </View>
        </Modal>

        <View style={styles.MainContainer}>
          <TouchableOpacity
            onPress={() => {
              this.setModalTextVisible(true);
            }}>
            <View style={styles.imgContenainer}>
              <Image
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 70,
                  width: 79,
                }}
                source={require('../Icons/keyboard-solid-79x70.png')}
              />
              <Text style={{textAlign: 'center'}}>Message</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setModalDrawVisible(true);
            }}>
            <View style={styles.imgContenainer}>
              <Image
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 70,
                  width: 88,
                }}
                source={require('../Icons/dragon-solid-88x70.png')}
              />
              <Text style={{textAlign: 'center'}}>Dessin</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.MainContainer}>
          <TouchableOpacity
            onPress={() => {
              this.setModalLibraryVisible(true);
            }}>
            <View style={styles.imgContenainer}>
              <Image
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 70,
                  width: 70,
                }}
                source={require('../Icons/image-solid-70x70.png')}
              />
              <Text style={{textAlign: 'center'}}>Bibliothèque</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setModalGaleryVisible(true);
            }}>
            <View style={styles.imgContenainer}>
              <Image
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 70,
                  width: 79,
                }}
                source={require('../Icons/images-solid-79x70.png')}
              />
              <Text style={{textAlign: 'center'}}>Galerie</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'space-around',
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    width: '100%',
  },
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
  ModalInsideView: {
    backgroundColor: 'rgba(241,249,246,0.93)',
    height: '80%',
    width: '90%',
    borderRadius: 10,
    borderWidth: 1,
    paddingTop: 20,
    borderColor: '#060606',
    justifyContent: 'space-between',
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
  imgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    height: 30,
    width: 30,
  },
  touchableCloseIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
});
