import React, { Component, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import {
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
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { sendPushNotification } from './notifications'
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default function SignUp({ navigation }) {
  // Declare a new state variable, which we'll call "count"
  const [email, setEmail] = useState(null);
  const [emailcorrect, setemailcorrect] = useState(null);
  const notificationListener =  React.useRef();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const responseListener = React.useRef();
  const [password, setPassword] = useState(null);
  const [passwordvalide, setpasswordvalide] = useState(true);
  const [notiftoken,setnotiftoken]=useState();
  useEffect(()=>{
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
 },[]);
 async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}

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
 
  const Connect = () => {
    const req = {
      "email": email,
      "motDePasse": password,
      "notification":expoPushToken
    }
      axios.post("http://192.168.1.60:8095/Authentification/login", req)
        .then(res => {
            AsyncStorage.setItem("token", res.data)
            .then(axios.get("http://192.168.1.60:8095/Authentification/userbytoken/" + res.data).then(response => {
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
            }));
        },
          err => {
            Alert.alert("Login ou mot de passe invalide!")
          }
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.bgImage}
        source={require('./meklti.png')}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={{ flex: 2, justifyContent: "flex-end" }}>

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
            onPress={() => Connect()}
          >
            <Text style={styles.loginText}>Se Connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.btnText}>Vous n'avez pas un compte?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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



