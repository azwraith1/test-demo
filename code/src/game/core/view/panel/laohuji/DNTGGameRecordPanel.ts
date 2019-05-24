module dntg {
	export class DNTGGameRecordPanel extends game.BaseComponent {

		public gameRecordScroller: eui.Scroller;
		public gameRecordList: eui.List;
		private closeBtn: eui.Button;

		public constructor() {
			super();
			this.skinName = new DNTGRecordSkin();
		}

		public createChildren() {
			super.createChildren();
			this.showData();
			this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_DNTG_RECORD_PANEL);
			}, this)
		}

		public async showData() {
			this.gameRecordScroller.scrollPolicyH = 'off';
			let handler = ServerPostPath.hall_userHandler_c_getReportInfo;
			let id = "slot";
			let data = Global.gameProxy.gameIds[id];
			if (data) {
				id = data;
			}
			let nums = {
				gameId: id,
				skip: 0,//表示已经获得的条数。
				limit: 20,//每次请求好多条。
			};
			let resp: any = await game.PomeloManager.instance.request(handler, nums);
			if (resp.length > 0) {
				let atr = [];
				for (let i in resp) {
					atr.push(resp[i]);
				}
				atr.pop();
				this.gameRecordList.itemRenderer = DNTGGameRecordItem;
				this.gameRecordList.dataProvider = new eui.ArrayCollection(atr);
			}

		}
	}
}