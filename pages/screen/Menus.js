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
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Alert } from "react-native";
import { TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
export default function Menus({ navigation }) {
  const [chef, setChef] = useState(null);
  const [nomplat, setnomplat] = useState();
  const [platid, setplatid] = useState();
  const [newitemssucré, setnewitemssucré] = useState([]);
  const [newitemsboisson, setnewitemsboisson] = useState([]);
  const [recherche, setrecherche] = useState();
  const [selected, setselected] = useState(0);
  const [prix, setprix] = useState();
  const [pictureone, setPictureone] = useState(
    "https://i.pinimg.com/originals/c6/dc/94/c6dc940457e1a8e6fc55082fd10dd04c.png"
  );
  const [commands, setcommands] = useState();
  const [list, setlist] = useState(["salé", "sucré", "boisson"]);
  const [sucréid, setsucréid] = useState();
  const [saléid, setsaléid] = useState();
  const [boissonid, setboissonid] = useState();
  const [menusalé, setmenusalé] = useState([]);
  const [newitemssalé, setnewitems] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("salé");
  const [editmodalvisible,seteditmodalvisible]=useState(false);
  const [itemtomodifyprice,setitemtomodifyprice]=useState();
  const [itemtomodifynom,setitemtomodifynom]=useState();
  const [menusucré, setmenusucré] = useState([]);
  const [menuboisson, setmenuboisson] = useState([]);
  const [Quantity, setquantity] = useState(0);
  const [modalsaléVisible, setModalsaléVisible] = useState(false);
  const [modalsucréVisible, setModalsucréVisible] = useState(false);
  const [modalboissonVisible, setModalboissonVisible] = useState(false);
  const [rusure, setrusure] = useState(false);
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
  const deleteplat = async (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.delete(
      "http://192.168.1.60:8095/shop/supprimerplate/" + id,
      config,
      {}
    );
  };
  const modifier = async (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.put(
      "http://192.168.1.60:8095/shop/editplat/" + platid,
      {
          "nom":itemtomodifynom,
          "prix":itemtomodifyprice,
          "image":pictureone
      },
      config,
      {}
    );
    getconnecteduser();
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
      "http://192.168.1.60:8095/shop/ajouterdesplats/" + saléid,

      newitemssalé,
      config,
      {}
    );
    await axios.post(
      "http://192.168.1.60:8095/shop/ajouterdesplats/" + sucréid,
      newitemssucré,
      config,
      {}
    );
    await axios.post(
      "http://192.168.1.60:8095/shop/ajouterdesplats/" + boissonid,
      newitemsboisson,
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
            response.data.shop.menus.forEach((element) => {
              if (element.type == "sucré") {
                setmenusucré(element.plats);
                setsucréid(element.id);
              } else if (element.type == "salé") {
                setmenusalé(element.plats);
                setsaléid(element.id);
              } else if (element.type == "boisson") {
                setmenuboisson(element.plats);
                setboissonid(element.id);
              }
            });
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
              });
          });
      }
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    getconnecteduser();
  }, []);
  return (
    <ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={rusure}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setrusure(!rusure);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              êtes-vous sûr de vouloir supprimer cette plat{" "}
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: 200,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  deleteplat(platid);
                  getconnecteduser();
                  setrusure(false);
                }}
              >
                <Text style={styles.textStyle}>Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setrusure(!rusure)}
              >
                <Text style={styles.textStyle}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
                <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                  <TouchableOpacity onPress={()=>{setitemtomodifynom(l.nom);setitemtomodifyprice(l.prix);setPictureone(l.image);seteditmodalvisible(true);setplatid(l.id)}}>
                    <FontAwesome5
                      style={{
                        marginHorizontal: 3,
                        alignSelf: "flex-end",
                      }}
                      name="edit"
                      size={22}
                      color="orange"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setrusure(true);
                      setplatid(l.id);
                    }}
                  >
                    <FontAwesome5
                      style={{
                        marginHorizontal: 3,
                        alignSelf: "flex-end",
                      }}
                      name="trash-alt"
                      size={22}
                      color="orange"
                    />
                  </TouchableOpacity>
                </View>
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
                  textAlign: "center",
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
                    textAlign: "center",
                    marginVertical: 15,
                    fontSize: 20,
                    borderBottomWidth: 1,
                  }}
                >
                  {Quantity}
                </TextInput>
              </View>
              <TouchableOpacity
                onPress={() => {
                  openImagePickerAsyncOne();
                }}
              >
                <Image
                  style={{
                    height: 90,
                    width: 90,
                    borderRadius: 45,
                    borderWidth: 1,
                    alignSelf: "center",
                    margin: 15,
                  }}
                  source={{ uri: pictureone }}
                />
              </TouchableOpacity>
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
                newitemssalé.push(newItem);
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
        visible={editmodalvisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          seteditmodalvisible(!editmodalvisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ justifyContent: "space-between", width: 230 }}>
              <TextInput
                onChangeText={(text) => {
                  setitemtomodifynom(text);
                }}
                value={itemtomodifynom}
                style={{
                  fontSize: 20,
                  borderBottomWidth: 1,
                  marginRight: 15,
                  textAlign: "center",
                  marginVertical: 15,
                }}
              />
              <View style={{}}>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setitemtomodifyprice(text);
                  }}
                  style={{
                    textAlign: "center",
                    marginVertical: 15,
                    fontSize: 20,
                    borderBottomWidth: 1,
                  }}
                >
                  {itemtomodifyprice}
                </TextInput>
              </View>
              <TouchableOpacity
                onPress={() => {
                  openImagePickerAsyncOne();
                }}
              >
                <Image
                  style={{
                    height: 90,
                    width: 90,
                    borderRadius: 45,
                    borderWidth: 1,
                    alignSelf: "center",
                    margin: 15,
                  }}
                  source={{ uri: pictureone }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                modifier();
                seteditmodalvisible(false);
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
              <TouchableOpacity
                onPress={() => {
                  openImagePickerAsyncOne();
                }}
              >
                <Image
                  style={{
                    height: 90,
                    width: 90,
                    borderRadius: 45,
                    borderWidth: 1,
                    alignSelf: "center",
                    margin: 15,
                  }}
                  source={{ uri: pictureone }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                const newItem = {
                  nom: nomplat,
                  prix: Quantity,
                  image: pictureone,
                };
                newitemssucré.push(newItem);

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
              <TouchableOpacity
                onPress={() => {
                  openImagePickerAsyncOne();
                }}
              >
                <Image
                  style={{
                    height: 90,
                    width: 90,
                    borderRadius: 45,
                    borderWidth: 1,
                    alignSelf: "center",
                    margin: 15,
                  }}
                  source={{ uri: pictureone }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                const newItem = {
                  nom: nomplat,
                  prix: Quantity,
                  image: pictureone,
                };
                newitemsboisson.push(newItem);
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
          marginBottom: 30,
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
          setnewitems([]);
          setnewitemssucré([]);
          setnewitemsboisson([]);
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
          ajouter les menus
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
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
