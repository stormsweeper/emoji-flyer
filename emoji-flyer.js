var isGameRunning = false;
var interval;
var highScore = 0;
var currentScore = 0;
var ticks = 0; // how many 'ticks' have happened
var tickLength = 200; // how many millis per 'tick'
var scoreMultiplier = Math.min(1, Math.round(1000 / tickLength));
var maxTicks = Math.floor(Number.MAX_SAFE_INTEGER/scoreMultiplier);

// various functions below use a type to chose what to do
var allTypes = ['car', 'boat', 'bike', 'copter', 'plane'];

// handle the keyboard commands
$(document).keydown(
    function(event) {
        // if we haven't started, don't do anything
        if (isGameRunning === false) {
            return;
        }

        // if we have, listen for keys
        event.preventDefault();
        var birdPos = $('#bird').position();
        if (event.which === 38) { // up
            $('#bird').css('top', Math.max(0, birdPos.top - 10));
            checkCollisions();
        } else if (event.which === 40) { // down
            $('#bird').css('top', Math.min(250, birdPos.top + 10));
            checkCollisions();
        } else if (event.which === 37) { // left
            $('#bird').css('left', Math.max(0, birdPos.left - 10));
            checkCollisions();
        } else if (event.which === 39) { // right
            $('#bird').css('left', Math.min(550, birdPos.left + 10));
            checkCollisions();
        }
    }
);

// handle the start button
$('#start-button').click(
    function() {
        // if we have started, don't do anything
        if (isGameRunning === true) {
            return;
        }

        event.preventDefault();
        startGame();
    }
);

function startGame() {
    // disable button
    $('#start-button').attr('disabled', true);

    // reset our ticks and score
    ticks = 0;
    currentScore = 0;
    $('#current-score').text(currentScore);

    // un-kill the bird and clear all obstacles
    $('#bird').removeClass('dead');
    $('#bird').css('top', 0);
    $('#bird').css('left', 0);
    $('.obstacle').remove();

    // start the timer
    isGameRunning = true;
    interval = setInterval(doTick, tickLength);
}

// gets called by checkCollisions()
function stopGame() {
    isGameRunning = false;
    clearInterval(interval);
    highScore = Math.max(highScore, currentScore);
    $('#high-score').text(highScore);
    $('#start-button').removeAttr('disabled');
}

// run this every "tick"
function doTick() {
    // update ticks
    ticks = ticks + 1;

    // update score (5 points per tick)
    currentScore = ticks * scoreMultiplier;
    $('#current-score').text( currentScore )

    addObstacles();
    advanceObstacles();

    if (ticks >= maxTicks) {
        console.log('stopping at max ticks');
        stopGame();
    }
}

// checks odds of an obstacle being added
function checkOdds(type) {
    var odds = {
        'car': 1/20, 
        'boat': 1/30,
        'bike': 1/40,
        'copter': 1/60,
        'plane': 1/80,
    };
    return Math.random() < odds[type];
}

// add new obstacles
function addObstacles() {
    for (var i = 0; i < allTypes.length; i++) {
        if (isSpaceFor(allTypes[i]) && checkOdds(allTypes[i])) {
            console.log('adding obstacle: ' + allTypes[i]);
            addObstacleSprite(allTypes[i]);
        }
    }
}

function isSpaceFor(type) {
    var selector = '.' + type;

    // we can always add one if none of them
    if ($(selector).length < 1) {
        return true;
    }

    // otherwise check space
    var minSpace = {
        'car': 10, 
        'boat': 20,
        'bike': 5,
        'copter': 40,
        'plane': 60,
    };
    var lastLeft = $(selector).last().position().left;
    return lastLeft < 550 - minSpace[type];
}

function advanceObstacles() {
    for (var i = 0; i < allTypes.length; i++) {
        $('.' + allTypes[i]).each(
            function() {
                var left = $(this).position().left;
                $(this).css('left', left - getSpeed(allTypes[i]));
            }
        );
    }

    // remove any that are off stage left
    $('.obstacle').each(
        function() {
            if ( $(this).position().left < -50 ) {
                $(this).remove();
            }
        }
    );

    checkCollisions();
}

// This adds an emoji of the type to the stage
function addObstacleSprite(type) {
    var emoji = getEmoji(type);
    var top = getTop(type);

    // create a new obstacle div
    var obstacle = $('<div class="sprite obstacle">');
    obstacle.addClass(type);
    obstacle.text(emoji);
    obstacle.css('top', top);
    obstacle.css('left', 595);

    // add it to the stage
    $('#stage').append(obstacle);
}

// match the sprite to the correct lane for it
function getTop(type) {
    switch (type) {
        case 'car': return $('#road').position().top;
        case 'boat': return $('#waterway').position().top - 10;
        case 'bike': return $('#bike-path').position().top;
        case 'copter': return $('#copters').position().top - 10;
        case 'plane': return $('#planes').position().top;
    }
}

// how far this type moves per tick
function getSpeed(type) {
    switch (type) {
        case 'car': return 10;
        case 'boat': return 10;
        case 'bike': return 5;
        case 'copter': return 20;
        case 'plane': return 30;
    }
}

// gets an emoji to use for the type
function getEmoji(type) {
    var obstacles = {};
    obstacles['car'] = ['🚗','🚕','🚙','🚗','🚕','🚙','🚗','🚕','🚙','🚌','🚌','🚓','🚑','🚒','🚐','🚚','🚛','🚐','🚚','🚛'];
    obstacles['boat'] = ['⛵️','🛥','🛥','🛥','🚤','🚤'];
    obstacles['bike'] = ['🚴','🚴','🚴','🏇' ];
    obstacles['copter'] = ['🚁'];
    obstacles['plane'] = ['🛩', '✈️'];

    var items = obstacles[type];
    var index = Math.floor(Math.random() * items.length);
    return items[index];
}

// checks if the playeris collidding with anything
function checkCollisions() {
    for (var i = 0; i < allTypes.length; i++) {
        if (isCollision(allTypes[i])) {
            console.log('is collision: ' + allTypes[i]);
            $('#bird').addClass('dead');
            stopGame();
            break;
        }
    }
}

// loops through obstacles of each type, checking for collisions
function isCollision(type) {
    var collided = false;

    $('.'+type).each(
        function() {
            var obstaclePos = $(this).position();
            var birdPos = $('#bird').position();
        
            var similarX = (birdPos.left > obstaclePos.left - 50 ) && (birdPos.left < obstaclePos.left + 50);
            var similarY = (birdPos.top > obstaclePos.top - 50 ) && (birdPos.top < obstaclePos.top + 50);
            collided = similarX && similarY;
            // the return here breaks out of the .each() if false
            return !collided;
        }
    );

    return collided;
}

