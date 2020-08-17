import React from 'react';

import Splash from './src/screens/Splash';
import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import ForgotPassword from './src/screens/ForgotPassword';

import Screen1 from './src/screens/drawer/screen1Settings';
import Screen2 from './src/screens/drawer/screen2Account';
import Screen3 from './src/screens/drawer/screen3Logout';

import Tab1 from './src/screens/tabs/Tab1Profile';
import Tab2 from './src/screens/tabs/Tab2Swipe';
import Tab3 from './src/screens/tabs/Tab3Chat';

import Swipe from './src/screens/Swipe';

import Chat from './src/screens/Chat'

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  DrawerActions,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Appearance, useColorScheme, AppearanceProvider } from 'react-native-appearance';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();
const MaterialTopTabs = createMaterialTopTabNavigator();;

import { Provider } from 'react-redux';
import store from './src/store';

const App = () => {

  const colorScheme = useColorScheme();

  const MyTheme = {
    dark: false,
    colors: {
      primary: 'white',
      background: 'white',
      card: '#05375a',
      text: 'white',
      border: 'white',
    },
  }

  const createHomeStack = () =>
    <Stack.Navigator    >
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Swipe"
        component={Swipe}
      />

      {/* <Stack.Screen name="Bottom Tabs" children={createBottomTabs} /> */}
      <Stack.Screen
        name="Top Tabs"
        children={createDrawer}
        // options={{ headerShown: false }}
        options={({ navigation }) => ({
          title: "Lets Chat",
          headerLeft: () =>
            <Icon
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              style={[{ color: 'white', marginLeft: 8 }]}
              size={24}
              name={'menu'}
            />
        })
        }
      />
    </Stack.Navigator>

  const createDrawer = () =>
    <Drawer.Navigator initialRouteName="Top Tabs Draw">
      <Drawer.Screen
        name="Top Tabs Draw"
        options={{ title: "Lets Chat" }}
        component={createTopTabs} />
      <Drawer.Screen
        name="Settings"
        component={Screen1}
      />
      <Drawer.Screen
        name="Account"
        component={Screen2}
      />
      <Drawer.Screen
        name="Logout"
        component={Screen3}
      />
    </Drawer.Navigator>

  const createTopTabs = (props) => {
    return <MaterialTopTabs.Navigator>
      <MaterialTopTabs.Screen
        name="Tab 1"
        component={Tab1}
        options={{ title: 'Profile' }}
      />
      <MaterialTopTabs.Screen
        name="Tab 2"
        component={Tab2}
        options={{ title: 'Swipe' }}
      />
      <MaterialTopTabs.Screen
        name="Tab 3"
        component={createChatStack}
        options={{ title: 'Chat' }}
      />
    </MaterialTopTabs.Navigator>
  }


  const createChatStack = (props) => {
    console.log('props', props);
    return (<Stack.Navigator    >
      <Stack.Screen
        name="Connections"
        component={Tab3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        // options={{ title: props.route.params.name !== undefined ? props.route.params.name : 'Chat' }}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>)
  }


  // const createBottomTabs = () => {
  //   return <MaterialBottomTabs.Navigator>
  //     <MaterialBottomTabs.Screen
  //       name="Tab 1"
  //       style={{ marginBottom: 16 }}
  //       component={Tab1}
  //       options={{
  //         tabBarLabel: 'Home',
  //         tabBarIcon: () => (
  //           <Icon style={[{ color: 'white' }]} size={25} name={'home'} />
  //         ),
  //       }}
  //     />
  //     <MaterialBottomTabs.Screen name="Tab 2" component={Tab2}
  //       options={{
  //         tabBarLabel: 'Profile',
  //         tabBarIcon: () => (
  //           <Icon style={[{ color: 'white' }]} size={25} name={'human'} />
  //         )
  //       }}
  //     />
  //     <MaterialBottomTabs.Screen name="Tab 3" component={Tab3}
  //       options={{
  //         tabBarLabel: 'Map',
  //         tabBarIcon: () => (
  //           <Icon style={[{ color: 'white' }]} size={25} name={'map'} />
  //         ),
  //       }}
  //     />
  //   </MaterialBottomTabs.Navigator>
  // }

  return (
    <Provider store={store}>
      <AppearanceProvider>
        <NavigationContainer theme={colorScheme == 'dark' ? DarkTheme : MyTheme}>
          {createHomeStack()}
        </NavigationContainer>
      </AppearanceProvider>
    </Provider>
  );
}

export default App;