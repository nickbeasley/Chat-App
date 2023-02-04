# Chat App

## Intro

Chat App for both Android/iOS created with React Native.

## Tech Stack

Technologies being used:

- React Native
- React Native asyncStorage API
- Expo
- Google Firebase
- Gifted Chat

## User Stories

- As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my
  friends and family.
- As a user, I want to be able to send messages to my friends and family members to exchange
  the latest news.
- As a user, I want to send images to my friends to show them what I’m currently doing.
- As a user, I want to share my location with my friends to show them where I am.
- As a user, I want to be able to read my messages offline so I can reread conversations at any
  time.
- As a user with a visual impairment, I want to use a chat app that is compatible with a screen
  reader so that I can engage with a chat interface.

## Key Features

- A page where users can enter their name and choose a background color for the chat screen
  before joining the chat.
- A page displaying the conversation, as well as an input field and submit button.
- The chat must provide users with two additional communication features: sending images
  and location data.
- Data gets stored online and offline

## Technical Requirements

- The app must be written in React Native.
- The app must be developed using Expo.
- The app must be styled according to the given screen design.
- Chat conversations must be stored in Google Firestore Database.
- The app must authenticate users anonymously via Google Firebase authentication.
- Chat conversations must be stored locally.
- The app must let users pick and send images from the phone’s image library.
- The app must let users take pictures with the device’s camera app, and send them.
- The app must store images in Firebase Cloud Storage.
- The app must be able to read the user’s location data.
- Location data must be sent via the chat in a map view.
- The chat interface and functionality must be created using the Gifted Chat library.
- The app’s codebase must contain comments.

### Prerequisites: Expo

- Install [Expo](https://expo.io/): `npm install expo-cli`

- Install Expo app on your mobile device or use an emulator

### Installation

- Install dependencies: `npm i`

- Start the chat app via: `npm start`

- Launch app on physical device: scan QR code in Expo GUI

- Launch app on emulator: Press "Run on Android device/emulator in Expo GUI

### Data storage (Firestore)

- Sign in at [Google Firebase/Firestore](https://firebase.google.com/)
- Go to console, start in test mode
- Settings/General/Your apps => Click "Firestore for Web" and copy the contents of the `config` object.
- In app file Components/Chat.js, replace Firebase config data with the copied credentials

> Chat.js
>
> ```javascript
> firebase.initializeApp({
>   apiKey: "your-api-key",
>   authDomain: "your-authdomain",
>   databaseURL: "your-database-url",
>   projectId: "your-project-id",
>   storageBucket: "your-storage-bucket",
>   messagingSenderId: "your-messaging-sender-id",
>   appId: "your-app-id",
> });
> ```

## What I learned

- Principles for programming an android app with React Native and Expo
- Mobile UI design principles
- Using Google Firestore as data storage for real-time applications
- Client-side storage with React Native’s asyncStorage API
- Using device communication features (camera, location)
- Storing media files in Google Cloud Storage
