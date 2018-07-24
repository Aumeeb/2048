
import { GCC } from './main'
export type Path = string & { __pathBrand: any }
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
    VaildDirection = Left | Up | Right | Down,
}

/**
 *there are some beaufully color  
 */
export const enum AnimationType {
    linear,
    easeIn,
    easeOut,
    easeInOut,
}
export type TileSquare = Array<Array<Tile>>;
export interface Size {
    /** 横向有多少个方块 */
    rows: number;
    /** 竖向有多少个方块   */
    columns: number;
    /** 横向和竖向方块的总数量  */
    count: () => number;
}
export interface Point {
    x: number;
    y: number
}
export interface ArrayCellAttribute<T> {
    index: number;
    value: T;

}
export interface TileInfo extends ArrayCellAttribute<number> {
    position?: Point;
    isAid: boolean;
    previousIndex: number | undefined
}
/** 历史数据 */
export interface Step {
    direction: Direction;
    index?: number;
    value: TileInfo[];
}

export class Tile implements TileInfo {
    position?: Point | undefined;
    isAid: boolean = false
    previousIndex: number | undefined;
    own: HTMLDivElement = document.createElement('div'); //初始化
    index: number = 0;//索引
    value: number = 0;//数值
    text: string= 'undefined'
    width: number = 0;//元素宽度
    height: number = 0;//元素高度
    borderWidth: number = 0; //边框宽度
    borderHeight: number = 0; //边框高度
    top: number = 0;//上偏移
    left: number = 0;//左偏移

    currentRowIndex(): number {
        return this.index / GCC.tableSize.columns
    }
    currentColIndex(): number {
        return this.index % GCC.tableSize.columns
    }

    isEmpty(): boolean {
        if (this.value == 0)
            return true
        else
            return false
    }
    //更新
    update(): void {
        if (this.own != undefined) {
            if (this.own.style.left)
                this.left = parseInt(this.own.style.left);
            if (this.own.style.top)
                this.top = parseInt(this.own.style.top);
            if (this.own.style.right)
                this.top = parseInt(this.own.style.right);
            if (this.own.style.bottom)
                this.top = parseInt(this.own.style.bottom);
        }
    }
}

export type Partial<T> = {
    [P in keyof T]?: T[P];
};