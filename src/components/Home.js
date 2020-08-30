import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import ProgressiveImage from 'react-progressive-image';
import homeImage from '../images/DJAMEL.png'
import { Button } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import GetAppIcon from '@material-ui/icons/GetApp';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from '@material-ui/icons/Instagram';

export class Home extends Component {

    render(){
        return(
            <>
            <Helmet>
                <title>Strawbang - Accueil</title>
                <meta name="description" content="Voir rapidement les informations sur strawbang" />
            </Helmet>
            <Container style={{height: '90%'}}>
                <Row style={{height: '100%'}}>
                    <Col md={6} className='ml-auto d-flex justify-content-center align-items-center flex-column'>
                        <h1>Strawbang</h1>
                        <h3>Developpeur</h3><br/>
                        <Button className="m-1" size="small" variant="contained" m={2} color="primary" href="/CV_Djamel_Bougouffa_Developpeur.pdf" target="_blank">Téléchargez mon CV<GetAppIcon/></Button><br/>
                        <div>
                            <a href='https://www.linkedin.com/in/djamel-bougouffa/' target="_blank"><LinkedInIcon style={{width: '40px',height: '40px',fontsize: '40px'}}/></a>
                            <a href='https://github.com/Strawbang' target="_blank"><GitHubIcon style={{width: '40px',height: '40px',fontsize: '40px'}}/></a>
                            <a href='https://www.instagram.com/strawbang' target="_blank"><InstagramIcon style={{width: '40px',height: '40px',fontsize: '40px'}}/></a>
                        </div>

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