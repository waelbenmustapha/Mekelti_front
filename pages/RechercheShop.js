import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getDistance } from 'geolib';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

export default function RechercheShop({ navigation,route }) {
    const [chefs,setchefs]=useState(null);
    const [location,setLocation]=useState(null)
   async function getshops()
   {
       await axios.get("http://192.168.1.60:8095/shop/findbyshopname/shop").then(res => {

        setchefs(res.data);
        console.log("reslt is")
        console.log(res.data)
      });
   } 
    useEffect(() => {
        getshops();
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
      if(chefs==null||location==null){return(<View><Text>Loading</Text></View>)}
      else{
    return(
        <View><FlatList
        keyExtractor={(item) => `key-${item.id}`}
        data={chefs}
        renderItem={({ item }) => (
          <TouchableOpacity style={{borderWidth:1}} onPress={() => navigation.navigate("Shop",{l:item})} >
    <Text>{item.shop.nom}</Text>
    <Image style={{height:100,width:100}} source={{uri:item.shop.image}}/>
    <Text>{(getDistance(
    { latitude: location.coords.latitude, longitude: location.coords.longitude },
    { latitude: item.shop.latitude, longitude: item.shop.longitude }
)/1000).toFixed(1)} KM</Text>
    </TouchableOpacity>)}/>
    </View>
    )
}}