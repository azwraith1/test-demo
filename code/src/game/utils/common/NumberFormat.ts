class NumberFormat {
	public static formatGold(gold, id?) {
		if (id == 1) {
			return Number(new Big(gold).round(2, 0));
		} else {
			gold = Number(new Big(gold).round(2, 0));
			if (gold < 10000) {
				return gold;
			}
			let baiWan = Math.floor(gold / 10000);
			let bai = Math.floor((gold % 10000) / 100);
			let baiStr = bai + "";
			if (bai < 10) {
				baiStr = "0" + baiStr;
			}
			let str = baiWan + "." + baiStr + "万";
			return str;
		}

	}

	public static formatGold_scence(gold, id?) {
		if (id == 1) {
			return Number(new Big(gold).round(2, 0));
		} else {
			gold = Number(new Big(gold).round(2, 0));
			if (gold < 10000) {
				return gold;
			}
			let baiWan = Math.floor(gold / 10000);
			let bai = Math.floor((gold % 10000) / 100);
			let baiStr = bai + "";
			if (bai < 10) {
				baiStr = "0" + baiStr;
			}
			let str = baiWan + "." + baiStr + "万";
			return str;
		}
	}

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

	/**
	 * 拆分分数
	 */
	public static chaifenScore(arrList, value: number) {
		let scores = _.clone(arrList);
		let chujinScore;
		let jishu;
		if (value % arrList[0] != 0) {
			for (let i = 0; i < scores.length; i++) {
				if (scores[i] % arrList[0] != 0) {
					jishu = scores[i];
					value -= jishu;
					break;
				}
			}
		}

		for (let i = 0; i < scores.length; i++) {
			if (value % scores[i] == 0) {
				chujinScore = scores[i];
				break;
			}
		}
		if (!chujinScore) {
			console.log("分数不合法");
			return;
		}
		let numbers = {};
		let scoreFunc = (lastScore) => {
			let max = Math.floor(value / lastScore);
			if (max > 0) {
				let use = Math.floor(_.random(Math.ceil(max / 2), max));
				if (lastScore == chujinScore) {
					use = max;
					let total = use * lastScore;
					numbers[lastScore] = use;
					value -= total;
				} else {
					let total = use * lastScore;
					if ((value - total) % chujinScore == 0) {
						numbers[lastScore] = use;
						value -= total;
					}
				}
			}
		}
		while (scores.length > 0) {
			let lastScore = scores.pop();
			scoreFunc(lastScore);
		}
		if (jishu) {
			if (!numbers[jishu]) {
				numbers[jishu] = 1
			} else {
				numbers[jishu]++;
			}
		}
		return numbers;
	}

	/**
     * 浮点数保留指定位数，不四舍五入
     * @param x
     * @param precision
     * @returns {number}
     */
	public static handleFloatDecimal(x, precision = 2) {
		return Number(new Big(x).round(precision, 0));
	}

	


	public static toNonExponential(num) {
		//处理非数字
		if (isNaN(num)) { return num; }

		//处理不需要转换的数字
		let str = '' + num;
		if (!/e/i.test(str)) { return num; }

		return (num).toFixed(18).replace(/\.?0+$/, "");
	}

	public static handleFloatDecimalStr(x, precision = 2) {
		let s_x = this.toNonExponential(x);
		s_x = s_x.toString();
		let pos_decimal = s_x.indexOf('.');
		if (pos_decimal < 0) {
			return s_x;
		}
		if (pos_decimal < 0) {
			pos_decimal = s_x.length;
			s_x += '.';
		} else {
			s_x = s_x.substring(0, pos_decimal + 1 + precision);
		}

		while (s_x.length <= pos_decimal + precision) {
			s_x += '0';
		}

		if (s_x == 0) {
			s_x = '0.';
			let pos_decimal = s_x.indexOf('.');
			while (s_x.length <= pos_decimal + precision) {
				s_x += '0';
			}
		}

		return s_x;
	}
}