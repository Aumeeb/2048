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