import React, {Component} from 'react';
import { View } from 'react-native';

class Bounce extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 'bounce'
        };
    }
    componentDidMount() {


    }

    render() {
		return(
			<View style={{flex: 1, backgroundColor: this.props.bg}}>
			</View>
		)
    }
}


module.exports = Bounce;