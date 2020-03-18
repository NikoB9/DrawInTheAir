import React, {Component} from 'react';
import FeaturesMenu from './Components/FeaturesMenu';
import Toast from 'react-native-simple-toast';
import BluetoothSerial from 'react-native-bluetooth-serial';
import {Buffer} from 'buffer';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  Switch,
  TouchableHighlight,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import BluetoothConnection from './Components/BluetoothConnection';

/*import {
  //DebugInstructions,
  //ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';*/

global.Buffer = Buffer;
const iconv = require('iconv-lite');

const Button = ({title, onPress, style, textStyle}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.buttonText, textStyle]}>{title.toUpperCase()}</Text>
  </TouchableOpacity>
);

const DeviceList = ({
  devices,
  connectedId,
  showConnectedIcon,
  onDevicePress,
}) => (
  <ScrollView style={styles.container}>
    <View style={styles.listContainer}>
      {devices.map((device, i) => {
        return (
          <TouchableHighlight
            underlayColor="#DDDDDD"
            key={`${device.id}_${i}`}
            style={styles.listItem}
            onPress={() => onDevicePress(device)}>
            <View style={{flexDirection: 'row'}}>
              {showConnectedIcon ? (
                <View style={{width: 48, height: 48, opacity: 0.4}}>
                  {connectedId === device.id ? (
                    <Image
                      style={{
                        resizeMode: 'contain',
                        width: 24,
                        height: 24,
                        flex: 1,
                      }}
                      source={require('./Icons/ic_done_black_24dp.png')}
                    />
                  ) : null}
                </View>
              ) : null}
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>{device.name}</Text>
                <Text>{`<${device.id}>`}</Text>
              </View>
            </View>
          </TouchableHighlight>
        );
      })}
    </View>
  </ScrollView>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      unpairedDevices: [],
      connected: false,
      section: 0,
      modalBluetoothVisible: false,
      device: '',
    };
  }

  setModalBluetoothVisible(visible) {
    this.setState({modalBluetoothVisible: visible});
  }

  componentDidMount() {
    Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
      values => {
        const [isEnabled, devices] = values;
        this.setState({isEnabled, devices});
      },
    );

    BluetoothSerial.on('bluetoothEnabled', () =>
      Toast.show('Bluetooth activé'),
    );
    BluetoothSerial.on('bluetoothDisabled', () =>
      Toast.show('Bluetooth désactivé'),
    );
    BluetoothSerial.on('error', err => console.log(`Error: ${err.message}`));
    BluetoothSerial.on('connectionLost', () => {
      if (this.state.device) {
        Toast.show(
          `La connexion à l'appareil ${this.state.device.name} a été perdue`,
        );
      }
      this.setState({connected: false});
    });
  }

  /**
   * [android]
   * request enable of bluetooth from user
   */
  requestEnable() {
    BluetoothSerial.requestEnable()
      .then(res => this.setState({isEnabled: true}))
      .catch(err => Toast.show(err.message));
  }

  /**
   * [android]
   * enable bluetooth on device
   */
  enable() {
    BluetoothSerial.enable()
      .then(() => {
        this.setState({isEnabled: true});
      })
      .catch(err => Toast.show(err.message));
  }

  /**
   * [android]
   * disable bluetooth on device
   */
  disable() {
    BluetoothSerial.disable()
      .then(res => this.setState({isEnabled: false}))
      .catch(err => Toast.show(err.message));
  }

  /**
   * [android]
   * toggle bluetooth
   */
  toggleBluetooth(value) {
    if (value === true) {
      this.enable();
    } else {
      this.disable();
    }
  }

  /**
   * [android]
   * Discover unpaired devices, works only in android
   */
  discoverUnpaired() {
    if (this.state.discovering) {
      return false;
    } else {
      this.setState({discovering: true});
      BluetoothSerial.discoverUnpairedDevices()
        .then(unpairedDevices => {
          this.setState({unpairedDevices, discovering: false});
        })
        .catch(err => Toast.show(err.message));
    }
  }

  /**
   * [android]
   * Discover unpaired devices, works only in android
   */
  cancelDiscovery() {
    if (this.state.discovering) {
      BluetoothSerial.cancelDiscovery()
        .then(() => {
          this.setState({discovering: false});
        })
        .catch(err => Toast.show(err.message));
    }
  }

  /**
   * [android]
   * Pair device
   */
  pairDevice(device) {
    BluetoothSerial.pairDevice(device.id)
      .then(paired => {
        if (paired) {
          Toast.show(`Appareil ${device.name} appareillé avec succès`);
          const devices = this.state.devices;
          devices.push(device);
          this.setState({
            devices,
            unpairedDevices: this.state.unpairedDevices.filter(
              d => d.id !== device.id,
            ),
          });
        } else {
          Toast.show(`L'appareillage à ${device.name} a échoué`);
        }
      })
      .catch(err => Toast.show(err.message));
  }

  /**
   * Connect to bluetooth device by id
   * @param  {Object} device
   */
  connect(device) {
    this.setState({connecting: true});
    BluetoothSerial.connect(device.id)
      .then(res => {
        Toast.show(`Connecté à l'appareil ${device.name}`);
        this.setState({device, connected: true, connecting: false});
      })
      .catch(err => Toast.show(err.message));
  }

  /**
   * Disconnect from bluetooth device
   */
  disconnect() {
    BluetoothSerial.disconnect()
      .then(() => this.setState({connected: false}))
      .catch(err => Toast.show(err.message));
  }

  /**
   * Toggle connection when we have active device
   * @param  {Boolean} value
   */
  toggleConnect(value) {
    if (value === true && this.state.device) {
      this.connect(this.state.device);
    } else {
      this.disconnect();
    }
  }

  /**
   * Write message to device
   * @param  {String} message
   */
  write(message) {
    if (!this.state.connected) {
      Toast.show("Vous devez d'abord vous connecter à un appareil");
    }

    BluetoothSerial.write(message)
      .then(res => {
        Toast.show("L'envoie s'est déroulé avec succès");
        this.setState({connected: true});
      })
      .catch(err => Toast.show(err.message));
  }

  onDevicePress(device) {
    if (this.state.section === 0) {
      this.connect(device);
    } else {
      this.pairDevice(device);
    }
  }

  writePackets(message, packetSize = 64) {
    const toWrite = iconv.encode(message, 'cp852');
    const writePromises = [];
    const packetCount = Math.ceil(toWrite.length / packetSize);

    for (var i = 0; i < packetCount; i++) {
      const packet = new Buffer(packetSize);
      packet.fill(' ');
      toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize);
      writePromises.push(BluetoothSerial.write(packet));
    }

    Promise.all(writePromises).then(result => {});
  }

  render() {
    const activeTabStyle = {borderBottomWidth: 6, borderColor: '#009688'};
    return (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalBluetoothVisible}
          position={'center'}
          onRequestClose={() => {
            this.setModalTextVisible(!this.state.modalBluetoothVisible);
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.ModalInsideView}>
              <TouchableOpacity
                style={styles.touchableCloseIcon}
                onPress={() => {
                  this.setModalBluetoothVisible(
                    !this.state.modalBluetoothVisible,
                  );
                }}>
                <Image
                  style={styles.closeIcon}
                  source={require('./Icons/close.png')}
                />
              </TouchableOpacity>
              <View style={{flex: 1, marginTop: 10}}>
                <View style={styles.topBar}>
                  <Text style={styles.heading}>Connexion Bluetooth</Text>
                  {Platform.OS === 'android' ? (
                    <View style={styles.enableInfoWrapper}>
                      <Text style={{fontSize: 12, color: '#FFFFFF'}}>
                        {this.state.isEnabled ? 'on' : 'off'}
                      </Text>
                      <Switch
                        onValueChange={this.toggleBluetooth.bind(this)}
                        value={this.state.isEnabled}
                      />
                    </View>
                  ) : null}
                </View>

                {Platform.OS === 'android' ? (
                  <View
                    style={[
                      styles.topBar,
                      {justifyContent: 'center', paddingHorizontal: 0},
                    ]}>
                    <TouchableOpacity
                      style={[
                        styles.tab,
                        this.state.section === 0 && activeTabStyle,
                      ]}
                      onPress={() => this.setState({section: 0})}>
                      <Text style={{fontSize: 14, color: '#FFFFFF'}}>
                        APPAREILS CONNUS
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tab,
                        this.state.section === 1 && activeTabStyle,
                      ]}
                      onPress={() => this.setState({section: 1})}>
                      <Text style={{fontSize: 14, color: '#FFFFFF'}}>
                        APPAREILS INCONNUS
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {this.state.discovering && this.state.section === 1 ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ActivityIndicator style={{marginBottom: 15}} size={60} />
                    <Button
                      textStyle={{color: '#FFFFFF'}}
                      style={styles.buttonRaised}
                      title="Annuler la recherche"
                      onPress={() => this.cancelDiscovery()}
                    />
                  </View>
                ) : (
                  <DeviceList
                    showConnectedIcon={this.state.section === 0}
                    connectedId={this.state.device && this.state.device.id}
                    devices={
                      this.state.section === 0
                        ? this.state.devices
                        : this.state.unpairedDevices
                    }
                    onDevicePress={device => this.onDevicePress(device)}
                  />
                )}

                <View style={{alignSelf: 'flex-end', height: 52}}>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.fixedFooter}>
                    {Platform.OS === 'android' && this.state.section === 1 ? (
                      <Button
                        title={
                          this.state.discovering ? '... Recherche' : 'Découvrir'
                        }
                        onPress={this.discoverUnpaired.bind(this)}
                      />
                    ) : null}
                    {Platform.OS === 'android' && !this.state.isEnabled ? (
                      <Button
                        title="Activation"
                        onPress={() => this.requestEnable()}
                      />
                    ) : null}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            <View style={styles.body}>
              <View>
                <TouchableOpacity
                  style={styles.btBtn}
                  onPress={() => {
                    this.setModalBluetoothVisible(
                      !this.state.modalBluetoothVisible,
                    );
                  }}>
                  <Image
                    style={styles.bluetoothIco}
                    source={
                      this.state.connected
                        ? require('./Icons/bt-1-2.png')
                        : this.state.isEnabled
                        ? require('./Icons/bt.png')
                        : require('./Icons/bt-1.png')
                    }
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  Bienvenue sur{' '}
                  <Text style={styles.highlight}>Air Drawing</Text>
                </Text>
                <Text style={styles.sectionDescription}>
                  L'application dédiéé à notre support de persistance rétinienne.
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <FeaturesMenu connectedDevice={this.state.device} />
              </View>
              <View style={styles.sectionContainerRow}>
                <Image
                  style={{maxWidth: '100%'}}
                  source={require('./Icons/grouppic.png')}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
    marginBottom: 15,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionContainerRow: {
    marginTop: 32,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  container: {
    flex: 0.9,
    backgroundColor: '#F5FCFF',
  },
  topBar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 6,
    backgroundColor: '#4877a2',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
    color: '#FFFFFF',
  },
  enableInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    flex: 0.5,
    height: 56,
    justifyContent: 'center',
    borderBottomWidth: 6,
    borderColor: 'transparent',
  },
  connectionInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  connectionInfo: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 18,
    marginVertical: 10,
    color: '#238923',
  },
  listContainer: {
    borderColor: '#ccc',
    borderTopWidth: 0.5,
  },
  listItem: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    borderColor: '#ccc',
    borderBottomWidth: 0.5,
    justifyContent: 'center',
  },
  fixedFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    height: 36,
    margin: 5,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#4877a2',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonRaised: {
    backgroundColor: '#4877a2',
    borderRadius: 2,
    elevation: 2,
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
  bluetoothIco: {
    width: 20,
    height: 30,
    right: 1,
  },
  btBtn: {
    width: 20,
    height: 30,
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default App;
