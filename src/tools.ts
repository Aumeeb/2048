import { TileInfo } from "./types";
import * as System from "./types";
import { Option } from "./option";

const EMOJI_MAP: Record<number, string> = {
    0: "",
    2: Option.emoji.dog,
    4: Option.emoji.monkey,
    8: Option.emoji.mouse,
    16: Option.emoji.piggy,
    32: Option.emoji.tiger,
    64: Option.emoji.caty,
    128: Option.emoji.Monocerus,
    256: Option.emoji.snake,
    512: Option.emoji.bee,
    1024: Option.emoji.panda,
};

export function value2emoji(score: number): string {
    return EMOJI_MAP[score] ?? Option.emoji.default;
}

export function randomNum(n: number): number {
    return (Math.random() * n) | 0;
}

export function randomRangeIndexs(count: number, maxRangeValue: number): number[] {
    if (count < 1) {
        throw new Error("參數錯誤 至少生成一個");
    }
    const targetCount = Math.min(count, maxRangeValue);
    const selected = new Set<number>();
    while (selected.size < targetCount) {
        selected.add(randomNum(maxRangeValue));
    }
    return Array.from(selected);
}

function createEmptyTile(index: number): TileInfo {
    return { index, value: 0, isAid: false, previousIndex: undefined, moveSteps: 0 };
}

/**
 * 實現思路 
 * (1) 把每個行/列的空數據去除 ,保留不為0的數據.
 * (2) 兩兩比對 相同的話存入新的數組  
 * (3) 最後從新數組賦值給老數組 完成計算
 */
function mergeLine(nonZero: TileInfo[]): TileInfo[] {
    const merged: TileInfo[] = [];
    for (let i = 0; i < nonZero.length; i++) {
        const current = nonZero[i];
        const next = nonZero[i + 1];
        if (next !== undefined && current.value === next.value) {
            next.value = next.value * next.value;
            merged.push(next);
            i++;
        } else {
            merged.push(current);
        }
    }
    return merged;
}

export function combineTiles(
    board: TileInfo[],
    rows: number,
    cols: number,
    dir: System.Direction
): TileInfo[] {
    const total = rows * cols;
    const result = new Array<TileInfo>(total);
    for (let i = 0; i < total; i++) {
        result[i] = createEmptyTile(i);
    }

    const isHorizontal = dir === System.Direction.Left || dir === System.Direction.Right;
    const isReverse = dir === System.Direction.Right || dir === System.Direction.Down;
    const outerLen = isHorizontal ? rows : cols;
    const innerLen = isHorizontal ? cols : rows;

    for (let outer = 0; outer < outerLen; outer++) {
        const nonZero: TileInfo[] = [];

        for (let step = 0; step < innerLen; step++) {
            const inner = isReverse ? innerLen - 1 - step : step;
            const idx = isHorizontal ? outer * cols + inner : inner * cols + outer;
            const tile = board[idx];
            if (tile.value !== 0) {
                nonZero.push({
                    ...tile,
                    previousIndex: tile.index,
                });
            }
        }

        const merged = mergeLine(nonZero);

        for (let step = 0; step < merged.length; step++) {
            const inner = isReverse ? innerLen - 1 - step : step;
            const idx = isHorizontal ? outer * cols + inner : inner * cols + outer;
            const tile = merged[step];
            tile.index = idx;
            tile.isAid = false;
            result[idx] = tile;
        }
    }

    return result;
}

/**初始化獎勵的方塊 */
export function initCreateTiles(length: number, count: number, valuesRange: number[] = [2, 4]): TileInfo[] {
    const targetCount = Math.min(count, length);
    const result = new Array<TileInfo>(length);
    for (let i = 0; i < length; i++) {
        result[i] = createEmptyTile(i);
    }

    const indices = randomRangeIndexs(targetCount, length);
    for (const idx of indices) {
        result[idx].value = valuesRange[idx % valuesRange.length];
    }
    return result;
}

/**額外獎勵方塊 */
export function aid(data: TileInfo[], count: number = 1): TileInfo[] {
    const emptySlots: TileInfo[] = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].value === 0) {
            emptySlots.push(data[i]);
        }
    }

    if (emptySlots.length === 0 || count < 1) {
        return data;
    }

    const validIndices = randomRangeIndexs(Math.min(count, emptySlots.length), emptySlots.length);
    for (const idx of validIndices) {
        const tile = emptySlots[idx];
        tile.value = Option.initTileValueRange[0];
        tile.isAid = true;
        tile.previousIndex = undefined;
    }
    return data;
}
