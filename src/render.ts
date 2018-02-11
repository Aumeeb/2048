import { GCC } from '.';
import { ColorPan } from './colorPan';
import { randomNum } from "./tools";
import * as  System from "./gameEnum";
import { Tile , TileSquare} from "./types";
export class UI {
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
    private c: HTMLDivElement;
    constructor(c: HTMLDivElement) {
        this.c = c;
        this.c.tabIndex = 100;
        this.backgroundSkin();
        this.bodyStyle();
        this.canvasStyle();
        this.createBackGroundTail(GCC.canvasWidth, GCC.canvasHeight, GCC.tableSize.rows, GCC.tableSize.columns, "div");
    }

    private backgroundSkin(): void {
        this.c.style.backgroundColor = ColorPan.backgroundDivBig;
        this.c.style.margin = "auto";
        this.c.style.position = "relative";
        this.c.style.borderRadius = this.toPx(6)
    }
    private createBackGroundTail(canvasWidth: number, canvasHeight: number, row: number, col: number, eleName: string): void {

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

            this.c.appendChild(element);

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
        this.createTile(cellArray[availableIndex])
    }
    public update(previous: TileSquare, next: TileSquare): Boolean {
        return true;
    }
    public createTile(tile: Tile, row: number = GCC.tableSize.rows, col: number = GCC.tableSize.columns): HTMLDivElement {
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
        this.c.appendChild(eleDiv);

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