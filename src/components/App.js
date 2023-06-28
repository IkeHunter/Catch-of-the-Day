import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Inventory from "./Inventory";
import Order from "./Order";
import sampleFishes from "../sample-fishes";
import Fish from "./Fish";
import base from "../base";

class App extends React.Component {
	state = {
		fishes: {},
		order: {},
	};

	static propTypes = {
		match: PropTypes.object,
	};

	componentDidMount() {
		// lifecycle method
		const { params } = this.props.match;
		/**
		 * Sync with db.
		 * Goes to fish-store-name/fishes, syncs state from there.
		 * Reference nested object because entire db is not needed.
		 */
		const localStorageRef = localStorage.getItem(params.storeId); // get items currently stored
		if (localStorageRef) {
			this.setState({ order: JSON.parse(localStorageRef) });
		}

		this.ref = base.syncState(`${params.storeId}/fishes`, {
			context: this,
			state: "fishes",
		});
	}

	componentDidUpdate() {
		// lifecycle method
		localStorage.setItem(
			this.props.match.params.storeId,
			JSON.stringify(this.state.order)
		);
	}

	componentWillUnmount() {
		// lifecycle method
		base.removeBinding(this.ref); // remove ref to avoid memory leaks
	}

	addFish = (fish) => {
		/***
		 * Changing value of state:
		 * Similar to C++, must make public method to do so.
		 * 1. Take copy of existing state
		 * 2. Add new object to clone of state
		 * 3. Set state to clone
		 */
		const fishes = { ...this.state.fishes }; // deep clone
		fishes[`fish${Date.now()}`] = fish;

		this.setState({ fishes }); // updates fish state

		console.log("adding fish");
	};

	updateFish = (key, updatedFish) => {
		// 1. Take a copy of the current state
		const fishes = { ...this.state.fishes };
		// 2. Update taht state
		fishes[key] = updatedFish;
		// 3. Set that to state
		this.setState({ fishes });
	};

	deleteFish = (key) => {
		// 1. take a copy of state
		const fishes = { ...this.state.fishes };
		// 2. update the state
		fishes[key] = null;
		// 3. udpate state
		this.setState({ fishes });
	};

	loadSampleFishes = () => {
		console.log("loading sample fishes...");
		this.setState({ fishes: sampleFishes });
	};

	addToOrder = (key) => {
		// 1. Take copy of state
		const order = { ...this.state.order };
		// 2. Either add to order or update number in order
		order[key] = order[key] + 1 || 1; // increment, or return 1
		// 3. Call setstate to update state object
		this.setState({ order });
	};

	removeFromOrder = (key) => {
		// 1. Take copy of state
		const order = { ...this.state.order };
		// 2. Remove item from order
		delete order[key];
		// 3. Call setstate to update state object
		this.setState({ order });
	};

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="fishes">
						{Object.keys(this.state.fishes).map((key) => (
							<Fish
								key={key} // this does not give access to key explicitly, need to pass again as prop other than key
								index={key}
								details={this.state.fishes[key]}
								addToOrder={this.addToOrder}
							/>
						))}
					</ul>
				</div>
				<Order
					// {...this.state} // passes values of state into order, instead of passing individual items
					fishes={this.state.fishes}
					order={this.state.order}
					removeFromOrder={this.removeFromOrder}
				/>
				<Inventory
					addFish={this.addFish}
					updateFish={this.updateFish}
					deleteFish={this.deleteFish}
					loadSampleFishes={this.loadSampleFishes}
					fishes={this.state.fishes}
					storeId={this.props.match.params.storeId}  // comes from react router
				/>
			</div>
		);
	}
}

export default App;
