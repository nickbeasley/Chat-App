import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
//import firebase
const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      iud: 0,
    };
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
    this.addMessage = this.addMessage.bind(this);
    onCollectionUpdate = (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        messages.push({
          _id: data._id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: data.user,
        });
      });
      this.setState({ messages });
    };
  }
  //ComponentDidMount
  componentDidMount() {
    this.referenceMessages = firebase.firestore().collection("messages");
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ title: name, backgroundColor: color });
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user?.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }
  //ComponentWillUnmount
  componentWillUnmount() {
    this.authUnsubscribe();
  }
  //AddMessage
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
    });
  };
  //OnSend
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }
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
  //Render
  render() {
    let color = this.props.route.params.color;
    return (
      <View style={[{ flex: 1 }, { backgroundColor: color }]}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat
          style={styles.item}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
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
