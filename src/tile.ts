import { GCC } from ".";
export class Tile {
    own: HTMLDivElement = document.createElement('div'); //初始化
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