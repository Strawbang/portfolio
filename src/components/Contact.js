import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

export class Contact extends Component {

    render(){
        return(
            <>
            <Helmet>
                <title>Strawbang - Contact</title>
                <meta name="description" content="Contacter strawbang" />
            </Helmet>
            <Container>
                <Row>
                    <Col xs={12}>
                        <h1 className='text-center'>Contact</h1>
                    </Col>
                    <Col>
                        <p>Envoyer moi un email à cette adresse dbougouffa@gmail.com</p>
                        <Button className="m-1" size="small" variant="contained" m={2} color="primary">Téléchargez mon CV</Button>
                    </Col>
                </Row>
            </Container>
            </>
        )
    }
}