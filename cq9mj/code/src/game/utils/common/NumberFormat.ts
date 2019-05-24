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

	public static fNumber(number){
		return Number(new Big(number).round(2, 0).toFixed(2));
	}	
}