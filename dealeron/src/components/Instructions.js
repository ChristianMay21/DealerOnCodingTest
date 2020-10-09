import React from 'react';
import './Instructions.css'

class Instructions extends React.Component {
  render() {

    return (
      <div className="Instructions">
        <h2>Overview</h2>
        <p>To the left, you can see satellite imagery of our rovers on the surface of Mars. North is up, South is down. Their direction vector is displayed with a green arrow. Enter the rover's instructions into the Rover Command Terminal, and you will see the rovers in action as they navigate the red planet. </p>
        <p>We only have one connection to the rovers with very limited bandwidth: you may queue new actions at any time but do not expect a rover to return its results before it has completed movement.</p>
      </div>
    );
  }
}

export default Instructions;
