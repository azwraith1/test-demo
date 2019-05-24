class NumberFormat {
	public static getNNTimeStr(time) {
		let time1 = Math.ceil(time / 1000);
		if (time1 < 10) {
			if (time1 == 1) {
				return "0" + time1;
			}
			return "0" + time1;
		}
		if (time1 <= 0) {
			return "00";
		}

		return time1 + "";
	}


	public static getTimeStr(time) {
		let time1 = Math.ceil(time / 1000);
		if (time1 < 10) {
			if (time1 == 1) {
				return "0 " + time1;
			}
			return "0" + time1;
		}
		if (time1 <= 0) {
			return "00";
		}

		return time1 + "";
	}

	public static add(number1, number2) {
		return Number(new Big(number1).add(number2));
	}

	public static fNumber(number) {
		return Math.floor(Number(new Big(number).round(0, 0)));
	}

	public static fNumberStr(number) {
		return Number(new Big(number).round(0, 0)) + "";
	}

	public static fNumberBDZStr(number) {
		let str = "";
		let yuanGold = Math.floor(number / KOREA_GOLD.YUAN);
		if (yuanGold > 0) {
			str += yuanGold + "y";
		}
		let jiaoGold = Math.floor((number - yuanGold * KOREA_GOLD.YUAN) / KOREA_GOLD.JIAO);
		if (jiaoGold > 0) {
			str += jiaoGold + "f";
		} else {
			let fenGold = Math.floor(number - (jiaoGold * KOREA_GOLD.JIAO) - (yuanGold * KOREA_GOLD.YUAN));
			if (fenGold > 0) {
				str += fenGold;
			}
		}
		return str;
	}

	public static fNumberBDZStr2(number) {
		let str = "";
		let yuanGold = Math.floor(number / KOREA_GOLD.YUAN);
		if (yuanGold > 0) {
			str += yuanGold + "억";
		}
		let jiaoGold = Math.floor((number - yuanGold * KOREA_GOLD.YUAN) / KOREA_GOLD.JIAO);
		if (jiaoGold > 0) {
			str += jiaoGold + "만";
		} 
		let fenGold = Math.floor(number - (jiaoGold * KOREA_GOLD.JIAO) - (yuanGold * KOREA_GOLD.YUAN));
		if (fenGold > 0) {
			str += fenGold;
		}
		return str;
	}

	public static fNumberBDZStr3(number) {
		let str = "";
		let yuanGold = Math.floor(number / KOREA_GOLD.YUAN);
		let jiaoGold = Math.floor((number - yuanGold * KOREA_GOLD.YUAN) / KOREA_GOLD.JIAO);
		if (jiaoGold > 0) {
			str += jiaoGold + "j";
		} 
		let fenGold = Math.floor(number - (jiaoGold * KOREA_GOLD.JIAO) - (yuanGold * KOREA_GOLD.YUAN));
		if (fenGold > 0) {
			str += fenGold;
		}
		return str;
	}
}