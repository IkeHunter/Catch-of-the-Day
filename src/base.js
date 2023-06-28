import Rebase from "re-base"; // react-firebase package
import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyA8m4JEMFDDddhTa4ehRvF8j30YroCHc_I",
	authDomain: "catch-of-the-day-65829.firebaseapp.com",
	databaseURL: "https://catch-of-the-day-65829-default-rtdb.firebaseio.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const base = Rebase.createClass(firebaseApp.database());

// named export
export { firebaseApp };

// default export
export default base;
