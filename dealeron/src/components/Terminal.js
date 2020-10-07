import React from 'react';
import { XTerm } from 'xterm-for-react'

const LEFT_ARROW = "\x1b[D"
const RIGHT_ARROW = "\x1b[C"
const CLEAR_DISPLAY = '\x1b[2J'
const CURSOR_TO_ORIGIN = '\x1b[H'

class Terminal extends React.Component {
    constructor(props) {
        super(props)
        this.xtermRef = React.createRef()

        this.state = {
            input: "",
            lines: [], //does not include currentLine
            currentLine: "",
            cursorPosition: 0 //number of positions back the cursor is relative to the end of the line
        }
    }

    handleBackspace = () => {//terminal does not support backspace by default, so we have to store the whole terminal text in state, delete all of the text from the terminal upon backspace, and then reprint all of it save whatever character was deleted
        if(this.state.cursorPosition !== this.state.currentLine.length) {
            const DELETED_CHAR_INDEX = -1*(this.state.cursorPosition)
            let newLineText = this.state.currentLine.slice(0, DELETED_CHAR_INDEX+this.state.currentLine.length-1)+this.state.currentLine.slice(DELETED_CHAR_INDEX+this.state.currentLine.length, this.state.currentLine.length) //storing line in case setState does not finish before the terminal rerenders
            this.setState((prevState, props) => (
                { currentLine: prevState.currentLine.slice(0, DELETED_CHAR_INDEX+prevState.currentLine.length-1)+prevState.currentLine.slice(DELETED_CHAR_INDEX+prevState.currentLine.length, prevState.currentLine.length)}
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
        if(this.state.currentLine.length > this.state.cursorPosition) {
            this.xtermRef.current.terminal.write(LEFT_ARROW)
            this.setState((prevState, props) => ({
                cursorPosition: prevState.cursorPosition + 1
            }));
        }
    }

    moveCursorRight = () => {
        if(this.state.cursorPosition > 0) {
            this.xtermRef.current.terminal.write(RIGHT_ARROW)
            this.setState((prevState, props) => ({
                cursorPosition: prevState.cursorPosition - 1
            }));
        }
    }

    handleEnter = () => {

    }

    componentDidMount() {
        this.writeln(
            "NASA Rover Mission Console: Version 12.3.46"
        );
        this.writeln("(c) National Aeronautics and Space Administration. All rights reserved.")
    }

    render() {
        return (
            <div>
                <XTerm
                    ref={this.xtermRef}
                    onData={(data) => {
                        const code = data.charCodeAt(0);
                        if (code === 13 && this.state.input.length > 0) {
                            this.handleEnter()
                        } else if (code === 127 && this.state.input.length > 0) {
                            this.handleBackspace()
                        } else if (code === 27) {
                            if(data === LEFT_ARROW) {
                                this.moveCursorLeft()
                            } else if (data === RIGHT_ARROW) {
                                this.moveCursorRight()
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
        );
    }
}

export default Terminal;
