/**
 * 庄闲问路
 */
module bjle {
	export class BjlLd6Panel extends eui.Component {
		private zitem1: eui.Image;
		private xitem1: eui.Image;
		public constructor() {
			super();
		}
		public createChildren() {
			super.createChildren();

		}

		private newList = [];
		public testNums(num, num2, num1) {
			//数据格式定义：1庄赢，2庄对，3闲对 ，4庄闲对；
			//				5闲赢，6庄对，7闲对，8庄闲对；
			//             9和局 ，10庄对，11闲对，12庄闲对。
			num.push(num2);
			let newList = bjle.BaseBjlLd.changVlue(num.concat(this.newList));
			let lists = bjle.BaseBjlLd.arryIntoArry(newList);
			if (lists.length < 5) {
				return;
			}
			let ResultArray = lists.concat([]);
			for (let i = 0; i < ResultArray.length; i++) {
				let list = ResultArray[i];
				bjle.BaseBjlLd.removeArryByValue(list);
			}

			// let arry: any[];
			// if (ResultArray.length <= 24) {
			// 	arry = bjle.BaseBjlLd.initQizi_dyxyjy(ResultArray, num1);
			// } else {
			// 	let nums = ResultArray.splice(-24);
			// 	arry = bjle.BaseBjlLd.initQizi_dyxyjy(ResultArray, num1);
			// }
			// let arry1 = bjle.BaseBjlLd.arryIntoArry(arry);
			// return arry1;

			let arry = bjle.BaseBjlLd.initQizi_dyxyjy(ResultArray, num1);
			let arry1 = bjle.BaseBjlLd.arryIntoArry(arry);
			if (ResultArray.length <= 24) {
				return arry1;
			} else {
				let index = 0;
				let nums = arry1.splice(-24);
				return nums;
			}
		}

		/**
		 * 庄赢情况呢
		 */
		public zhangWin(num) {
			let arry = this.testNums(num, 1, 3);
			let arry1 = this.testNums(num, 1, 4);
			let arry2 = this.testNums(num, 1, 5);
			console.log(arry); console.log(arry1); console.log(arry2);
			this.zhangWin1(arry, 1, 3);
			this.zhangWin1(arry1, 2, 4);
			this.zhangWin1(arry2, 3, 5);
		}

		/**
		 * 闲赢情况呢
		 */
		public xianWin(num) {
			let arry = this.testNums(num, 2, 3);
			let arry1 = this.testNums(num, 2, 4);
			let arry2 = this.testNums(num, 2, 5);
			console.log(arry); console.log(arry1); console.log(arry2);
			this.xianWin1(arry, 1, 3);
			this.xianWin1(arry1, 2, 4);
			this.xianWin1(arry2, 3, 5);
		}

		private zhangWin1(arry, index, index1) {
			if (!arry) {
				return;
			}
			if (arry.length == 0) {
				return;
			}
			let a1 = arry[arry.length - 1];
			let num = a1[a1.length - 1];
			switch (index1) {
				case 3:
					if (num == 1) {
						this["zitem" + index].source = RES.getRes("bjl_red_big_quan_png")
					} else {
						this["zitem" + index].source = RES.getRes("bjl_blue_big_quan_png")
					}
					break;
				case 4:
					if (num == 1) {
						this["zitem" + index].source = RES.getRes("bjl_red_big_dian_png")
					} else {
						this["zitem" + index].source = RES.getRes("bjl_blue_big_dian_png")
					}
					break;
				case 5:
					if (num == 1) {
						this["zitem" + index].source = RES.getRes("bjl_red_xie_png")
					} else {
						this["zitem" + index].source = RES.getRes("bjl_blue_xie_png")
					}
					break;
			}
		}

		private xianWin1(arry, index, index1) {
			if (!arry) {
				return;
			}
			let a1 = arry[arry.length - 1];
			let num = a1[a1.length - 1];
			switch (index1) {
				case 3:
					if (num == 1) {
						this["xitem" + index].source = RES.getRes("bjl_red_big_quan_png")
					} else {
						this["xitem" + index].source = RES.getRes("bjl_blue_big_quan_png")
					}
					break;
				case 4:
					if (num == 1) {
						this["xitem" + index].source = RES.getRes("bjl_red_big_dian_png")
					} else {
						this["xitem" + index].source = RES.getRes("bjl_blue_big_dian_png")
					}
					break;
				case 5:
					if (num == 1) {
						this["xitem" + index].source = RES.getRes("bjl_red_xie_png")
					} else {
						this["xitem" + index].source = RES.getRes("bjl_blue_xie_png")
					}
					break;
			}
		}
	}
}