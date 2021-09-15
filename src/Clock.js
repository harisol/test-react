import {Component} from 'react';

class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        let d = new Date();
        let seconds = d.getSeconds();
        if (seconds % 5 === 0 && seconds !== 0) {
            this.second = 'the second is multiple of 5';
        } else {
            this.second = null;
        }
        this.setState({ date: d });
    }
    

    render() {
        return (
            <div>
                <h1>Ticking Clock</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}</h2>
                <h3>{this.second}</h3>
            </div>
        );
    }
}

export default Clock;