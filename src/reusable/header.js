import React, {Component} from "react";
import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import FontAwesome, {Icons} from "react-native-fontawesome";

const Header = (props) => {
    return(
      <View style = {styles.container}>
          { props.hasSidebar ? 
            <TouchableOpacity onPress={props.showSidebar}>
              <FontAwesome style ={styles.listIcon}>{Icons.list}</FontAwesome>
            </TouchableOpacity> : 
            <Text style = {[styles.title, {color: "black"}]}>HH</Text>
          }

          <Text style = {styles.title}>{props.title}</Text>

          <TouchableOpacity>
            <FontAwesome style ={styles.listIcon}>{Icons.cogs}</FontAwesome>
          </TouchableOpacity>
      </View>
    );
}

const styles = {
  container: {
    backgroundColor: "black",
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between"
  },
  title: {
    color: "#00B073",
    paddingTop: 13,
    fontSize: 18,
    fontWeight: "600"
  },
  listIcon: {
    color: "#00B073",
    fontSize: 18,
    paddingRight: 20,
    paddingTop: 15
  }
}

export default Header;
