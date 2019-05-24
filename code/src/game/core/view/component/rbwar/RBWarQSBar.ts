module rbwar {
	export class RBWarQSBar extends eui.Component {
		private pointGroup: eui.Group;
		private textGroup: eui.Group;
		private qsBtn: eui.Button;
		public constructor() {
			super();
		}

		public createChildren() {
			super.createChildren();
			this.qsBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.qsBtnTouch, this);
		}

		public qsBtnTouch() {
			game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_RBWARZS);
		}

		public init() {
			for (let i = 0; i < this.pointGroup.numChildren; i++) {
				this.pointGroup.getChildAt(i).visible = false;
			}

			for (let i = 0; i < this.textGroup.numChildren; i++) {
				this.textGroup.getChildAt(i).visible = false;
			}
		}

		/**
		 * 更新趋势榜
		 */
		public update() {
			let roomInfo = Global.roomProxy.roomInfo as RBWRoomInfo;
			let report = roomInfo.lastRBReport;
			for (let i = 0; i < this.pointGroup.numChildren; i++) {
				let image = this.pointGroup.getChildAt(i) as eui.Image;
				let portIndex = report.length - 20 + i;
				let result = report[portIndex];
				if (result) {
					let text = result == 1 ? "rb_poing_red_png" : "rb_point_black_png";
					image.source = RES.getRes(text);
					image.visible = true
				} else {
					image.visible = false;
				}
			}
			let patterns: any = roomInfo.lastWinPattern;
			for (let i = 0; i < this.textGroup.numChildren; i++) {
				let image = this.textGroup.getChildAt(i) as RBWarQSText;
				let patternData = patterns[10 + i];

				let result = patterns[10 + i].pattern;
				if (result || result > -1) {
					if (patternData.pump == true) {
						//对7
						image.visible = true;
						image.changeTongsha();
					} else {
						image.visible = true;
						image.showText(RBW_PATTERN[result]);
						image.changeBg(patterns[10 + i].luckyWin);
					}
				} else {
					image.visible = false;
				}

			}
		}
	}
}