import * as System from "./types";

export const Option = {
    emojiMode: true,
    animation: false,
    /**元素id */
    canvasId: 'd',
    /**初始化方塊取值範圍 */
    initTileValueRange: [2, 4, 8, 16, 32, 64, 128, 256],
    /**初始化方塊的數量 */
    initTileCount: 1,
    emoji: {
        default: `❓`,
        piggy: `🐷`,
        monkey: `🐵`,
        tiger: `🐯`,
        dog: `🐶`,
        mouse: `🐭`,
        caty: ` 🐱`,
        Monocerus: `🦄`,
        bee: `🐝`,
        snake: `🐍`,
        panda: `🐼`,
    },
    /**再下一回合會獎勵方塊的數量 */
    tilesCountBouns: 1,
    /**畫佈的大小 */
    resolution: { w: 1200, h: 1200 },

    diff: System.Difficult.Normal,
};
