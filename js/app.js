var Enemy = function(x, y, speed) {
    this.x = x; //x position of enemies
    this.y = y; //y position of enemies
    this.speed = speed; //speed of enemies
    this.sprite = 'images/enemy-bug.png'; //image of enemies
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    // when off canvas, reset position of enemy to move across again
    if (this.x > 700) {
        this.x = -150;
        this.speed = 100 + Math.floor(Math.random() * 500);
    }

    // Check for collision between player and enemies
    if (player.x < this.x + 50 && 
        player.x + 50 > this.x && 
        player.y < this.y + 50 && 
        player.y + 50 > this.y) {
        player.x = 300;
        player.y = 380;
        game.hideHeart();
        if (game.hearts === 0) {
            game.gameover();
        }
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function(x, y, speed) {
    this.x = x; //x position of player
    this.y = y; //y position of player
    this.speed = speed; //speed of player
    this.sprite = 'images/char-pink-girl.png'; //image of player
    score = 0;
};

// Prevent player from moving beyond canvas wall boundaries
Player.prototype.update = function() {
    if (this.y > 380) {
        this.y = 380;
    }

    if (this.x > 600) {
        this.x = 600;
    }

    if (this.x < 0) {
        this.x = 0;
    }

    // Check for player reaching top of canvas and winning the game
    if (this.y < 0) {
        this.x = 300;
        this.y = 380;
        game.addScore();
        game.addLevel();
        enemyLocation = [60, 140, 220];
        if (game.levels <= 8) {
            posY = enemyLocation[game.getRandomInt(0, 2)];
            enemy = new Enemy(0, posY, 100 + Math.floor(Math.random() * 300));
            allEnemies.push(enemy);
        }
        if (game.levels === 15) {
            game.finished();
        }     
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Player's movement speed 
Player.prototype.handleInput = function(keyPress) {
    switch (keyPress) {
        case 'left':
            this.x -= this.speed + 50;
            break;
        case 'up':
            this.y -= this.speed + 30;
            break;
        case 'right':
            this.x += this.speed + 50;
            break;
        case 'down':
            this.y += this.speed + 30;
            break;
    }
};


// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

// Position "y" where the enemies will are created
var enemyPosition = [60];
var player = new Player(300, 380, 50);
var enemy;
var scores = 0;
var levels = 0;
var hearts = 3;


var Game = function(scores, levels, hearts) {
  this.scores = scores;
  this.levels = levels;
  this.hearts = hearts;
  
  //Add one level while the player reach to the top area of river
  this.addLevel = function () {
    this.levels++;
    const levelsText = document.querySelector('.levels');
    levelsText.innerText = this.levels;
  }
  
  //Reset level to 0
  this.resetLevel = function() {
    this.levels = 0;
    const levelsText = document.querySelector('.levels');
    levelsText.innerText = this.levels;
  }

  //Add 100 score while the player reach to the top area of river
  this.addScore = function() {
    this.scores += 100;
    const scoresText = document.querySelector('.scores');
    scoresText.innerText = this.scores;
  }
  
  //Reset score to 0
  this.resetScore = function() {
    this.scores = 0;
    const scoresText = document.querySelector('.scores');
    scoresText.innerText = this.scores;
  }

  //If the player hit one enemy, one heart is reduced and turn to oulined heart 
  this.hideHeart = function() {
    const heartList = document.querySelectorAll('.hearts li');
    this.hearts--;
    for (heart of heartList) {
      if (heart.firstElementChild.className == 'fa fa-heart') {
          heart.firstElementChild.className = 'fa fa-heart-o';
          break;
      }
  }
  }
   
  //Display all three full hearts 
  this.resetHeart = function() {
    const heartList = document.querySelectorAll('.hearts li');
    this.hearts = 3
    for (heart of heartList) {
      heart.firstElementChild.className = 'fa fa-heart';
  }
}
    
  //Reset enemies and start from one enemy
  this.resetEmemy = function() {
    allEnemies = [];
    enemyPosition.forEach(function(posY) {
        enemy = new Enemy(0, posY, 100 + Math.floor(Math.random() * 300));
        allEnemies.push(enemy);
   });
}

   //Restart the game, all score, level reset, heart reset and player's position will be resetted as the beginning
   this.restart = function() {
    if(confirm("Are you sure to restart?")) {
        this.resetScore();
        this.resetLevel();
        this.resetHeart();
        this.resetEmemy();
        player.x = 300;
        player.y = 380;
    }
}


    //gameover and ask to restart the game
    this.gameover = function() {
      alert("Game Over! Please restart.");
      this.resetScore();
      this.resetLevel();
      this.resetHeart();
      this.resetEmemy();
      player.x = 300;
      player.y = 380;
    }

    //finish the game and say congratulation
    this.finished = function() {
      alert("Congratulation!!");
      this.resetScore();
      this.resetLevel();
      this.resetHeart();
      this.resetEmemy();
      player.x = 300;
      player.y = 380;
    }

    //random to display enemies
    this.getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}


var game = new Game(scores, levels, hearts);



enemyPosition.forEach(function(posY) {
    const enemy = new Enemy(0, posY, 100 + Math.floor(Math.random() * 300));
    allEnemies.push(enemy);
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
