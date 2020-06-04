import React, { Component } from 'react';
import { FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';

export class Contact extends Component {

    render(){
        return(
            <>
            <h1>Contact</h1>
            <FormControl>
                <InputLabel htmlFor="my-input">Email address</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" />
                <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
            </FormControl>
            </>
        )
    }
}