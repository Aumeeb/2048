/**
 *  You can choose one of all difficult to start game , each difficult has different cells
 */
export const enum Difficult {
    /** has 3 * 3 cells */
    Kids,
    /** has 4 * 4 cells */
    Normal,
    /** has 8 * 8 cells */
    Easy,
    /** has 16 * 16 cells */
    Hard,
    /** has 32 * 32 cells */
    Expert,
    /** has 64 * 64 cells */
    Boss,
    /** has 88 * 88 cells */
    Abyss
}

/**
 * record which direction key has been pressed
 */
export const enum Direction {
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
    Nothing = 0,
}

export interface Size {
    /** 横向有多少个方块 */
    rows: number;
    /** 竖向有多少个方块   */
    columns: number;
    /** 横向和竖向方块的总数量  */
    count: () => number;
}

export interface ArrayCellAttribute<T> {
    index: number;
    value: T;
}

export interface TileInfo extends ArrayCellAttribute<number> {
    moveSteps: number;  //需要移动多少步
    isAid: boolean;
    previousIndex: number | undefined;
}

/** history data */
export interface Step {
    direction: Direction;
    index?: number;
    value: TileInfo[];
}
