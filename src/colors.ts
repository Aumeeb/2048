export class ColorPan {
    public static readonly Lv1 = "#FFFFCC";
    public static readonly Lv2 = "#CCFFFF";
    public static readonly Lv3 = "#FFCCCC";
    public static readonly Lv4 = "#FFCC99";
    public static readonly Lv5 = "#CCFF99";
    public static readonly Lv6 = "#C8BFE7";
    public static readonly Lv7 = "#99CC99";
    public static readonly Lv8 = "#FFFFFF";
    public static readonly Lv9 = "#FFFF99";
    public static readonly Lv10 = "#CCCCFF";
    public static readonly Default = "#CCCCCC";
    public static readonly backgroundDivBig = "#b8ac9e";
    public static readonly backgroundDivSmall = "#d5cdc2";
}

const COLOR_MAP: Record<number, string> = {
    2: ColorPan.Lv1,
    4: ColorPan.Lv2,
    8: ColorPan.Lv3,
    16: ColorPan.Lv4,
    32: ColorPan.Lv5,
    64: ColorPan.Lv6,
    128: ColorPan.Lv7,
    256: ColorPan.Lv8,
    512: ColorPan.Lv9,
    1024: ColorPan.Lv10,
};

export function getTileColor(val: number): string {
    return COLOR_MAP[val] ?? ColorPan.Default;
}
