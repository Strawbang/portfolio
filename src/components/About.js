import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Container, Row, Col } from 'react-bootstrap';

export class About extends Component {

    render(){
        return(
            <>
            <Helmet>
                <title>Strawbang - A propos</title>
                <meta name="description" content="Projets de strawbang" />
            </Helmet>
            <Container fluid>
                <Row>
                    <Col xs={12} className='m-5'>
                        <h1 className='text-center'>A propos</h1>
                    </Col>
                    <Col xs={12}>
                        <p >
                            En derniere annee de master (Expert Architecte Web) ayant deja effectuer une alternance d'un ans et sept mois en tant developpeur junior.
                            Auparavant ayant deja accquis quelques experiences en stages.
                            Passionne par le developpement et les nouvelles technologies depuis quelques annees.
                            Je suis a la recherche d'une alternance. 
                        </p>
                    </Col>
                </Row>
            </Container>
            </>
        )
    }
}