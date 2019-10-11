import React, {Component} from "react";
import {View, Text, TextInput, TouchableOpacity, Image, Dimensions, AsyncStorage, Modal} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Url from "../constants/url";
import {NavigationActions} from "react-navigation";
import Wating from "../reusable/wating";
import CountryPicker from "./countryPicker";
import FontAwesome, {Icons} from "react-native-fontawesome";

class Login extends Component{

  constructor(props){
    super(props);
    this.state= {
      username: "",
      email: "",
      password: "",
      password_confirmation:"",
      isSignup: false,
      loginUsername: "",
      loginPassword: "",
      errorMessage: "", 
      watingVisible: true,
      showCountries: false, 
      country: ""
    }
  }

  componentWillMount(){
    setTimeout(() => {this.setState({watingVisible: false})}, 2500)
  }

  closeCountries(){
    this.setState({showCountries: false});
  }

  selectCountry(country){
    this.setState({ country, showCountries: false })
  }

  userAction(action){
    const {username, password, password_confirmation, email, country} = this.state;
    var postArgs = action == "login" ? {"username": username, "password": password} : {"username": username, "email": email, "password": password, "password_confirmation": password_confirmation, "country": country}

      return fetch(`http://${Url}:8000/users/${action}/`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json"
        },
        body: JSON.stringify(postArgs)
      })
      .then(res => res.json())
      .then(jsonRes => {
          if(jsonRes.jwt && jsonRes.user){
            const coins = jsonRes.user.profile.coins;
            try {
              AsyncStorage.setItem('token', jsonRes.jwt);
              AsyncStorage.setItem('username', jsonRes.user.username);
              AsyncStorage.setItem('userID', jsonRes.user.id.toString());
              AsyncStorage.setItem('coins', coins.toString());
            } catch (error) {
              console.log(error.message);
            }
            this.sendToHome()
          } else {
            console.log(jsonRes)
            this.handleResponse(jsonRes)
          }
      }).catch(error => console.log(error))
  }

  sendToHome(){
    const {username, password, password_confirmation, email} = this.state;
    this.setState({username: "", password: "", password_confirmation: "", email: "", errorMessage: ""})

    const navigateAction = NavigationActions.navigate({
      routeName: "Home"
    });

    this.props.navigation.dispatch(navigateAction);
  }

  handleResponse(response){
    //In case the response is not right
    // switch(response){

    //   case typeof response.password !== 'undefined':
    //     return this.setState({errorMessage: "Password can´t be blank"})
    //     break;

    //   case typeof response.non_field_errors !== 'undefined':
    //     return this.setState({errorMessage: "Username or password is incorrect"})
    //     break;
    // }
    //Case user login

    if(response.username){
        if(response.username[0] == "This field may not be blank."){
          return this.setState({errorMessage: "Please fill all requirements"})
        }  else if(response.username[0] == "This field must be unique."){
          return this.setState({errorMessage: "This username is already taken"})
        }
    }  else if(response.non_field_errors){
        if(response.non_field_errors[0] == "Password doesnt match"){
            return this.setState({errorMessage: "Password doesnt match"})
        } else if(response.non_field_errors[0] == "Invalid credential"){
            return this.setState({errorMessage: "Invalid credentials", username: "", password: ""})
        }
    } else if(response.password || response.password_confirmation){
        return this.setState({errorMessage: "Please fill all requirements"})

    } else if(response.email){
        return this.setState({errorMessage: "Please fill all requirements"})
    } else if(response.country){
        return this.setState({errorMessage: "Please fill all requirements"})
    }


    // if(response.username[0] == "This field may not be blank." || response.password[0] == "This field may not be blank." || response.country[0] == "This field may not be blank."){
    //   "This field may not be blank."
    // } else if(response.non_field_errors){
    //   return this.setState({errorMessage: "Invalid credentials", username: "", password: ""})
    // } else if(response.username[0] == "This field must be unique."){
    //   return this.setState({errorMessage: "This username already exist."})
    // }
  }

  onChangeInput = (state) => (event,value) => {
    this.setState({
      [state]:event
    });
  }

  registrationForm(){
    const {email, password_confirmation, password, username, loginUsername, loginPassword} = this.state;
    if(this.state.isSignup){
      return(
        <View style = {styles.inputs}>
          <TextInput
            style={{height: 40, borderBottomColor: 'white', borderBottomWidth: 0.5, marginBottom: 25, color: "white"}}
            placeholder = "Username"
            placeholderTextColor = "gray"
            autoCapitalize = 'none'
            onChangeText ={this.onChangeInput('username')}
            value = {username}
          />

          <TextInput
            style={{height: 40, borderBottomColor: 'white', borderBottomWidth: 0.5, color:"white", color: "white", marginBottom: 25,}}
            placeholder = "Email"
            placeholderTextColor = "gray"
            autoCapitalize = 'none'
            onChangeText ={this.onChangeInput('email')}
            value = {email}
          />
          <TextInput
            style={{height: 40, borderBottomColor: 'white', borderBottomWidth: 0.5, color:"white", color: "white", marginBottom: 25 }}
            placeholder = "Password"
            placeholderTextColor = "gray"
            secureTextEntry={true}
            autoCapitalize = 'none'
            onChangeText ={this.onChangeInput('password')}
            value = {password}
          />
          <TextInput
            style={{height: 40, borderBottomColor: 'white', borderBottomWidth: 0.5, color:"white", color: "white"}}
            placeholder = "Password confirmation"
            placeholderTextColor = "gray"
            secureTextEntry={true}
            autoCapitalize = 'none'
            onChangeText ={this.onChangeInput('password_confirmation')}
            value = {password_confirmation}
          />

          <TouchableOpacity style = {{ marginTop: 23}} onPress = {()=> this.setState({showCountries: true})}>  
            <Text style = {{color:"gray", fontSize: 16}}>{this.state.country || "Select Country" }  <FontAwesome>{Icons.sortDown}</FontAwesome></Text>
          </TouchableOpacity>

          <Text style = {{color: "#D24D57", alignSelf:"center", marginTop: 15}}>{this.state.errorMessage}</Text>

          <View style = {{marginLeft: 15, marginRight: 15, marginTop: 55}}>
            <TouchableOpacity style = {{backgroundColor: "#00B073", paddingTop: 10, paddingBottom: 10}} onPress= {this.userAction.bind(this, "signup")}>
              <Text style = {{textAlign: "center", color: "white", fontWeight: "300", fontSize: 16}}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style = {{ position: "absolute", bottom: 15, flexDirection: "row", alignSelf:"center"}}>
            <Text style= {{fontWeight: "300", color: "#DCDCDC"}}>Do yoy have an acount? </Text>
            <TouchableOpacity onPress= {() => this.setState({isSignup: false, username: "", password: "", email: "", password_confirmation: ""})}>
              <Text style= {{fontWeight: "600", color: "#00B073"}}> Sign in </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else{
      return(
        <View style = {styles.inputs}>
          <TextInput
            style={{height: 40, borderBottomColor: 'white', borderBottomWidth: 0.5, marginBottom: 25, color: "white"}}
            placeholder = "Username"
            placeholderTextColor = "gray"
            autoCapitalize = 'none'
            onChangeText ={this.onChangeInput('username')}
            value = {username}
          />
          <TextInput
            style={{height: 40, borderBottomColor: 'white', borderBottomWidth: 0.5, color:"white", color: "white"}}
            placeholder = "Password"
            placeholderTextColor = "gray"
            secureTextEntry={true}
            autoCapitalize = 'none'
            onChangeText ={this.onChangeInput('password')}
            value = {password}
          />

          <View style = {{marginLeft: 15, marginRight: 15, marginTop: 55}}>
            <TouchableOpacity style = {{backgroundColor: "#00B073", paddingTop: 10, paddingBottom: 10}} onPress = {this.userAction.bind(this, "login")}>
              <Text style = {{textAlign: "center", color: "white", fontWeight: "300", fontSize: 16}}>Login</Text>
            </TouchableOpacity>

            <Text style = {{color: "#D24D57", alignSelf:"center", margin: 5}}>{this.state.errorMessage}</Text>

            <TouchableOpacity style = {{marginTop: 12}}>
              <Text style = {{alignSelf:"center", color:"gray"}}>Forgot your password ?</Text>
            </TouchableOpacity>
          </View>

          <View style = {{ position: "absolute", bottom: 15, flexDirection: "row", alignSelf:"center"}}>
            <Text style= {{fontWeight: "300", color: "#DCDCDC"}}>Dont have an acount? </Text>
            <TouchableOpacity onPress= {() => this.setState({isSignup: true, username: "", password: ""})}>
              <Text style= {{fontWeight: "600", color: "#00B073"}}> Sign up </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  render(){
    console.log(this.state.errorMessage, this.state.country);
    return(
      <LinearGradient style = {{flex: 1}} start={{x: 1, y: 1}} end={{x: 4 , y: 0}} colors = {["#161616", "gray"]}>

        <Image source = {require('../images/smkt.png')} style = {{width: Dimensions.get("window").width * 0.6, height: 50, alignSelf: "center", marginTop: 55}}/>

        {this.registrationForm()}
  

      <Modal visible= {this.state.watingVisible}>
        <Wating/>
      </Modal>

      <Modal visible= {this.state.showCountries}>
        <CountryPicker closeModal = {this.closeCountries.bind(this)} onChangeCountry = {this.selectCountry.bind(this)}/>
      </Modal>

      </LinearGradient>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#161616"
  },
  inputs: {
    justifyContent: 'center',
    margin: 15,
    marginLeft: 30,
    marginRight: 30,
    position: 'absolute',
    top: 0,left: 0,
    right: 0, bottom: 0,
  }
}

export default Login
