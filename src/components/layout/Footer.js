import React, { Component } from 'react';
import InstagramEmbed from 'react-instagram-embed';

export default class Home extends Component {

    render(){
        return(
            <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
            />
        )
    }
}