import React from 'react';
import './Map.css'
import MapItem from './MapItem'
import Rover from './Rover'


class Map extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            east: this.props.roverLocation[0],
            north: this.props.roverLocation[1],
            direction: this.props.roverLocation[2]
        }
    }

    changeWidth = () => {
        this.setState({map_width: window.innerWidth-675})
    }

    componentDidMount() {
        window.addEventListener('resize', this.changeWidth)
    }



    render() {
        let container_styles = {}
        let grid_styles = {
            gridTemplateColumns: "auto ".repeat(this.props.width).slice(0, -1),
            gridTemplateRows: "auto ".repeat(this.props.height).slice(0, -1)
        }

        if (this.props.height > this.props.width) { //'tall' grid: shrink width   
            grid_styles.width = `${(this.props.width/this.props.height)*90}vh`
            container_styles.width = grid_styles.width;

        } else { //'chubby' grid: shrink height
            grid_styles.height = `${(this.props.height/this.props.width)*90}vh`
            container_styles.width = `90vh`
        }
        let cells = []
        let c, r;
        c = r = 0;

        while (c < this.props.width) {
            while (r < this.props.height) {
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
                <div className="rovers" style={grid_styles}>
                    {this.props.roverLocation[0] !== -1 ? <Rover col={this.props.roverLocation[0]} row={this.props.roverLocation[1]} direction={this.props.roverLocation[2]}/> : null /* render rover only if a location has been passed */} 
                </div>
            </div>
        );
    }
}

export default Map;
