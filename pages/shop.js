import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Picker,
Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { sendPushNotification } from './notifications'

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadioButton } from 'react-native-paper';

import { icons, COLORS, SIZES, FONTS } from "../assets/constants";

const Restaurant = ({ route, navigation }) => {
  const scrollX = new Animated.Value(0);
  const [restaurant, setRestaurant] = React.useState(null);
  const [orderItems, setOrderItems] = React.useState([]);
  const [livraison,setlivraison]=useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [user, setuser] = useState();
  const [plats, setPlats] = React.useState([]);
  function passerDemande() {
    if (plats.length > 0&& livraison!=null) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      axios.post(
        "http://192.168.1.60:8095/demande/envoyerdemande",
        {
          utilisateur: { id: user.id },
          chef: { id: route.params.l.id },
          statut: 0,
          plats: plats,
          livraison:livraison,
          montant: sumOrder(),
        },
        config,
        {}
      );
      Alert.alert(
        "Demande envoyée",
        "vous serez averti une fois que le chef aura confirmé votre commande"
      );
      navigation.navigate("Home");
    } else {
      Alert.alert("Erreur", "veuillez vous remplir tous les champs");
    }
  }
  React.useEffect(() => {
    getconnecteduser();

  }, []);
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
  function editOrder(action, menuId, price) {
    let orderList = orderItems.slice();
    let item = orderList.filter((a) => a.menuId == menuId);
    if (action == "+") {
      const newplat = { id: menuId };
      plats.push(newplat);
      console.log(plats);
      if (item.length > 0) {
        let newQty = item[0].qty + 1;
        item[0].qty = newQty;
        item[0].total = item[0].qty * price;
      } else {
        const newItem = {
          menuId: menuId,
          qty: 1,
          price: price,
          total: price,
        };
        orderList.push(newItem);
      }

      setOrderItems(orderList);
    } else {
      var __FOUND = -1;
      for (var i = 0; i < plats.length; i++) {
        if (plats[i].id == menuId) {
          plats.splice(i, 1);
          break;
        }
      }
      console.log("les plat tna7a");
      console.log(plats);
      if (item.length > 0) {
        if (item[0]?.qty > 0) {
          let newQty = item[0].qty - 1;
          item[0].qty = newQty;
          item[0].total = newQty * price;
        }
      }

      setOrderItems(orderList);
    }
  }

  function getOrderQty(menuId) {
    let orderItem = orderItems.filter((a) => a.menuId == menuId);

    if (orderItem.length > 0) {
      return orderItem[0].qty;
    }

    return 0;
  }

  function getBasketItemCount() {
    let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0);

    return itemCount;
  }

  function sumOrder() {
    let total = orderItems.reduce((a, b) => a + (b.total || 0), 0);

    return total.toFixed(2);
  }

  function renderHeader() {
    return (
      <View style={{ flexDirection: "row" }}>
       
      </View>
    );
  }

  function renderFoodInfo() {
    return (
      <Animated.ScrollView
        horizontal
        persistentScrollbar={true}
        pagingEnabled
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
           <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>êtes-vous sûr de vouloir passer cette commande pour un total de {sumOrder()} </Text>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}><TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {passerDemande();sendPushNotification(route.params.l.notification,"Nouvelle ordre","Vous avez une nouvelle ordre")}}
            >
              <Text style={styles.textStyle}>Commander</Text>
            </TouchableOpacity><TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Annuler</Text>
            </TouchableOpacity></View>
          </View>
        </View>
      </Modal>
        {route.params.l.shop.menus.map((item, index) => (
          <View key={`menu-${index}`} style={{ alignItems: "center" }}>
            {item.plats.length!==0 ? 
              <View>
                <Text style={{textAlign:'center',fontWeight:'bold',fontSize:20,opacity:0.6}}>{item.type}</Text>
                <ScrollView>
                  {item.plats.map((plats, indexx) => (
                    <View
                      key={`plats-${indexx}`}
                      style={{ alignItems: "center", marginVertical: 15 }}
                    >
                      <View style={{ height: SIZES.height * 0.35 }}>
                        {/* Food Image */}
                        <Image
                          source={{ uri: plats.image }}
                          resizeMode="cover"
                          style={{
                            width: SIZES.width,
                            height: "100%",
                          }}
                        />

                        {/* Quantity */}
                        <View
                          style={{
                            position: "absolute",
                            bottom: -20,
                            width: SIZES.width,
                            height: 50,
                            justifyContent: "center",
                            flexDirection: "row",
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              width: 50,
                              backgroundColor: COLORS.white,
                              alignItems: "center",
                              justifyContent: "center",
                              borderTopLeftRadius: 25,
                              borderBottomLeftRadius: 25,
                            }}
                            onPress={() => editOrder("-", plats.id, plats.prix)}
                          >
                            <Text style={{ ...FONTS.body1 }}>-</Text>
                          </TouchableOpacity>

                          <View
                            style={{
                              width: 50,
                              backgroundColor: COLORS.white,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ ...FONTS.h2 }}>
                              {getOrderQty(plats.id)}
                            </Text>
                          </View>

                          <TouchableOpacity
                            style={{
                              width: 50,
                              backgroundColor: COLORS.white,
                              alignItems: "center",
                              justifyContent: "center",
                              borderTopRightRadius: 25,
                              borderBottomRightRadius: 25,
                            }}
                            onPress={() => editOrder("+", plats.id, plats.prix)}
                          >
                            <Text style={{ ...FONTS.body1 }}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Name & Description */}
                      <View
                        style={{
                          width: SIZES.width,
                          alignItems: "center",
                          marginTop: 15,
                          paddingHorizontal: SIZES.padding * 2,
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              marginVertical: 10,
                              textAlign: "center",
                              ...FONTS.h2,
                            }}
                          >
                            {plats.nom} -
                          </Text>
                          <Text
                            style={{
                              textAlignVertical: "center",
                              fontSize: 22,
                              color: "#E1B530",
                            }}
                          >
                            {" "}
                            {plats.prix} TND
                          </Text>
                        </View>
                        <Text style={{ ...FONTS.body3 }}>{plats.nom}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
             : null}
          </View>
        ))}
      </Animated.ScrollView>
    );
  }

  function renderOrder() {
    return (
      <View>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
              borderBottomColor: COLORS.lightGray2,
              borderBottomWidth: 1,
            }}
          >
            <Text style={{ ...FONTS.h3 }}>
              {getBasketItemCount()} items in Cart
            </Text>
            <Text style={{ ...FONTS.h3 }}>{sumOrder()} TND</Text>
          </View>
{/* Order Button */}
       
        <View style={{flexDirection:'row',justifyContent:'space-around'}}>
        {route.params.l.shop.livraison ==1? <View style={{flexDirection:'row'}}><Text style={{textAlignVertical:'center'}}>À livrer</Text><RadioButton
        value={1}
        status={ livraison === 1 ? 'checked' : 'unchecked' }
        onPress={() => setlivraison(1)}
      /></View>:null}
      <View style={{flexDirection:'row'}}><Text style={{textAlignVertical:'center'}}>À réserver</Text><RadioButton
        value={0}
        status={ livraison === 0 ? 'checked' : 'unchecked' }
        onPress={() => setlivraison(0)}
      /></View>
</View>
          <View
            style={{
              padding: SIZES.padding * 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >

            <TouchableOpacity
              style={{
                width: SIZES.width * 0.9,
                padding: SIZES.padding,
                backgroundColor: COLORS.primary,
                alignItems: "center",
                borderRadius: SIZES.radius,
              }}
              onPress={() => {
                setModalVisible(true);
              }}
            >

              <Text style={{ color: COLORS.white, ...FONTS.h2 }}>
                Commander
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      { renderHeader()}
      {renderFoodInfo()}
      {renderOrder()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
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
      marginHorizontal:10,
      width:100,
    borderRadius: 20,
    padding: 10,
    elevation: 2
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
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default Restaurant;
