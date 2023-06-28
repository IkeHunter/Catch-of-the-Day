import React from "react";
import PropTypes from "prop-types";
import { getFunName } from "../helpers";

class StorePicker extends React.Component {
	/***
	 * 1. Stop form from submitting
	 * 2. Get text from input
	 * 3. Change page to /store/etc..
	 */
    
     /***
     * When creating custom methods, must bind to React
     * component like the following syntax. Otherwise, 
     * 'this' will be undefined.
     */
    // constructor() {
    //     super();

        // this.goToStore = this.goToStore.bind(this); 
    // }
    myInput = React.createRef()
	static propTypes = {
		history: PropTypes.object
	}
	
	goToStore = (event) => {
		event.preventDefault();
		console.log("Going to store");
        console.log(this.myInput.current.value)
        const storeName = this.myInput.current.value
        this.props.history.push(`/store/${storeName}`)
	}
	render() {
		return (
			<form
				className="store-selector"
				onSubmit={this.goToStore}>
                    
				<h2>Please Enter a Store</h2>
				<input
					type="text"
                    ref={this.myInput}
					placeholder="Store Name"
					required
					defaultValue={getFunName()}
				/>
				<button type="submit">Visit Store &rarr;</button>
			</form>
		);
	}
}

export default StorePicker;
