import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//functional component for a single cell. Also determines color of cell (0: white, 1: pink).
function Square(props){
  let cellColor;
  cellColor = props.value === 0 ? "square" : "square-red";
  return (    
    <button className={cellColor} onClick={props.onClick}>
        {props.value}
    </button>
  )
}

//class component for the entire board.
class Board extends React.Component {

  //renders a cell and determines what happens when it is clicked.
  renderSquare(i) {
    return <Square value={this.props.squares[i]}
                   onClick={()=> this.props.onClick(i)}/>;
  }

  //renders the entire board, by rendering each cell in a grid layout.
  render() {    
    var list = [];
    for (var i = 0; i < 225; i++) {
      list.push(i);
    } 

    return (
      <div style={
        {display: 'grid',
        gridTemplateColumns: `repeat(${15},34px)`}}>
          {list.map(num => <div key={`${num}`}> {this.renderSquare(num)} </div>)}
      </div>
    )
  }
}

class Game extends React.Component {
  //the state of the game is housed in this component. 
  constructor(props) {
    super(props);
    
    this.state = {
        squares: Array(225).fill(0),
        width: 15,
        interval: null,
    }
  }

  //used to remove any live cells from the board.
  clearGrid(){
    const emptySquares = Array(225).fill(0);
    this.setState({squares: emptySquares});
  }

  //used to bring random cells to life
  populateRandom(){
    let newSquares = Array.from({length: 225}, () => Math.round(Math.random()));
    console.log(newSquares);
    this.setState({squares: newSquares});
  }

  //determines which cell is clicked and toggles it's value (0 <-> 1).
  handleClick(i) {
    const squares = this.state.squares;
    let squaresCopy = [...squares];
    squaresCopy[i] = squares[i] ? 0 : 1;
    this.setState({squares: squaresCopy});
  }

  //used to initiate the game-of-life simulation
  startSimulation(){
    if(this.state.interval){
      clearInterval(this.state.interval);
    }
    let interval = setInterval(() => this.simulate(),1000);
    this.setState({interval: interval});
  }

  //used to stop the game-of-life simulation
  stopSimulation(){
    clearInterval(this.state.interval);
  }

  //enforces the rules of conway's game of life on the current board state.
  simulate(){
    const squares = this.state.squares;
    let squaresCopy = [...squares];
    const width = this.state.width; 

    //run one iteration of the game of life 
    let liveNeighborsCount = 0;
    for(let row = 0; row < width ; row++){
      for(let col = 0; col < width ; col++){
        //looking at each of the eight neighbors and keeping track of the liveNeighbors
        let topLeft = row>0 && col > 0 ? squares[width * (row - 1) + (col - 1)] : 0;
        let left = row>0 ? squares[width * (row - 1) + col] : 0;
        let bottomLeft = row>0 && col < width -1 ? squares[width * (row - 1) + (col + 1)]: 0;

        let top = col > 0? squares[width * row + (col - 1)] : 0;
        let bottom = col < width - 1? squares[width * row + (col + 1)] :0;

        let topRight = row < width - 1 && col > 0 ? squares[width * (row + 1) + (col - 1)] : 0;
        let right = row < width - 1? squares[width * (row + 1) + col] : 0 ;
        let bottomRight = row < width - 1 && col < width - 1? squares[width * (row + 1) + (col + 1)] : 0;
        liveNeighborsCount = topLeft + left + bottomLeft + top + bottom + topRight + right + bottomRight;

        if(squares[width * row + col] === 1){//live cell
          if(liveNeighborsCount < 2 || liveNeighborsCount > 3){
            squaresCopy[width * row + col] = 0;//dies by underpopulation or overpopulation
          }
        }
        else{
          if(liveNeighborsCount === 3){
            squaresCopy[width * row + col] = 1;//comes alive as if by reproduction
          }
        }
        liveNeighborsCount = 0;
      }
    }
    //update the grid with new grid configuration.
    this.setState({squares: squaresCopy});
  }

  //used to render the entire game 
  render() {
    return (
      <div className="App">
      <h1 className="title">Conway's Game Of Life</h1>
      <button className="button-style-green" onClick={() => this.startSimulation()}>Simulate</button>
      <button className="button-style-red" onClick={() =>  this.stopSimulation()}>Pause</button>
      <button className="button-style-purple" onClick={() =>  this.populateRandom()}>Random</button>
      <button className="button-style-clear" onClick={() =>  this.clearGrid()}>Clear</button>

      <div style={{color: 'white'}}>
        To start/resume the simulation, click on the "simulate" Button.
      </div>

      <div style={{color: 'white'}}>
      To stop/pause the simulation, click on the "Pause" button.
      </div>

      <div style={{color: 'white'}}>
      To generate a random grid configuration, click on the "random" button.
      </div>

      <div style={{color: 'white'}}>
      To clear the board configuration, click on the "clear" button.
      </div>

      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
      </div>
      </div>
    );
  }
}

// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
