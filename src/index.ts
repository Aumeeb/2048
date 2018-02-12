import * as  System from "./gameEnum";
import { ColorPan } from './colors'
import { randomNum, combinationTiles, initCreateTiles, combinationTilesLR, combinationTilesTB, initCreateTilesTest, } from './tools'
import { convert1Dto2D, convert2DTo1D,  } from "./convert";
import { Option } from "./option";
import { UI } from "./render";
import { Tile, Size, Step, TileSquare } from "./types";

/** Game control center 游戏控制 ! */
export class GCC {
    /**画板 */
    static readonly canvas = document.getElementById(Option.canvasId) as HTMLDivElement
    /**画板上内边距 */
    static readonly canvasPaddingTop: number = 300
    /**画板宽度 */
    static readonly canvasWidth: number = Option.resolution.w;
    /**画板高度 */
    static readonly canvasHeight: number = Option.resolution.h;
    /**动画持续时间 */
    static readonly animDuration: number = 100
    /**棋盘格 */
    static tableSize: Size = { rows: 0, columns: 0, count: () => GCC.tableSize.rows * GCC.tableSize.columns }

    static user: UserBehavior = { inputable: true }
    static history: Step[] = [];
    static curStep = GCC.history.length;

    score: number = 0;
    // //根据难度计算出的来行数
    // canInput: boolean = true;
    // curInputValue: System.Direction = System.Direction.Nothing;
    // preInputValue: System.Direction = System.Direction.Nothing;
    // historyInputValueList: Array<System.Direction> = new Array<System.Direction>();
    static addRecord(record: Step) {
        record.index = GCC.history.length
        GCC.history.push(record);
        console.log(record.index)
        console.log(record.curData)
    }
}

interface UserBehavior {
    inputable: boolean

}
/**
 * record users behaviour and operation state 
 */
class Player {
    constructor(canvas: HTMLElement) {
        canvas.addEventListener('mouseup', (ev) => {
            console.log('already clicked')
        })
    }

    nextStep = (dir: System.Direction) => {

    }
    preStep = () => {

    }


}

/**瓦片*/

class Main {

    canAnim: boolean = true;
    ui: UI;
    tileSquare: TileSquare;
    cellArray = new Array<Tile>();
    //开局生成随机多少个瓦片
    constructor(difficult: System.Difficult) {

        this.setDifficult(difficult);
        this.tileSquare = [];
        this.init();
        this.bindEvent();

        this.ui = new UI(GCC.canvas);

    }
    bindEvent() {
        GCC.canvas.onkeydown = (e) => {

            var preRoundData = GCC.history[GCC.history.length - 1].curData;
            var d2 = convert1Dto2D(preRoundData, GCC.tableSize.rows);

            if (GCC.user.inputable) {
                switch (e.keyCode) {//判断e.indexCode
                    //是37: 就左移
                    case 37:
                        var newData = convert2DTo1D(combinationTilesLR(d2, System.Direction.Left))
                        GCC.addRecord({ curData: newData, curInputValue: System.Direction.Left });
                        break;
                    //是38: 就上移
                    case 38:
                        var newData = convert2DTo1D(combinationTilesTB(d2, System.Direction.Up))
                        GCC.addRecord({ curData: newData, curInputValue: System.Direction.Up });
                        break;
                    //是39: 就右移
                    case 39:
                        var newData = convert2DTo1D(combinationTilesLR(d2, System.Direction.Right))
                        GCC.addRecord({ curData: newData, curInputValue: System.Direction.Right });
                        break;
                    //是40: 就下移
                    case 40:
                        var newData = convert2DTo1D(combinationTilesTB(d2, System.Direction.Down))
                        GCC.addRecord({ curData: newData, curInputValue: System.Direction.Down });
                        break;
                    default:
                }
            }

        }

        GCC.canvas.onmouseover = this.mouseOver;
    }
    setDifficult(diff: System.Difficult): void {

        const sideLenOfCell: number = 4;
        let finalSideLenOfCell = 4;

        switch (diff) {
            case System.Difficult.Kids:
                finalSideLenOfCell = 3
                break;
            case System.Difficult.Easy:
                finalSideLenOfCell = sideLenOfCell << 1;
                break;
            case System.Difficult.Hard:
                finalSideLenOfCell = sideLenOfCell << 2;
                break;
            case System.Difficult.Expert:
                finalSideLenOfCell = sideLenOfCell << 3;
                break;
            case System.Difficult.Boss:
                finalSideLenOfCell = sideLenOfCell << 4;
            case System.Difficult.Abyss:
                finalSideLenOfCell = 88
                break;
        }
        GCC.tableSize.rows = finalSideLenOfCell;
        GCC.tableSize.columns = finalSideLenOfCell;
        // Constpoint = new Table(finalSideLenOfCell, finalSideLenOfCell);
    }
    copyTileSquare(source: TileSquare): TileSquare {
        let target = new Array<Array<Tile>>(GCC.tableSize.rows);
        source.forEach(t => {
            var newArray = new Array<Tile>();
            target.push(newArray)
            for (const value of t) {
                newArray.push(value);
            }
        })
        return target;
    }

    toTable(cur: Tile[]): TileSquare {
        let table = new Array<Array<Tile>>(GCC.tableSize.rows);

        let array = new Array<Tile>();
        for (let i = 0, k = -1; i < cur.length; i++) {
            if (i % GCC.tableSize.rows == 0) {
                array = new Array<Tile>();
                k++
            }
            array.push(cur[i]);
            table[k] = array;
        }
        return table
    }
    init(): void {

        // ----------------------------------------------------------------
        // var initRecord = initCreateTilesTest();
        var initRecord = initCreateTiles(GCC.tableSize.count(), Option.initTileCount, Option.initTileValueRange);
        GCC.addRecord({ curData: initRecord, curInputValue: System.Direction.Nothing });
        var record2D = convert1Dto2D(initRecord, GCC.tableSize.rows);
        // ----------------------------------------------------------------
        this.tileSquare = new Array<Array<Tile>>(GCC.tableSize.rows);
        let tab = 0;
        //设置 棋盘格初始化数据
        for (let i = 0; i < GCC.tableSize.rows; i++) {
            let array1 = new Array<Tile>(GCC.tableSize.columns);
            for (var j = 0; j < array1.length; j++) {
                array1[j] = new Tile();
                array1[j].index = tab;
                array1[j].value = record2D[i][j]
                tab++;
            }
            this.tileSquare[i] = array1;
        }

        this.tileSquare.forEach(element => {
            element.forEach(tile => {
                this.cellArray.push(tile);
            });
        });

    }
    mouseOver(mouse: MouseEvent): void {
        //   console.log(mouse.x);
    }

    start(): void {

        this.cellArray.forEach((tile) => {
            if (tile.value > 0) {
                this.ui.createTile(tile);
            }
        })

    }
    /**
    * 创建随机数字 2 or 4
    */
    createNumber2or4(): number {
        var ran = randomNum(10);
        var beginRan = ran % 2 == 0 ? 2 : 4;
        return beginRan;
    }
}

let game = new Main(System.Difficult.Normal);
game.start();



