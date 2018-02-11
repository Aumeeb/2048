import { Tile } from "./index";
import * as  System from "./gameEnum";
import { create } from "domain";

export function randomNum(n: number): number {
    return Math.floor(Math.random() * n);
}
export function randomRGB(): string {
    let Max = 2 << 7 - 1;
    let R = randomNum(Max);
    let G = randomNum(Max);
    let B = randomNum(Max);
    return `RGB(${R},${G},${B})`;
}
export function convert1Dto2D(cur: number[], rows: number): number[][] {
    let table = new Array<Array<number>>(rows);

    let array: number[] = [];
    for (let i = 0, k = -1; i < cur.length; i++) {
        if (i % rows == 0) {
            array = [];
            k++
        }
        array.push(cur[i]);
        table[k] = array;
    }
    return table
}
export function convert2DTo1D(cur: number[][]): number[] {

    var rows = cur.length;
    var cols = cur[0].length
    var result: number[] = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cur[i].length; j++) {
            result.push(cur[i][j]);
        }
    }
    return result;
}
export function combinationTiles(tileSquare: Tile[][], dir: System.Direction): Tile[][] {

    if (dir == System.Direction.Right) {
        tileSquare.forEach(tileArray => {
            let isNotComputed = true
            //实现思路 从每一个行最右边依次向最左边拿"元素" 每个拿到的元素会和它自身右边的元素相乘
            for (let i = tileArray.length - 2; i >= 0; i--) {
                //如果元素自身是空 就不管它
                if (tileArray[i].value == 0)
                    continue;

                //元素自动向右移动 直到最右边为止
                let tileIndex = i
                while (tileArray[tileIndex + 1].value == 0 && tileIndex < tileArray.length) {
                    tileArray[tileIndex + 1].value = tileArray[tileIndex].value
                    tileArray[tileIndex].value = 0;
                    tileIndex++
                    if (tileIndex == tileArray.length - 1)
                        break;
                }

                //如果当前的元素和它右边相邻的元素一样 就可以相乘
                if (isNotComputed) {
                    if (tileArray[i].value == tileArray[i + 1].value) {
                        tileArray[i + 1].value **= 2
                        tileArray[i].value = 0
                    }
                    isNotComputed = false
                }

            }
        })
    }
    return tileSquare
}

export function combinationTiles2(table: number[][], dir: System.Direction): number[][] {

    if (dir == System.Direction.Right) {
        table.forEach(tileArray => {
            let isNotComputed = true
            // 每一行最右边依次向最左边拿"元素" 
            // 每个拿到的元素会和它自身右边的元素相乘
            var trueDataCache: number[] = [];
            var clacCache: number[] = [];
            for (let i = tileArray.length - 2; i >= 0; i--) {
                //如果元素自身是空，就进入下一轮循环
                if (tileArray[i] == 0)
                    continue;

                //元素自动向右移动 直到最右边为止
                let tileIndex = i
                let right = 1;
                while (tileArray[tileIndex + right] == 0 && tileIndex < tileArray.length) {
                    tileArray[tileIndex + right] = tileArray[tileIndex]
                    tileArray[tileIndex] = 0;
                    tileIndex++
                    if (tileIndex == tileArray.length - 1)
                        break;
                }
                //如果當前的元素和右邊的一樣,計算後的結果保存到緩衝區,之後將2個元素清零0;

                if (tileArray[tileIndex] == tileArray[tileIndex + right]) {
                    clacCache.push(tileArray[tileIndex] ** 2)
                    tileArray[tileIndex + right] = 0;
                    tileArray[tileIndex] = 0
                }

            }
        })
        return table
    }
    if (dir == System.Direction.Left) {
        table.forEach(tileArray => {
            let isNotComputed = true
            //实现思路 从每一个行最右边依次向最左边拿"元素" 每个拿到的元素会和它自身右边的元素相乘
            // i=1 表示从左边第二个元素开始
            for (let i = 1; i <= tileArray.length - 1; i++) {
                //如果元素自身是空 就不管它
                if (tileArray[i] == 0)
                    continue;
                // 明天在写
                //元素自动向左移动 直到最左边为止
                let tileIndex = i
                while (tileArray[tileIndex + 1] == 0 && tileIndex < tileArray.length) {
                    tileArray[tileIndex + 1] = tileArray[tileIndex]
                    tileArray[tileIndex] = 0;
                    tileIndex++
                    if (tileIndex == tileArray.length - 1)
                        break;
                }
                //如果当前的元素和它右边相邻的元素一样 就可以相乘
                if (isNotComputed) {
                    if (tileArray[i] == tileArray[i + 1]) {
                        tileArray[i + 1] **= 2
                        tileArray[i] = 0
                    }
                    isNotComputed = false
                }
            }
        })
        return table
    }

    return table;
}
/**创建初始数据 */
export function initCreateTiles(length: number, count: number, valuesRange: number[] = [2, 4]): number[] {
    let pushCount = 0
    let result: number[] = [];
    for (let i = 0; i < length; i++) {
        result.push(0)
    }
    while (pushCount < count) {
        var ranNum = randomNum(length)
        if (result[ranNum] == 0) {
            result[ranNum] = valuesRange[ranNum % valuesRange.length]
            pushCount++;
        }

    }
    return result;
}
export function initCreateTilesTest() {
    return [4, 4, 0, 0, 2, 0, 4, 4, 2, 2, 2, 2, 4, 2, 4, 4];
}

