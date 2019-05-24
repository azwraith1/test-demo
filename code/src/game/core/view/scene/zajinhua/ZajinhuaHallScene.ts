module zajinhua {
	export class ZajinhuaHallScene extends game.BaseHallScene {
		public hallId: string = "zjh";
		public pmdKey: string = "zjh";
		private selectGroup: eui.Group;
		private header_mask: eui.Image;

		/**
		 * 头像前缀
		 */
		public headerFront: string = "hall_header";
		/**
		 * 背景音乐
		 */
		public bgMusic: string = "zjh_bgm_mp3";

		/**
		 * 关闭当前界面的通知
		 */
		public CLOSE_NOTIFY: string = SceneNotify.CLOSE_ZJHSELECT;

		/**
		 * 进入正确匹配的通知
		 */
		public MATCHING_NOTIFY: string = SceneNotify.OPEN_ZJH_MATCHING;

		/**
		 * 帮助界面的通知
		 */
		public HELP_NOTIFY: string = PanelNotify.OPEN_ZJHHELP;

		/**
		 * 记录界面的通知
		 */
		public RECORD_NOTIFY: string = PanelNotify.OPEN_ZJHRECORD;

		/**
		 * 设置界面的通知
		 */
		public SETTING_NOTIFY: string = PanelNotify.OPEN_ZJHSET;

		/**
		 * 需要加载的资源组
		 */
		public loadGroups: string[] = ['zhajinhua_game'];
		public constructor() {
			super();
			this.skinName = new ZajinhuaHallSkin();
		}


		public createChildren() {
			super.createChildren();
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(ServerNotify.s_enterResult, this.enterResult, this);
			EventManager.instance.addEvent(EventNotify.ENTER_GOLD_SCENE, this.enterScene, this);
		}

		public onRemoved() {
			super.onRemoved()
			EventManager.instance.removeEvent(ServerNotify.s_enterResult, this.enterResult, this);
			EventManager.instance.removeEvent(EventNotify.ENTER_GOLD_SCENE, this.enterScene, this);

		}

		private enterResult(e: egret.Event) {
			let data = e.data;
			if (e.data.reconnect) {
				return;
			}
			if (data.code && data.code != 0) {
				Global.alertMediator.addAlert(data.msg, () => {

				}, null, true);
				return;
			}
			Global.roomProxy.setRoomInfo(e.data);
			game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
			game.AppFacade.getInstance().sendNotification(this.MATCHING_NOTIFY, data);
		}

		/**
		 * 检查回到界面
		 */
		private checkReconnectScene() {
			let roomState = Global.gameProxy.roomState;
			if (roomState && roomState.state == 1) {
				RotationLoading.instance.load(["zhajinhua_game"], "", () => {
					this.enterScene({ data: roomState });
				});
			}
		}

		/**
		 * 获取对局信息
		 * @param  {egret.Event} e?
		 */
		public async enterScene(event) {
			var data = event.data;
			RotationLoading.instance.load(["zhajinhua_game"], "", async () => {
				Global.gameProxy.lastGameConfig = data;
				var handler = ServerPostPath.hall_sceneHandler_c_enter;
				let resp: any = await game.PomeloManager.instance.request(handler, data);
				this.enterSceneCall(resp, data);
			});
		}

		public showHallBars() {
			var nums = Global.gameProxy.gameNums["zjh"];
			let index = 1;
			var item: any;
			for (let i in nums) {
				let barConfig = nums[i];
				item = new ZajinhuaHallBar(nums[i], index);
				item.name = "item" + i;
				this.selectGroup.addChild(item);
				// item.x = 25 + item.width / 2 + (index - 1) * (item.width + 20)
				index++;
				item.alpha = 1;
				egret.Tween.get(this.selectGroup).to({
					alpha: 1
				}, 800);
			}
		}
	}
}