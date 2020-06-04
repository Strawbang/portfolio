import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Helmet } from 'react-helmet';

export class Project extends Component {

    render(){
        return(
            <>
            <Helmet>
                <title>Strawbang - Projets</title>
                <meta name="description" content="Projets de strawbang" />
            </Helmet>
            <Container fluid>
                <Row>
                    <Col xs={12} className='m-5'>
                        <h1 className='text-center'>Projets</h1>
                    </Col>
                    <Col className='m-5'>
                        <Card style={{maxWidth: '345'}}>
                        <CardActionArea>
                            <CardMedia
                            component="img"
                            alt="Contemplative Reptile"
                            height="140"
                            image="/static/images/cards/contemplative-reptile.jpg"
                            title="Contemplative Reptile"
                            />
                            <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Lizard
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                                across all continents except Antarctica
                            </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary">
                            Learn More
                            </Button>
                        </CardActions>
                        </Card>
                    </Col>
                </Row>
            </Container>
            </>
        )
    }
}