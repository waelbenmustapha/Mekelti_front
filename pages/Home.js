import React, { Component, useEffect,useState } from "react";
import { ImageBackground,StyleSheet, Text, Image, View, TouchableOpacity } from "react-native";
import { icons, images } from "./constans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Home({ navigation }) {
  getconnecteduser = async () => {
    try {

      const token = await AsyncStorage.getItem('token');
      if(token){
        await axios.get("http://192.168.1.60:8095/Authentification/userbytoken/" + token).then(response => {
          if (response.data.role == 'Utilisateur') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Tabs' }],
            })              }
          else if (response.data.role == 'Chef') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'TabsChef' }],
            })  
    
          }
        })}
    } catch (error) {
console.log(error)    }
  };
  useEffect(() => {
    getconnecteduser();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={images.mekltii} style={styles.image}>
      
      <View style={styles.header}>
        <Image
          style={{
            alignSelf: "center",
            height: 200,
            width: 200,
            borderRadius: 150 / 2,
           
          
          }}
          source={ icons.meklti
          
        }
        />
      </View>
     
     
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignIn");
          }}
          style={{
            width: 130,
            borderWidth: 1,
            borderColor: "#6495ED",
            borderRadius: 55,
            height: 50,
            paddingHorizontal: 15,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              color: "#6495ED",
            }}
          >
            Se Connecter
          </Text>
        </TouchableOpacity>   
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
          style={{
            backgroundColor: "#6495ED",
            width: 130,
            borderWidth: 1,
            borderRadius: 55,
            height: 50,
            paddingHorizontal: 15,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              color: "black",
              opacity: 0.7,
            }}
          >
            S'inscrire
          </Text>
        </TouchableOpacity>
      </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  header: { flex: 1, justifyContent: "center" },
  body: { padding: 20, flex: 1 },
  footer: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
});
