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
  createGrid = (cols, rows) => {//sets grid size
    this.setState({
      width: cols,
      height: rows
    })
  }

  createRover = (roverLocation) => {//spawns a new rover
    movements.push(() => {
      this.setState({ movePath: "" })
      this.setState({ roverLocation: roverLocation })
    })
  }

  leftTurn = (direction) => {//makes rover turn left
    const turnMap = {
      'N': 'W',
      'W': 'S',
      'S': 'E',
      'E': 'N'
    }
    return turnMap[direction]
  }

  rightTurn = (direction) => {//makes rover turn right
    const turnMap = {
      'N': 'E',
      'E': 'S',
      'S': 'W',
      'W': 'N'
    }
    return turnMap[direction]
  }

  moveRoverForward = () => { //makes rover go forward
    switch (this.state.roverLocation[2]) {
      case 'N':
        if (this.state.roverLocation[1] < this.state.height - 1) { //do not allow rover to exit the grid
          this.setState((prevState, props) => ({
            roverLocation: [prevState.roverLocation[0], prevState.roverLocation[1] + 1, prevState.roverLocation[2]]
          }))
        }
        break;

      case 'E':
        if (this.state.roverLocation[0] < this.state.width - 1) {//do not allow rover to exit the grid
          this.setState((prevState, props) => ({
            roverLocation: [prevState.roverLocation[0] + 1, prevState.roverLocation[1], prevState.roverLocation[2]]
          }))
        }
        break;

      case 'S':
        if (this.state.roverLocation[1] > 0) {//do not allow rover to exit the grid
          this.setState((prevState, props) => ({
            roverLocation: [prevState.roverLocation[0], prevState.roverLocation[1] - 1, prevState.roverLocation[2]]
          }))
        }
        break;

      case 'W':
        if (this.state.roverLocation[0] > 0) {//do not allow rover to exit the grid
          this.setState((prevState, props) => ({
            roverLocation: [prevState.roverLocation[0] - 1, prevState.roverLocation[1], prevState.roverLocation[2]]
          }))
        }
        break;
      default:
        break;

    }
  }

  modifyRoverPosition = (char) => {//parses rover movement instructions
    if (char === 'L') {
      this.setState((prevState, props) => ({
        roverLocation: [prevState.roverLocation[0], prevState.roverLocation[1], this.leftTurn(prevState.roverLocation[2])]
      }))
    } else if (char === 'R') {
      this.setState((prevState, props) => ({
        roverLocation: [prevState.roverLocation[0], prevState.roverLocation[1], this.rightTurn(prevState.roverLocation[2])]
      }))
    } else if (char === 'M') {
      this.moveRoverForward()
    }
  }

  logRoverPosition = () => {//once the rover is done moving, this function is called, adding its position to the list of positions that will eventually be printed in the terminal
    this.setState((prevState, props) => ({
      locationLog: [...prevState.locationLog,this.state.roverLocation]
    }));
  }

  processOneMovement = () => {
    if (movements.length !== 0) {
      movements[0]()
      movements.shift();
    }
  }

  moveRover = (data) => {//adds one single movement instruction to movement queue
    let counter = 1;

    for (let char of data) {
      movements.push(() => { this.modifyRoverPosition(char) })
      if (counter === data.length) {
        movements.push(() => { this.logRoverPosition() })
      }
      counter ++;
    }
  }

  componentDidMount() {
    setInterval(this.processOneMovement, 1000) //sets a heartbeat that constantly checks for movements - this is to ensure that movements happen slowly enough to see the rover moving along the grid
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
