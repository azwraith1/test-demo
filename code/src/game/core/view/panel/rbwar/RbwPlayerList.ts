module rbwar {
	export class RbwPlayerList extends game.BaseComponent {
		private playerNums: eui.Label;
		private playerGroup: eui.Group;
		private closeBtn: eui.Button;
		private rcts: eui.Rect;
		public constructor() {
			super();
			this.skinName = new RbwarPlayerListSkin();
		}

		public createChildren() {
			super.createChildren();
			this.richManList = [];
			let data = Global.roomProxy.roomInfo;
			let playerList = data.playerList;
			this.showList(playerList);
		}

		private richManList = [];
		private showList(data) {
			this.playerGroup.removeChildren();
			let playerCount = data.playerCount;
			this.richManList = data.richManList.concat([]);
			let xyx = data.winRate1st;
			this.richManList.unshift(xyx);
			this.playerNums.text = "当前房间玩家数量：" + playerCount;
			for (let i = 0; i < this.richManList.length - 1; i++) {
				let n = new RbwPlayerListBar(this.richManList[i], i);
				this.playerGroup.addChild(n);
			}

		}

		public onTouchTap(e: egret.TouchEvent) {
			switch (e.target) {
				case this.closeBtn:
				case this.rcts:
					this.rcts.visible = false;
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_RBWARPL);
					break;
			}
		}

	}
}