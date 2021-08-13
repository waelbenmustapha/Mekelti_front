import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,} from "react-native";
  import { createStackNavigator } from '@react-navigation/stack';
  import 'react-native-gesture-handler';
  import { NavigationContainer } from '@react-navigation/native';
import ConnectedUtilisateur from './pages/ConnectedUtilisateur';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Map from './pages/map';
import Shop from "./pages/shop";
import ConnectedChef from "./pages/ConnectedChef";
import RechercheShop from "./pages/RechercheShop";
import Tabs from "./pages/Tabs";
import TabsChef from "./pages/TabsChef";
export default function App() {
  const Stack = createStackNavigator();

  return (

 <NavigationContainer><Stack.Navigator >
<Stack.Screen name="Home" component={Home} />

<Stack.Screen options={{title:'Meklti'}} name="Tabs" component={Tabs} />

<Stack.Screen name="SignUp" component={SignUp} />
<Stack.Screen name="TabsChef" component={TabsChef} />

<Stack.Screen name="RechercheShop" component={RechercheShop} />

    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="Shop" component={Shop} />
    
    <Stack.Screen name="ConnectedUtilisateur" component={ConnectedUtilisateur} />
  </Stack.Navigator></NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  
});
