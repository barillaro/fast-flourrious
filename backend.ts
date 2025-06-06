/****************************************************************************************
 * Project: Micro:bit Multiplayer Game
 * Description: Core logic and custom extensions for micro:bit multiplayer interaction.
 * 
 * File: backend.ts
 * Contains: Helper functions to aliviate students' work
 * 
 * Author: Sebastian Barillaro
 * Date: 2025-06-01
 * Platform: Microsoft MakeCode for micro:bit
 * 
 * Notes:
 * - Designed for use with MakeCode editor (https://makecode.microbit.org/)
 * - Compatible with MakeCode's TypeScript (pxt) environment
 * 
 * License: Reserved for Luxembourg Tech School ASBL
 ****************************************************************************************/


let lastSendTime = 0
const cooldownTimer = 10 //seconds

// === Logo pressed: Send bomb if allowed ===
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (bombActive == true) return;
    if (gameOver == true) return;
    const now = control.millis()
    if (now - lastSendTime > cooldownTimer * 1000) {
        if (myID == -1 || difficulty == "chaos") {
            lastSendTime = now
            sendBomb()
        }
    } else {
        basic.showIcon(IconNames.No)
        basic.pause(200)
    }
})

function startGame() {
    // play starting sound
    music.play(music.builtinPlayableSoundEffect(soundExpression.happy), music.PlaybackMode.InBackground)
    // show the status!
    showStatus()
}

function countdown(defuseTime: number) {
    for (let i = 0; i <= defuseTime - 1; i++) {
        music.playTone(262, 100)
        // basic.showIcon(IconNames.Heart)
        basic.showNumber(defuseTime - i)
        basic.pause(400)
        music.playTone(349, 100)
        basic.clearScreen()
        basic.pause(400)
        if (bombActive == false) {
            break;
        }
    }
}


// === Helper: Bomb Defused ===
function defuseSuccess() {
    bombActive = false
    myScore += 5
    music.stopAllSounds()
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    showStatus()
    if (difficulty == "extreme") {
        sendBomb()
    }
}

// === Helper: Bomb Exploded ===
function explodeBomb() {
    bombActive = false
    myScore = Math.max(0, myScore - 5)
    music.stopAllSounds()
    music.startMelody(["C5", "B", "A", "G", "F", "E", "D", "C"], MelodyOptions.Once)
    basic.showIcon(IconNames.Skull)
    basic.pause(1000)
    showStatus()
}

function isBombMessage(message: string) {
    // Compare the first 5 char of the message with "bomb:"
    if (message.substr(0, 5) == "bomb:") {
        // It is a bomb message. Return true
        return true
    } else {
        // It is NOT a bomb message. Return false
        return false
    }
}
