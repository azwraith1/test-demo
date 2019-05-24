/**
 * 珠盘路
 */
module bjle {
	export class BjlLd1Panel extends eui.Component {
		private rult: BJLResult;
		private zhupanlu: BjlZPLItem;
		private item1: BjlZPLItem;
		public constructor() {
			super();
		}
		public createChildren() {
			super.createChildren();

		}


		public testNums(num) {
			let index = 1;
			//数据格式定义：1庄赢，2庄对，3闲对 ，4庄闲对；
			//				5闲赢，6庄对，7闲对，8庄闲对；
			//             9和局 ，10庄对，11闲对，12庄闲对。
			let dataArr1 = [9, 9, 1, 1, 1, 1, 1, 1, 5,
				1, 5, 1, 9, 1, 1, 1, 1, 5, 5, 9, 5, 1,
				5, 1, 5, 5, 1, 1, 1, 5, 1, 1, 5, 5, 1,
				1, 5, 9, 1, 1, 1, 1, 5, 1, 5, 1, 1];
			let dataArr = num.concat([]);
			let leght = dataArr.length;
			if (leght <= 48) {
				this.initQizi(dataArr);
			} else {
				let nums = dataArr.splice(-48);
				this.initQizi(nums);
			}
		}

		/**
		 * 初始化棋子，并装入到对应的组里面。
		 */
		private initQizi(arryList) {
			this.chushihua();
			let index = 1;
			for (let i = 0; i < arryList.length; i++) {
				//创建棋子。
				let qizi = new BJLResult();
				qizi.initNums(arryList[i]);
				let point1 = i + 1;
				let point2 = (index - 1) * 6;
				this["item" + index].setPosition(qizi, point1 - point2);
				this["item" + index].addChild(qizi);
				if ((i + 1) % 6 == 0) {
					index++;
				}
			}
		}

		private chushihua() {
			for (let i = 0; i < 8; i++) {
				this["item" + (i + 1)].removeChildren();
			}
		}
	}
}