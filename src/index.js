import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//This is a tic-tac-toe game that uses a 5 x 5 board for playing.
/*
//this is a class component, but since we now no longer have any state in this component we can re-write this as a functional component as shown below. 
class Square extends React.Component {
  render() {
    return (
      //here note that we are passing in a function as the onClick property(prop).
      <button className= "square" 
              onClick  = {() => this.props.onClick()}
              > 
        {this.props.value} 
      </button>                  
    );
  }
}
*/

//functional components takes props as input and returns 'what should be rendered'.
function Square(props){
  let cellColor;


  cellColor = props.value === 0 ? "square" : "square-red";

  return (    
    <button className={cellColor} onClick={props.onClick}>
        {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]}
                   onClick={()=> this.props.onClick(i)}
                   />;//passing in a property(prop) called value to the square component.
  }

  render() {
    return (
      <div>
        <div className="board-row">          
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
        </div>
        <div className="board-row">
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}

        </div>
        <div className="board-row">
          {this.renderSquare(10)}
          {this.renderSquare(11)}
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
        </div>
        <div className="board-row">
          {this.renderSquare(15)}
          {this.renderSquare(16)}
          {this.renderSquare(17)}
          {this.renderSquare(18)}
          {this.renderSquare(19)}
        </div>
        <div className="board-row">
          {this.renderSquare(20)}
          {this.renderSquare(21)}
          {this.renderSquare(22)}
          {this.renderSquare(23)}
          {this.renderSquare(24)}
        </div>

      </div>
    );
  }
}

class Game extends React.Component {
  //this is used to manage state of the game (e.g. moving between histories)
  constructor(props) {
    super(props);
    this.state = {
        squares: Array(100).fill(0),
        width: 10,
        interval: null,
    }
  }


  handleClick(i) {
    console.log("handling click" + i);
    const squares = this.state.squares;
    let squaresCopy = [...squares];
    squaresCopy[i] = squares[i] ? 0 : 1;
    this.setState({squares: squaresCopy});
  }

  stopSimulation(){
    clearInterval(this.state.interval);
  }

  startSimulation(){
    console.log("started simulation");
    if(this.state.interval){
      clearInterval(this.state.interval);
    }
    let interval = setInterval(() => this.simulate(),1000);
    this.setState({interval: interval});
  }

  simulate(){
    console.log(this.state);
    const squares = this.state.squares;
    let squaresCopy = [...squares];
    const width = this.state.width; 

    //run one iteration of the game of life (use setState to update the array.)
    let liveNeighborsCount = 0;
    for(let row = 1; row < width - 1; row++){
      for(let col = 1; col < width - 1; col++){
        //looking at each of the eight neighbors and keeping track of the liveNeighbors
        liveNeighborsCount = squaresCopy[width * row - 1 + col - 1] +
        squaresCopy[width * row - 1 + col] +
        squaresCopy[width * row - 1 + col + 1] +

        squaresCopy[width * row + col - 1] +
        squaresCopy[width * row + col + 1 ] +

        squaresCopy[width * row + 1 + col - 1] +
        squaresCopy[width * row + 1 + col] +
        squaresCopy[width * row + 1 + col + 1];

        if(squaresCopy[width * row + col] === 1){//live cell
          if(liveNeighborsCount < 2){
            squaresCopy[width * row + col] = 0;//dies by underpopulation
          }
          else if(liveNeighborsCount > 3){
            squaresCopy[width * row + col] = 0;//dies by overpopulation
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

    console.log("Calling Set State!");
    this.setState({squares: squaresCopy});
    // ,()=> 
    // setTimeout(this.simulate, 1000, this.state))
  }

  render() {
    //caching in memory the values in global game state

    return (
      <>
      <button onClick={() => this.startSimulation()}>Start Simulation</button>
      <button onClick={() =>  this.stopSimulation()}>Stop Simulation</button>

      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          {/* <div>{status}</div> */}
          {/* <ol className="numbers">{moves}</ol> */}
        </div>
      </div>
      </>
    );
  }
}

// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
