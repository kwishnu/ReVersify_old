'use strict';
import React, {Component} from 'react';
import { Navigator } from 'react-native';

const Splash = require('../routes/splash');
const Intro = require('../routes/intro');
const Home = require('../routes/home');
const Settings = require('../routes/settings');
const Mission = require('../routes/mission');
const About = require('../routes/about');
const Social = require('../routes/social');
const Game = require('../routes/game');
const Daily = require('../routes/daily');
const Collection = require('../routes/collection');
const Favorites = require('../routes/favorites');
const Bounce = require('../routes/bounce');
const HintStore = require('../routes/hintstore');
const Store = require('../routes/store');

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
            case 'mission':
                return Mission;
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
            case 'favorites':
                return Favorites;
            case 'bounce':
                return Bounce;
            case 'hints':
                return HintStore;
            case 'store':
                return Store;

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
