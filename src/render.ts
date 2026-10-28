import { GCC } from "./main";
import { ColorPan, getTileColor } from "./colors";
import { combineTiles, aid, value2emoji } from "./tools";
import * as System from "./types";
import { TileInfo } from "./types";
import { Aud } from "./audio";
import { Option } from "./option";

export class UserInterface {
    /**
     * 最外层的div容器
     */
    private readonly divCanvas: HTMLDivElement;
    private readonly tileElements: HTMLDivElement[] = [];
    private readonly textElements: HTMLAnchorElement[] = [];
    private readonly prevValues: Int32Array;

    constructor(c: HTMLDivElement) {
        this.divCanvas = c;
        this.divCanvas.tabIndex = 100;
        const totalCells = GCC.tableSize.count();
        this.prevValues = new Int32Array(totalCells).fill(-1);

        this.backgroundSkin();
        this.bodyStyle();
        this.canvasStyle();
        this.initGridDOM();
    }

    private canvasStyle(): void {
        this.divCanvas.style.width = this.toPx(GCC.canvasWidth);
        this.divCanvas.style.height = this.toPx(GCC.canvasHeight);
    }

    private bodyStyle(): void {
        const body = document.body;
        body.style.paddingTop = this.toPx(GCC.canvasPaddingTop);
        body.style.opacity = "0.9";
        body.style.background = "url(./img/huge2.jpg)";
    }

    private toPx(val: number): string {
        return `${val}px`;
    }

    private backgroundSkin(): void {
        this.divCanvas.style.backgroundColor = ColorPan.backgroundDivBig;
        this.divCanvas.style.margin = "auto";
        this.divCanvas.style.position = "relative";
        this.divCanvas.style.borderRadius = this.toPx(6);
    }

    private initGridDOM(): void {
        const rows = GCC.tableSize.rows;
        const cols = GCC.tableSize.columns;
        const total = rows * cols;

        const borderWidth = GCC.canvasWidth / 6;
        const borderHeight = GCC.canvasHeight / 6;
        const width = (GCC.canvasWidth - borderWidth) / cols;
        const height = (GCC.canvasHeight - borderHeight) / rows;
        const singleBorderWidth = borderWidth / (cols + 1);
        const singleBorderHeight = borderHeight / (rows + 1);

        const widthPx = this.toPx(width);
        const heightPx = this.toPx(height);
        const radiusPx = this.toPx(10);
        const fontSizePx = this.toPx(height / 2.5);

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < total; i++) {
            const colIdx = i % cols;
            const rowIdx = (i / cols) | 0;
            const xPx = this.toPx(singleBorderWidth + (singleBorderWidth + width) * colIdx);
            const yPx = this.toPx(singleBorderHeight + (singleBorderHeight + height) * rowIdx);

            const eleDiv = document.createElement("div");
            eleDiv.className = "tile";
            eleDiv.style.width = widthPx;
            eleDiv.style.height = heightPx;
            eleDiv.style.backgroundColor = ColorPan.Default;
            eleDiv.style.borderRadius = radiusPx;
            eleDiv.style.position = "absolute";
            eleDiv.style.lineHeight = heightPx;
            eleDiv.style.textAlign = "center";
            eleDiv.style.left = xPx;
            eleDiv.style.top = yPx;

            const a = document.createElement("a");
            a.style.fontSize = fontSizePx;
            eleDiv.appendChild(a);

            this.tileElements.push(eleDiv);
            this.textElements.push(a);
            fragment.appendChild(eleDiv);
        }

        this.divCanvas.appendChild(fragment);
    }

    public draw(records: TileInfo[]): void {
        const emojiMode = Option.emojiMode;
        for (let i = 0; i < records.length; i++) {
            const val = records[i].value;
            if (this.prevValues[i] !== val) {
                this.prevValues[i] = val;
                this.tileElements[i].style.backgroundColor = getTileColor(val);
                this.textElements[i].textContent = emojiMode ? value2emoji(val) : val.toString();
            }
        }
    }

    public move(event: KeyboardEvent): void {
        const keyCode = event.keyCode as System.Direction;
        if (
            keyCode !== System.Direction.Left &&
            keyCode !== System.Direction.Up &&
            keyCode !== System.Direction.Right &&
            keyCode !== System.Direction.Down
        ) {
            return;
        }

        if (!GCC.user.inputable) {
            return;
        }

        const preRoundData = GCC.curRecord().value;
        const newData = combineTiles(
            preRoundData,
            GCC.tableSize.rows,
            GCC.tableSize.columns,
            keyCode
        );

        const data = aid(newData, Option.tilesCountBouns);
        GCC.addRecord({ value: data, direction: keyCode });
        Aud.play();
        this.draw(data);
    }
}
