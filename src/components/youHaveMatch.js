import React, {Component} from "react";
import {View, Text, TouchableOpacity, Image, LayoutAnimation} from "react-native";
import FontAwesome, {Icons} from "react-native-fontawesome";
import LinearGradient from "react-native-linear-gradient";

class YouHaveMatch extends Component{

  componentWillMount(){
    return LayoutAnimation.spring();
  }

  render(){
    return(
        <LinearGradient  style = {{flex: 1}} start={{x: 4.5, y: 0.5}} end={{x: 0 , y: 5}} colors = {[ "black", "gray"]}>
            <View>
              <Text style = {styles.matchTitle}>You have a match! </Text>
            </View>

            <View style = {styles.users}>
              <View>
                <Image
                  source = {{uri: "https://yena.co.uk/wp-content/uploads/2018/01/profile-circle.png"}}
                  style= {styles.image}
                />
                <Text style = {[styles.text, {fontStyle: "oblique", fontSize: 15, fontWeight: "400", color: "#00B073"}]}>You</Text>
                <Text style = {styles.text}>{this.props.teamSelected.name}</Text>
              </View>

                <Text style = {[styles.text, {fontStyle: "oblique", fontSize: 13, fontWeight: "400"}]}>VS.</Text>

              <View>
                <Image
                  source = {{uri: "https://pizzasundayclub.com/wp/wp-content/uploads/2016/08/george-profile-350-circle.png.png"}}
                  style= {styles.image}
                />
                <Text style = {[styles.text, {fontStyle: "oblique", fontSize: 15, fontWeight: "400", color: "#00B073"}]}>{this.props.user.user}</Text>
                <Text style = {styles.text}>{this.props.teamsNotSelected.name}</Text>
              </View>
            </View>

            <Text style = {[styles.text, {color: "#DAA520"}]}>{this.props.user.bet} <FontAwesome>{Icons.bitcoin}</FontAwesome> </Text>

            <TouchableOpacity style = {styles.buttonCointainer} onPress = {this.props.sendToMatches}>
              <Text style = {styles.buttonText}>CONTINUE</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
  }
}

const styles = {

  matchTitle: {
    color:"#00B073",
    fontWeight: "300",
    fontStyle: "oblique",
    fontSize: 33,
    alignSelf: "center",
    marginTop: 55,
    marginBottom: 15
  },
  buttonCointainer: {
    backgroundColor: "#00B073",
    padding: 14,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: 17
  },
  users: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30
  },
  image: {
    width: 90,
    height: 90
  },
  text: {
    color: "white",
    fontSize: 18,
    alignSelf: "center",
    marginTop: 10,
    textAlign: "center"
  }
}

export default YouHaveMatch;
