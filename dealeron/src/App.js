import React from 'react';
import './App.css';
import Terminal from'./components/Terminal'
import Map from './components/Map'
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            NASA Mission Control: Operation Rover Rangers
        </p>
        </header>
          <Terminal />
          <Map />
      </div>
    );
  }
}

export default App;
