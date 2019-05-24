class NiuniuUtils {
	public constructor() {
	}

	public static getNumberSum(numbers: number[]) {
		let sum = 0;
		for (let i = 0; i < numbers.length; i++) {
			let num = numbers[i] % 100;
			if (num > 10) {
				num = 10;
			}
			sum += num;
		}
		return sum;
	}


	/**
	 * 根据自己的位子获取方位
	 * @param  {number} mineIndex
	 */
	public static getDirectionByMine(mineIndex: number, playerLength: number) {
		let directionTrue: any = {};
		let dirArr = [];
		for (let i = mineIndex; i <= playerLength; i++) {
			dirArr.push(i);
		}

		for (let i = 1; i < mineIndex; i++) {
			dirArr.push(i);
		}

		for (let i = 0; i < dirArr.length; i++) {
			let data = dirArr[i];
			directionTrue[data] = (i + 1) + "";
		}
		return directionTrue;
	}

	public static getNNSort(dealer: number, playerLength) {
		let dirArr = [];
		for (let i = dealer + 1; i <= playerLength; i++) {
			dirArr.push(i);
		}

		for (let i = 1; i < dealer; i++) {
			dirArr.push(i);
		}

		dirArr.push(dealer);
		return dirArr;
	}


	//------------------- 声音控制方法----------------------------------------------------


	/**
	 * 播放出牌的声音。
	 * sex性别，value打的牌面值。
	 */
	public static playShowNiu(sex, value) {
		let playerSound = sex == 1 ? "malecow_" : "femalecow_";
		let sound = playerSound + value + "_mp3";
		SoundManager.getInstance().playEffect(sound);
	}

	/**
 * 飞金币
 */
	public static playFjb() {
		SoundManager.getInstance().playEffect("nns_fjb_mp3");
	}

	/**
	 * 定庄
	 */
	public static playDz() {
		SoundManager.getInstance().playEffect("nns_dz_mp3");
	}

	/**
	 * 选牌
	 */
	public static playClick() {
		SoundManager.getInstance().playEffect("nns_xuanpai_mp3");
	}

	/**
	 * 显示赢
	 */
	public static showWin() {
		SoundManager.getInstance().playEffect("nns_win_mp3");
	}
	/**
	 * 发牌
	 */
	public static fapai() {
		SoundManager.getInstance().playEffect("nns_fapai_mp3");
	}
}