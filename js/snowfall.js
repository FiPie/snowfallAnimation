//Initial Setup
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var mouse = {
  x: undefined,
  y: undefined
};


var colourArray = [
  ['#FCBB6D',
    '#D8737F',
    '#AB6C82',
    '#685D79',
    '#475C7A'
  ],
  ['#F8B195',
    '#F67280',
    '#C06C84',
    '#6C5B7B',
    '#355C7D'
  ],
  ['#E5FCC2',
    '#9DE0AD',
    '#45ADA8',
    '#547980',
    '#594F4F '
  ],
  ['#805C22',
    '#FFD591',
    '#FFB845',
    '#806A49',
    '#CC9337'
  ],
  ['#425780',
    '#D1E0FF',
    '#85ADFF',
    '#697080',
    '#6A8BCC'
  ]
];
var colourScheme = 4;
var gravity = 0.005;
var friction = 0.01;
var quantity = 1;
var repulsiveForce = 0;
var opacity = 0.4;
var dxMin = -1;
var dxMax = 1;
var dyMin = -0.1;
var dyMax = 0.5;
var sizeMin = 3;
var sizeMax = 6;
var melting = 0.1;

window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init(quantity);
});

window.addEventListener('click', function() {
  init(quantity);
});

window.addEventListener('wheel', function(event) {
  event.preventDefault();
  quantity += event.deltaY;
  init(quantity);
});

//useful functions
function randomColor(colourArray, colourScheme) {
  return colourArray[colourScheme][Math.floor(Math.random() * colourArray.length)];
};

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// function arrayRemove(array, value) {
//   return array.filter(function(element) {
//     return element != value;
//   });
// };




//Objects
function Ball(id, x, y, dx, dy, radius, color, opacity) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;
  this.opacity = opacity;

  this.update = function() {
    if (this.y + this.radius + this.dy >= canvas.height) {
      // we're stoping this snowflake after it hits the bottom border of the canvas element
      this.dx = 0;
      this.dy = 0;
      // if the ball is close to being invisible it will be removed from the array and won't be computed anymore
      if (this.radius - melting <= 0) {
        var ballToRemove;
        ballArray.forEach(ball => {
          if (ball === this) {
            ballToRemove = ballArray.indexOf(ball);
          }
        });

        ballArray.splice(ballToRemove, 1); // ball removed
        console.log('snowflake has melted :( ');
      } else {
        this.radius -= melting; //the snowflake will 'melt' when on the
      }

    } else {

      if (this.y + this.radius + this.dy > canvas.height) {
        //this changes the velocity in opposite direction after hitting bottom border of the canvas element
        this.dy = -this.dy * friction;
      } else {
        //here we're adding gravity/acceleration
        this.dy += gravity;
      }

      if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
        //this changes the velocity in opposite direction after hitting the side borders of the canvas element
        this.dx = -this.dx;
      }

      this.x += this.dx;
      this.y += this.dy;
    }
    //we check if the circles are withing 50 px reach from the mouse cursor
    if (mouse.x - this.x < 50 && mouse.x - this.x > -50 &&
      mouse.y - this.y < 50 && mouse.y - this.y > -50) {
      this.dx -= repulsiveForce;
      this.dy -= repulsiveForce;
      //c.fillText("proximity alert!", mouse.x, mouse.y);
    }

    this.draw();
  };

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save(); //saves the current state of canvas element
    c.globalAlpha = this.opacity; // sets opacity of the entire canvas element
    c.fillStyle = this.color;
    Ball
    c.fill();
    c.restore(); //restores saved state of canvas element, so
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  };
}


//Implementation
// var ball;
let ballArray = [];


function init(quantity) {

  for (var i = 0; i < quantity; i++) {
    var id = i;
    var radius = randomIntFromRange(sizeMin, sizeMax); //spawning size
    var x = randomIntFromRange(radius, canvas.width - radius); //spawning horizontal position
    var y = randomIntFromRange(0, /*canvas.height -*/ radius * 6); //spawning height
    var dx = randomIntFromRange(dxMin, dxMax); //spawning initial speed on x axis
    var dy = randomIntFromRange(dyMin, dyMax); //spawning initial speed on y axis

    var colour = randomColor(colourArray, colourScheme);
    ballArray.push(new Ball(id, x, y, dx, dy, radius, colour, opacity));
  }
  console.log(ballArray);
}

//animation
function animate() {
  // if array does not exist, is not an array, or is empty
  // ⇒ do not attempt to process array
  if (!Array.isArray(ballArray) || !ballArray.length) {
    console.log('No more objects in the array');
    return false;
  }
  requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < ballArray.length; i++) {
    ballArray[i].update();
  }

}

init(quantity);
animate();

var arr = [1];

console.log(Array.isArray(arr)); //returns