import * as React from 'react';
import './App.css';
import WordCloud from 'react-d3-cloud';

class TagCloud extends React.Component{
  constructor(props) {
    super(props);
    this.words = [];
    this.fontMapper = word => Math.min(Math.log1p(word.value) * word.value, 70);
    this.rotate = word => word.value % 45;
    this.state = {
      textAreaValue: '',
      renderCloud: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event){
    this.setState({textAreaValue: event.target.value, renderCloud: false})
  }

  handleClick(){
    let regex = /[!"#$%'()*+,-./:;<=>?@[\]^_`~{|}]/g;
    this.setState({renderCloud: false});
    this.words = [];
    let wordArray = this.state.textAreaValue.split("\n").join(",").split(" ").join(",").split(",");
    let weightMapper = new Map();
    wordArray.forEach(word => {
      let wordChecked = word.trim().replace(regex, '');
      if(wordChecked.length > 0){
        wordChecked = wordChecked.charAt(0).toUpperCase() + wordChecked.slice(1).toLowerCase();
        if(weightMapper.has(wordChecked)){
          const wordWeight = weightMapper.get(wordChecked);
          weightMapper.set(wordChecked, wordWeight + 5);
        } else {
          weightMapper.set(wordChecked, 10);
        }
      }
    });

    Array.from(weightMapper.keys()).forEach(word => {
      this.words.push({
        text: word,
        value: weightMapper.get(word)
      })
    });
    this.setState({renderCloud: true});
  }

  render() {
    return (
        <div className='tagcloud-input-container'>
          <textarea className='tagcloud-input' placeholder='Enter text for creating word cloud'
                    value={this.state.textAreaValue} onChange={this.handleChange}>
          </textarea>
          <br/>
          <button className={'generate-button ' + (!this.state.textAreaValue ? 'disabled-button' : '')}
                  onClick={this.handleClick} disabled={!this.state.textAreaValue}> Generate </button>
          {this.state.renderCloud && (
              <WordCloud width={1200} height={500} data={this.words} fontSizeMapper={this.fontMapper} rotate={this.rotate}/>
          )}
        </div>
    )
  }

}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TagCloud/>
      </header>
    </div>
  );
}

export default App;
