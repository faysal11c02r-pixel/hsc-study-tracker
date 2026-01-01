const firebaseConfig = {
  // Go to console.firebase.google.com, create project, enable Auth (Google), Firestore. Copy your config here.
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  // etc.
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
