import * as System from "./types";
import { initCreateTiles } from "./tools";
import { Option } from "./option";
import { UserInterface } from "./render";
import { Size, Step } from "./types";

/** Game control center 游戏控制 ! */
export class GCC {
    /**画板 */
    static readonly canvas = document.getElementById(Option.canvasId) as HTMLDivElement;
    static readonly stage = document.body as HTMLBodyElement;
    /**画板上内边距 */
    static readonly canvasPaddingTop: number = 300;
    /**画板宽度 */
    static readonly canvasWidth: number = Option.resolution.w;
    /**画板高度 */
    static readonly canvasHeight: number = Option.resolution.h;
    /**动画持续时间 */
    static readonly animDuration: number = 100;
    /**棋盘格 */
    static readonly tableSize: Size = {
        rows: 0,
        columns: 0,
        count: () => GCC.tableSize.rows * GCC.tableSize.columns,
    };
    static readonly user = { inputable: true };
    static readonly history: Step[] = [];

    static curRecord(): Step {
        return GCC.history[GCC.history.length - 1];
    }

    static addRecord(record: Step): void {
        record.index = GCC.history.length;
        GCC.history.push(record);
    }
}

export class Main {
    ui: UserInterface;

    //开局生成随机多少个瓦片
    constructor(difficult: System.Difficult) {
        this.setDifficult(difficult);
        this.ui = new UserInterface(GCC.canvas);
        this.init();
        this.bindEvent();
    }

    bindEvent(): void {
        GCC.stage.onkeydown = (e) => {
            this.ui.move(e);
        };
    }

    setDifficult(diff: System.Difficult): void {
        const sideLenOfCell = 4;
        let finalSideLenOfCell = 4;

        switch (diff) {
            case System.Difficult.Kids:
                finalSideLenOfCell = 3;
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
            case System.Difficult.Abyss:
                finalSideLenOfCell = 88;
                break;
        }
        GCC.tableSize.rows = finalSideLenOfCell;
        GCC.tableSize.columns = finalSideLenOfCell;
    }

    init(): void {
        const initRecord = initCreateTiles(
            GCC.tableSize.count(),
            Option.initTileCount,
            Option.initTileValueRange
        );
        GCC.addRecord({ value: initRecord, direction: System.Direction.Nothing, index: 0 });
        this.ui.draw(GCC.curRecord().value);
    }
}
