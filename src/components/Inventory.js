import React from "react";
import PropTypes from "prop-types";
import firebase from "firebase";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm";
import Login from "./Login";
import base, { firebaseApp } from "../base"; // importing base and named export

class Inventory extends React.Component {
	static propTypes = {
		fishes: PropTypes.object,
		updateFish: PropTypes.func,
		deleteFish: PropTypes.func,
		loadSampleFishes: PropTypes.func,
	};

	state = {
		uid: null,
		owner: null,
	};

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.authHandler({ user });
			}
		});
	}

	authHandler = async (authData) => {
		// 1. look up current store in firebase db
		const store = await base.fetch(this.props.storeId, { context: this });
		// 2. claim it if no owner
		if (!store.owner) {
			// save it to user
			await base.post(`${this.props.storeId}/owner`, {
				data: authData.user.uid, // from github, unique id
			});
		}
		// 3. set the state to the inventory component to reflect current user
		this.setState({
			// sets local state
			uid: authData.user.uid,
			owner: store.owner || authData.user.uid,
		});
	};

	authenticate = (provider) => {
		const authProvider = new firebase.auth[`${provider}AuthProvider`]();
		firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
	};

	logout = async () => {
		console.log("Logging out!");
		await firebase.auth().signOut();
		this.setState({ uid: null });
	};

	render() {
		const logout = <button onClick={this.logout}>Log Out</button>;

		// 1. check if logged in
		if (!this.state.uid) {
			return <Login authenticate={this.authenticate} />;
		}

		// 2. check if owner of store
		if (this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry, you are not the owner!</p>
					{logout}
				</div>
			);
		}

		// 3. they must be owner, render inventory
		return (
			<div className="inventory">
				<h2>Inventory</h2>
				{logout}
				{/* // convert object to array, then map over it */}
				{Object.keys(this.props.fishes).map((key) => (
					<EditFishForm
						key={key}
						index={key} // make key accessible from props
						fish={this.props.fishes[key]}
						updateFish={this.props.updateFish}
						deleteFish={this.props.deleteFish}
					/>
				))}
				<AddFishForm addFish={this.props.addFish} />
				<button onClick={this.props.loadSampleFishes}>
					Load Sample Fishes
				</button>
			</div>
		);
	}
}

export default Inventory;
