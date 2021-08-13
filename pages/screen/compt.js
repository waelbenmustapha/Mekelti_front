import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, Button } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
export default function App() {
  const [nom, setNom] = React.useState("");
  const [user,setuser]=useState(null);
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pictureone, setPictureone] = useState("");

  const [demstotal,setdemandestotal]=useState(0);
  const handleUploadOne = (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "meklti");
    data.append("cloud_name", "meklti");
    data.append("api_key", "872298167159271");
    data.append("timestamp", (Date.now() / 1000) | 0);
    axios
      .post("https://api.cloudinary.com/v1_1/meklti/image/upload", data)
      .then((response) => {
        setPictureone(response.data.url);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Erreur de téléchargement");
      });
  };
  let openImagePickerAsyncOne = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!data.cancelled) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(".")[1]}`,
        };
        handleUploadOne(newfile);
      }
    } else {
      Alert.alert("Il faut donner la permission");
    }
  };
  function modifierprofil()
  {
    axios.put(
        "http://192.168.1.60:8095/chef/modifiercompte",

        {
          id: user.id,
          nom: nom,
          motDePasse: password,
          image:pictureone,
          numeroTelephone: phone,
        },
        {},
        {}
      );
      Alert.alert("Compte Modifié");
    } 
  
  const getconnecteduser = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      {
        axios
          .get("http://192.168.1.60:8095/Authentification/userbytoken/" + token)
          .then((response) => {
              setNom(response.data.nom);
              setPhone(response.data.numeroTelephone);
              setPictureone(response.data.image);
            setuser(response.data);
             axios.get("http://192.168.1.60:8095/demande/getdemandeutilisateur/" + response.data.id).then((res) => {
setdemandestotal(res.data.length);
console.log(res.data);
          })
          })
          
          
      }
    } catch (e) {
      console.log("error");
    }
  };
  useEffect(()=>{getconnecteduser()},[])
  if(user==null)
  {
    return (<Text>Loading</Text>)
  }
  else{
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignSelf: "center" }}>
          <View style={styles.profileImage}>
            <Image
              source={{
                uri: pictureone,
              }}
              style={styles.image}
              resizeMode="center"
            ></Image>
          </View>

          <View style={styles.active}></View>
          <TouchableOpacity style={styles.add} onPress={()=>{openImagePickerAsyncOne()}}>
            <Ionicons
              name="ios-add"
              size={48}
              color="#DFD8C8"
              style={{ marginTop: 6, marginLeft: 2 }}
            ></Ionicons>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>
            {user.nom}
          </Text>
          <Text style={[styles.text, { color: "#AEB5BC", fontSize: 14 }]}>
{user.email}</Text>
        </View>

        {user.role!=="Chef"?<View style={styles.statsContainer}>
          <View style={styles.statsBox}>
            <Text style={[styles.text, { fontSize: 24 }]}>{demstotal}</Text>
            <Text style={[styles.text, styles.subText]}>Commandes</Text>
          </View>
          <View
            style={[
              styles.statsBox,
              {
                borderColor: "#DFD8C8",
                borderLeftWidth: 1,
                borderRightWidth: 1,
              },
            ]}
          >
            <Text style={[styles.text, { fontSize: 24 }]}>{user.favoris.length}</Text>
            <Text style={[styles.text, styles.subText]}>favoris</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={[styles.text, { fontSize: 24 }]}>302</Text>
            <Text style={[styles.text, styles.subText]}>Following</Text>
          </View>
        </View>:null}
        <Text
          style={[
            styles.text,
            {
              color: "#AEB5BC",
              fontSize: 14,
              textAlign: "center",
              marginTop: 10,
            },
          ]}
        >
          Modifier compte
        </Text>
        <TextInput
          label="Nom"
          style={{ width: "80%", alignSelf: "center", marginVertical: 10 }}
          value={nom}
          mode={"outlined"}
          onChangeText={(text) => setNom(text)}
        />
        <TextInput
          label="Numero telephone"
          style={{ width: "80%", alignSelf: "center", marginVertical: 10 }}
          value={phone}
          mode={"outlined"}
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
        label={"Mot de passe"}
          placeholder={"Si vous ne voulez pas modifier le mot de passe, laissez-le vide"}
          style={{ width: "80%", alignSelf: "center", marginVertical: 10 }}
          value={password}
          secureTextEntry={true}
          mode={"outlined"}
          onChangeText={(text) => setPassword(text)}
        />
        
          <Button icon="content-save" style={{height:40,width:'60%',margin:10,alignSelf:'center'}} mode="contained" onPress={() => modifierprofil()}>
    Modifier
  </Button>
      </ScrollView>
    </SafeAreaView>
  );
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  text: {
    fontFamily: "HelveticaNeue",
    color: "#52575D",
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16,
  },
  subText: {
    fontSize: 12,
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  profileImage: {
    width: 150,
    marginTop: 30,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
  },
  dm: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    backgroundColor: "#34FFB9",
    position: "absolute",
    bottom: 28,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  add: {
    backgroundColor: "#41444B",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32,
  },
  statsBox: {
    alignItems: "center",
    flex: 1,
  },
  mediaImageContainer: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  mediaCount: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: "50%",
    marginTop: -50,
    marginLeft: 30,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.38)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 1,
  },
  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  activityIndicator: {
    backgroundColor: "#CABFAB",
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20,
  },
});
