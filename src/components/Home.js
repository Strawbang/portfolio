import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Swiper from 'react-id-swiper';
import { Helmet } from 'react-helmet';
import ProgressiveImage from 'react-progressive-image';
import homeImage from '../images/DJAMEL.png'

export class Home extends Component {

    render(){
        return(
            <>
            <Helmet>
                <title>Strawbang - Accueil</title>
                <meta name="description" content="Voir rapidement les informations sur strawbang" />
            </Helmet>
            <Container style={{height: '100%'}}>
                <Row className="justify-content-md-center" style={{height: '100%'}}>
                    <Col md={6} className='ml-auto d-flex align-items-center'>
                        <h1 className='text-right'>Strawbang</h1>
                    </Col>
                    <Col md={6} className='ml-auto d-flex align-items-center'>
                        <ProgressiveImage src={homeImage} placeholder={homeImage}>
                            {src => <img src={src} alt="an image" style={{width: '100%', boxShadow: "200px 5px 5px white", borderRadius:"50%"}}/>}
                        </ProgressiveImage>
                    </Col>
                </Row>
            </Container>
            </>
        )
    }
}