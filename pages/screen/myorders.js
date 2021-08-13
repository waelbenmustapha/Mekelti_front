import React, { Component, useEffect,useState } from "react";
import { ImageBackground,Modal,StyleSheet,FlatList, Text, Image, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import StarRating from "react-native-star-rating";
import {
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
export default function myorders({ navigation }) {
    const [user,setuser]=useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [starCount, setstarCount] = useState(0);
const [chefid,setchefid]=useState();
const [demandeid,setdemandeid]=useState();
    const [commandes,setcommandes]=useState(null);
    const ajouterFeedback = () => {
      axios
        .put("http://192.168.1.60:8095/demande/notterDemande/" + demandeid +"/"+starCount+"/"+chefid)
        .then((response) => {
          setstarCount(0);
          getconnecteduser();
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    const getconnecteduser = async () => {
        try {
          let token = await AsyncStorage.getItem("token");
          {
            axios
              .get("http://192.168.1.60:8095/Authentification/userbytoken/" + token)
              .then((response) => {
                setuser(response.data);
                    axios
                    .get(
                      "http://192.168.1.60:8095/demande/getdemandeutilisateur/"+response.data.id
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
                      setcommandes(res.data);
                    });
              });
          }
        } catch (e) {
          console.log("error");
        }
      };
      useEffect(() => {
        getconnecteduser();
      }, []);
      if(commandes==null)
      {return(<View><Text>Loading</Text></View>)}
      else{
      return (<View><Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText,{fontSize:22}]}>Donner une note</Text>
            <View style={{marginVertical:25}}><StarRating
              disabled={false}
              maxStars={5}
              starStyle={{ paddingHorizontal: 5 }}
              starSize={45}
              animation={"tada"}
              fullStarColor={"gold"}
              rating={starCount}
              selectedStar={(rating) => setstarCount(rating)}
            /></View>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {ajouterFeedback();setModalVisible(false)}}
            >
              <Text style={styles.textStyle}>Nottez cette demande</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal><FlatList
        keyExtractor={(item) => `key-${item.id}`}
        data={commandes}
        renderItem={({ item }) => (
          <View>
            
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
                        {item.chef.shop.nom} :{" "}
                        {item.chef.numeroTelephone}
                      </Text>
                      {item.livraison==1?(<Text style={{fontWeight:'900',fontSize:16,color:'#3399ff'}}>À livrer</Text>):<Text style={{fontWeight:'900',fontSize:16,color:'#3399ff'}}>Réserver</Text>}
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
                  {item.statut==2 && item.note==null?<TouchableOpacity onPress={()=>{setModalVisible(true);setchefid(item.chef.id);console.log(item.chef.id);setdemandeid(item.id)}} style={{width:'50%',alignSelf:'center',margin:15,backgroundColor:'orange',borderRadius:25,height:40}}><Text style={{textAlign:'center',textAlignVertical:'center',height:40,fontSize:16,color:'white'}}>Noter demande</Text></TouchableOpacity>:null}
{item.note!==null?<View style={{width:'60%',alignSelf:'center',marginVertical:15,flexDirection:'row',justifyContent:'space-between'}}><StarRating
              disabled={true}
              maxStars={5}
              starStyle={{}}
              starSize={28}
              animation={"tada"}
              fullStarColor={"gold"}
              rating={item.note}
            /><TouchableOpacity onPress={()=>{setModalVisible(true);setchefid(item.chef.id);console.log(item.chef.id);setdemandeid(item.id)}} style={{alignSelf:'center'}}><FontAwesome5
            style={{
              marginHorizontal: 3,
              alignSelf: "flex-end",
            }}
            name="edit"
            size={22}
            color="orange"
          /></TouchableOpacity></View>:null}
                </TouchableOpacity>
              </View>
          </View>
        )}
      />
        
        </View>);}
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
      backgroundColor: "orange",
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
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "orange",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
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
  