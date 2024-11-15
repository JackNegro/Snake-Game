//HTML elements
const board = document.getElementById('board');
const scores = document.getElementById('scoreBoard');
const startBtn = document.getElementById('start_btn');
const overMsg = document.getElementById('over');

//Game Settings
const boardSize = 10
const speed = 100
const squareType = {
    emptySquare:0,
    snakeSquare:1,
    foodSquare:2,
};
const directions = {
    ArrowUp : -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

//Game variables
let snake
let score
let direction
let boardSquares
let emptySquares
let moveInterval


//Score
let highScores = [];

function addScore(newScore) {
    highScores.push(newScore);
    highScores.sort((a, b) => b - a);
    highScores = scores.slice(0, 5);
}

function displayScores() {
const scoresContainer = document.getElementById('scores-container');
    scoresContainer.innerHTML = '';
    highScores.forEach((highScores, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${highScores}`;
        scoresContainer.appendChild(li);
    });
}

// Función que se llama al presionar un botón de "Ver Scores"
function showScores() {
    displayScores();
}



const updateScore = () =>{
    scoreBoard.innerText = score
}

const drawSnake = () =>{
    snake.forEach(square => drawSquare(square,'snakeSquare'))
}

const createRandomFood = () =>{
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)]
    drawSquare(randomEmptySquare,'foodSquare')
}

//Move
const setDirection = newDirection =>{
    direction = newDirection
}

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length-1]) + directions[direction])
        .padStart(2,'0')    
    const [row,column] = newSquare.split('')

    if (newSquare<0 ||
        newSquare>boardSize * boardSize|| 
        (direction === 'ArrowRight' && column == 0 )|| 
        (direction === 'ArrowLeft' && column == 9 )|| 
        boardSquares[row][column] === squareType.snakeSquare) {
            gameOver()
    }else{
        snake.push(newSquare)
        if(boardSquares[row][column]=== squareType.foodSquare){
            addFood()
        }else{
            const emptySquare = snake.shift()
            drawSquare(emptySquare, 'emptySquare')
        }
        drawSnake()
    }
}

//Random Food
const addFood = () =>{
    score = score + 100
    updateScore()
    createRandomFood()
}
//Game Over message
const gameOver = () =>{
    overMsg.style.display = 'block'
    clearInterval(moveInterval)
    startBtn.style.display = 'block'
    addScore(score)
    updateScore()
}

//Rellenar cuadrado
//@param:  
//square: posicion del cuadrado
//type: tipo de cuadrado(emptySquare, snakeSquare, foodSquare)
const drawSquare = (square,type) =>{ 
    const [row,column] = square.split('')
    boardSquares[row][column] = squareType[type]
    const squareElement = document.getElementById(square)
    squareElement.setAttribute('class', `square ${type}`)

    if (type === 'emptySquare') {
        emptySquares.push(square)
    }else{
        if (emptySquares.indexOf(square) !== -1 )  {
            emptySquares.splice(emptySquares.indexOf(square),1)
        }
    }
}

const createBoard = () =>{
    boardSquares.forEach( (row,rowIndex) => {
        row.forEach( (column,columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class','square emptySquare');
            squareElement.setAttribute('id',squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    })
}; 

function startGame() {
    snake = ['00', '01', '02', '03']
    score = snake.length * 100
    direction = 'arrowRigth'
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareType.emptySquare));
    board.innerHTML = ""
    emptySquares = []
    createBoard()
    showScores()
}

const start = ()=>{
    startGame();
    overMsg.style.display = 'none'
    startBtn.style.display = 'none'
    drawSnake()
    updateScore()
    createRandomFood()
    document.addEventListener('keydown', directionEvent)
    moveInterval = setInterval( () => moveSnake(),speed)
};

startBtn.addEventListener('click',start);
