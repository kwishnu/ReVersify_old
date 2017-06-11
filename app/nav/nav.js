//"landing page" for both index.android.js and index.ios.js to host Navigation for app
'use strict';
import React, { Component } from 'react';
var Navigation = require('./app_navigator');

class Nav extends Component {
    render() {
        return (
            <Navigation />
        );
    }
}

module.exports = Nav;
