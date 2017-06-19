'use strict';
import React, {Component} from 'react';
import { Navigator } from 'react-native';

const Splash = require('../routes/splash');
const Intro = require('../routes/intro');
const Home = require('../routes/home');
const Settings = require('../routes/settings');
const About = require('../routes/about');
const Social = require('../routes/social');
const Game = require('../routes/game');
const Daily = require('../routes/daily');
const Collection = require('../routes/collection');
const Bounce = require('../routes/bounce');

class AppNavigator extends React.Component {
    constructor(props) {
        super(props);
    }
    navigatorRenderScene(routeID) {
        switch (routeID) {
            case 'splash':
                return Splash;
            case 'intro':
                return Intro;
            case 'home':
                return Home;
            case 'settings':
                return Settings;
            case 'about':
                return About;
            case 'social':
                return Social;
            case 'game':
                return Game;
            case 'daily':
                return Daily;
            case 'collection':
                return Collection;
            case 'bounce':
                return Bounce;

            // Add more ids here
        }
    }

    render() {
        return (
            <Navigator
              initialRoute={ { id: 'splash',  passProps: {motive: 'initialize'} } }
              renderScene={(route, navigator) => {
                return React.createElement(this.navigatorRenderScene(route.id), { ...this.props, ...route.passProps, navigator, route } );
              }} />
        );
    }
}

module.exports = AppNavigator;
