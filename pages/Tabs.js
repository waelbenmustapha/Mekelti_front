import React from 'react';
import {
    View,Image,TouchableOpacity } from 'react-native';
    import Map from './constans/maps';
    import { NavigationContainer } from '@react-navigation/native';
    import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
    import Svg,{ Path } from 'react-native-svg';
    import HomeClient from './screen/HomeClient';
    import{ COLORS, icons} from "./constans";
   import compt from './screen/compt';
   import myorders from './screen/myorders';

import favoris from './screen/favoris';
    
    const Tab = createBottomTabNavigator();
    const TabBarrCustomButtom =({accessibilityState, children, onPress})=>{
     var isSelected= accessibilityState.selected
     if(isSelected){
         return(
            <View style={{ flex: 1, alignItems: "center" }}>
            <View style={{ flexDirection: 'row', position: 'absolute', top: 0 }}>
                <View style={{ flex: 1, backgroundColor: COLORS.white }}></View>
                <Svg
                    width={75}
                    height={61}
                    viewBox="0 0 75 61"
                >
                    <Path
                        d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
                        fill={COLORS.white}
                    />
                </Svg>
                <View style={{ flex: 1, backgroundColor: COLORS.white }}></View>
            </View>

            <TouchableOpacity
                style={{
                    top: -22.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: COLORS.white
                }}
                onPress={onPress}
            >
                {children}
            </TouchableOpacity>
        </View>

         )

     }
     else {
         return(
            <TouchableOpacity
            style={{
                flex: 1,
                height: 60,
                backgroundColor: COLORS.white
            }}
            activeOpacity={1}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity> 
         )
     }
    }
   
    const Tabs = () => {
    return(
        <Tab.Navigator  
        tabBarOptions ={{ ShowLabels:false,
        style:{
            borderTopWidth:0,
            backgroundColor: "transparent",
            elevation:0
        }
        }} 
      
        >
            <Tab.Screen 
        name="food"
        component={HomeClient}
        options={{
            tabBarIcon:({focused}) =>(
        <Image source={icons.farchita}
            resizeMode ="contain"
            style ={{
                width:25,
                height: 25,
                tintColor : focused ? COLORS.primary : COLORS.secondary
            }} 
        />
        ),
        tabBarButton: (props)=>
        <TabBarrCustomButtom{...props }
        />
    }}
    />
        <Tab.Screen 
        name="map"
        component={Map}
        options={{
            tabBarIcon:({focused}) =>(
        <Image source={icons.location}
            resizeMode ="contain"
            style ={{
                width:25,
                height: 25,
                tintColor : focused ? COLORS.primary : COLORS.secondary
            }} 
        />
        ),
        tabBarButton: (props)=>
        <TabBarrCustomButtom{...props }
        />
    }}

    />
<Tab.Screen 
        name="favoris"
        component={favoris}
        options={{
            tabBarIcon:({focused}) =>(
        <Image source={icons.like}
            resizeMode ="contain"
            style ={{
                width:25,
                height: 25,
                tintColor : focused ? COLORS.primary : COLORS.secondary
            }} 
        />
        ),
        tabBarButton: (props)=>
        <TabBarrCustomButtom{...props }
        />
    }}
    />
    <Tab.Screen 
        name="compte"
        component={compt}
        options={{
            tabBarIcon:({focused}) =>(
        <Image source={icons.compte}
            resizeMode ="contain"
            style ={{
                width:25,
                height: 25,
                tintColor : focused ? COLORS.primary : COLORS.secondary
            }} 
        />
        ),
        tabBarButton: (props)=>
        <TabBarrCustomButtom{...props }
        />
    }}
    />

    <Tab.Screen 
        name="Orders"
        component={myorders}
        options={{
            tabBarIcon:({focused}) =>(
        <Image source={icons.notification}
            resizeMode ="contain"
            style ={{
                width:25,
                height: 25,
                tintColor : focused ? COLORS.primary : COLORS.secondary
            }} 
        />
        ),
        tabBarButton: (props)=>
        <TabBarrCustomButtom{...props }
        ></TabBarrCustomButtom>
    }}
    
    />
    </Tab.Navigator>
    )
}
    export default Tabs;
