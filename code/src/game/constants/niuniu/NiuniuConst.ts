class NiuniuColor {
	// 特殊牌
	public static SPEC: number = 0;
	// 红桃
	public static HEART: number = 2;
	// 黑桃
	public static SPADE: number = 1;
	// 梅花
	public static CLUB: number = 3;
	// 方块
	public static DIAMOND: number = 4;   
}


class NiuniuPattern {
	// 无牛
	public static NN0: number = 0;
	// 牛一
	public static NN1: number = 1;
	// 牛2
	public static NN2: number = 2;
	// 牛3
	public static NN3: number = 3;
	// 牛4
	public static NN4: number = 4;
	// 牛5
	public static NN5: number = 5;
	// 牛6
	public static NN6: number = 6;
	// 牛7
	public static NN7: number = 7;
	// 牛8
	public static NN8: number = 8;
	// 牛9
	public static NN9: number = 9;
	// 牛牛
	public static NN_NIU: number = 10;
	// 4花牛
	public static NN_FOUR_FLOWER: number = 11;
	// 5花牛
	public static NN_FIVE_FLOWER: number = 12;
	// 炸弹牛
	public static NN_BOOM: number = 13;
	// 五小牛
	public static NN_FIVE_SMALL: number = 14;
};

class NiuniuStatus{
	public static running: number = 0;
	public static close: number = 1;

}

class NiuniuStep{
	public static FAPAI: number  = 3;
	public static QIANG_ZHUANG: number  = 4;
	public static ADDANTE: number  = 5;
	public static XUANPAI: number  = 6;
	public static KAIPAI: number  = 7;
	public static EMPTY: number = 8;
	public static CLOSE: number = 9;		
}


class NiuniuCode{
	public static IS_ADDANTED = -10304;
}