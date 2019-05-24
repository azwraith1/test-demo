/**
 * 大路
 */
module bjle {
	export class BjlLd2Panel extends eui.Component {
		private item1: BjlDLItem;
		public constructor() {
			super();
		}
		public createChildren() {
			super.createChildren();

		}

		private newList = [];
		public testNums(num) {
			let index = 1;
			//数据格式定义：1庄赢，2庄对，3闲对 ，4庄闲对；
			//				5闲赢，6庄对，7闲对，8庄闲对；
			//             9和局 ，10庄对，11闲对，12庄闲对。
			let dataArr1 = [9,9,9,9, 1, 1, 1, 1, 1, 1, 5,
				1, 5, 1, 9, 1, 1, 1, 1, 5, 5, 9, 5, 1,
				5, 1, 5, 5, 1, 1, 1, 5, 1, 1, 5, 5, 1,
				1, 5, 9, 1, 1, 1, 1, 5, 1, 5, 1, 1];
			//数据处理
			let dataArr = num.concat([]);
			let newList = bjle.BaseBjlLd.changVlue(dataArr);
			let lists = bjle.BaseBjlLd.arryIntoArry(newList);
			let arry: any[];
			if (lists.length <= 24) {
				this.initQizi(lists);
			} else {
				let index = 0;
				let nums = lists.splice(-24);
				let num = nums[nums.length - 1];
				if (num.length > 6) {
					index = num.length - 6;
				}
				let nums1 = nums.splice((-24 + index));
				this.initQizi(nums1);
			}
		}

		/**
		 * 初始化棋子，并装入到对应的组里面。
		 */
		private tesu9 = 0;
		private maxLie = 0;
		private startLength = 1;//第几列
		private MaxLength = 6;//每列最大长度
		private index = 0;
		private idx = 1;
		private initQizi(arryList) {
			if (!arryList || arryList.length == 0) {
				return;
			}
			this.chushihua();
			let islock = true;
			for (let i = 0; i < arryList.length; i++) {
				if (i >= 24) {
					return;
				}
				islock = true;
				this.startLength = i + 1;
				this.index = 0;
				let list = arryList[i];
				for (let j = 0; j < list.length; j++) {
					let qizi = new BJLResult1();
					if (this.maxLie <= i) {
						this.MaxLength = 6;
					}
					if (this.index >= this.MaxLength) {
						console.log("p2p" + this.MaxLength + "p2p" + this.index);
						if (this.MaxLength < 2) {
							return;
						}
						if (islock) {
							this.MaxLength--;
							islock = false;
						}
						qizi.initNums(list[j], 2);
						if (list[j] == 9) {
							this.startLength;
						} else {
							this.startLength++;
						}
						this["item" + this.startLength].setPosition(qizi, this.MaxLength + 1);
						this["item" + this.startLength].addChild(qizi);
						if (this.startLength > this.maxLie) {
							this.maxLie = this.startLength;
						}
						console.log(this.startLength);
						this.index++;
					} else {
						if (list[j] == 9) {
							if (j == 0) {
								this["item" + (i + 1)].setPosition(qizi, 1);
								this.tesu9 = 1;
							} else {
								if (list[j - 1] == 9) {
									this["item" + (i + 1)].setPosition(qizi, this.tesu9);
								} else {
									this.index;
									this.tesu9 = this.index;
									this["item" + (i + 1)].setPosition(qizi, this.index);
								}
							}
							qizi.initNums(list[j], 2);
						} else {
							this.index++;
							// if (list[j - 1] == 9) {
							// 	if (this.index == 0) {
							// 		this.index = 1;
							// 	}
							// 	this.index
							// } else {

							// }
							qizi.initNums(list[j], 2);
							this["item" + (i + 1)].setPosition(qizi, this.index);
						}

						this["item" + (i + 1)].addChild(qizi);
					}
				}
			}
		}
		private chushihua() {
			this.MaxLength = 6;
			for (let i = 0; i < 24; i++) {
				this["item" + (i + 1)].removeChildren();
			}
		}
	}
}