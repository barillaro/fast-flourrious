/****************************************************************************************
 * Project: Micro:bit Multiplayer Game
 * Description: Core logic and custom extensions for micro:bit multiplayer interaction.
 * 
 * File: main.ts
 * Contains: Main logic. Initial template.
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


// === Constants ===
// TODO: Define constant values
const defaultDefuseTime = 6  // seconds
const radioGroup = 10

// === Flag Variables ===
let bombActive = false // false = bomb not active ; true = bomb activated!
let gameOver = false // false = game is NOT over (playing) ; true = the game is over.

// === Support Variables ===
let defuseCode = ""
let defuseTime = defaultDefuseTime;
let myScore = 0

// === Configuration variables ===
// Set the number of players!
let players = 4;
// Set your ID (Must be unique in your group)
let myID = randint(1, players); // Change the random value for something fix
// Set the difficulty of the game: "easy", (more to come later)
let difficulty = "easy";
// Set the defuse code list
let defuseCodeList = ["A"];
// Optionally, you can extend the list of codes to include more codes
// defuseCodeList = ["A", "B", "P0", "P1", "P2"]


// === This executes at the beginning ===
// Configure the radio Group
// TODO: radio.setGroup(use the radioGroup here)
// start the game!
// TODO: Call the startGame function


// === Helper: Show current status (ID + Score) ===
function showStatus() {
    // Print the label "ID:" and the ID on the display
    // TODO: show ID on the LED display

    // Print the label "S:" and the score on the display
    // TODO: show your score on the LED display

}

// This function configures the device to end the game
function endGame() {
    // Set the flag gameOver 
    // TODO: set the flag variable gameOver = true
    // Deactivate any bomb
    // TODO: set the flag variable bombActive = false
    //Stop the sound
    music.stopAllSounds()
    // Show the NO icon during 1 second (a visual reference)
    basic.showIcon(IconNames.No)
    basic.pause(1000)
    // show the final score on screen
    // TODO: call the showStatus function
}

// === Receive Radio Message ===
// This function executes when the device receives a radio message.
radio.onReceivedString(handleRadioMessage)

// === handler of the reception ===
function handleRadioMessage(message: string) {
    // If the game is over, we do nothing (return)
    // TODO: if (check flag if game is over) 
    {
        return;
    }

    // The game is not over. Let's see what we have received
    if (message == "gameover") {
        // The message received requires to end the game
        // TODO: Call the endGame function
        return;
    }

    // Check if the message is of type bomb
    if (isBombMessage(message) == true) {
        // The message is of type bomb! Process the bomb message!
        // TODO: Call the processBombMessage function!
    }
}

function processBombMessage(message: string) {
    // The message received has four parts: bomb, Target ID, Defuse Code, and Defuse time.
    // All the parts are together, separated by a :
    // We need to split the parts by the separator
    let parts = message.split(":")
    // We store the fields in variables starting with m (m for message)
    let mTargetId = parseInt(parts[1])
    let mCode = parts[2]
    let mTime = parseInt(parts[3])

    // All players get a point for surviving this round
    // TODO: Increment myScore by 1

    // Short alert to all
    // TODO: basic.showString( Show a visual notification "!" )

    //Check if the bomb was sent to me :-O
    if (mTargetId == myID) {
        // Caramba!! I have the bomb!
        // mark the flag bomb active!
        // TODO: Mark bombActive = true
        // save the message data:
        defuseCode = mCode
        defuseTime = mTime

        // Show how to defuse the bomb on the LED display
        basic.showString("CODE: " + defuseCode)

        // Start the countdown during "defuseTime" seconds
        // TODO: call countdown() with defuseTime

        // The countdown function ended. Check if you defused the bomb (or not) 
        // TODO: Check if bombActive == true
        {
            // The bomb remains active. I am very sorry for you >:-D
            explodeBomb() // booom!!!
        }
    } else {
        // The bomb is not for me (fiuuuuu)
        basic.pause(1000)
        showStatus()
    }
}



// === Defuse Inputs ===
// This function executes when the button A is pressed
input.onButtonPressed(Button.A, function () {
    // Try to defuse using the code A
    Defuse("A")
})

// TODO: add an input function to process the Button B

// TODO: add an input function to process the Pin 0
// input.onPinPressed(TouchPin.P0, function () {
//     Defuse("P0")
// })

// TODO: add an input function to process the Pin 1

// TODO: add an input function to process the Pin 2

// === Helper: Handle Defuse Attempt ===
function Defuse(codePressed: string) {
    // TODO: Check if game is over. if (gameOver == true) 
    { // If the game is over, there is nothing to do
        return // end of function
    }

    // The game is not over. Check if the bomb is active
    // TODO: Check if game is over. if (bombActive == true) 
    {   // The bomb is active! 
        // Check if defused correctly
        // TODO: Check if codePressed matches defuseCode. if (defuseCode == codePressed)
        {// bomb defused correctly. Well done!
            defuseSuccess()
        }
        // TODO: else 
        {
            // bomb is not defused. I am very sorry for you :-p
            explodeBomb()
        }
    }
}


// === Helper: Send Bomb ===
function sendBomb() {
    // We need to prepare the bomb message before sending it.
    // The message is comprised of several parts separated by a :
    // Consider the following example
    // - Type of message = bomb
    // - TargetID = 12
    // - defuse code = B
    // - defuse time = 5 seconds
    // Combining all the data, you can CODIFY a message as bomb:12:B:5
    let message: string

    // Choose a target to send the bomb
    let targetID
    do { //TODO: Set the range of random target ID
        targetID = randint(0, 0)
    } while (targetID == myID); // This checks that we don't throw the bomb to ourselves

    // Choose a random defuse code index
    let defuseCodeIndex = randint(0, defuseCodeList.length - 1)
    // TODO: Use the defuseCodeIndex to pick a defuse code (from the list of codes)
    let defuseCode = defuseCodeList[0]

    // Adjust defuse time for extreme difficulty
    if (difficulty == "extreme") {
        // defuseTime is one second less (minimum 1)
        defuseTime = Math.max(1, defuseTime - 1)
    } else {
        defuseTime = defaultDefuseTime
    }

    // Show the targetID on screen (and play some sound)   
    basic.showString("To:" + targetID)
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.InBackground)

    // Assembly all the parts in a single message
    // TODO: concatenate the parts into a single message.
    //       Intercalate : in between as a separator
    message = "bomb:" // concatenate + ":" + the ":" +  parts ;-)

    // send the message by radio!
    // TODO: use the message to broadcast by radio
    radio.sendString("your bomb here")
}



