import React from 'react';
import './App.css';
import Terminal from './components/Terminal'
import Map from './components/Map'
import Instructions from './components/Instructions'

let movements = []

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: 5,
      height: 5,
      roverLocation: [-1, -1, 'S'],
      movePath: "",
      locationLog: []
    }
  }
  createGrid = (cols, rows) => {
    this.setState({
      width: cols,
      height: rows
    })
  }

  createRover = (roverLocation) => {
    movements.push(() => {
      this.setState({ movePath: "" })
      this.setState({ roverLocation: roverLocation })
    })
  }

  leftTurn = (direction) => {
    const turnMap = {
      'N': 'W',
      'W': 'S',
      'S': 'E',
      'E': 'N'
    }
    return turnMap[direction]
  }

  rightTurn = (direction) => {
    const turnMap = {
      'N': 'E',
      'E': 'S',
      'S': 'W',
      'W': 'N'
    }
    return turnMap[direction]
  }

  modifyRoverPosition = (char) => {
    if (char === 'L') {
      this.setState((prevState, props) => ({
        roverLocation: [prevState.roverLocation[0], prevState.roverLocation[1], this.leftTurn(prevState.roverLocation[2])]
      }))
    } else if (char === 'R') {
      this.setState((prevState, props) => ({
        roverLocation: [prevState.roverLocation[0], prevState.roverLocation[1], this.rightTurn(prevState.roverLocation[2])]
      }))
    } else if (char === 'M') {
      switch (this.state.roverLocation[2]) {
        case 'N':
          if (this.state.roverLocation[1] < this.state.height - 1) {
            this.setState((prevState, props) => ({
              roverLocation: [prevState.roverLocation[0], prevState.roverLocation[1] + 1, prevState.roverLocation[2]]
            }))
          }
          break;

        case 'E':
          if (this.state.roverLocation[0] < this.state.width - 1) {
            console.log('updating rover position')
            this.setState((prevState, props) => ({
              roverLocation: [prevState.roverLocation[0] + 1, prevState.roverLocation[1], prevState.roverLocation[2]]
            }))
          }
          break;

        case 'S':
          if (this.state.roverLocation[1] > 0) {
            this.setState((prevState, props) => ({
              roverLocation: [prevState.roverLocation[0], prevState.roverLocation[1] - 1, prevState.roverLocation[2]]
            }))
          }
          break;

        case 'W':
          if (this.state.roverLocation[0] > 0) {
            this.setState((prevState, props) => ({
              roverLocation: [prevState.roverLocation[0] - 1, prevState.roverLocation[1], prevState.roverLocation[2]]
            }))
          }
          break;
        default:
          break;

      }
    }
  }

  logRoverPosition = () => {
    console.log('logging position')
    this.setState((prevState, props) => ({
      locationLog: [...prevState.locationLog,this.state.roverLocation]
    }));
  }

  processOneMovement = () => {
    console.log('looking at movement queue')
    if (movements.length !== 0) {
      console.log('executing an action!')
      movements[0]()
      movements.shift();
    }
  }

  moveRover = (data) => {
    let counter = 1;

    for (let char of data) {
      movements.push(() => { this.modifyRoverPosition(char) })
      if (counter === data.length) {
        console.log('queueing position log')
        movements.push(() => { this.logRoverPosition() })
      }
      counter ++;
    }
  }

  componentDidMount() {
    setInterval(this.processOneMovement, 1000)
  }

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
            <Map width={this.state.width} height={this.state.height} roverLocation={this.state.roverLocation} movePath={this.state.movePath} sendLocation={this.sendLocation} />
          </div>
          <div className='input'>
            <Instructions />
            <Terminal createGrid={this.createGrid} createRover={this.createRover} moveRover={this.moveRover} locationLog={this.state.locationLog} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
