module majiang {
	export class GameRecordRenderer extends game.BaseUI {
		private values;
		private i;
		private paijunumber: eui.Label;
		private room: eui.Label;
		private winOrLose: eui.Label;
		private gametimes: eui.Label;
		private hfbtn: eui.Image;
		public constructor(data, i) {
			super();
			this.values = data;
			this.i = i;
			this.skinName = new GameRecordRendererSkin();
		}

		private async getHFData() {
			let roomId = this.values.roomId;
			let path = ServerPostPath.hall_userHandler_c_getPlaybackInfo;
			let resp: any = await Global.pomelo.request(path, { roomId: roomId });
			if (resp.code) {
				Global.alertMediator.addAlert("信息错误");
				return;
			}


			ReplayData.data = resp;
			RotationLoading.instance.load(["majiang_game"], "", () => {
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_GAMERECORD);
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_CESI);
			});
		}

		public onTouchTap(e: egret.TouchEvent) {
			switch (e.target) {
				case this.hfbtn:
					egret.Tween.get(this.hfbtn).to({ scaleX: 0.9, scaleY: 0.9 }, 70).to({ scaleX: 1, scaleY: 1 }, 70);
					this.getHFData();
					break;
			}
		}

		protected createChildren(): void {
			super.createChildren();
			this.hfbtn.visible = ServerConfig.PATH_TYPE == PathTypeEnum.NEI_TEST
			let num = this.values;
			this.paijunumber.text = num["roomId"];
			this.room.text = this.choseField(num["sceneId"]);
			if (num["gainGold"] >= 0) {
				this.winOrLose.text = "+" + num["gainGold"].toFixed(2);
				this.winOrLose.textColor = 0xf43c3c
			} else {
				this.winOrLose.text = num["gainGold"].toFixed(2);
				this.winOrLose.textColor = 0x29ab17
			}
			this.gametimes.text = this.fmtDate(num["gameTime"]);
		}


		private choseField(value) {
			let val = Number(value);
			switch (val) {
				case 1001:
					return "平民场";
				case 1002:
					return "小资场";
				case 1003:
					return "白领场";
				case 1004:
					return "富豪场";
			}
		}

		private fmtDate(obj) {
			var date = new Date(obj * 1000);
			var y = date.getFullYear();
			var m = "0" + (date.getMonth() + 1);
			var d = "0" + date.getDate();
			var h = "0" + date.getHours();
			var mins = "0" + date.getMinutes();
			var sc = "0" + date.getSeconds();
			return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length) + "\t" + h.substring(h.length - 2, h.length) + ":" + mins.substring(mins.length - 2, mins.length) + ":" + sc.substring(sc.length - 2, sc.length);
		}
	}
}