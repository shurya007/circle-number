import * as React from 'react';
import './App.css';

class CircleNumber extends React.Component{
  constructor(props) {
    super(props);
    this.circleNumberMapper = new Map();
    this.state = {
      allSet: false,
      previousSelectedIndex: 0,
      circleNumber: 0,
      increment: 0
    }
    this.handleChange = this.handleChange.bind(this);
  }


  displayText = (index, value) => {
    if(this.state.allSet && index !== this.state.previousSelectedIndex){
      this.setCircle();
      this.setState({allSet: false})
    }

    const circleObject = this.circleNumberMapper.get(index);
    this.circleNumberMapper.set(index , {
      numberAssigned: circleObject.numberAssigned > 0 ? circleObject.numberAssigned: this.state.increment + 1,
      displayNumber: value
    })
    if(circleObject.numberAssigned === 0){
      this.setState({increment: this.state.increment + 1})
    }
    if(!this.state.allSet){
      this.setState({previousSelectedIndex: index})
    } else{
      this.forceUpdate()
    }
  }

  onMouseUp = (index) => {
    const circleObject = this.circleNumberMapper.get(index);
    this.circleNumberMapper.set(index , {
      ...circleObject,
      displayNumber: false
    })
    this.setState({allSet: Array.from(this.circleNumberMapper.values()).every(item => item.numberAssigned > 0),
      previousSelectedIndex: index})
  }

  handleChange(event){
    this.setState({circleNumber: event.target.value, increment: 0})
  }

  resetCounter = () => {
    this.setState({increment: 0})
  }

  setCircle = () => {
    this.setState({renderCircle: false})
    this.circleNumberMapper = new Map();
    for(let i=1; i<= this.state.circleNumber; i++){
      this.circleNumberMapper.set(i, {
        numberAssigned: 0,
        displayNumber: false
      });
    }
    this.setState({renderCircle: true})
  }

  render() {
    return (
        <div className='input-container'>
          <input type='number' className='circle-input' placeholder='Enter number of circles to be generated'
                    value={this.state.circleNumber} onChange={this.handleChange}>
          </input>
          <button className={'generate-button ' + (this.state.circleNumber < 1 ? 'disabled-button' : '')}
                  onClick={() => {this.setCircle(); this.resetCounter()}} disabled={this.state.circleNumber < 1}> Generate </button>
          {this.state.renderCircle && (
              <div className='circles-container' >
                {Array.from(this.circleNumberMapper.keys()).map(cir => {
                      return <div key={cir} className={'circle ' + (this.circleNumberMapper.get(cir).numberAssigned > 0 ? 'visited-circle' : '')}
                                  onMouseDown={() => this.displayText(cir, true)}
                                  onMouseUp={() => this.onMouseUp(cir)} onMouseLeave={() => this.onMouseUp(cir)} >
                        {this.circleNumberMapper.get(cir).displayNumber && <div className='circle-counter'>
                          {this.circleNumberMapper.get(cir).numberAssigned}
                        </div>}
                      </div>
                    })
                }
              </div>
          )}
        </div>
    )
  }

}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CircleNumber/>
      </header>
    </div>
  );
}

export default App;
