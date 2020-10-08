import React from 'react';
import './Map.css'
import MapItem from './MapItem'
import Rover from './Rover'

class Map extends React.Component {
    render() {
        let grid_styles = {
            gridTemplateColumns: "auto ".repeat(this.props.width).slice(0, -1),
            gridTemplateRows: "auto ".repeat(this.props.height).slice(0, -1)
        }

        let container_styles = {
            width: `${(this.props.width / this.props.height) * 90}vh`
        }

        let cells = []
        let c, r;
        c = r = 0;

        while (c < this.props.width) {
            while (r < this.props.height) {
                console.log('pushing')
                cells.push(<MapItem key={[c, r]} east={c} north={r} />)
                r += 1;
            }
            r = 0;
            c += 1;
        }

        
        return (

                <div className="map-container" style={container_styles}>
                    <div className="Map" style={grid_styles}>
                        {cells}
                    </div>
                    <div className = "rovers">

                    </div>
                </div>
        );
    }
}

export default Map;
