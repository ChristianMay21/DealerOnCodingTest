import React from 'react';
import { XTerm } from 'xterm-for-react'
import './Terminal.css'

const LEFT_ARROW = "\x1b[D"
const RIGHT_ARROW = "\x1b[C"
const DOWN_ARROW = "\x1b[B"
const CLEAR_DISPLAY = '\x1b[2J'
const CURSOR_TO_ORIGIN = '\x1b[H'

let num_cols = null;
let num_rows = null

class Terminal extends React.Component {
    constructor(props) {
        super(props)
        this.xtermRef = React.createRef()

        this.state = {
            input: "",
            lines: [], //does not include currentLine
            currentLine: "",
            cursorPosition: 0, //number of positions back the cursor is relative to the end of the line
            commandNum: 1, //which line of user-input commands we're on
        }
    }
 
    nextLine = () => {
        this.setState((prevState, props) => ({
            lines: [...prevState.lines, this.state.currentLine]
        }));
        this.xtermRef.current.terminal.writeln(" ")
        this.setState({currentLine: ""})
    }


    handleBackspace = () => {//terminal does not support backspace by default, so we have to store the whole terminal text in state, delete all of the text from the terminal upon backspace, and then reprint all of it save whatever character was deleted
        if (this.state.cursorPosition !== this.state.currentLine.length) {
            const DELETED_CHAR_INDEX = -1 * (this.state.cursorPosition)
            let newLineText = this.state.currentLine.slice(0, DELETED_CHAR_INDEX + this.state.currentLine.length - 1) + this.state.currentLine.slice(DELETED_CHAR_INDEX + this.state.currentLine.length, this.state.currentLine.length) //storing line in case setState does not finish before the terminal rerenders
            this.setState((prevState, props) => (
                { currentLine: prevState.currentLine.slice(0, DELETED_CHAR_INDEX + prevState.currentLine.length - 1) + prevState.currentLine.slice(DELETED_CHAR_INDEX + prevState.currentLine.length, prevState.currentLine.length) }
            )); //remove last character from line
            this.xtermRef.current.terminal.write(CLEAR_DISPLAY);
            this.xtermRef.current.terminal.write(CURSOR_TO_ORIGIN);
            for (let line of this.state.lines) {
                this.xtermRef.current.terminal.writeln(line)
            }
            this.xtermRef.current.terminal.write(newLineText)
            let counter = this.state.cursorPosition;
            while (counter > 0) {
                this.xtermRef.current.terminal.write(LEFT_ARROW)
                counter -= 1;
            }
        }
    }

    writeln = (data) => {
        this.setState((prevState, props) => ({
            lines: [...prevState.lines, data]
        }));
        this.xtermRef.current.terminal.writeln(data)
    }

    write = (data) => {
        this.setState((prevState, props) => (
            { currentLine: prevState.currentLine + data }
        ));
        this.xtermRef.current.terminal.write(data)
    }

    moveCursorLeft = () => {
        if (this.state.currentLine.length > this.state.cursorPosition) {
            this.xtermRef.current.terminal.write(LEFT_ARROW)
            this.setState((prevState, props) => ({
                cursorPosition: prevState.cursorPosition + 1
            }));
        }
    }

    moveCursorRight = () => {
        if (this.state.cursorPosition > 0) {
            this.xtermRef.current.terminal.write(RIGHT_ARROW)
            this.setState((prevState, props) => ({
                cursorPosition: prevState.cursorPosition - 1
            }));
        }
    }

    handleDownArrow = () => {
        console.log('locationLog:', this.props.locationLog)
        this.nextLine()
        this.writeln('results: ')
        for (const loc of this.props.locationLog) {
            this.writeln(`${loc[0]} ${loc[1]} ${loc[2]}`)
        }
    }

    incrementCommandNum = () => {
        this.setState((prevState, props) => ({
            commandNum: prevState.commandNum + 1
        }));
    }

    handleGridSize = (data) => {
        const [COLS, ROWS] = data.split(" ").map((chars) => parseInt(chars) + 1)
        num_cols = COLS
        num_rows = ROWS
        console.log('cols, rows: ', num_cols, num_rows)
        this.props.createGrid(COLS, ROWS)
        this.incrementCommandNum()
        this.nextLine()
    }

    handleLocation = (data) => {
        const EAST_COORD = parseInt(data.split(" ")[0])
        const NORTH_COORD = parseInt(data.split(" ")[1])
        const HEADING = data.split(" ")[2]
        if(EAST_COORD >= num_cols || NORTH_COORD >= num_rows) {
            this.invalidInput("Coordinates out of marked region. Please input valid coordinates.")
        } else {
            this.props.createRover([EAST_COORD,NORTH_COORD,HEADING])
            this.incrementCommandNum()
            this.nextLine()
        }

    }

    handleMovement = (data) => {
        this.props.moveRover(data)
        this.incrementCommandNum()
        this.nextLine()
    }

    handleEnter = () => {
        console.log(this.state.currentLine)
        if (this.state.commandNum === 1) {
            if (!/\d+ \d+/.test(this.state.currentLine)) {
                this.invalidInput('invalid format. Line should be of format "# #"')
            } else {
                this.handleGridSize(this.state.currentLine)
            }
        } else if ((this.state.commandNum - 1) % 2 === 1) {//position and heading line
            if (!/\d \d [NSEW]/.test(this.state.currentLine)) {
                this.invalidInput('invalid format. Line should be of format "# # N/S/E/W"')
            } else {
                this.handleLocation(this.state.currentLine)
            }
        } else {
            if (!/^[MLR]*$/.test(this.state.currentLine)) {//movement instructions
                this.invalidInput('invalid format. Line should be of format "MRLLR..."')
            } else {
                this.handleMovement(this.state.currentLine)
            }
        }
    }

    invalidInput = (data) => {
        this.nextLine()
        this.writeln("Error: " + data + " Try again.")
    }

    componentDidMount() {
        this.writeln("NASA Rover Mission Console: Version 12.3.46");
        this.writeln("(c) National Aeronautics and Space Administration. All rights reserved.")
        this.writeln(" ")
        this.writeln("Please input Rover instructions, one line at a time. When you are done, press ")
        this.writeln("the down arrow to see output of final results.")
    }

    render() {
        return (

            <div className='terminal-container'>
                <div className="terminal">
                    <div className='commandHeader'>Rover Command Console</div>
                    <XTerm
                        ref={this.xtermRef}
                        onData={(data) => {
                            const code = data.charCodeAt(0);
                            if (code === 13 && this.state.input.length > 0) {
                                this.handleEnter()
                            } else if (code === 127 && this.state.input.length > 0) {
                                this.handleBackspace()
                            } else if (code === 27) {
                                if (data === LEFT_ARROW) {
                                    this.moveCursorLeft()
                                } else if (data === RIGHT_ARROW) {
                                    this.moveCursorRight()
                                } else if (data === DOWN_ARROW) {
                                    this.handleDownArrow()
                                }
                            }
                            else if (code < 32) { //ignore keys that are not text input
                                return;
                            } else {
                                this.write(data);
                                this.setState({ input: this.state.input + data })
                            }
                        }
                        }
                    />
                </div>
                <div className='code-format'>
                    <div className='format-header'>CODE FORMATTING:</div>
                    <div className='format-element'>Did you happen to forget the formatting? Here's a refresher</div>
                    <div className='format-element'><span className="format-subheader">First row:</span> Dimensions of grid. E.g. <span className='code'>5 5</span></div>
                    <div className='format-element'><span className="format-subheader">Second row:</span> position and heading of rover. E.g. <span className='code'>1 2 N</span></div>
                    <div className='format-element'><span className="format-subheader">Third row:</span> Movement instructions. E.g. <span className='code'>LMLMLMLMM</span></div>
                    <div className='format-element'>Repeat second and third rows for additional rovers</div>
                    <div className='format-element'>Press down arrow for final results when complete</div>
                </div>
            </div>
        );
    }
}

export default Terminal;
