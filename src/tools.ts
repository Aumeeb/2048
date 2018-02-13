import { Tile, TileInfo } from "./types";
import * as  System from "./gameEnum";
import { create } from "domain";
import { Festival } from "./festival";

export function randomNum(n: number): number {
    return Math.floor(Math.random() * n);
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

export function combinationTilesLR(table: TileInfo[][], dir: System.Direction, scoreBouns = 1): TileInfo[][] {

    var blankArr = createBlank2DArray(table.length, table[0].length);

    /**有效行 */
    const vaildRow = (cache: TileInfo[]) => {
        for (const tile of tileRowArr) {
            if (tile.value == 0)
                continue;
            cache.push(tile);
        }
    }
    //如果是右鍵
    if (dir == System.Direction.Right) {

        var vaildDataCache: TileInfo[] = []; //有效數據值
        var finalCache: TileInfo[] = []; //計算後的值
        for (let t = 0; t < table.length; t++) {
            var tileRowArr = table[t];
            var blankRowArr = blankArr[t];

            vaildRow(vaildDataCache);

            //如果有效數據數組中的數據長度大於0,那麼就無限循環下去
            while (vaildDataCache.length != 0) {
                var targetIndex: number = vaildDataCache.length - 1 //從右開始
                if (vaildDataCache.length == 1) {
                    finalCache.push(vaildDataCache[targetIndex]);
                    vaildDataCache.pop();
                    break;
                }
                if (vaildDataCache.length >= 2) {
                    var targetRightIndex: number = targetIndex - 1
                    if (vaildDataCache[targetRightIndex] == vaildDataCache[targetIndex]) {

                        var target = vaildDataCache[targetRightIndex];
                        target.value = target.value * target.value * Festival.bouns(target.value);
                        finalCache.push(target)

                        vaildDataCache.pop();
                        vaildDataCache.pop();

                        continue;
                    } else {
                        finalCache.push(vaildDataCache[targetIndex]);
                        vaildDataCache.pop();
                    }
                }
            }
            for (let i = blankRowArr.length - 1; i < blankRowArr.length; i--) {
                if (finalCache.length > 0) {
                    var cValue = finalCache.shift();
                    if (cValue != null) {
                        blankRowArr[i] = cValue
                    }
                } else
                    break;
            }

        }
        return blankArr
    }
    //如果是左鍵
    if (dir == System.Direction.Left) {
        var vaildDataCache: TileInfo[] = []; //有效數據值
        var finalCache: TileInfo[] = []; //計算後的值
        for (let t = 0; t < table.length; t++) {
            var tileRowArr = table[t];
            var blankRowArr = blankArr[t];

            vaildRow(vaildDataCache);


            //如果有效數據數組中的數據長度大於0,那麼就無限循環下去
            while (vaildDataCache.length != 0) {
                var targetIndex: number = 0;  //從左開始
                if (vaildDataCache.length == 1) {
                    finalCache.push(vaildDataCache[targetIndex]);
                    vaildDataCache.shift();
                    break;
                }
                if (vaildDataCache.length >= 2) {
                    var targetRightIndex: number = targetIndex + 1
                    if (vaildDataCache[targetRightIndex] == vaildDataCache[targetIndex]) {

                        var target = vaildDataCache[targetRightIndex];
                        target.value = target.value * target.value * Festival.bouns(target.value);
                        finalCache.push(target)

                        vaildDataCache.shift();
                        vaildDataCache.shift();

                        continue;
                    } else {
                        finalCache.push(vaildDataCache[targetIndex]);
                        vaildDataCache.shift();
                    }
                }
            }
            for (let i = 0; i < blankRowArr.length; i++) {
                if (finalCache.length > 0) {
                    var cValue = finalCache.shift();
                    if (cValue != null) {
                        blankRowArr[i] = cValue
                    }
                } else
                    break;
            }
        }
    }
    return blankArr;

}
export function combinationTilesTB(table: TileInfo[][], dir: System.Direction, scoreBouns = 1): TileInfo[][] {
    var blankArr = createBlank2DArray(table.length, table[0].length);

    const colsLength = table[0].length

    const vaildCol = (colIndex: number, cache: TileInfo[]) => {
        for (let i = 0; i < colsLength; i++) {
            var tile = table[i][colIndex];

            if (tile.value == 0)
                continue;

            cache.push(tile);
        }
    }
    if (dir == System.Direction.Up) {

        for (let c = 0; c < colsLength; c++) {

            var vaildDataCache: TileInfo[] = []; //有效數據值
            var finalCache: TileInfo[] = []; //計算後的值
            var blankRowArr = blankArr[c];

            // 每一行最右边依次向最左边拿"元素" 
            // 每个拿到的元素会和它自身右边的元素相乘
            vaildCol(c, vaildDataCache);
            var floor = 0;
            //如果有效數據數組中的數據長度大於0,那麼就無限循環下去
            while (vaildDataCache.length != 0) {
                var targetIndex: number = 0;  //從左開始
                if (vaildDataCache.length == 1) {
                    finalCache.push(vaildDataCache[targetIndex]);
                    vaildDataCache.shift();
                    break;
                }
                if (vaildDataCache.length >= 2) {
                    var targetRightIndex: number = targetIndex + 1
                    if (vaildDataCache[targetRightIndex] == vaildDataCache[targetIndex]) {


                        var target = vaildDataCache[targetRightIndex];
                        target.value = target.value * target.value * Festival.bouns(target.value);
                        finalCache.push(target)

                        vaildDataCache.shift();
                        vaildDataCache.shift();

                        continue;
                    } else {
                        finalCache.push(vaildDataCache[targetIndex]);
                        vaildDataCache.shift();
                    }
                }
            }
            for (let i = 0; i < finalCache.length; i++) {
                blankArr[i][c] = finalCache[i]
            }
        }
        return blankArr
    }

    if (dir == System.Direction.Down) {
        for (let c = 0; c < colsLength; c++) {

            var vaildDataCache: TileInfo[] = []; //有效數據值
            var finalCache: TileInfo[] = []; //計算後的值
            var blankRowArr = blankArr[c];

            // 每一行最右边依次向最左边拿"元素" 
            // 每个拿到的元素会和它自身右边的元素相乘
            vaildCol(c, vaildDataCache);
            var floor = 0;
            //如果有效數據數組中的數據長度大於0,那麼就無限循環下去
            while (vaildDataCache.length != 0) {
                var targetIndex: number = vaildDataCache.length - 1 //從右開始
                if (vaildDataCache.length == 1) {
                    finalCache.push(vaildDataCache[targetIndex]);
                    vaildDataCache.pop();
                    break;
                }
                if (vaildDataCache.length >= 2) {
                    var targetRightIndex: number = targetIndex - 1
                    if (vaildDataCache[targetRightIndex] == vaildDataCache[targetIndex]) {

                        var target = vaildDataCache[targetRightIndex];
                        target.value = target.value * target.value * Festival.bouns(target.value);
                        finalCache.push(target)

                        vaildDataCache.pop();
                        vaildDataCache.pop();

                        continue;
                    } else {
                        finalCache.push(vaildDataCache[targetIndex]);
                        vaildDataCache.pop();
                    }
                }
            }

            for (let i = colsLength - 1; i < colsLength; i--) {
                if (finalCache.length > 0) {
                    var cValue = finalCache.pop();
                    if (cValue != null) {
                        blankArr[i][c] = cValue
                    }
                } else
                    break;
            }
        }
        return blankArr
    }
    return table;
}

export function initCreateTiles(length: number, count: number, valuesRange: number[] = [2, 4]): TileInfo[] {
    if (count > length)
        count = length;

    let pushCount = 0
    let result: TileInfo[] = [];
    for (let i = 0; i < length; i++) {
        result.push({ index: i, value: 0, isAid: true })
    }
    while (pushCount < count) {
        var ranNum = randomNum(length)
        if (result[ranNum].value == 0) {
            result[ranNum].value = valuesRange[ranNum % valuesRange.length]
            pushCount++;
        }
    }
    return result;
}
export function aid() {

}
export function initCreateTilesTest() {
    return [4, 4, 4, 0, 2, 2, 4, 4, 2, 2, 2, 2, 4, 2, 4, 4];
}
export function createBlank2DArray(rows: number, cols: number, defaultVallue = 0): TileInfo[][] {
    var arr2d = new Array<Array<TileInfo>>(rows);
    for (let i = 0; i < rows; i++) {
        arr2d[i] = new Array<TileInfo>(cols);
        for (let k = 0; k < rows; k++) {
            arr2d[i][k] = Object.create(null) 
            arr2d[i][k].value = 0
        }
    }
    return arr2d;
}