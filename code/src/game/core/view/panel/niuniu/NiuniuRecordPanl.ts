
/*
 * @Author: he bing 
 * @Date: 2018-08-13 11:05:43 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 18:44:59
 * @Description: 牛牛和三公游戏记录
 */

module niuniu {
	export class NiuniuRecordPanl extends game.BaseComponent {
		public resizeGroup: eui.Group;
		private rects: eui.Rect;
		public LiuShuiGroup: eui.Group;
		private closeBtn: eui.Button;
		private tishiyu: eui.Label;
		private gameId: any;
		public constructor(gameId) {
			super();
			this.gameId = gameId;
			this.skinName = new NiuniuRecordSkin();
		}

		protected createChildren() {
			super.createChildren();
			this.init();
		}

		/**
		 * 初始化赋值
		 */
		private recordData;
		private async init() {
			let data = Global.gameProxy.gameIds[this.gameId];
			if(data){
				this.gameId = data;
			}
			var handler = ServerPostPath.hall_userHandler_c_getReportInfo;
			let nums = {
				gameId: this.gameId,
				skip: 0,//表示已经获得的条数。
				limit: 20,//每次请求好多条。
			};
			let resp: any = await game.PomeloManager.instance.request(handler, nums);
			this.recordData = resp;
			this.fuZhi(this.gameId);
		}

		private fuZhi(id) {
			this.LiuShuiGroup.removeChildren();
			if (this.recordData.length == 0) {
				this.tishiyu.visible = true;
			} else {
				for (let i = 0; i < this.recordData.length; i++) {
					var items = new NiuniuRecordRenderer(this.recordData[i], id);
					this.LiuShuiGroup.addChild(items);
				}
			}
		}

		protected onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			if (e.target == this.closeBtn || e.target == this.rects) {
				this.rects.visible = false;
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_NIUGAMERECORD);
			}
		}
	}
}