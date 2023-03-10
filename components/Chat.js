import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Image,
  StyleSheet,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Constants, Permissions } from "expo";

//import firebase
const firebase = require("firebase");
require("firebase/firestore");

//Chat Component
export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      uid: 0,
      messages: [],
      user: {
        _id: 0,
        name: "",
      },
      image: null,
      location: null,
      isConnected: false,
    };

    //Connect to firebase
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAYXU-uroGZ67vHPINS3khV--eZzk1hTk0",
        authDomain: "chatapp-789ea.firebaseapp.com",
        projectId: "chatapp-789ea",
        storageBucket: "chatapp-789ea.appspot.com",
        messagingSenderId: "521769461203",
        appId: "1:521769461203:web:4295ecee8e0448227dfb26",
        measurementId: "G-WQJCF9K6QH",
      });
    }
    this.referenceMessagesUser = null;
    this.referenceMessages = firebase.firestore().collection("messages");
    this.authUnsubscribe = null;
    this.unsubscribe = null;
  }

  //ComponentDidMount
  componentDidMount() {
    //Check if user is online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });
      } else {
        this.setState({
          isConnected: false,
        });
      }
    });
    //Get messages
    this.getMessages();
    //Get user name and color
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ title: name, backgroundColor: color });
    //Check if user is logged in
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        return await firebase.auth().signInAnonymously();
      }
      //Update user state with currently active user data
      this.setState({
        uid: user?.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        },
      });
      //Create reference to messages
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }
  //get messages
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  //save messages
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  //delete messages
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  //OnCollectionUpdate
  onCollectionUpdate = (querySnapshot) => {
    if (!this.state.isConnected) return;
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({ messages });
  };

  //ComponentWillUnmount
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }
  // Check if user is online
  handleConnectivityChange = (state) => {
    const isConnected = state.isConnected;
    if (isConnected == true) {
      this.setState({
        isConnected: true,
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    } else {
      this.setState({
        isConnected: false,
      });
    }
  };
  //AddMessage
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  //OnSend
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.saveMessages();
        this.addMessage();
      }
    );
  }
  //define title in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.userName}'s Chat`,
    };
  };
  //RenderBubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "deepskyblue",
          },
          left: {
            backgroundColor: "greenyellow",
          },
        }}
      />
    );
  }
  //Render Input Toolbar
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }
  // Render Custom Actions
  renderCustomActions = (props) => <CustomActions {...props} />;
  // Render Custom View
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  //Render method
  render() {
    let color = this.props.route.params.color;
    return (
      <View style={[{ flex: 1 }, { backgroundColor: color }]}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          style={styles.item}
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
          accessible={true}
          accessibilityLabel="Chat input field"
          accessibilityHint="Here you can enter the message. After entering the message, you can press send on the right."
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: "blue",
  },
  text: {
    fontSize: 30,
  },
});
