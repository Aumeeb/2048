import * as  System from "./gameEnum";
import { ColorPan } from './colorPan'
import { randomNum, combinationTiles } from './tools'

interface Size {
    /** 横向有多少个方块 */
    rows: number;
    /** 竖向有多少个方块   */
    columns: number;
    /** 横向和竖向方块的总数量  */
    count: () => number;
}
Window
/** 历史数据 */
interface Step {
    new(): Step;
    index: number;
    curInputValue: System.Direction;
    curData: number[]
    to2DArray?: () => number[][]

}
/** Game control center 游戏控制 ! */
class GCC {
    /**画板 */
    static readonly canvas = document.getElementById('d') as HTMLDivElement
    /**画板上内边距 */
    static readonly canvasPaddingTop: number = 300
    /**画板宽度 */
    static readonly canvasWidth: number = 1200
    /**画板高度 */
    static readonly canvasHeight: number = 1200
    /**动画持续时间 */
    static readonly animDuration: number = 100
    /**棋盘格 */
    static tableSize: Size = { rows: 0, columns: 0, count: () => GCC.tableSize.rows * GCC.tableSize.columns }
    static history: Step[] = [];
    static curStep = history.length;

    score: number = 0;
    // //根据难度计算出的来行数
    // canInput: boolean = true;
    // curInputValue: System.Direction = System.Direction.Nothing;
    // preInputValue: System.Direction = System.Direction.Nothing;
    // historyInputValueList: Array<System.Direction> = new Array<System.Direction>();
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

export class Tile {
    /**
 * 瓦片
 */
    own: HTMLDivElement
    constructor() {
        this.own = document.createElement('div'); //初始化
    }

    /**
  * 索引
  */
    index: number = 0;
    /**
    * 数值
    */
    value: number = 0;
    /**
    * 元素宽度
    */
    width: number = 0;
    /**
    * 元素高度
    */
    height: number = 0;
    /**
    * 边框宽度
    */
    borderWidth: number = 0;
    /**
    * 边框高度
    */
    borderHeight: number = 0;
    /**
    * 上偏移
    */
    top: number = 0;
    /**
    * 左偏移
    */
    left: number = 0;

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
 
 

type TileSquare = Array<Array<Tile>>;
class Main {
    gameStep: number = 1;
    history: Map<number, TileSquare>
    inputable: boolean = true
    canAnim: boolean = true;
    uIRender: UIRender;
    table: TileSquare;
    cellArray = new Array<Tile>();
    
    //开局生成随机多少个瓦片
    ranTileCount = 2;  //有bug 可能生成的元素会在同一个坐标上🐷
    //总数
    public tilesCount: number;
    constructor(difficult: System.Difficult) {

        this.setDifficult(difficult);
        this.table = [];
        GCC.canvas.tabIndex = 100;
        this.tilesCount = GCC.tableSize.count()
        this.history = new Map<number, TileSquare>();
        this.uIRender = new UIRender(GCC.canvas, this);
        this.init();
        this.uIRender.createBackGroundTail(GCC.canvasWidth, GCC.canvasHeight, GCC.tableSize.rows, GCC.tableSize.columns, "div");
        GCC.canvas.onkeydown = (e) => {
            if (this.inputable) {
                switch (e.keyCode) {//判断e.indexCode
                    //是37: 就左移
                    case 37:
                        console.log("左");
                        // if (this.canAnim) {
                        //     this.cellArray.forEach((ele) => {
                        //         this.uIRender.TailMove(ele, System.Direction.Left);
                        //     });
                        // }
                        //有问题.
                        break;
                    //是38: 就上移
                    case 38:
                        console.log("上");
                        break;
                    //是39: 就右移
                    case 39:
                        console.log("右");
                        if (this.canAnim) {
                            combinationTiles(this.table, System.Direction.Right)
                            this.cellArray.forEach((ele) => {
                                this.uIRender.moveTile(ele, System.Direction.Right);
                            });
                        }
                        this.uIRender.createNewOne(this.cellArray);
                        break;
                    //是40: 就下移
                    case 40:
                        console.log("下");
                        break;
                    default:
                        console.log(e.code);
                }
            }

        }

        GCC.canvas.onmouseover = this.mouseOver;
    }
    /**选择难度 */
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
    recordHistory(cur: TileSquare) {
        var newCur = this.copyTileSquare(cur);


        this.history.set(this.gameStep++, newCur)
        this.history.forEach((v, k) => {

            console.log("round " + k)
            console.log(v)
        })
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
 


        this.table = new Array<Array<Tile>>(GCC.tableSize.rows);
        let tab = 0;
        //设置 棋盘格初始化数据
        for (let i = 0; i < GCC.tableSize.rows; i++) {
            let array1 = new Array<Tile>(GCC.tableSize.columns);
            for (var j = 0; j < array1.length; j++) {
                array1[j] = new Tile();
                array1[j].index = tab;
                tab++;
            }
            this.table[i] = array1;
        }

        this.recordHistory(this.table)
        //把矩形2维数组转换1维

        // 2 2 1 
        // 1 9 2
        // 4 6 8

        // 2 2 1 1 9 2 4 6 8

        this.table.forEach(element => {
            element.forEach(tile => {
                this.cellArray.push(tile);
            });
        });


        //设置初始化瓦片索引和值      
        for (let i = 0; i < this.ranTileCount; i++) {
            //开始创建2个随机的数字 2或者4
            let tileIndex = randomNum(this.tilesCount);
            let tileValue = this.createNumber2or4();
            let cell = this.cellArray[tileIndex];

            cell.value = tileValue;
        }
        this.recordHistory(this.toTable(this.cellArray));

    }
    mouseOver(mouse: MouseEvent): void {
        //   console.log(mouse.x);
    }

    start(): void {
        // console.dir(this.table);
        // console.dir(this.cellArray);
        // console.dir(this.tilesCount);
        this.cellArray.forEach((tile) => {
            if (tile.value > 0) {
                this.uIRender.createTile(GCC.tableSize.rows, GCC.tableSize.columns, tile);
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

class Animation {
    private static linear(t: number, b: number, c: number, d: number): number {
        return c * t / d + b;
    }
    private static easeIn(t: number, b: number, c: number, d: number): number {
        return c * (t /= d) * t + b;
    }
    private static easeOut(t: number, b: number, c: number, d: number): number {
        return -c * (t /= d) * (t - 2) + b;
    }
    private static easeInOut(t: number, b: number, c: number, d: number): number {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
    /**
     * 
     * @param currentTime（当前时间）
     * @param beginningValue（初始值） 当前的值 
     * @param ChangeInValue（增量） 坐标100px to 200px  公式200-100=100   100px to 150px  公式150-100= 50
     * @param duration (帧率) t++   t<d   值120 每秒
     * @param animType
     * @param divElement (div元素)
     */
    static BeginAnim(currentTime: number, beginningValue: number, ChangeInValue: number, duration: number, animType: System.AnimationType, divElement: HTMLDivElement): void {

        //var t = 0;
        //var b = parseInt(divElement.style.left);
        //var c = -400;
        //var d = 120;
        var ms = 1000;
        var colseID = setInterval(() => {
            switch (animType) {
                case System.AnimationType.linear:

                    var val = this.linear(currentTime, beginningValue, ChangeInValue, duration);
                    var str;
                    if (currentTime <= duration) {
                        str = val + "px";
                        if (divElement != null) {
                            divElement.style.left = str;
                        }
                    }
                    currentTime++;
                    if (currentTime == duration) {
                        //  divElement.style.left = str;
                    }

                    break;
                case System.AnimationType.easeIn:
                    this.easeIn(currentTime, beginningValue, ChangeInValue, duration);
                    break;
                case System.AnimationType.easeOut:
                    this.easeOut(currentTime, beginningValue, ChangeInValue, duration);
                    break;
                case System.AnimationType.easeInOut:
                    this.easeInOut(currentTime, beginningValue, ChangeInValue, duration);
                    break;
                default:
                    this.linear(currentTime, beginningValue, ChangeInValue, duration);
                    break;
            }

        }, ms / duration);

        setTimeout(() => { clearInterval(colseID); }, ms);
    }

}
class UIRender {
    private canvasStyle(): void {
        let canvas = document.getElementById('d') as HTMLDivElement;
        canvas.style.width = this.toPx(GCC.canvasWidth)
        canvas.style.height = this.toPx(GCC.canvasHeight)
    }
    private bodyStyle(): void {
        var body = document.getElementsByTagName('body').item(0);
        body.style.paddingTop = this.toPx(GCC.canvasPaddingTop);
        body.style.opacity = '0.9';
        body.style.backgroundImage = 'url(./img/huge2.jpg)';
    }

    private toPx(val: number): string {
        return val + 'px';
    }
    /**
     * 最外层的div容器
     */
    private canvas: HTMLDivElement;
    private game: Main
    constructor(canvas: HTMLDivElement, game: Main) {
        this.game = game
        this.canvas = canvas;
        this.backgroundSkin();
        this.bodyStyle();
        this.canvasStyle();
    }

    private backgroundSkin(): void {
        this.canvas.style.backgroundColor = ColorPan.backgroundDivBig;
        this.canvas.style.margin = "auto";
        this.canvas.style.position = "relative";
        this.canvas.style.borderRadius = this.toPx(6)
    }
    public createBackGroundTail(canvasWidth: number, canvasHeight: number, row: number, col: number, eleName: string): void {

        let borderWidth = canvasWidth * (1 / 6);
        let borderHeight = canvasHeight * (1 / 6);
        let width = (canvasWidth - borderWidth) / col;
        let height = (canvasHeight - borderHeight) / row;
        let pieceOfRectangle = row * col;
        let singleborderWidth = borderWidth / (col + 1);
        let singleborderHeight = borderHeight / (row + 1);


        for (var i = 0; i < pieceOfRectangle; i++) {

            let element = document.createElement(eleName);
            element.style.width = this.toPx(width);
            element.style.height = this.toPx(height);
            element.style.backgroundColor = ColorPan.backgroundDivSmall;
            element.style.borderRadius = this.toPx(10);
            element.style.position = "absolute";

            let x = ((singleborderWidth + ((singleborderWidth + width) * (i % col))));
            element.style.left = this.toPx(x);
            let y = singleborderHeight + (singleborderHeight + height) * (Math.floor(i / col));
            element.style.top = this.toPx(y);

            this.canvas.appendChild(element);

        }
    }
    //随机创建一个新的  "格子""
    public createNewOne(cellArray: Array<Tile>) {
        //找出空的集合
        let emptyIndexArray = new Array<number>();
        for (let i = 0; i < cellArray.length; i++) {
            if (cellArray[i].value == 0)
                emptyIndexArray.push(i)
        }
        //选出用可用的下标
        let ranIndex = randomNum(emptyIndexArray.length);
        let availableIndex = emptyIndexArray[ranIndex]
        cellArray[availableIndex].value = 2
        this.createTile(GCC.tableSize.rows, GCC.tableSize.columns, cellArray[availableIndex])
    }
    public update(previous: TileSquare, next: TileSquare): Boolean {
        return true;
    }
    public createTile(row: number, col: number, tile: Tile
        , ): HTMLDivElement {
        if (tile == null) {
            console.log("dict is null")
        }
        let index = tile.index;
        let value = tile.value;

        let borderWidth = GCC.canvasWidth * (1 / 6);
        let borderHeight = GCC.canvasHeight * (1 / 6);
        let width = (GCC.canvasWidth - borderWidth) / col;
        let height = (GCC.canvasHeight - borderHeight) / row;
        let pieceOfRectangle = row * col;
        let singleborderWidth = borderWidth / (col + 1);
        let singleborderHeight = borderHeight / (row + 1);
        let eleDiv = document.createElement("div");


        eleDiv.style.width = this.toPx(width);
        eleDiv.style.height = this.toPx(height);
        eleDiv.style.backgroundColor = ColorPan.Lv2;
        eleDiv.style.borderRadius = this.toPx(10);
        eleDiv.style.position = "absolute";
        eleDiv.style.lineHeight = this.toPx(height);
        eleDiv.style.textAlign = "center";
        let x = ((singleborderWidth + ((singleborderWidth + width) * (index % col))));
        eleDiv.style.left = this.toPx(x);
        let y = singleborderHeight + (singleborderHeight + height) * (Math.floor(index / col));
        eleDiv.style.top = this.toPx(y);

        tile.own = eleDiv;
        tile.width = width;
        tile.height = height;
        tile.borderWidth = singleborderWidth;
        tile.borderHeight = singleborderHeight;
        tile.left = x;
        tile.top = y;


        var a = document.createElement("a");
        a.style.fontSize = this.toPx(height / 2.5);
        a.innerText = tile.value.toString();
        eleDiv.appendChild(a);
        this.canvas.appendChild(eleDiv);

        return eleDiv;
    }
    moveTile(tile: Tile, dir: System.Direction): void {
        let frameRate: number = 60;
        if (tile) {
            if (dir != null) {
                if (dir == System.Direction.Left) {

                    Animation.BeginAnim(0, tile.left, tile.borderWidth - tile.left, frameRate, System.AnimationType.linear, tile.own);
                    setTimeout(() => {
                        tile.update();
                    }, GCC.animDuration);
                }
                if (dir == System.Direction.Right) {
                    var tileWidth = tile.width + tile.borderWidth;
                    Animation.BeginAnim(0, tile.left, (tileWidth * (GCC.tableSize.rows - 1)) - (tileWidth * tile.currentColIndex()), frameRate, System.AnimationType.linear, tile.own);
                    setTimeout(() => {
                        tile.update();
                    }, GCC.animDuration);
                }
            }

        } else {
            console.log("div不存在");
        }
    }

}




let game = new Main(System.Difficult.Kids);
game.start();



