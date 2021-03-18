import * as firebase from 'firebase'
import 'firebase/firestore';


export const AddHistory = (data) => {
  firebase
    .database()
    .ref(`compute-${Math.floor(Math.random() * 6) + 1  }`)
    .set({
     equation: data
    });
}

export const GetHistory = () => {
  firebase.database().ref("history/").on('value', (snapshot) => {
    const historyValue = snapshot.val().equation;
    console.log(historyValue);

	return historyValue;
  });
}
