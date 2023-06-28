import React from "react";
import PropTypes from "prop-types";
import { formatPrice } from "../helpers";
import { TransitionGroup, CSSTransition } from "react-transition-group";

class Order extends React.Component {
	static propTypes = {
		fishes: PropTypes.object,
		order: PropTypes.object,
		removeFromOrder: PropTypes.func
	}
	renderOrder = (key) => {
		// takes in map instance
		const fish = this.props.fishes[key];
		const count = this.props.order[key];
		const isAvailable = fish && fish.status === "available";
		const transitionOptions = {
			classNames: "order",
			key: key,
			timeout: { enter: 500, exit: 500 },
		};
		// Make sure fish is done being loaded
		if (!fish) return null; // usually happens between retrieve local storage and firebase

		// Then determine what is displayed
		if (!isAvailable) {
			return (
				<CSSTransition {...transitionOptions}>
					<li key={key}>
						Sorry {fish ? fish.name : "fish"} is no longer
						available.
					</li>
				</CSSTransition>
			);
		}
		return (
			// timeout: how fast to enter and exit
			<CSSTransition {...transitionOptions}>
				<li key={key}>
					<span>
						<TransitionGroup component="span" className="count">
							<CSSTransition
								classNames="count"
								key={count}
								timeout={{ enter: 250, exit: 250 }}>
								<span>{count}</span>
							</CSSTransition>
						</TransitionGroup>
						lbs {fish.name}
						{formatPrice(fish.price)}
						<button onClick={() => this.props.removeFromOrder(key)}>
							&times;
						</button>
					</span>
				</li>
			</CSSTransition>
		);
	};
	render() {
		const orderIds = Object.keys(this.props.order);
		const total = orderIds.reduce((prevTotal, key) => {
			// is like a map, returns a "tally"
			const fish = this.props.fishes[key];
			const count = this.props.order[key];
			const isAvailable = fish && fish.status === "available";
			if (isAvailable) {
				return prevTotal + count * fish.price;
			}
			return prevTotal;
		}, 0); // starting value
		return (
			<div className="order-wrap">
				<h2>Order</h2>
				<TransitionGroup component="ul" className="order">
					{orderIds.map(this.renderOrder)}
				</TransitionGroup>
				<div className="total">
					Total:
					<strong>{formatPrice(total)}</strong>
				</div>
			</div>
		);
	}
}

export default Order;
