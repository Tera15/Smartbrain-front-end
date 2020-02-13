import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai'
import './App.css';

const particlesOptions = { //removed from particles options from the component and stored in variable to clean up code.
    particles: {
    number: {
      value: 35,
      density: {
        enable: true,
        value_area: 300
      }
    }
  }
}


const app = new Clarifai.App({
  apiKey: "0fcf3071ce5e4c039377dfe6fea1f2db",
})


class App extends Component{
  constructor(){
    super();
    this.state = {
      imput: '',
      imageUrl: '',
      box: {},
      route: 'signout',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  //loading user
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputImage')
     const width = Number(image.width);
     const height = Number(image.height);
     return {
       leftCol: clarifaiFace.left_col * width,
       topRow: clarifaiFace.top_row * height,
       rightCol: width - (clarifaiFace.right_col * width),
       bottomRow: height - (clarifaiFace.bottom_row * height),
     }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input}); 
    app.models
    .predict(
    Clarifai.FACE_DETECT_MODEL,
        // URL
       this.state.input)
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route==='home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){
    return(
      <div className="App">
        <Particles className='particles' //react particles js library.
        params={particlesOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
        ? //ternary operator dealing with route state.
       <div>
          <Logo/> 
         <Rank 
         entries={this.state.user.entries}
         name={this.state.user.name}
         />
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit}
        />
         <FaceRecognition
          imageUrl={this.state.imageUrl}
          box={this.state.box}
          /> 
          </div>
        :  (
          this.state.route === 'signout' 
         ? <SignIn 
         loadUser={this.loadUser}
         onRouteChange={this.onRouteChange}
         />
         : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
        
        }  
      </div>
    );
  }
}

export default App;
