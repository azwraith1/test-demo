/**
 * 小眼路
 */
module bjle {
	export class BjlLd4Panel extends eui.Component {
		private item1: BjlDXJYItem;
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
			let dataArr1 = [9, 9, 1, 1, 1, 1, 1, 1, 5,
				1, 5, 1, 9, 1, 1, 1, 1, 5, 5, 9, 5, 1,
				5, 1, 5, 5, 1, 1, 1, 5, 1, 1, 5, 5, 1,
				1, 5, 9, 1, 1, 1, 1, 5, 1, 5, 1, 1];



			let newList = bjle.BaseBjlLd.changVlue(num.concat(this.newList));
			let lists = bjle.BaseBjlLd.arryIntoArry(newList);
			if (lists.length <= 3) {
				if (lists[2]) {
					let list = lists[2];
					if (!list[1]) {
						return;
					}
				} else {
					return;
				}
			}
			let ResultArray = lists.concat([]);
			for (let i = 0; i < ResultArray.length; i++) {
				let list = ResultArray[i];
				bjle.BaseBjlLd.removeArryByValue(list);
			}

			let arry = bjle.BaseBjlLd.initQizi_dyxyjy(ResultArray, 3);
			let arry1 = bjle.BaseBjlLd.arryIntoArry(arry);
			if (ResultArray.length <= 24) {
				this.initQizi(arry1);
			} else {
				let index = 0;
				let nums = arry1.splice(-24);
				let num = nums[nums.length - 1];
				if (num.length > 6) {
					index = num.length - 6;
				}
				let nums1 = nums.splice((-24 + index));
				this.initQizi(nums1);
			}
		}









		private index = 0;
		private maxLie = 0;
		private startLength = 1;//第几列
		private MaxLength = 6;//每列最大长度
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
					qizi.width = qizi.height = 7;
					if (this.maxLie <= i) {
						this.MaxLength = 6;
					}
					if (this.index >= this.MaxLength) {
						console.log("p4p" + this.MaxLength + "p4p" + this.index);
						if (this.MaxLength < 2) {
							return;
						}
						if (islock) {
							this.MaxLength--;
							islock = false;
						}
						qizi.initNums(list[j], 4);
						this.startLength++;
						this["item" + this.startLength].setPosition(qizi, this.MaxLength + 1);
						this["item" + this.startLength].addChild(qizi);
						if (this.startLength > this.maxLie) {
							this.maxLie = this.startLength;
						}
						this.index++;
					} else {
						this.index++;
						qizi.initNums(list[j], 4);
						this["item" + (i + 1)].setPosition(qizi, this.index);
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