/*
 * @Author: he bing 
 * @Date: 2018-08-13 11:05:43 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 18:46:20
 * @Description: 红黑游戏记录
 */
module rbwar {
	export class RBWRecordPanl extends game.BaseComponent {
		public resizeGroup: eui.Group;
		private rect: eui.Rect;
		public jiluGroup: eui.Group;
		private closeBtn: eui.Button;
		//	private tishiyu: eui.Label;
		private num: any;
		public constructor() {
			super();
			this.skinName = new RBWJiLuSkin();
		}

		protected createChildren() {
			super.createChildren();
			this.chuShiHua(Global.roomProxy.rbwRecord_time);
		}


		/**
		 * 初始化赋值
		 */

		private async chuShiHua(times) {
			switch (times) {
				case 0:
					let id = "rbwar";
					let data = Global.gameProxy.gameIds[id];
					if (data) {
						id = data;
					}
					var handler = ServerPostPath.hall_userHandler_c_getReportInfo;
					let nums = {
						gameId: id,
						skip: 0,//表示已经获得的条数。
						limit: 20,//每次请求好多条。
					};
					let resp: any = await game.PomeloManager.instance.request(handler, nums);
					Global.roomProxy.rbwRecord_time = 1;
					Global.roomProxy.rbw_rect = resp;
					this.fuZhi();
					break;
				case 1:
					this.fuZhi();
			}
			egret.setTimeout(() => {
				Global.roomProxy.rbwRecord_time = 0;
			}, this, 60000);
		}
		private tishiyu: eui.Label;
		private fuZhi() {
			this.jiluGroup.removeChildren();
			if (Global.roomProxy.rbw_rect.length == 0) {
				this.tishiyu.visible = true;
			} else {
				for (let i = 0; i < Global.roomProxy.rbw_rect.length; i++) {
					var items = new RBWRecordRenderer(Global.roomProxy.rbw_rect[i]);
					this.jiluGroup.addChild(items);
				}
			}

		}

		protected onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			if (e.target == this.closeBtn || e.target == this.rect) {
				this.rect.visible = false;
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_RBWARJL);
			}
		}
	}
}