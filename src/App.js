import React from 'react';
import logo from './logo.svg';
import Header from './components/layout/Header';
import Routing from './components/layout/Routing';
import Footer from './components/layout/Footer';
import './styles/App.scss'

function App() {
  return (
    <>
      <Header/>
      <Routing/>
      <Footer/>
    </>
  );
}

export default App;
