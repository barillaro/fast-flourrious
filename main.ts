/****************************************************************************************
 * Project: Micro:bit Multiplayer Game
 * Description: Core logic and custom extensions for micro:bit multiplayer interaction.
 * 
 * File: main.ts
 * Contains: Main logic. Task 1
 * 
 * Author: Sebastian Barillaro
 * Date: 2025-06-10
 * Platform: Microsoft MakeCode for micro:bit
 * 
 * Notes:
 * - Designed for use with MakeCode editor (https://makecode.microbit.org/)
 * - Compatible with MakeCode's TypeScript (pxt) environment
 * 
 * License: Reserved for Luxembourg Tech School ASBL
 ****************************************************************************************/


// === Constants ===
const defaultDelyTime = 6  // seconds
const defaultRadioGroup = 10
const mGameOver = "gameOver"

// === Flag Variables ===
let orderActive = false // false = order not active ; true = order activated!
let gameOver = false // false = game is NOT over (playing) ; true = the game is over.

// === Support Variables ===
let delyDoor = ""
let delyTime = defaultDelyTime;
let myScore = 0

// === Configuration variables ===
// print radio Message
let printMessage = false;
// Set the number of players!
let players = 20;
// Set your ID (Must be unique in your group)
let myID = randint(1, players); // Change the random value for something fix
// Set the difficulty of the game: "easy", (more to come later)
let difficulty = "easy";
// Set the ringbell options list
let ringbellPanel = ["A", "B", "0", "1", "2"]

// =======================================
// ========= Task 1:
// =======================================
// Configure the radio Group
// TODO: radio.setGroup(use the radioGroup here)
// start the game!
// TODO: Call the startGame function

// === Receive Radio Message ===
// This function executes when the device receives a radio message.
radio.onReceivedString(radioMessageReceived)

// === handler of the reception ===
function radioMessageReceived(message: string) {
// =======================================
// ========= Task: 2 (a)
// =======================================
// TODO: Set printMessage to false to stop showing the message on the LED display
    // You have received a radio message. We will print it on the display
    if (printMessage == true){
        basic.showString(message);
    }

    // If the game is over, we do nothing (return)
    if (gameOver == true) {
        // Show the NO icon during 1 second (a visual reference)
        basic.showIcon(IconNames.Ghost)
        basic.pause(1000)
        return // This return instruction ends the function. 
               // It continues where it was called from
    }

    // The game is not over. Let's see what we have received
// =======================================
// ========= Task: 2 (b)
// =======================================
// TODO: check if the message received is equal to "gameover"
   if (true) {
        // The message received indicates to end the game
        endGame()
        return;
    }

    // The header of the message indicates what type of message is
    // Let's extract the header of the message
    let header = message.substr(0, 5) // this line extract the first 5 letters
// =======================================
// ========= Task: 3
// =======================================
// TODO: Check if the header of the message is "order"
    if (false) {
        // The message is of type order! Process the order message!
        announceOrder();
        processOrderMessage(message)
    }
}

function processOrderMessage(message: string) {
    // The message received has four parts: order, Courier ID, ring bell, and delivery time.
    // All the parts are together, separated by a :
    // For example order:5:B:6
    // We need to split the parts by the separator
    let mParts = message.split(":")
    // We store the fields in variables starting with m (m for message)
    let mType = "";
    let mCourierId = 0;
    let mDelyDoor = "";
    let mDelyTime = 0;
// =======================================
// ========= Task: 4
// =======================================
//TODO: take the message parts (0, 1, 2, and 3) 
//      in separated variables (mType, mCourierId, mDelyDoor, mDelyTime)
    mType = mParts[0];

    //Check if the order was sent to me :-O
    if (mCourierId == myID) {
        // Caramba!! The order is for me!!!
        // mark the flag order active!
        orderActive = true
        // save the message data:
        delyDoor = mDelyDoor
        delyTime = mDelyTime

        // Show the door to deliver the order on the LED display
        basic.showString("Door:" + delyDoor)

        // Start the countdown during "delyTime" seconds
        countdown(delyTime)

        // The countdown function ended.
        // was the order delivered?  
        // Check if you delivered the pizza (or not) 
        if (orderActive == true){
            // The order remains pending. I am very sorry for you >:-D
            deliveryFail() // booom!!!
        }
    } else { // This ELSE comes from above if (mCourierId == myID) 
        // The order is not for me (fiuuuuu)
        basic.pause(1000)
        // Show I add a point
        basic.showString("+1")
    }
}

// === Inputs handlers ===
// This function executes when the button A is pressed
input.onButtonPressed(Button.A, function () {
    // deliver the order to door "A"
    deliverTo("A"); // Use "A", not A
})

// =======================================
// ========= Task: 5
// =======================================
// TODO: add an input function to process the input Button B
input.onButtonPressed(Button.B, function () {
    // deliver the order to door "B".
    // HINT: it is almost identical to the Button A input function
})

// TODO: add an input function to process the Pin 0
input.onPinPressed(TouchPin.P0, function () {
    // deliver the order to door "0"
    deliverTo("0");
})

// TODO: add an input function to process the Pin 1
input.onPinPressed(TouchPin.P1, function () {
    // deliver the order to door "1"
    // HINT: it is almost identical to the P0 input function
})

// TODO: add an input function to process the Pin 2
input.onPinPressed(TouchPin.P2, function () {
    // deliver the order to door "2"
    // HINT: it is almost identical to the P0 input function
})


// === Helper: Handle Delivery Attempt ===
function deliverTo(ringPressed: string) {
    // Check if the game is over.
    if (gameOver == true) 
    { // If the game is over, there is nothing to do
        return // end of function
    }

    // NOTE: If you are reading this after the if gameOver validation, it means that
    //       the game is not over. We keep delivering the order!
    // The game is not over. Check if the order is active
    if (orderActive == true) 
    {   // The order is active! 
        // Check if delivered correctly. Door must equal ringbell
// =======================================
// ========= Task: 6
// =======================================
// TODO: Check if you pressed the right ringbell
    if (false){
        // order delivered correctly. Well done!
            deliveryOK()
        } else {
            // order is not delivered ok. I am very sorry for you :-p
            deliveryFail()
        }
    }
}

// === Logo pressed: Create a pizza order ===
input.onLogoEvent(TouchButtonEvent.Pressed, createOrder)

function createOrder() {
    // Not create order if there is another order active already
    if (orderActive == true) return;
    // Not create order if the game is over already
    if (gameOver == true) return;
    const now = control.millis()
    if (now - lastSendTime > cooldownTimer * 1000) {
        lastSendTime = now
// =======================================
// ========= Task: 7
// =======================================
// TODO: Create an order, prepare the order, and send the order.

    } else {
        basic.showIcon(IconNames.Chessboard)
        basic.pause(200)
    }
}


// === Helper: prepare Order ===
function prepareOrder():string {
// We need to prepare the order message before sending it.
    // The message is comprised of several parts separated by a :
    // Consider the following example
    // - Type of message = order
    // - courierID = 12
    // - door = B
    // - DelyTime = 5 seconds
    // Combining all the data,
    // you can CODIFY a message as order:12:B:5
    
// Let's start by creating our variables. The m in the name says is for messaging
    let mTypeMessage = "order"
    let mCourierID;        // the courier destination
    let mDoor;             // the door to deliver the order
    let mDelyTime         // the time left to deliver the order
    let mSeparator = ":"  // a separator, to not mix the data
    let message: string   // The message with the full order

// Choose a courier to send the order
    do { // Choose a random courier ID
        mCourierID = randint(1, players)
    } while (mCourierID == myID); // This checks that you don't send the order to yourself

// Choose a random door
    // We choose a random option from all the ringbellPanel chances
    let ringbellOption = randint(0, ringbellPanel.length - 1)
    // we use the option to choose from the ringbell panel
    mDoor = ringbellPanel[ringbellOption]

// Choose a delivery time
    // Use the default delivery time
    mDelyTime = defaultDelyTime

// Show the targetID on screen (and play some sound)   
    basic.showString("To:" + mCourierID)
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.InBackground)

// Assembly all the parts in a single message
// =======================================
// ========= Task: 8
// =======================================
    // TODO: concatenate the parts into a single message.
    //       Intercalate : in between as a separator
    message = "" // concatenate + ":" + the ":" +  parts ;-)

// return the order
    // The message order is ready! return the message
    return message;
}

function sendOrder(message: string){
    // send the message by radio!
// =======================================
// ========= Task: 9
// =======================================
    // TODO: use the message to broadcast by radio
    radio.sendString("your order here")
}

