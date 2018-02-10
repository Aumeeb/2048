import { Tile } from "./index";
import * as  System from "./gameEnum";

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
