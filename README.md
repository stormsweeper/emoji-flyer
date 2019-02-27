      ______                 _ _   ______ _                 _ 
     |  ____|               (_|_) |  ____| |               | |
     | |__   _ __ ___   ___  _ _  | |__  | |_   _  ___ _ __| |
     |  __| | '_ ` _ \ / _ \| | | |  __| | | | | |/ _ \ '__| |
     | |____| | | | | | (_) | | | | |    | | |_| |  __/ |  |_|
     |______|_| |_| |_|\___/| |_| |_|    |_|\__, |\___|_|  (_)
                           _/ |              __/ |            
                          |__/              |___/             
    ----------------------------------------------------------------- 


## This is an example project!
This is meant to demonstrate how to make a simple game with just HTML, CSS, and 
JavaScript (including jQuery).

## How to play
Use the arrow keys to move the bird around the screen, avoiding obstacles.

Either clone this repo and open index.html, or play here: 
https://stormsweeper.github.io/emoji-flyer/

## How it works
When the game is started, a timer is started, and each "tick" these steps happen:
1. New obstacles are added randomly.
2. Obstacles on the stage are moved
3. Collisions are checked (e.g. the bird is touching a car)

Collisions are also checked when the bird is moved via keyboard commands.

## Some of the bits used here:
* CSS transforms (some of the emoji are flipped)
* `setInterval` for the timer
* jQuery click and keydown event handlers
* `for` loops to check all items of a type
* Math.random() for choosing which emojis to use or adding obstacles
* arrays and objects for storing data
