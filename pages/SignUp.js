import React, { Component, useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";
import axios from "axios";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Picker,
  SafeAreaView,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
export default function SignUp({ navigation }) {
  // Declare a new state variable, which we'll call "count"
  const [type, setType] = useState("client");
  const [nom, setNom] = useState(null);
  const [livraison,setlivraison]=useState(null);
  const [numertelephone, setNumertelephone] = useState(null);
  const [email, setEmail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [marker, setMarker] = useState(null);
  const [location, setLocation] = useState(null);
  const [emailcorrect, setemailcorrect] = useState(null);
  const [password, setPassword] = useState(null);
  const [mobilevalide, setmobilevalide] = useState(true);
  const [passwordvalide, setpasswordvalide] = useState(true);
  const [shopname, setShopname] = useState(null);
  const [typeshop, setTypeshop] = useState(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      
      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High});
      console.log(location);
      setLocation(location);
    })();
  }, []);
  const validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) == false || email != "") {
      setemailcorrect(false);
    }

    if (reg.test(text) == true) {
      setemailcorrect(true);
    }
  };
  const validatepassword = (text) => {
    if (text.length < 8) {
      setpasswordvalide(false);
    } else {
      setpasswordvalide(true);
    }
  };
  const validatePhoneNumber = (text) => {
    let reg = /^[2,4,5,9][0-9]{7}$/;
    if (reg.test(text) === false) {
      setmobilevalide(false);
    } else {
      setmobilevalide(true);
    }
  };
  function ajouterutilisateur() {
    if (type == "Chef") {
      if (
        livraison!=null &&
        passwordvalide == true &&
        typeshop != null &&
        marker!=null&
        nom.length > 3 &&
        emailcorrect == true &&
        shopname.length > 2 &&
        mobilevalide == true
      ) {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        axios.post(
          "http://192.168.1.60:8095/Authentification/registerChef",
          {
            nom: nom,
            numeroTelephone: numertelephone,
            motDePasse: password,
            email: email,
            shop:{nom:shopname,
              type:typeshop,
              livraison:livraison,  
              latitude:marker.latitude,
              longitude:marker.longitude
            }
          },
          config,
          {}
        );
        Alert.alert(
          "Un e-mail de vérification a été envoyé à votre adresse e-mail"
        );
        navigation.navigate("SignIn");
      } else {
        Alert.alert("Vérifier vos données");
      }
    } else {
      if (
        passwordvalide == true &&
        nom.length > 0 &&
        emailcorrect == true &&
        mobilevalide == true
      ) {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        axios.post(
          "http://192.168.1.60:8095/Authentification/registerUser",
          {
            nom: nom,
            numeroTelephone: numertelephone,
            motDePasse: password,
            email: email,
          },
          config,
          {}
        );
        Alert.alert(
          "Un e-mail de vérification a été envoyé à votre adresse e-mail"
        );
        navigation.navigate("SignIn");
      } else {
        Alert.alert("Vérifier vos données");
      }
    }
  }
  if (location == null) {
    return (<View><Text>loading</Text></View>);
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          style={{ flex: 1 }}
        >
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.00522,
              longitudeDelta: 0.00521,
            }}
            showsUserLocation={true}
            onLongPress={(e) => setMarker(e.nativeEvent.coordinate)}
          >
            {marker && <MapView.Marker coordinate={marker} />}
          </MapView>
          <View style={{ position: "absolute", top: 0, right: 0, left: 0 }}>
            <Text
              style={{
                textAlign: "center",
                padding: 15,
                fontSize: 14,
                color: "#0dacfa",
              }}
            >
              Appuyez longuement sur un emplacement sur la carte Pour que les
              utilisateurs vous y trouvent
            </Text>
          </View>
          <View style={{ position: "absolute", bottom: 10, right: 0, left: 0 }}>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "white",
                backgroundColor: "#45d3f4",
                borderRadius: 15,
                justifyContent: "center",
                alignSelf: "center",
                height: 50,
                width: 160,
              }}
              onPress={() => {
                console.log(marker);
                setModalVisible(false);
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                sélectionner position
              </Text>
            </TouchableOpacity>
            
          </View>
        </Modal>
        <Image
          style={styles.bgImage}
          source={require('./meklti.png')}
        />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center",marginTop:10 }}
        >
          <View style={{ flex: 2, justifyContent: "flex-end" }}>
            <View
              style={[
                styles.inputContainer,
                nom == ""
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                    }
                  : {},
              ]}
            >
              <TextInput
                style={styles.inputs}
                placeholder="Nom et prénom"
                value={nom}
                onChangeText={(text) => {
                  setNom(text);
                }}
                underlineColorAndroid="transparent"
              />
              <Image
                style={styles.inputIcon}
                source={{
                  uri: "https://img.icons8.com/color/40/000000/circled-user-male-skin-type-3.png",
                }}
              />
            </View>
            <View
              style={[
                styles.inputContainer,
                emailcorrect == false
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                    }
                  : {},
              ]}
            >
              <TextInput
                style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={(text) => {
                  setEmail(text);
                  validate(text);
                }}
                underlineColorAndroid="transparent"
              />
              <Image
                style={styles.inputIcon}
                source={{
                  uri: "https://img.icons8.com/flat_round/40/000000/secured-letter.png",
                }}
              />
            </View>
            <View
              style={[
                styles.inputContainer,
                passwordvalide == false
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                    }
                  : {},
              ]}
            >
              <TextInput
                style={styles.inputs}
                placeholder="Mot De Passe"
                secureTextEntry={true}
                onChangeText={(text) => {
                  setPassword(text);
                  validatepassword(text);
                }}
                underlineColorAndroid="transparent"
              />
              <Image
                style={styles.inputIcon}
                source={{
                  uri: "https://img.icons8.com/color/40/000000/password.png",
                }}
              />
            </View>
            <View
              style={[
                styles.inputContainer,
                mobilevalide == false
                  ? {
                      borderWidth: 1,
                      borderColor: "red",
                    }
                  : {},
              ]}
            >
              <TextInput
                style={styles.inputs}
                placeholder="Numero Telephone"
                onChangeText={(text) => {
                  setNumertelephone(text);
                  validatePhoneNumber(text);
                }}
                underlineColorAndroid="transparent"
              />
              <Image
                style={styles.inputIcon}
                source={{
                  uri: "https://img.icons8.com/flat-round/64/000000/phone.png",
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#FFFFFF",
                borderRadius: 30,
                marginBottom: 20,
                shadowColor: "#808080",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
              }}
            >
              <Text
                style={{
                  textAlignVertical: "center",
                  fontSize: 17,
                  marginLeft: 16,
                  fontWeight: "bold",
                  opacity: 0.6,
                  color: "black",
                }}
              >
                vous êtes un{" "}
              </Text>
              <View
                style={{
                  backgroundColor: "#F2F2F2",
                  borderRadius: 30,
                  width: 150,
                  height: 45,
                  margin: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  alignContent: "center",
                  borderWidth: 1,
                  borderColor: "grey",
                  shadowColor: "#808080",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                }}
              >
                <Picker
                  selectedValue={type}
                  style={{ height: 50, width: 150 }}
                  onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                >
                  <Picker.Item label="Client" value="Client" />
                  <Picker.Item label="Chef" value="Chef" />
                </Picker>
              </View>
            </View>
            {type == "Chef" ? (
              <View>
                <View
                  style={[
                    styles.inputContainer,
                    shopname == ""
                      ? {
                          borderWidth: 1,
                          borderColor: "red",
                        }
                      : {},
                  ]}
                >
                  <TextInput
                    style={styles.inputs}
                    placeholder="Nom du Shop"
                    onChangeText={(text) => {
                      setShopname(text);
                    }}
                    underlineColorAndroid="transparent"
                  />
                  <Image
                    style={styles.inputIcon}
                    source={{
                      uri: "https://img.icons8.com/cute-clipart/64/000000/shop.png",
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    opacity: 0.75,
                    paddingBottom: 5,
                    marginTop:-7,
                    paddingHorizontal: 7,
                    fontWeight: "bold",
                  }}
                >
                  Type Shop
                </Text>
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 30,
                    width: 300,
                    height: 45,
                    marginBottom: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 3,
                    paddingRight: 7,
                    shadowColor: "#808080",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <RadioButton
                      value="Cafe"
                      status={typeshop === "Cafe" ? "checked" : "unchecked"}
                      onPress={() => setTypeshop("Cafe")}
                    />
                    <Text style={{ textAlignVertical: "center" }}>Café</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <RadioButton
                      value="restaurant"
                      status={
                        typeshop === "restaurant" ? "checked" : "unchecked"
                      }
                      onPress={() => setTypeshop("restaurant")}
                    />
                    <Text style={{ textAlignVertical: "center" }}>
                      Restaurant
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <RadioButton
                      value="patisserie"
                      status={
                        typeshop === "patisserie" ? "checked" : "unchecked"
                      }
                      onPress={() => setTypeshop("patisserie")}
                    />
                    <Text style={{ textAlignVertical: "center" }}>
                      Patisserie
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 30,
                    width: 300,
                    height: 45,
                    marginBottom: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    paddingHorizontal: 3,
                    paddingRight: 7,
                    shadowColor: "#808080",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                  }}
                >
               
        <View style={{flexDirection:'row'}}><Text style={{textAlignVertical:'center'}}>Fournit livraison</Text><RadioButton
        value={1}
        status={ livraison === 1 ? 'checked' : 'unchecked' }
        onPress={() =>  {setlivraison(1)}}
      /></View>
      <View style={{flexDirection:'row'}}><Text style={{textAlignVertical:'center'}}>Pas de livraison</Text><RadioButton
        value={0}
        status={ livraison === 0 ? 'checked' : 'unchecked' }
        onPress={() => {setlivraison(0)}}
      /></View>
</View>
                <View
              style={{
                padding:5,
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#FFFFFF",
                borderRadius: 30,
                marginBottom: 20,
                shadowColor: "#808080",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
              }}
            >
             
              <TouchableOpacity
              style={{flexDirection:'row',justifyContent:'space-between',flex:1}}
              onPress={() => setModalVisible(true)}
            >
               <Text
                style={{
                  textAlignVertical: "center",
                  fontSize: 17,
                  marginLeft: 16,
                  fontWeight: "bold",
                  opacity: 0.6,
                  color: "black",
                }}
              >
                Localiser votre shop{" "}
              </Text>
 <Image
          style={{marginRight:10,height:35,width:35}}
          source={{
            uri: "https://image.flaticon.com/icons/png/512/854/854878.png",
          }}
        /></TouchableOpacity>
            </View>
               
              </View>
            ) : null}
          </View>
          <View
            style={{
              alignContent: "flex-end",
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
           
            <TouchableOpacity
              style={[styles.buttonContainer, styles.loginButton]}
              onPress={() => ajouterutilisateur()}
            >
              <Text style={styles.loginText}>S'inscrire</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => navigation.navigate("SignIn")}
            >
              <Text style={styles.btnText}>Vous avez un compte?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const resizeMode = "center";

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: "center",
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 300,
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  btnByRegister: {
    height: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: 300,
    backgroundColor: "transparent",
  },
  loginButton: {
    backgroundColor: "#00b5ec",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
  loginText: {
    color: "white",
  },
  bgImage: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  textByRegister: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",

    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
