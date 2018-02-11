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
/**
 * 實現思路 
 * (1) 把每個行的空數據去除 ,保留不為0的數據.
 * (2) 兩兩比對 相同的話存入新的數組  
 * (3) 最後從新數組賦值給老數組 完成計算
 * @param table 
 * @param dir 
 */
export function combinationTiles2(table: number[][], dir: System.Direction, scoreBouns = 1): number[][] {

    var blankArr = createblankArray(table.length, table[0].length);
    if (dir == System.Direction.Right) {


        for (let t = 0; t < table.length; t++) {
            var tileRowArr = table[t];
            var blankRowArr = blankArr[t];

            // 每一行最右边依次向最左边拿"元素" 
            // 每个拿到的元素会和它自身右边的元素相乘
            var vaildDataCache: number[] = [];
            var clacCache: number[] = [];

            for (const tile of tileRowArr) {
                if (tile == 0)
                    continue;
                vaildDataCache.push(tile);
            }

            // 移動的齒輪
            //如果有效數據數組中的數據長度大於0,那麼就無限循環下去
            while (vaildDataCache.length != 0) {
                var targetIndex: number = vaildDataCache.length - 1
                if (vaildDataCache.length == 1) {
                    clacCache.push(vaildDataCache[targetIndex]);
                    vaildDataCache.pop();
                    break;
                }
                if (vaildDataCache.length >= 2) {
                    var targetLeftIndex: number = targetIndex - 1
                    if (vaildDataCache[targetLeftIndex] == vaildDataCache[targetIndex]) {
                        clacCache.push(vaildDataCache[targetLeftIndex] ** 2 * scoreBouns)
                        vaildDataCache.pop();
                        vaildDataCache.pop();
                        continue;
                    } else {
                        clacCache.push(vaildDataCache[targetIndex]);
                        vaildDataCache.pop();
                    }
                }
            }

            for (let i = blankRowArr.length - 1; i < blankRowArr.length; i--) {
                if (clacCache.length > 0) {
                    var cValue = clacCache.shift();
                    if (cValue != null) {
                        blankRowArr[i] = cValue
                    }
                } else
                    break;
            }

        }
        return blankArr
    }
    return blankArr;

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

export function createblankArray(rows: number, cols: number, defaultVallue = 0): number[][] {
    var arr2d = new Array<Array<number>>(rows);
    for (let i = 0; i < rows; i++) {
        arr2d[i] = [];
        for (let k = 0; k < rows; k++) {
            arr2d[i][k] = 0
        }
    }
    return arr2d;
}