import React from 'react';
import './Rover.css'

import south from '../assets/roverS.png'
import north from '../assets/roverN.png'
import east from '../assets/roverE.png'
import west from '../assets/roverW.png'

class Rover extends React.Component {
  render() {
    const bgImages = {
        N: north,
        S: south,
        E: east,
        W: west
    }
    let styles = { //sets styles based on rover's position and heading
        gridColumn: this.props.col+1,
        gridRow: -1*(this.props.row+2),
        backgroundImage: `url(${bgImages[this.props.direction]}`
    }
    return (
      <div className="Rover" style={styles}>
          
      </div>
    );
  }
}

export default Rover;
