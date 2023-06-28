import React, { Component } from "react";
import PropTypes from "prop-types";

export default class EditFishForm extends Component {
	static propTypes = {
		fish: PropTypes.shape({
			image: PropTypes.string,
			name: PropTypes.string,
			price: PropTypes.string,
			desc: PropTypes.string,
			price: PropTypes.number,
		}),
		index: PropTypes.string,
		updateFish: PropTypes.func,
	};

	handleChange = (event) => {
		/**
		 * When passing a state value into an editable text field,
		 * react requires an onchange handler. Once that change has been
		 * recorded, make a copy of the state object, and pass it upstream.
		 */
		// 1. Take a copy of current fish
		const updatedFish = {
			...this.props.fish,
			// dynamically determine what object should be changed.
			[event.currentTarget.name]: event.currentTarget.value,
		};

		this.props.updateFish(this.props.index, updatedFish);
	};
	render() {
		return (
			<div className="fish-edit">
				<input
					type="text"
					name="name"
					onChange={this.handleChange}
					value={this.props.fish.name}
				/>
				<input
					type="text"
					name="price"
					onChange={this.handleChange}
					value={this.props.fish.price}
				/>
				<select
					type="text"
					name="status"
					onChange={this.handleChange}
					value={this.props.fish.status}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea
					name="desc"
					onChange={this.handleChange}
					value={this.props.fish.desc}
				/>
				<input
					type="text"
					name="image"
					onChange={this.handleChange}
					value={this.props.fish.image}
				/>
				<button onClick={() => this.props.deleteFish(this.props.index)}>
					Remove Fish
				</button>
			</div>
		);
	}
}
