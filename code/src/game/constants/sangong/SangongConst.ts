class SangongColor {
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
const SangongPattern = {
	SG0: 0,        // 0点
	SG1: 1,        // 1点
	SG2: 2,        // 2点
	SG3: 3,        // 3点
	SG4: 4,        // 4点
	SG5: 5,        // 5点
	SG6: 6,        // 6点
	SG7: 7,        // 7点
	SG8: 8,        // 8点
	SG9: 9,        // 9点
	THREE_GONG: 10, // 三公
	BIG_THREE_GONG: 11, // 大三公
	SUPREMACY: 12, // 至尊
};

//三公牌型倍数
const patternScore = {};
patternScore[SangongPattern.SG0] = 1;
patternScore[SangongPattern.SG1] = 1;
patternScore[SangongPattern.SG2] = 1;
patternScore[SangongPattern.SG3] = 1;
patternScore[SangongPattern.SG4] = 1;
patternScore[SangongPattern.SG5] = 1;
patternScore[SangongPattern.SG6] = 1;
patternScore[SangongPattern.SG7] = 2;
patternScore[SangongPattern.SG8] = 2;
patternScore[SangongPattern.SG9] = 2;
patternScore[SangongPattern.THREE_GONG] = 3;
patternScore[SangongPattern.BIG_THREE_GONG] = 4;
patternScore[SangongPattern.SUPREMACY] = 5;

class SangongStatus {
	public static running: number = 0;
	public static close: number = 1;

}

class SangongStep {
	public static FAPAI: number = 3;
	public static QIANG_ZHUANG: number = 4;
	public static ADDANTE: number = 5;
	public static XUANPAI: number = 6;
	public static KAIPAI: number = 7;
	public static EMPTY: number = 8;
	public static CLOSE: number = 9;
}


class SangongCode {
	public static IS_ADDANTED = -10304;
}