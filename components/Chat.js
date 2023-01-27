import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
        }}
      />
    );
  }
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.setState({
      messages: [
        {
          _id: 1,
          text: `${name} has entered the chat.`,
          createdAt: new Date(),
          system: true,
        },

        {
          _id: 2,
          text: `Hello ${name}! How are you?`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://loremflickr.com/140/140/any",
          },
        },
      ],
    });
  }
  render() {
    let color = this.props.route.params.color;
    return (
      <View style={[{ flex: 1 }, { backgroundColor: color }]}>
        <GiftedChat
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

const styles = StyleSheet.create({
  chatContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
