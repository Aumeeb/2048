/**
 *  You can choose one of all difficult to start game , each difficult has different cells
 */
export enum Difficult {
    /** has 8 * 8 cells */
    Easy,
    /** has 4 * 4 cells */
    Normal,
    /** has 16 * 16 cells */
    Hard,
    /** has 32 * 32 cells */
    Expert,
    /** has 64 * 64 cells */
    Boss
}
/**
 * record which direction key has been pressed
 */

export enum Direction {
    Left,
    Up,
    Down,
    Right,
    Nothing,
}
/**
 *there are some beaufully color  
 */
export enum AnimationType {
    linear,
    easeIn,
    easeOut,
    easeInOut,

}