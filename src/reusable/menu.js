import React, {Component} from "react";
import {View, Text, FlatList, ScrollView, Image, TouchableOpacity, Modal, AsyncStorage} from "react-native";
import FontAwesome, {Icons} from "react-native-fontawesome";
import LinearGradient from "react-native-linear-gradient";
import Leagues from "../components/leagues";
import { NavigationActions } from 'react-navigation';
import Url from "../constants/url";
import NumberFormat from 'react-number-format';

class Menu extends Component {

  constructor(props){
    super(props);
    this.state = {
      leaguesModal: false,
      leagueSelected: "",
      showModal: false,
      username: "", country: "", coins: 0, currentUser: "", currentToken:""
    }
  }

  async componentDidMount(){
      this._isMounted = true;

      const usernameGet = await AsyncStorage.getItem('username');
        if (usernameGet) {
          this.setState({ currentUser: usernameGet});
        } else {
          this.setState({ currentUser: false });
      }

      const tokenGet = await AsyncStorage.getItem('token');
        if (tokenGet) {
          this.setState({ currentToken: tokenGet });
        } else {
          this.setState({ currentToken: false });
      }

      return fetch(`http://${Url}:8000/users/${this.state.currentUser}/`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json",
          "Authorization": `Token ${this.state.currentToken}`
        }
      })
      .then(res => res.json())
      .then(jsonRes => {
        console.log(jsonRes)
        if(this._isMounted){
          this.setState({
                username: jsonRes.user.username,
                country: jsonRes.user.profile.country,
                coins: jsonRes.user.profile.coins
          })
        }
      })
      .catch(error => console.log(error));
  }


  selectLeagues(sport){
    return fetch(`http://${Url}:8000/leagues?sport=${sport}`, {
      method: "GET",
      headers: {
          "Accept": "application/json",
          "Content-type": "application/json"
      }
    })
    .then(res => res.json())
    .then(jsonRes => {
      console.log(jsonRes)
        this.setState({
            leagueSelected: jsonRes.results,
            leaguesModal: !this.state.leaguesModal
        });
    })
    .catch(error => console.log(error)).then(this.props.closeModal)
  }

  closeModal(){
    this.setState({leaguesModal: !this.state.leaguesModal})
  }


  sendToLogin(){
    const navigateAction = NavigationActions.navigate({
      routeName: "Login"
    });

    this.props.navigation.dispatch(navigateAction);
  }

  renderSport(){
    return this.props.sports.map((item, index) => {
      return(
        <View>
          <TouchableOpacity key = {index} style = {{flexDirection:"row", justifyContent: "space-between"}} onPress = {this.selectLeagues.bind(this, item.name)}>
            <Text style = {styles.sport}> <Image source= {{uri: item.img}} style = {{width: 21, height: 21}}/> {item.name} </Text>
            <Text style = {{marginTop: 7, color: "gray"}}> {item.count} <FontAwesome>{Icons.chevronRight}</FontAwesome> </Text>
          </TouchableOpacity>
        </View>
      );
    })
  }

  render(){
    console.log(this.props.sports)
    const {coins, username, country} = this.state;
    return(
      <View style = {styles.container}>

        <Modal
          visible = {this.state.showModal}
        >
          <View style = {{flex: 1, backgroundColor: "#161616"}}>
            <Text style = {{marginTop: 100, color: "white", textAlign: "center", fontSize: 20}}>Welcome to Betmatcher</Text>
          </View>
        </Modal>

          <LinearGradient start={{x: 0, y: 0}} end={{x: 4 , y: 0}} colors = {[ "black", "gray"]}>
            <View style = {styles.userContainer}>
              <Image
                source = {{uri: "https://cdn4.iconfinder.com/data/icons/instagram-ui-twotone/48/Paul-18-512.png"}}
                style = {{width: 100, height: 100, marginBottom: 20, marginLeft: 5}}
              />

              <View>
                <Text style= {{color:"#00B073", marginBottom: 10, fontSize: 20, fontWeight: "400"}}>{username}</Text>
                <Text style= {{color:"#DCDCDC", marginBottom: 10, fontSize: 12, fontWeight: "400", fontStyle: "oblique"}}>{country} <FontAwesome>{Icons.flag}</FontAwesome></Text>
                <NumberFormat
                    value={this.props.coins}
                    displayType={'text'}
                    thousandSeparator={true}
                    renderText={value => <Text style= {{color:"#DAA520"}}>{value}  <FontAwesome>{Icons.database}</FontAwesome></Text>}
                /> 
              </View>
            </View>
          </LinearGradient>

        <ScrollView>
          <View style = {{margin: 15, marginTop:10}}>
            <Text style  ={styles.categorie}> Events </Text>

            {this.renderSport()}

            <Text style  ={[styles.categorie, {marginTop: 12}]}> Options </Text>
              <View style ={{marginLeft: 8}}>

                <TouchableOpacity onPress = {this.props.sendToPrizes}>
                  <Text style = {styles.sport}> <FontAwesome style = {{fontSize: 17, marginRight: 4}}>{Icons.tags}</FontAwesome> Change your coins </Text>
                </TouchableOpacity>
              </View>

            <Text style  ={[styles.categorie, {marginTop: 12}]}> Account </Text>
              <TouchableOpacity style ={{marginLeft: 8}} onPress = {this.props.handleLogout}>
                <Text style = {styles.sport}><FontAwesome style = {{fontSize: 17}}>{Icons.signOut}</FontAwesome> Logout</Text>
              </TouchableOpacity>
          </View>
          </ScrollView>

          <Modal visible = {this.state.leaguesModal} animationType = "slide" style={{ flex: 1, position: "relative" , margin: 20}}>
            <Leagues
                 filter = {this.props.filteredEvents}
                 leagues = {this.state.leagueSelected}
                 close = {() => this.setState({leaguesModal: false})}
            />
          </Modal>
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: "#DCDCDC",
    flex: 1
  },
  categorie: {
    color: "#00B073",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5
  },
  sport: {
    color: "black",
    marginBottom: 15,
    marginLeft: 12,
    fontSize: 19
  },
  userContainer: {
    padding: 20,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 35,
    flexDirection: "row",
    justifyContent: "space-around"
  }
}

export default Menu;



