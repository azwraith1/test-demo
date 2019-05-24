module bjle {
	export class BaseBjlLd {
		/**
	 * 数组装数组
	 */
		public static arryIntoArry(dataArr: number[]) {
			let index = -1;
			let lastValue = 0;
			let arry9 = [];
			let dataResult = [];
			if (dataArr.length == 0) {
				return;
			}
			while (dataArr[0] == 9) {
				arry9.push(dataArr.shift());
			}
			while (dataArr.length > 0) {
				if (!dataResult[index] && index > -1) {
					dataResult[index] = [];
				}
				let value = dataArr.shift();
				if (lastValue == value || value == 9) {
					dataResult[index].push(value);
				} else {
					index++;
					if (!dataResult[index]) {
						//如果dataResult[index]不存在，那个将把这个dataResult[index]初始化成一个数组。
						dataResult[index] = [];
					}
					dataResult[index].push(value)
					lastValue = value;
				}
			}
			while (arry9.length > 0) {
				dataResult[0].unshift(arry9.pop());
			}
			return dataResult;
		}

		/**
		 * 删除指定元素。
		 */
		public static removeArryByValue(arr: any[]) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i] == 9) {
					arr.splice(i, 1);
				}
			}
		};

		/**
		 * 修改数据
		 */
		public static changVlue(newList) {
			for (let i = 0; i < newList.length; i++) {
				if (newList[i] < 5) {
					newList[i] = 1;
				} else if (newList[i] < 9 && newList[i] >= 5) {
					newList[i] = 5;
				} else {
					newList[i] = 9;
				}
			}
			return newList;
		}

		/**
		 * 绘制成大眼路,小眼路，甲由路要的格式。
		 */
		public static dylArrays = [];
		public static initQizi_dyxyjy(arryList: any[], gameType) {
			if (!arryList || arryList.length == 0) {
				return;
			}
			for (let i = 0; i < arryList.length; i++) {
				if (arryList.length <= 2) {
					if (arryList.length < 2) {
						return;
					}
					if (!arryList[1]) {
						return;
					}
				}
				if (i > (gameType - 3)) {
					let list = arryList[i - (gameType - 2)];
					let qizi = new BJLResult1();
					if (i == (gameType - 2)) {
						if (arryList[i].length > 1) {
							//length大于1，2个或者两个以上的元素的比较情况，这时候比较i-1对应list的j号与j-1号位元素。
							for (let j = 1; j < arryList[i].length; j++) {
								//从数组的第二个函数开始判断。
								if (list[j] == list[j - 1]) {
									this.dylArrays.push(1);
								} else {
									this.dylArrays.push(2);
								}
							}
						}
					} else {
						if (arryList[i].length > 1) {
							//length大于1，2个或者两个以上的元素的比较情况，这时候比较i-1对应list的j号与j-1号位元素。
							for (let j = 0; j < arryList[i].length; j++) {
								if (j == 0) {
									if (arryList[i - 1].length == arryList[i - (gameType - 1)].length) {
										this.dylArrays.push(1);
									} else {
										this.dylArrays.push(2);
									}
								} else {
									//从数组的第二个函数开始判断。
									if (list[j] == list[j - 1]) {
										this.dylArrays.push(1);
									} else {
										this.dylArrays.push(2);
									}
								}
							}
						} else {
							//length等于1情况，这时候比较i-1对应list与i-2对应list的长度。
							if (i >= (gameType - 1)) {
								if (arryList[i - 1].length == arryList[i - (gameType - 1)].length) {
									this.dylArrays.push(1);
								} else {
									this.dylArrays.push(2);
								}
							}
						}
					}
				}
			}
			return this.dylArrays;
		}
	}
}