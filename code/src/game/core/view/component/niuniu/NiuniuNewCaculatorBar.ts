module niuniu {
	export class NiuniuNewCaculatorBar extends game.BaseUI {


		private number0: eui.BitmapLabel;
		private number1: eui.BitmapLabel;
		private number2: eui.BitmapLabel;
		private number3: eui.BitmapLabel;
		public constructor() {
			super();
			this.skinName = new NiuniuNewCaculatorBarSkin();
		}

		public createChildren() {
			super.createChildren();
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.CACULATOR_VALUE, this.countResult, this);
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(EventNotify.CACULATOR_VALUE, this.countResult, this);
		}

		private countResult(e: egret.Event) {
			let resultArr = e.data;
			let sum = 0;
			for (let i = 0; i < 4; i++) {
				this['number' + i].text = "";
			}
			for (let i = 0; i < resultArr.length; i++) {
				let card = resultArr[i] as NiuniuCard;
				let value = card.value;
				if (value > 10) {
					value = 10;
				}
				sum += value;
				this['number' + i].text = value;
			}
			if (!sum) {
				this.number3.text = "";
			} else {
				// if (resultArr.length == 3) {
				this.number3.text = "" + sum;
				// }
			}
		}
	}
}