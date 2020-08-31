import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import Button from '@material-ui/core/Button';

export default function SimpleMenu() {
  return (
    <div>
    <header>
                <Navbar bg="white" expand="lg">
                <Navbar.Brand href="/">Strawbang</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                    <Button className="m-1" size="small" variant="contained" m={2} color="primary" href="/projet">
                    Projets
                    </Button>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
    </header>
    </div>
  );
}