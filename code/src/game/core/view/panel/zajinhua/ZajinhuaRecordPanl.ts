module zajinhua {
	export class ZajinhuaRecordPanl extends game.BaseComponent {
		public resizeGroup: eui.Group;
		private rect: eui.Rect;
		public jiluGroup: eui.Group;
		private closeBtn: eui.Button;
		//private tishiyu: eui.Label;
		private num: any;
		public constructor() {
			super();
			this.skinName = new ZajinhuaJiluSkin();
		}

		protected createChildren() {
			super.createChildren();
			this.chuShiHua(Global.roomProxy.zjhRecord_time);
		}


		/**
		 * 初始化赋值
		 */
		private async chuShiHua(times) {
			switch (times) {
				case 0:
					let id = 10005;
					var handler = ServerPostPath.hall_userHandler_c_getReportInfo;
					let nums = {
						gameId: id,
						skip: 0,//表示已经获得的条数。
						limit: 20,//每次请求好多条。
					};
					let resp: any = await game.PomeloManager.instance.request(handler, nums);
					Global.roomProxy.zjhRecord_time = 1;
					Global.roomProxy.zjh_rect = resp;
					this.fuZhi();
					break;
				case 1:
					this.fuZhi();
			}
			egret.setTimeout(() => {
				Global.roomProxy.zjhRecord_time = 0;
			}, this, 60000);
		}
		private zwjl: eui.Label;
		private fuZhi() {
			this.jiluGroup.removeChildren();
			if (Global.roomProxy.zjh_rect.length == 0) {
				this.zwjl.visible = true;
			} else {
				for (let i = 0; i < Global.roomProxy.zjh_rect.length; i++) {
					var items = new ZajinhuaRecordBar(Global.roomProxy.zjh_rect[i]);
					this.jiluGroup.addChild(items);
				}
			}

		}

		protected onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			if (e.target == this.closeBtn || e.target == this.rect) {
				this.rect.visible = false;
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_ZJHRECORD);
			}
		}
	}
}