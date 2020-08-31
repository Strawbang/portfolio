import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import {Home} from '../Home';
import {Project} from '../Project';

export default class Routing extends Component {

    render(){
        return(
            <Switch>
                <Route path='/' component={Home} exact></Route>
                <Route path='/projet' component={Project}></Route>
            </Switch>
        )
    }
}