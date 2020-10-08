import React from 'react';
import './Instructions.css'

class Instructions extends React.Component {
  render() {

    return (
      <div className="Instructions">
          To the left, you can see satellite imagery of our rovers on the surface of Mars. North is up, South is down. Enter the rover's instructions into the Rover Command Terminal, and you will see the rovers in action as they navigate the red planet.
      </div>
    );
  }
}

export default Instructions;
