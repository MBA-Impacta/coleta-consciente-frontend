import React, { Component } from "react";
import { ImageBackground, View,Button, Image, Text, StyleSheet, TouchableOpacity, TextInput, Platform, PermissionsAndroid, Alert} from "react-native";
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends Component {
  watchId = null;

  constructor(){
    super();
     
      this.state = {
        email:'',
        password:'',
        loading: false,
        updatesEnabled: false,
        location: {},
        //isLoading: false,
        coordinate: '',
        isChecked:false,
        isChecked1:false
      };
  }

  componentDidMount(){

    this.hasLocationPermission()
  
 
  }

  
  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  }

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ loading: true }, () => {
      Geolocation.getCurrentPosition(
        (position) => {
          this.setState({ location: position, loading: false });
          global.lat = position.coords.latitude;
          global.long =position.coords.longitude;
          
        },
        (error) => {
          this.setState({ location: error, loading: false });
          console.log(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000, distanceFilter: 5 }
      );
    });
  }

  getLocationUpdates = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) return;

    this.setState({ updatesEnabled: true }, () => {
      this.watchId = Geolocation.watchPosition(
        (position) => {
          this.setState({ location: position });
          console.log(position);
        },
        (error) => {
          this.setState({ location: error });
          console.log(error);
        },
        { enableHighAccuracy: true, distanceFilter: 0, interval: 1000, fastestInterval: 1000 }
      );
    });
  }

  removeLocationUpdates = () => {
      if (this.watchId !== null) {
          Geolocation.clearWatch(this.watchId);
          this.setState({ updatesEnabled: false })
      }
  }
  
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }
  

  onLogin = async () =>{

    const { navigation } = this.props;

    this.getLocation();

    const headers = {
      'Authorization':'Basic Y29kZXJlZjokMmEkMTAkcDlQazBmUU5BUVNlc0k0dnV2S0EwT1phbkREMg==',
      'Content-Type':'application/json'
     }



     await axios.post(`http://134.209.115.59:50708/oauth/token?username=${this.state.email}&password=${this.state.password}&grant_type=password`,{}, { headers, withCredentials: true }) 
     .then(function (response) {
       console.log(response.data.access_token);

      let token = response.data.access_token;
      global.token = token; 
      global.update = 'pp'
       AsyncStorage.setItem('token', token);
       //console.log(token)
       

     })
     .catch(function (error) {
      Alert.alert('Email ou senha inválidos!')
       console.log(error);
     }); 

     this.setState({
      email:'',
      password:'',
     })

     if(global.token != ''){
      navigation.navigate("Home")  
     }
  }


  onRegister = () =>{

    const { navigation } = this.props;

    navigation.navigate("Register")
  }
  render(){
  
    const { navigation } = this.props;
  
    return (
      <View style={{alignItems:'center'}}>
       
           <View style={styles.Vlogo}>
               
                  <Image style={styles.Ilogo} source={require('../assets/logo.png')}/>               

                <View style={styles.Vdrawer}>
                <TouchableOpacity onPress={()=> navigation.openDrawer()}>

                <Image style={styles.Idrawer} source={require('../assets/drawer.png')}/>
                </TouchableOpacity>
                </View>      

        </View>  
           
         
         <ImageBackground source={require('../assets/bax.png')} style={styles.image}>
         <View style={styles.Vftalks}>
          <Text style={styles.T3}>Coleta  <Text style={styles.T5}>Consciente</Text></Text>

         

          <View style={styles.Vinput}>
        

        

          <TextInput
            style={styles.input}
            placeholder={'E-mail'}            
            onChangeText={(text) => this.updateTextInput(text, 'email')}
            value={this.state.email}
          />


     

        <TextInput
          style={styles.input}
          placeholder={'Senha'}            
          onChangeText={(text) => this.updateTextInput(text, 'password')}
          value={this.state.password}
          secureTextEntry={true}
        />

      
                                
          </View>
     
         
          <TouchableOpacity
                style={styles.T4}
                onPress={() => this.onRegister()}
            >
                <Text>Não possui Login ? <Text style={styles.T5}>Faça o cadastro</Text></Text>
            </TouchableOpacity>
        
        
          
  
        <View  style={styles.button}>
        <Button
          title="Logar"
          color="#742699"
          onPress={() => this.onLogin()}
        />
        </View>
        </View>

         </ImageBackground>
      </View>
    );
  };
  }
  
  const styles = StyleSheet.create({
   Vlogo: {
    alignItems: 'flex-start', 
    backgroundColor: '#FFFDC0', 
    width:'100%',
    height: 50
  },
  Ilogo: {
    width: 50, 
    height: 40, 
    marginTop: 5 
  },
  Vdrawer: {
    marginTop: - 40,  
    
    alignSelf: 'flex-end'
  },
  Idrawer: {
    width: 30, 
    height: 30,
  },
    socialIcon:{
      height: 55,
      width: 55,
      marginTop: 5
    },
    VSocial:{
      flex: 1, 
      flexDirection: 'row',
      marginLeft: 25,
      alignSelf: 'flex-start'
    },
    Cimage:{
      width: 400,
      height: 500,
      marginTop: 10
    },
    Tcongrats: {
      fontWeight: 'bold',
      fontSize: 24,  
      color: '#0E1973'
   },
   T1: {
      fontWeight: 'bold', 
      fontSize: 24, 
      justifyContent: 'center'
   },
   T2: {
     fontWeight: 'normal',
     fontSize: 26, 
     marginTop: 75, 
     justifyContent: 'center'
   },
   T3:{
    fontWeight: 'bold',
    fontSize: 34, 
    alignSelf: 'center',
   // marginTop: 150, 
    color: '#0E1973',
    marginLeft: 25, 
    justifyContent: 'center'
   },
   T4:{
    fontWeight: 'normal',
    fontSize: 18, 
    marginTop: 30, 
    color: '#000', 
    alignSelf: "center",
    justifyContent: 'center'
   },
   button:{
   alignSelf: 'center', 
   marginLeft: 25,
   marginTop: 50,
   borderRadius: 45,
   width: 180,
   backgroundColor:"#742699"
   },
   input: {
    width: 280,
    height: 40,
    margin: 12,
    marginTop: 0,
    marginLeft: 20,
    borderWidth: 1,
    color: '#fff',
    borderLeftColor: "transparent",
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    backgroundColor: '#0e1973'
  },
  Ti: {
    color: '#0E1973',
    alignSelf: 'flex-start', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginLeft: - 30 
  },
  Vinput: {
    marginTop: 40, 
    alignSelf: "center"
  },
  Ti3: {
    color: '#0E1973',
    alignSelf: 'flex-start', 
    fontSize: 20, 
    fontWeight: 'normal', 
    marginTop: - 20,
    marginLeft: 45
  },
  Ti2: {
    color: '#0E1973',
    alignSelf: 'flex-start', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginLeft: - 30 
  },
   image: {
    //flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    height: '100%',
    width: '100%'
  },
  VCheck: {
    // backgroundColor: '#ECFED5', 
     width: 30, 
     height: 30
     },
     VCheckD: {
       height: 10,
       },

       Vftalks:{
        marginTop: - 100, 
        paddingRight: '10%',
        paddingLeft: '10%',
        paddingTop: '10%',
        paddingBottom: '10%'
      },
    
   T5:{
    color: '#1DA64B',
   }
    
  });

export default Login;