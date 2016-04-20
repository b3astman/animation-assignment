function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,500,800,300);
    Entity.prototype.draw.call(this);
}

// batman

function Batman(game) {
    // spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, number of frames, loop, reverse
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/batman.png"), 0, 69, 70, 69, 0.35, 2, true, false);

    this.jumpingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/batman.png"), 351, 275, 70, 69, 0.25, 5, true, false);
    this.punchAnimation = new Animation(ASSET_MANAGER.getAsset("./img/batman.png"), 0, 135, 70, 69, 0.1, 4, true, true);

    this.runningAnimation = new Animation(ASSET_MANAGER.getAsset("./img/batman.png"), 0, 205, 70.2, 69, 0.1, 6, true, false);
    // this.leftRunning = Animation(ASSET_MANAGER.getAsset("./img/batman.png"), 0, 205, 70.2, 69, 0.1, 6, true, false);

    this.idle = true;
    this.running = false;
    this.punching = false;
    this.jumping = false;

    Entity.call(this, game, 300, 400);
};

Batman.prototype = new Entity();
Batman.prototype.constructor = Batman;

Batman.prototype.update = function () {
    Entity.prototype.update.call(this);
};

Batman.prototype.draw = function (ctx) {

    if (this.game.d) {
        this.running = true;
    } else if (this.game.w) {
        this.running = false;
        this.jumping = true;
    } else if (this.game.s) {
        this.running = false;
        this.jumping = false;
        this.punching = true;
    }

    if (this.running) {


        this.runningAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
    } else if (this.jumping) {

        // this.jumpingAnimation.elapsedTime = 0;
        // var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        // var totalHeight = 200;

        // if (jumpDistance > 0.5)
        //     jumpDistance = 1 - jumpDistance;

        // //var height = jumpDistance * 2 * totalHeight;
        // var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        // this.y = this.ground - height;

        this.jumpingAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
    } else if (this.punching) {
        this.punchAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 2);
    }

    // this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.update.call(this);

    this.running = false;
    this.jumping = false;
    this.punching = false;
    this.idle = true;


};

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/batman.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var batman = new Batman(gameEngine);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(batman);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
