importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyAFpQOCQy42NzigYd5aPH3OSpbjvADJ0o0",
  authDomain: "smartstudentnotebook.firebaseapp.com",
  databaseURL: "https://smartstudentnotebook-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "smartstudentnotebook",
  storageBucket: "smartstudentnotebook.appspot.com",
  messagingSenderId: "254968215542",
  appId: "1:254968215542:web:be0931c257ad1d8a60b9d7",
  measurementId: "G-YDRCWDT5QJ"
});

const messaging = firebase.messaging();