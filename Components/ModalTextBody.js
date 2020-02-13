import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {TriangleColorPicker, fromHsv} from 'react-native-color-picker';
import React, {Component} from 'react';
import BluetoothSerial from 'react-native-bluetooth-serial';
import Toast from 'react-native-simple-toast';

class ModalTextBody extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    message: '',
    textColor: '#ffffff',
    backgroundColor: '#000000',
  };

  handleTextMessage = text => {
    this.setState({message: text});
  };

  handleTextColor = color => {
    this.setState({textColor: fromHsv(color)});
  };

  handleBackgroundColor = color => {
    this.setState({backgroundColor: fromHsv(color)});
  };

  submit = (message, textColor, backgroundColor) => {
    alert(
      'message : ' +
        message +
        ' ; couleur du texte : ' +
        textColor +
        ' ; couleur de fond : ' +
        backgroundColor,
    );

    BluetoothSerial.write(
      'message : ' +
        message +
        ' ; couleur du texte : ' +
        textColor +
        ' ; couleur de fond : ' +
        backgroundColor,
    )
      .then(res => {
        Toast.show("L'envoie s'est déroulé avec succès");
      })
      .catch(err => Toast.show(err.message));
  };

  render() {
    return (
      <View>
        <View style={styles.ModalBody}>
          <Text>Entrer le message à transférer</Text>
          <TextInput
            name="Message"
            onChangeText={this.handleTextMessage}
            value={this.state.message}
            placeholder="Message"
            style={{
              height: 50,
              width: 200,
              backgroundColor: '#DDDDDD',
              marginTop: 16,
            }}
          />
          <View style={{flex: 1, padding: 45}}>
            <Text>Couleur du texte : </Text>
            <TriangleColorPicker
              oldColor="white"
              onColorChange={this.handleTextColor}
              onColorSelected={color => console.log(`Color selected: ${color}`)}
              style={{flex: 1}}
            />
            <Text />
            <Text />
            <Text>Couleur de fond : </Text>
            <TriangleColorPicker
              oldColor="black"
              onColorChange={this.handleBackgroundColor}
              onColorSelected={color => console.log(`Color selected: ${color}`)}
              style={{flex: 1}}
            />
          </View>
        </View>

        <View style={styles.ModalFooter}>
          <View style={styles.buttonContainer}>
            <Button
              title="Envoyer"
              onPress={() => {
                this.submit(
                  this.state.message,
                  this.state.textColor,
                  this.state.backgroundColor,
                );
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
});

export default ModalTextBody;
