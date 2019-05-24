module rbwar {
	export class RBWarHallScene extends game.BaseHallScene {
		public hallId: string = "rbwar";
		public pmdKey: string = "rbwar";
		/**
		 * 头像前缀
		 */
		public headerFront: string = "hall_header";
		/**
		 * 背景音乐
		 */
		public bgMusic: string = "rbw_bgm_mp3";

		/**
		 * 关闭当前界面的通知
		 */
		public CLOSE_NOTIFY: string = SceneNotify.CLOSE_RBWAR_HALL;

		/**
		 * 进入正确匹配的通知
		 */
		public MATCHING_NOTIFY: string = SceneNotify.OPEN_RBWAR_GAME;

		/**
		 * 帮助界面的通知
		 */
		public HELP_NOTIFY: string = PanelNotify.OPEN_RBWARHELP;

		/**
		 * 记录界面的通知
		 */
		public RECORD_NOTIFY: string = PanelNotify.OPEN_RBWARJL;

		/**
		 * 设置界面的通知
		 */
		public SETTING_NOTIFY: string = null;

		/**
		 * 需要加载的资源组
		 */
		public loadGroups: string[] = ['rbwar_game'];

		private selectGroup: eui.Group;

		private pmd_bg: eui.Image;

		private headerImageMask: eui.Image;
		public constructor() {
			super();
			this.skinName = new RBWarHallSceneSkin();
		}


		public createChildren() {
			super.createChildren();
			this.headerImage.mask = this.headerImageMask;
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
			if (data.code && data.code != 0) {
				Global.alertMediator.addAlert(data.msg, () => {
				}, null, true);
				return;
			}
			Global.roomProxy.setRoomInfo(e.data);
			try {
				game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
				game.AppFacade.getInstance().sendNotification(this.MATCHING_NOTIFY, data);
			} catch (e) {
				Global.alertMediator.addAlert("加入房间失败");
			} finally {
			}
		}

		/**
		 * 获取对局信息
		 * @param  {egret.Event} e?
		 */
		public async enterScene(event) {
			var data = event.data;
			RotationLoading.instance.load(this.loadGroups, "", async () => {
				Global.gameProxy.lastGameConfig = data;
				var handler = ServerPostPath.hall_sceneHandler_c_enter;
				let resp: any = await game.PomeloManager.instance.request(handler, data);
			});
		}

		public showHallBars() {
			var nums = Global.gameProxy.gameNums["rbwar"];
			let index = 0;
			var item: any;
			for (let i in nums) {
				if (index > 2) {
					break;
				}
				let barConfig = nums[i];
				item = new RBWHallBar(nums[i]);
				item.name = "item" + i;
				this.selectGroup.addChild(item);
				item.anchorOffsetX = item.width / 2;
				item.anchorOffsetY = item.height / 2;
				if (index == 0) {
					item.x = 220;
					item.y = 340;
					item.tzfflable.y = 304;
				} else if (index == 1) {
					item.x = 630;
					item.y = 340;
					item.tzfflable.y = 284;
				} else if (index == 2) {
					item.x = 1050;
					if (barConfig.enable) {
						item.y = 335;
					} else {
						item.y = 210;
					}

					item.tzfflable.y = 314;
				}
				index++;
			}
			egret.Tween.get(this.selectGroup).to({
				alpha: 1
			}, 800);
		}
	}
}

