import * as PIXI from "pixi.js"
PIXI.utils.skipHello();
import { Viewport } from "pixi-viewport";
import * as particles from "pixi-particles"

import leafImage from "./leaf.png";

import foxRun01 from "./images/foxRun1.png";
import foxRun02 from "./images/foxRun2.png";
import foxRun03 from "./images/foxRun3.png";
import foxRun04 from "./images/foxRun4.png";
import foxRun05 from "./images/foxRun5.png";
import foxRun06 from "./images/foxRun6.png";
import foxRun07 from "./images/foxRun7.png";
import foxRun08 from "./images/foxRun8.png";
import foxRun09 from "./images/foxRun9.png";

import foxJump01 from "./images/foxJump1.png";
import foxJump02 from "./images/foxJump2.png";
import foxJump03 from "./images/foxJump3.png";
import foxJump04 from "./images/foxJump4.png";
import foxJump05 from "./images/foxJump5.png";
import foxJump06 from "./images/foxJump6.png";
import foxJump07 from "./images/foxJump7.png";
import foxJump08 from "./images/foxJump8.png";
import foxJump09 from "./images/foxJump9.png";
import foxJump10 from "./images/foxJump10.png";
import foxJump11 from "./images/foxJump11.png";
import foxJump12 from "./images/foxJump12.png";


// create viewport
export function createViewport() {
    const newViewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: window.innerWidth,
        worldHeight: window.innerHeight,
    })

    // return viewport
    return newViewport;
}

// TODO: Take in config as parameters

export function createApp(height, width, viewportId) {
    const newApp = new PIXI.Application({
        // width: width || screenWidth,
        // height: height || screenHeight,
        transparent: true,
        antialias: true,
        autoResize: true,
        resizeTo: document.body,
        resolution: 2,
    });
    return newApp;
}

const app = createApp();
document.body.appendChild(app.view)
const viewport = createViewport();
app.stage.addChild(viewport)

let foxRunImages = [
    foxRun01,
    foxRun02,
    foxRun03,
    foxRun04,
    foxRun05,
    foxRun06,
    foxRun07,
    foxRun08,
    foxRun09
];
let foxRunTextures = [];

let foxJumpImages = [
    foxJump01,
    foxJump02,
    foxJump03,
    foxJump04,
    foxJump05,
    foxJump06,
    foxJump07,
    foxJump08,
    foxJump09,
    foxJump10,
    foxJump11,
    foxJump12,
];
let foxJumpTextures = [];

for (let i = 0; i < 9; i++) {
    let foxRunTexture = PIXI.Texture.from(foxRunImages[i]);
    foxRunTextures.push(foxRunTexture);
};
for (let i = 0; i < 12; i++) {
    let foxJumpTexture = PIXI.Texture.from(foxJumpImages[i]);
    foxJumpTextures.push(foxJumpTexture);
};
const baseAnimationSpeed = .25;
const foxContainer = new PIXI.Container();

let foxJumpSprite = new PIXI.AnimatedSprite(foxJumpTextures);
foxJumpSprite.anchor.set(0.5)
foxJumpSprite.position.set(viewport.worldWidth / 2, viewport.worldHeight - 38)
foxJumpSprite.animationSpeed = baseAnimationSpeed;
foxJumpSprite.visible = false;
foxContainer.addChild(foxJumpSprite)

let foxRunSprite = new PIXI.AnimatedSprite(foxRunTextures);
foxRunSprite.anchor.set(0.5)
foxRunSprite.position.set(viewport.worldWidth / 2, viewport.worldHeight - 38)
foxRunSprite.animationSpeed = baseAnimationSpeed;
foxRunSprite.interactive = true;
foxRunSprite.on("pointerdown", jump)

foxContainer.addChild(foxRunSprite).gotoAndPlay(0)

let jumping = false;
let moving = false;
let direction = null;

foxJumpSprite.onLoop = function () {
    foxJumpSprite.visible = false;
    foxJumpSprite.stop();
    foxRunSprite.visible = true;
    foxRunSprite.gotoAndPlay(0)

    jumping = false;
}

function jump() {
    if (!jumping) {
    jumping = true;
    // start the jump
    if (foxRunSprite.currentFrame <= 4) {
        foxRunSprite.stop();
        foxRunSprite.visible = false;
        foxJumpSprite.visible = true;
        foxJumpSprite.gotoAndPlay(foxRunSprite.currentFrame)
    } else {
        foxRunSprite.onFrameChange = function () {
            if (foxRunSprite.currentFrame === 0) {
                foxJumpSprite.position.x = foxRunSprite.position.x;
                foxJumpSprite.gotoAndPlay(0)
                foxJumpSprite.visible = true;
                // remove the running animation
                foxRunSprite.onFrameChange = null;
                foxRunSprite.stop();
                foxRunSprite.visible = false;
            }
        }
    }
}
}

function handleJump(ev) {
    if (ev.key === " " && !jumping) {
        jump()
    }
}



window.addEventListener("keydown", handleJump)

function handleMove(ev) {
    const key = ev.key;
    if ((key === "ArrowRight" || key === "ArrowLeft" || key === "d" || key === "a") && !moving && !jumping) {
        moving = true;
        if (key === "ArrowRight" || key === "d") {
            direction = "right";
            foxRunSprite.animationSpeed = .35;
            // foxJumpSprite.animationSpeed = .3;
        }
        if (key === "a" || key === "ArrowLeft") {
            direction = "left";
            foxRunSprite.animationSpeed = .2;
            // foxJumpSprite.animationSpeed = .2;
        }
    }
    if (ev.pageX && ev.pageX > window.innerWidth / 2) {
        moving = true;
        direction = "right";
            foxRunSprite.animationSpeed = .35;
            // foxJumpSprite.animationSpeed = .3;
    }
    if (ev.pageX && ev.pageX <= window.innerWidth / 2) {
        moving = true;
        direction = "left";
            foxRunSprite.animationSpeed = .2;
            // foxJumpSprite.animationSpeed = .2;
    }
}

window.addEventListener("keydown", handleMove)
window.addEventListener("pointerdown", jump)

function handleKeyUp(ev) {
    const key = ev.key;
    if ((key === "ArrowRight" || key === "ArrowLeft" || key === "d" || key === "a" || ev.pageX ) && moving) {
        moving = false;
        foxRunSprite.animationSpeed = baseAnimationSpeed;
        foxJumpSprite.animationSpeed = baseAnimationSpeed;
    }
}

window.addEventListener("keyup", handleKeyUp)

app.ticker.add(() => {
    if (moving) {
        if (direction === "right" && foxRunSprite.position.x < window.innerWidth - foxRunSprite.width / 2) {
            foxRunSprite.position.x = foxRunSprite.position.x + 1
            foxJumpSprite.position.x = foxRunSprite.position.x + 1
        }
        if (direction === "left"&& foxRunSprite.position.x > 0 + foxRunSprite.width / 2) {
            foxRunSprite.position.x = foxRunSprite.position.x - 1
            foxJumpSprite.position.x = foxRunSprite.position.x - 1
        }
    }
})

const leafContainer = new PIXI.Container();
viewport.addChild(leafContainer)
viewport.addChild(foxContainer)

var emitter = new particles.Emitter(

    // The PIXI.Container to put the emitter in
    // if using blend modes, it's important to put this
    // on top of a bitmap, and not use the root stage Container
    leafContainer,

    // The collection of particle images to use
    [PIXI.Texture.from(leafImage)],

    // Emitter configuration, edit this to change the look
    // of the emitter
    {
        "alpha": {
            "start": 1,
            "end": 1
        },
        "scale": {
            "start": 0.5,
            "end": 0.5,
            "minimumScaleMultiplier": 0.1
        },
        "color": {
            "start": "#ffffff",
            "end": "#ffffff"
        },
        "speed": {
            "start": 150,
            "end": 150,
            "minimumSpeedMultiplier": 0.6
        },
        "acceleration": {
            "x": 0,
            "y": 0
        },
        "maxSpeed": 0,
        "startRotation": {
            "min": 175,
            "max": 185
        },
        "noRotation": false,
        "rotationSpeed": {
            "min": 50,
            "max": 75
        },
        "lifetime": {
            "min": 20,
            "max": 20
        },
        "blendMode": "normal",
        "ease": [
            {
                "s": 0,
                "cp": 0.379,
                "e": 0.548
            },
            {
                "s": 0.548,
                "cp": 0.717,
                "e": 0.676
            },
            {
                "s": 0.676,
                "cp": 0.635,
                "e": 1
            }
        ],
        "frequency": 2,
        "emitterLifetime": -1,
        "maxParticles": 1000,
        "pos": {
            "x": 0,
            "y": 0
        },
        "addAtBack": false,
        "spawnType": "rect",
        "spawnRect": {
            "x": window.innerWidth,
            "y": window.innerHeight - 210,
            "w": 20,
            "h": 200
        }
    }
);

// Calculate the current time
var elapsed = Date.now();

// Update function every frame
var update = function () {

    // Update the next frame
    requestAnimationFrame(update);

    var now = Date.now();

    // The emitter requires the elapsed
    // number of seconds since the last update
    emitter.update((now - elapsed) * 0.001);
    elapsed = now;

    // Should re-render the PIXI Stage
    // renderer.render(stage);
};

// Start emitting
emitter.emit = true;

// Start the update
update();
