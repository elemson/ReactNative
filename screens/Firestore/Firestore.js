import * as firebase from 'firebase'
import 'firebase/firestore';


export const AddHistory = (data) => {
  firebase
    .database()
    .ref(history)
    .set({
     data
    });
}

export const getHistory = () => {
  firebase.database().ref("history/").on('value', (snapshot) => {
    const highscore = snapshot.val();
    console.log("New high score: " + highscore);
  });
}
