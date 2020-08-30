import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import {Home} from '../Home';
import {About} from '../About';
import {Contact} from '../Contact';
import {Project} from '../Project';

export default class Routing extends Component {

    render(){
        return(
            <Switch>
                <Route path='/' component={Home} exact></Route>
                <Route path='/projet' component={Project}></Route>
                <Route path='/a-propos' component={About}></Route>
            </Switch>
        )
    }
}