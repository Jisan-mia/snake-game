//select the canvas
const cvs = document.getElementById("snake");

const ctx = cvs.getContext("2d");

//create the unit
const box = 32;

//load images
const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

//inital speed in ms
let speed = 100;

// load audio files
const dead = new Audio();
const eat = new Audio();
const left = new Audio();
const right = new Audio();
const up = new Audio();
const down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
left.src = "audio/left.mp3";
right.src = "audio/right.mp3";
up.src = "audio/up.mp3";
down.src = "audio/down.mp3";

//create the snake
let snake = [];
snake[0] = {
	x: 9 * box,
	y: 10 * box,
};

//create the food
let food = {
	x: Math.floor(Math.random() * 17 + 1) * 32,
	y: Math.floor(Math.random() * 15 + 3) * 32,
};

//create score variable
let score = 0;

//control the snake
let d;
document.addEventListener("keydown", direction);

function direction(event) {
	if (event.keyCode === 37 && d != "RIGHT") {
		d = "LEFT";
		left.play();
	} else if (event.keyCode === 38 && d != "DOWN") {
		d = "UP";
		up.play();
	} else if (event.keyCode === 39 && d != "LEFT") {
		d = "RIGHT";
		right.play();
	} else if (event.keyCode === 40 && d != "UP") {
		d = "DOWN";
		down.play(0);
	}
}

function restartFunc() {
	let restart = confirm("Do you want to restart the game");
	if (restart) {
		window.location.reload();
	}
}

//draw everything to our canvas
function draw() {
	ctx.drawImage(ground, 0, 0);

	for (let i = 0; i < snake.length; i++) {
		ctx.fillStyle = i == 0 ? "green" : "white";
		ctx.fillRect(snake[i].x, snake[i].y, box, box);

		ctx.strokeStyle = "red";
		ctx.strokeRect(snake[i].x, snake[i].y, box, box);
	}

	ctx.drawImage(foodImg, food.x, food.y);

	//old head position
	let snakeX = snake[0].x;
	let snakeY = snake[0].y;

	//which direction
	if (d === "LEFT") snakeX = snakeX - box;
	if (d === "UP") snakeY = snakeY - box;
	if (d === "RIGHT") snakeX = snakeX + box;
	if (d === "DOWN") snakeY = snakeY + box;

	//if the snake eats the food
	if (snakeX == food.x && snakeY == food.y) {
		score++;
		food = {
			x: Math.floor(Math.random() * 17 + 1) * box,
			y: Math.floor(Math.random() * 15 + 3) * box,
		};
		eat.play();
	} else {
		//remove the tail
		snake.pop();
	}

	//add new head
	let newHead = {
		x: snakeX,
		y: snakeY,
	};

	function collision(head, array) {
		for (let i = 0; i < array.length; i++) {
			if (head.x == array[i].x && head.y == array[i].y) {
				return true;
			}
		}
		return false;
	}

	//game over
	if (
		snakeX < box ||
		snakeX > box * 17 ||
		snakeY < 3 * box ||
		snakeY > box * 17 ||
		collision(newHead, snake)
	) {
		clearInterval(game);
		dead.play();
		setTimeout(() => restartFunc(), 1000);
	}

	snake.unshift(newHead);

	//show score
	ctx.fillStyle = "white";
	ctx.font = "45px Tahoma";
	ctx.fillText(score, 2 * box, 1.6 * box);
}

//call draw funciton every 100ms
let game = setInterval(draw, speed);
