import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Alert } from "react-native";
import { TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { sendPushNotification } from "./notifications";
export default function ConnectedChef({ navigation }) {
  const [chef, setChef] = useState(null);
  const [nomplat, setnomplat] = useState();
  const [recherche,setrecherche]=useState();
  const [selected, setselected] = useState(0);
  const [prix, setprix] = useState();
  const [pictureone, setPictureone] = useState("https://i.pinimg.com/originals/c6/dc/94/c6dc940457e1a8e6fc55082fd10dd04c.png");
  const [commands, setcommands] = useState();
  const [list, setlist] = useState(["salé", "sucré", "boisson"]);
  const [menusalé, setmenusalé] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("salé");
  const [menusucré, setmenusucré] = useState([]);
  const [menuboisson, setmenuboisson] = useState([]);
  const [Quantity, setquantity] = useState(0);
  const [modalsaléVisible, setModalsaléVisible] = useState(false);
  const [modalsucréVisible, setModalsucréVisible] = useState(false);
  const [modalboissonVisible, setModalboissonVisible] = useState(false);
  async function changerstatutcommande(id, statut) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.put(
      "http://192.168.1.60:8095/demande/changerstatut/" + statut + "/" + id,
      {},
      config,
      {}
    );
    getconnecteduser();
  }
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
        console.log(response.data);
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
  const ajoutermenu = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.post(
      "http://192.168.1.60:8095/shop/ajoutermenu/" + chef.shop.id,
      {
        nom: "nom menu",
        type: "salé",
        plats: menusalé,
      },
      config,
      {}
    );
    await axios.post(
      "http://192.168.1.60:8095/shop/ajoutermenu/" + chef.shop.id,
      {
        nom: "nom menu",
        type: "sucré",
        plats: menusucré,
      },
      config,
      {}
    );
    await axios.post(
      "http://192.168.1.60:8095/shop/ajoutermenu/" + chef.shop.id,
      {
        nom: "nom menu",
        type: "boisson",
        plats: menuboisson,
      },
      config,
      {}
    );
    getconnecteduser();
    Alert.alert("Menu ajouté");
  };

  const getconnecteduser = async () => {
    try {
      let token = await AsyncStorage.getItem("token");
      {
        axios
          .get("http://192.168.1.60:8095/Authentification/userbytoken/" + token)
          .then((response) => {
            setChef(response.data);
            axios
              .get(
                "http://192.168.1.60:8095/demande/getdemandechef/" +
                  response.data.id
              )
              .then((res) => {
                for (var i = 0; i < res.data.length; i++) {
                  var list = [];
                  for (var b = 0; b < res.data[i].plats.length; b++) {
                    var cont = 0;
                    for (var x = 0; x < res.data[i].plats.length; x++) {
                      if (res.data[i].plats[b].id == res.data[i].plats[x].id) {
                        cont++;
                      }
                    }
                    const newItem = {
                      id: res.data[i].plats[b].id,
                      nom: res.data[i].plats[b].nom,
                      image: res.data[i].plats[b].image,
                      quantite: cont,
                    };
                    var found;
                    found = false;
                    for (var h = 0; h < list.length; h++) {
                      if (list[h].id === newItem.id) {
                        found = true;
                      }
                    }
                    if (found == false) {
                      list.push(newItem);
                    }
                  }
                  res.data[i].plats = list;
                }
                setcommands(res.data);
                console.log(res.data);
              });
          });
      }
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => { 
    getconnecteduser();
    console.log("ALL good !!");
  }, []);

  if (chef == null) {
    return (
      <View>
        <Text style={{ fontSize: 30 }}>Loading ...</Text>
      </View>
    );
  } else if (chef.shop.menus.length == 0) {
    return (
      <ScrollView>
        <View>
          <Picker
            style={{ borderWidth: 1, height: 50 }}
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }
          >
            <Picker.Item label="Salé" value="salé" />
            <Picker.Item label="Sucré" value="sucré" />
            <Picker.Item label="Boisson" value="boisson" />
          </Picker>
        </View>
        {selectedLanguage == "salé" ? (
          <View
            style={{
              borderWidth: 1,
              margin: 25,
              padding: 10,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                marginVertical: 7,
              }}
            >
              menu salé
            </Text>
            {menusalé.map((l, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.card]}
                onPress={() => {}}
              >
                <View style={styles.cardContent}>
                  <Image
                    style={[styles.image, styles.imageContent]}
                    source={{
                      uri: l.image,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: 200,
                    }}
                  >
                    <Text style={styles.name}>{l.nom}</Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "bold",
                        color: "#f9a12eff",
                      }}
                    >
                      {l.prix} TND
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={{
                marginTop: 10,
                height: 38,
                width: 170,
                alignSelf: "center",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
                backgroundColor: "#00BFFF",
              }}
              onPress={() => {
                setModalsaléVisible(!modalsaléVisible);
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
                ajouter plat salé
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {selectedLanguage == "sucré" ? (
          <View
            style={{
              borderWidth: 1,
              margin: 25,
              padding: 10,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                marginVertical: 7,
              }}
            >
              menu sucré
            </Text>
            {menusucré.map((l, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.card]}
                onPress={() => {}}
              >
                <View style={styles.cardContent}>
                  <Image
                    style={[styles.image, styles.imageContent]}
                    source={{
                      uri: "https://i.pinimg.com/236x/0b/ec/ac/0becac7bbc59f079bdd84685658a0e13--round-stickers-clementine.jpg",
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: 200,
                    }}
                  >
                    <Text style={styles.name}>{l.nom}</Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "bold",
                        color: "#f9a12eff",
                      }}
                    >
                      {l.prix} TND
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={{
                marginTop: 10,
                height: 38,
                width: 170,
                alignSelf: "center",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
                backgroundColor: "#00BFFF",
              }}
              onPress={() => {
                setModalsucréVisible(!modalsucréVisible);
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
                ajouter un dessert
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {selectedLanguage == "boisson" ? (
          <View
            style={{
              borderWidth: 1,
              margin: 25,
              padding: 10,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                marginVertical: 7,
              }}
            >
              menu boisson
            </Text>
            {menuboisson.map((l, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.card]}
                onPress={() => {}}
              >
                <View style={styles.cardContent}>
                  <Image
                    style={[styles.image, styles.imageContent]}
                    source={{
                      uri: "https://i.pinimg.com/236x/0b/ec/ac/0becac7bbc59f079bdd84685658a0e13--round-stickers-clementine.jpg",
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: 200,
                    }}
                  >
                    <Text style={styles.name}>{l.nom}</Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "bold",
                        color: "#f9a12eff",
                      }}
                    >
                      {l.prix} TND
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={{
                marginTop: 10,
                height: 38,
                width: 170,
                alignSelf: "center",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
                backgroundColor: "#00BFFF",
              }}
              onPress={() => {
                setModalboissonVisible(!modalboissonVisible);
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
                ajouter un boisson
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalsaléVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalsaléVisible(!modalsaléVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ justifyContent: "space-between", width: 230 }}>
                <TextInput
                  onChangeText={(text) => {
                    setnomplat(text);
                  }}
                  placeholder={"nom plat"}
                  style={{
                    fontSize: 20,
                    borderBottomWidth: 1,
                    marginRight: 15,
                    textAlign:'center',
                    marginVertical: 15,
                  }}
                />
                <View style={{}}>
                  <TextInput
                    keyboardType="numeric"
                    placeholder={"prix"}
                    onChangeText={(text) => {
                      setquantity(text);
                    }}
                    style={{
                        textAlign:'center',
                      marginVertical: 15,
                      fontSize: 20,
                      borderBottomWidth: 1,
                    }}
                  >
                    {Quantity}
                  </TextInput>
                </View>
                <TouchableOpacity onPress={()=>{openImagePickerAsyncOne()}}><Image style={{height:90,width:90,borderRadius:45,borderWidth:1,alignSelf:'center',margin:15}} source={{uri:pictureone }}/></TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  const newItem = {
                    nom: nomplat,
                    prix: Quantity,
                    image: pictureone,
                  };
                  menusalé.push(newItem);
                  setModalsaléVisible(!modalsaléVisible);
                }}
              >
                <Text style={styles.textStyle}>Ajouter item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalsucréVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalsucréVisible(!modalsucréVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ justifyContent: "space-between", width: 230 }}>
                <TextInput
                  onChangeText={(text) => {
                    setnomplat(text);
                  }}
                  placeholder={"nom plat"}
                  style={{
                    fontSize: 20,
                    borderBottomWidth: 1,
                    marginRight: 15,
                    marginVertical: 15,
                  }}
                />
                <View style={{}}>
                  <TextInput
                    keyboardType="numeric"
                    placeholder={"prix"}
                    onChangeText={(text) => {
                      setquantity(text);
                    }}
                    style={{
                      marginVertical: 15,
                      fontSize: 20,
                      borderBottomWidth: 1,
                    }}
                  >
                    {Quantity}
                  </TextInput>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  const newItem = {
                    nom: nomplat,
                    prix: Quantity,
                    image: pictureone,
                  };
                  menusucré.push(newItem);
                  setModalsucréVisible(!modalsucréVisible);
                }}
              >
                <Text style={styles.textStyle}>menu sucré</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalboissonVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalboissonVisible(!modalboissonVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ justifyContent: "space-between", width: 230 }}>
                <TextInput
                  onChangeText={(text) => {
                    setnomplat(text);
                  }}
                  placeholder={"nom plat"}
                  style={{
                    fontSize: 20,
                    borderBottomWidth: 1,
                    marginRight: 15,
                    marginVertical: 15,
                  }}
                />
                <View style={{}}>
                  <TextInput
                    keyboardType="numeric"
                    placeholder={"prix"}
                    onChangeText={(text) => {
                      setquantity(text);
                    }}
                    style={{
                      marginVertical: 15,
                      fontSize: 20,
                      borderBottomWidth: 1,
                    }}
                  >
                    {Quantity}
                  </TextInput>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  const newItem = {
                    nom: nomplat,
                    prix: Quantity,
                    image: pictureone,
                  };
                  menuboisson.push(newItem);
                  setModalboissonVisible(!modalboissonVisible);
                }}
              >
                <Text style={styles.textStyle}>menu boisson</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={{
            marginTop: 30,
            height: 38,
            width: 170,
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30,
            backgroundColor: "#FFB81C",
          }}
          onPress={() => {
            ajoutermenu();
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
            ajouter les menus
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  } else {
    return (
      <View>
        
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setselected(0);
            }}
            style={{
              borderRadius: 25,
              backgroundColor: "orange",
              padding: 7,
              margin: 5,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                textAlign: "center",
                textAlignVertical: "center",
              }}
            >
              Commande en attente
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setselected(1);
            }}
            style={{
              borderRadius: 25,
              backgroundColor: "orange",
              padding: 7,
              margin: 5,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                textAlign: "center",
                textAlignVertical: "center",
              }}
            >
              Commande en cours
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setselected(2);
            }}
            style={{
              borderRadius: 25,
              backgroundColor: "orange",
              padding: 7,
              margin: 5,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                textAlign: "center",
                textAlignVertical: "center",
              }}
            >
              Commande terminé
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          keyExtractor={(item) => `key-${item.id}`}
          data={commands}
          renderItem={({ item }) => (
            <View>
              {item.statut == selected ? (
                <View>
                  <TouchableOpacity style={styles.card} onPress={() => {}}>
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        style={styles.image}
                        source={{
                          uri: item.utilisateur.image,
                        }}
                      />
                      <View style={styles.cardContent}>
                        <Text style={styles.name}>
                          {item.utilisateur.nom} :{" "}
                          {item.utilisateur.numeroTelephone}
                        </Text>
                        {item.livraison==1?(<Text style={{fontWeight:'500'}}>À livrer</Text>):<Text style={{fontWeight:'900',fontSize:16,color:'#3399ff'}}>Réserver</Text>}
                        <FlatList
                          style={{
                            flex: 1,
                            alignSelf: "flex-end",
                            alignItems: "flex-end",
                          }}
                          keyExtractor={(item) => `key-${item.id}`}
                          data={item.plats}
                          renderItem={({ item }) => (
                            <View>
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: "700",
                                  opacity: 0.7,
                                }}
                              >
                                {item.nom} : x{item.quantite}
                              </Text>
                            </View>
                          )}
                        />
                        <Text style={{
                            flex: 1,
                            marginTop:10,
                            alignSelf: "flex-end",
                            alignItems: "flex-end",
                            fontSize:14,
                            fontWeight:'bold',
                            color:'#E1B530'
                          }}>TOTAL : {item.montant} TND</Text>
                      </View>
                    </View>
                    {item.statut == 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          margin: 10,
                        }}
                      >
                        <TouchableOpacity
                          style={styles.followButton}
                          onPress={() => {
                            changerstatutcommande(item.id, 1);
                            sendPushNotification(item.utilisateur.notification,"Demande accepter","votre ordre est accepté")

                          }}
                        >
                          <Text>Accepter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.followButton}
                          onPress={() => {changerstatutcommande(item.id, -1)
                          ;sendPushNotification(item.utilisateur.notification,"Demande annuler","votre ordre est anullé")
                        }}
                        >
                          <Text>Refuser</Text>
                        </TouchableOpacity>
                      </View>
                    ) : item.statut == 1 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          margin: 10,
                        }}
                      >
                        <TouchableOpacity
                          style={styles.followButton}
                          onPress={() => {
                            changerstatutcommande(item.id, 2);
                            sendPushNotification(item.utilisateur.notification,"Demande terminer","votre ordre est terminé")

                          }}
                        >
                          <Text>Terminer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.followButton}
                          onPress={() => {changerstatutcommande(item.id, -1);
                            sendPushNotification(item.utilisateur.notification,"Demande annuler","votre ordre est annulé")
                          }}
                        >
                          <Text>Annuler</Text>
                        </TouchableOpacity>
                      </View>
                    ) :null}
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  imageContent: {
    marginTop: -40,
  },
  tagsContent: {
    marginTop: 10,
    flexWrap: "wrap",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  button: {
    borderRadius: 20,
    marginVertical: 15,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  cardContent: {
    marginLeft: 20,
    flex: 1,
    marginTop: 10,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    borderWidth: 2,
    margin: 15,
    borderColor: "#ebf0f7",
  },

  card: {
    shadowColor: "#00000021",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    borderWidth: 2,
    borderColor: "orange",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
  },

  name: {
    marginVertical: 7,
    textAlign: "left",
    width: "100%",
    flex: 1,
    alignSelf: "flex-end",
    fontSize: 15,
    flex: 1,
    alignSelf: "center",
    color: "#3399ff",
    fontWeight: "bold",
  },
  count: {
    fontSize: 14,
    flex: 1,
    alignSelf: "center",
    color: "#6666ff",
  },
  followButton: {
    marginTop: 10,
    height: 35,
    borderWidth: 1,
    borderColor: "orange",
    width: 100,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "white",
  },
  followButtonText: {
    color: "#dcdcdc",
    fontSize: 1,
  },
});
