import React, { useEffect, useState } from "react";
import { View,FlatList, Text,TouchableOpacity,Image } from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { getDistance } from 'geolib';

import AsyncStorage from "@react-native-async-storage/async-storage";
export default function favoris({ navigation,route }) {
    const [user, setuser] = useState(null);
  const [location,setLocation]=useState(null)

  const getconnecteduser = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      {
        axios
          .get("http://192.168.1.60:8095/Authentification/userbytoken/" + token)
          .then((response) => {
            setuser(response.data);
          });
      }
    } catch (e) {
      console.log("error");
    }
  };
  useEffect(() => {
    getconnecteduser();
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
  if (user == null||location==null)
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  else {
    return (
      <View>
        <FlatList
          keyExtractor={(item) => `key-${item.id}`}
          data={user.favoris}
          renderItem={({ item }) => 
          <TouchableOpacity style={{borderWidth:1}} onPress={() => navigation.navigate("Shop",{l:item})} >
          <Text>{item.shop.nom}</Text>
          <Image style={{height:100,width:100}} source={{uri:item.shop.image}}/>
          <Text>{(getDistance(
          { latitude: location.coords.latitude, longitude: location.coords.longitude },
          { latitude: item.shop.latitude, longitude: item.shop.longitude }
      )/1000).toFixed(1)} KM</Text>
          </TouchableOpacity>
        }
        />
      </View>
    );
  }
};
