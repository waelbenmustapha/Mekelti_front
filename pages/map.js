import React, { Component, useEffect, useState } from "react";
import { RadioButton } from "react-native-paper";
import axios from "axios";
import { WebView } from "react-native-webview";
import { getDistance } from "geolib";
import StarRating from 'react-native-star-rating';

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
import MapView, { Callout } from "react-native-maps";
import * as Location from "expo-location";
export default function Map({ navigation }) {
  const [marker, setMarker] = useState(null);
  const [location, setLocation] = useState(null);
  const [chefs, setChefs] = useState(null);
  useEffect(() => {
    getchefs();
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  async function getchefs() {
    await axios.get("http://192.168.1.60:8095/chef/getall").then((resp) => {
      setChefs(resp.data);
    });
  }
  if (location == null || chefs == null) {
    return (
      <View>
        <Text>loading</Text>
      </View>
    );
  } else {
    return (
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
        {chefs.map((l, index) => (
          <MapView.Marker
            key={l.id}
            coordinate={{
              latitude: l.shop.latitude,
              longitude: l.shop.longitude,
            }}
          >
            <Callout
              onPress={() => navigation.navigate("Shop", { l })}
            >
          
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: 'space-between',
                }}
              >
                <View style={{justifyContent:'space-around',flex:1}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      margin: 5,
                      opacity:0.8,
                      textAlign:'center',
                    }}
                  >
                    {l.shop.nom}
                  </Text>
                  <Text style={{color:'#f9bb1a',fontSize:18}}>
                  À {(
                      getDistance(
                        {
                          latitude: location.coords.latitude,
                          longitude: location.coords.longitude,
                        },
                        {
                          latitude: l.shop.latitude,
                          longitude: l.shop.longitude,
                        }
                      ) / 1000
                    ).toFixed(1)}{" "}
                    km de vous
                  </Text>
                  <View
                        style={{
                            padding: 20,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                backgroundColor:'#FC6D3F',
                                alignItems: 'center',
                                borderRadius: 30
                            }}
                            onPress={() => {}}
                        >
                            <Text style={{ color: 'white',  }}>Consulter Shop</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ padding: 5,flex:1 }}>
                <StarRating
        disabled={false}
        maxStars={5}
        fullStarColor={"#f9bb1a"}
        starSize={30}
        rating={4}
      />
                  <WebView
                    style={{ height: 150, width: 150, borderWidth: 1 }}
                    source={{
                      uri: "https://nypost.com/wp-content/uploads/sites/2/2020/06/200618-outdoor-dining-phase2.jpg?quality=80&strip=all&w=618&h=410&crop=1",
                    }}
                  />
                </View>
              </View>
            </Callout>
          </MapView.Marker>
        ))}
      </MapView>
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
  bubble: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
    // marginBottom: -15
  },
  // Character name
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Character image
  image: {
    width: 100,
    height: 80,
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
