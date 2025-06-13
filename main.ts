/****************************************************************************************
 * Project: Micro:bit Multiplayer Game: Fast & Flourrious - Coach's version
 * 
 * Description: TODO
 * 
 * Instructions:
 * - Press A button to broadcast "pizza" message. 
 *      - It is used after task 1, to check that players can receive messages.
 * 
 * - Press A and B buttons (simultaneously) to broadcast a "gameOver" message.
 *      - Use it after Task 2 to check the players can identify the message.
 *      - Use after every round, to disable players to play further.
 * 
 * - Touch micro:bit logo to dispatch a delivery order.
 *      - It generates an order to a randomly chosen CourierID and Apartment, and a fixed delivery Delivery time
 *      - Use it to play
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

basic.showString("COACH")
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

// === Configuration variables ===
// print radio Message
let printMessage = true;
// Set the number of players!
let players = 20;
// Set your ID (Must be unique in your group)
let myID = -1; // Change the random value for something fix
// Set the difficulty of the game: "easy", (more to come later)
let difficulty = "easy";
// Set the ringbell options list
let ringbellPanel = ["A", "B", "0", "1", "2"]

radio.setGroup(defaultRadioGroup)

input.onButtonPressed(Button.AB, function () {
    basic.showIcon(IconNames.Ghost)
    basic.showString(mGameOver)
    basic.showIcon(IconNames.Ghost)
    sendOrder(mGameOver)
})

input.onButtonPressed(Button.A, function () {
    let message = "pizza"
    basic.showString(message)
    sendOrder(message)
})


// === Logo pressed: Create a pizza order ===
input.onLogoEvent(TouchButtonEvent.Pressed, createOrder)

function createOrder() {
    // Not create order if there is another order active already
    if (orderActive == true) return;
    // Not create order if the game is over already
    if (gameOver == true) return;

    let message: string
    message = prepareOrder()
    sendOrder(message)
}


// === Helper: prepare Order ===
function prepareOrder(): string {
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
    message = mTypeMessage + mSeparator
        + mCourierID + mSeparator
        + mDoor + mSeparator
        + mDelyTime

    // return the order
    // The message order is ready! return the message
    return message;
}

function sendOrder(message: string) {
    // send the message by radio!
    // =======================================
    // ========= Task: 9
    // =======================================
    // TODO: use the message to broadcast by radio
    radio.sendString(message)
}

