/*
 * @Author: he bing 
 * @Date: 2018-08-13 11:05:43 
 * @Last Modified by: he bing
 * @Last Modified time: 2018-09-25 17:26:39
 * @Description: 游戏记录
 */

module majiang {
	export class GameRecordPanel extends game.BaseComponent {
		private recordGroup: eui.Group;
		private closeBtn: eui.Button;
		public resizeGroup: eui.Group;
		private tishiyu: eui.Label;
		private rects: eui.Rect;
		private xzdd: eui.Image;
		private xlch: eui.Image;
		private rect_jt: eui.Image;
		private lable_one: eui.Label;
		private lable_two: eui.Label;
		private rect_bg: eui.Image;
		public constructor() {
			super();
			this.skinName = new GameRecordSkin();
		}

		protected createChildren() {
			super.createChildren();
			this.showGameByType("血流成河");
		}



		private showGameByType(txt) {
			if (txt == "血流成河") {
				this.chuShiHua("mjxlch", Global.gameProxy.gameRecord_time);
			} else {
				this.chuShiHua("mjxzdd", Global.gameProxy.gameRecord_time1);
			}
		}
		/**
		 * 初始化赋值
		 */

		private async chuShiHua(txt, times) {
			switch (times) {
				case 0:
					var handler = ServerPostPath.hall_userHandler_c_getReportInfo;
					let nums = {
						gameId: txt,
						skip: 0,//表示已经获得的条数。
						limit: 20,//每次请求好多条。
					};
					let resp: any = await game.PomeloManager.instance.request(handler, nums);
					if (!resp) {
						return;
					}
					if (txt == "mjxlch") {
						Global.gameProxy.gameRecord_time = 1;
						Global.gameProxy.gameRecord_xl = resp;
						this.fuZhi(1);
					} else {
						Global.gameProxy.gameRecord_time1 = 1;
						Global.gameProxy.gameRecord_xz = resp;
						this.fuZhi(2);
					}
					break;
				case 1:
					if (txt == "mjxlch") {
						this.fuZhi(1);
					} else {
						this.fuZhi(2);
					}

					break;
			}
			egret.setTimeout(() => {
				Global.gameProxy.gameRecord_time = 0;
				Global.gameProxy.gameRecord_time1 = 0;
			}, this, 60000);
		}

		private fuZhi(num) {
			this.recordGroup.removeChildren();
			this.tishiyu.visible = false;
			if (num == 1) {
				if (Global.gameProxy.gameRecord_xl.length == 0) {
					this.tishiyu.visible = true;
				} else {
					for (let i = 0; i < Global.gameProxy.gameRecord_xl.length; i++) {
						var items = new GameRecordRenderer(Global.gameProxy.gameRecord_xl[i], i);
						this.recordGroup.addChild(items);
					}
				}
			} else {
				if (Global.gameProxy.gameRecord_xz.length == 0) {
					this.tishiyu.visible = true;
				} else {
					for (let i = 0; i < Global.gameProxy.gameRecord_xz.length; i++) {
						var items = new GameRecordRenderer(Global.gameProxy.gameRecord_xz[i], i);
						this.recordGroup.addChild(items);
					}
				}
			}

		}

		protected onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			if (e.target == this.closeBtn || e.target == this.rects) {
				this.rects.visible = false;
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_GAMERECORD);
			}
			switch (e.target) {
				case this.xzdd:
				case this.lable_one:
				case this.rect_jt:
					if (this.lable_two.visible) {
						this.lable_two.visible = false;
						this.xlch.visible = false;
					} else {
						this.lable_two.visible = true;
						this.xlch.visible = true;
						this.exchangeName(this.lable_one.text);
					}
					break;
				case this.xlch:
				case this.lable_two:
					this.lable_two.visible = false;
					this.xlch.visible = false
					this.lable_one.text = this.lable_two.text;
					this.showGameByType(this.lable_two.text);
				case this.rect_bg:
					this.lable_two.visible = false;
					this.xlch.visible = false
					break;
			}
		}
		/**
		 * 改变选择按钮的值。
		 */
		private exchangeName(text) {
			if (text == "血流成河") {
				this.lable_one.text = text;
				this.lable_two.text = "血战到底";
			} else {
				this.lable_two.text = "血流成河";
				this.lable_one.text = text;
			}
		}
	}
}