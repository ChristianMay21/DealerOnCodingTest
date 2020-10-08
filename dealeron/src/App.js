import React from 'react';
import './App.css';
import Terminal from './components/Terminal'
import Map from './components/Map'
import Instructions from './components/Instructions'
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            NASA Mission Control: Operation Rover Rangers
        </p>
        </header>
        <div className='body-container'>
          <div className='left-side'>
            <Map width={4} height={5} />
          </div>
          <div className='input'>
            <Instructions />
            <Terminal />
          </div>

        </div>
      </div>
    );
  }
}

export default App;
