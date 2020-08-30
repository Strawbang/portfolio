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
                    <Col className='m-4'>
                        <Card style={{maxWidth: '345'}}>
                            <CardActionArea>
                                <CardMedia
                                component="img"
                                alt="Contemplative Reptile"
                                height="140"
                                image="/keyservices.png"
                                title="Contemplative Reptile"
                                />
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    KeyServices
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Projet de fin d'année fait avec une API (nodeJS) et un site web (ReactJS) en respectant le cahier des charges.
                                </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button href="https://github.com/Rocket-Agency" size="small" color="primary">
                                Voir le projet
                                </Button>
                            </CardActions>
                        </Card>
                        <br></br>
                        <Card style={{maxWidth: '345'}}>
                            <CardActionArea>
                                <CardMedia
                                component="img"
                                alt="Contemplative Reptile"
                                height="140"
                                image="/ferrieres-paris.png"
                                title="Contemplative Reptile"
                                />
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Ecole-Ferrières 
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Refonte du code (PHP vanilla) en tant qu'alternant. 
                                </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button href="https://www.ferrieres-paris.com/" size="small" color="primary">
                                Voir le site
                                </Button>
                            </CardActions>
                        </Card>
                    </Col>
                    <Col className='m-4'>
                        <Card style={{maxWidth: '345'}}>
                            <CardActionArea>
                                <CardMedia
                                component="img"
                                alt="Contemplative Reptile"
                                height="140"
                                image="/ecole89.png"
                                title="Contemplative Reptile"
                                />
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Ecole-89
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Projet durant lequel j'ai du effectuer des modifications (Wordpress) en tant qu'alternant.
                                </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button href="https://ecole-89.com/" size="small" color="primary">
                                Voir le site
                                </Button>
                            </CardActions>
                        </Card>
                        <br></br>
                        <Card style={{maxWidth: '345'}}>
                            <CardActionArea>
                                <CardMedia
                                component="img"
                                alt="Contemplative Reptile"
                                height="140"
                                image="accelis.png"
                                title="Contemplative Reptile"
                                />
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Groupe-Accelis
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Création de la page offres-emploi et toute ses sous pages (Wordpress) en tant qu'alternant.
                                </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button href="https://accelis.fr/offres-emploi/" size="small" color="primary">
                                Voir la page
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