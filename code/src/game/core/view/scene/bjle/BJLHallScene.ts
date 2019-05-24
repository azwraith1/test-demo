module bjle {
	export class BJLHallScene extends game.BaseHallScene {
		// private helpbtn: eui.Button;
		// private rectbtn: eui.Button;
		// private qpbtn: eui.Button;
		// private backbtn: eui.Button;
		private centerGroup: eui.Group;
		// private namelable: eui.Label;
		// private goldLabel: eui.Label;
		// private pmd_bg: eui.Image;
		// private headerImage: eui.Image;
		// private headerImageMask: eui.Image;


		public hallId: string = "baccarat";
		public pmdKey: string = "baccarat";
		/**
		 * 头像前缀
		 */
		public headerFront: string = "hall_header";
		/**
		 * 背景音乐
		 */
		public bgMusic: string = "baccarat_bgm_mp3";

		/**
		 * 关闭当前界面的通知
		 */
		public CLOSE_NOTIFY: string = SceneNotify.CLOSE_BJLHALL;
		/**
	 * 进入正确匹配的通知
	 */
		public MATCHING_NOTIFY: string = SceneNotify.OPEN_BJLGAME;
		/**
		 * 帮助界面的通知
		 */
		public HELP_NOTIFY: string = PanelNotify.OPEN_HELP_SHU;//要改

		/**
		 * 记录界面的通知
		 */
		public RECORD_NOTIFY: string = PanelNotify.OPEN_NIUGAMERECORD;//要改

		/**
		 * 设置界面的通知
		 */
		public SETTING_NOTIFY: string = null;

		/**
		 * 需要加载的资源组
		 */
		public loadGroups: string[] = ['bjl_game'];
		public constructor() {
			super();
			this.skinName = new BJLHallSceneSkin();
		}


		public createChildren() {
			super.createChildren();
			this.resetPMDPosition();
		}

		/**
	 * 修正跑马灯位子
	 */
		protected resetPMDPosition() {
			let publicMsg = PMDComponent.instance;
			publicMsg.anchorOffsetY = 24;
			publicMsg.horizontalCenter = -10;
			publicMsg.top = 120;
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



		public enterResult(e: egret.Event) {
			let data = e.data;
			if (data.code && data.code != 0) {
				Global.alertMediator.addAlert(data.msg, () => {

				}, null, true);
				return;
			}
			Global.roomProxy.setRoomInfo(e.data);
			try {
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_BJLHALL);
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_BJLGAME, data);
			} catch (e) {
				Global.alertMediator.addAlert("加入房间失败");
			} finally {
				this.lock = false;
			}
		}

		/**
		 * 玩家加入
		 */
		private playerEnter(e: egret.Event) {
			let roomInfo = Global.roomProxy.roomInfo;
			if (roomInfo) {
				// let richManList = roomInfo.playerList.richManList;
				// let data = e.data;
				// richManList.push(data.player);
			}
		}


		private joinScene(data) {
			RotationLoading.instance.load(["bjl_game"], "", () => {
				this.enterScene({ data: data });
			});
		}


		public async onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			// switch (e.target) {
			// 	case this.helpbtn:
			// 		game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_RBWARHELP);
			// 		break;
			// 	case this.rectbtn:
			// 		game.AppFacade.getInstance().sendNotification(PanelNotify.OPEN_RBWARJL);
			// 		break;
			// 	case this.qpbtn:
			// 		break;
			// 	case this.backbtn:
			// 		if (ServerConfig.OP_RETURN_TYPE == "2") {
			// 			FrameUtils.goHome();
			// 			return;
			// 		}
			// 		game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_RBWAR_HALL);
			// 		game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
			// 		break;

			// }
		}
		/**
		 * 检查回到界面
		 */
		private checkReconnectScene() {
			let roomState = Global.gameProxy.roomState;
			if (roomState && roomState.state == 1) {
				RotationLoading.instance.load(["bjl_game"], "", () => {
					this.enterScene({ data: roomState });
				});
			}
		}

		/**
		 * 获取对局信息
		 * @param  {egret.Event} e?
		 */
		private lock: boolean = false;
		public async enterScene(event) {
			if (this.lock) {
				return;
			}
			this.lock = true;
			var data = event.data;
			Global.gameProxy.lastGameConfig = data;
			var handler = ServerPostPath.hall_sceneHandler_c_enter;
			let resp: any = await game.PomeloManager.instance.request(handler, data);
			// RotationLoading.instance.load(["rbwar_game"], "", async () => {

			// 	// if (!resp) {
			// 	// 	this.lock = false;
			// 	// 	return;
			// 	// }
			// 	// try {
			// 	// 	if (resp.reconnect) {
			// 	// 		HallForwardFac.redirectScene(resp, data, () => {
			// 	// 			game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_RBWAR_HALL);
			// 	// 		});
			// 	// 	} else {
			// 	// 		game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_RBWAR_HALL);
			// 	// 		game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_RBWAR_GAME, data);
			// 	// 	}
			// 	// } catch (e) {
			// 	// 	Global.alertMediator.addAlert("加入房间失败");
			// 	// } finally {
			// 	// 	this.lock = false;
			// 	// }
			// });
		}




		public showHallBars() {
			var nums = Global.gameProxy.gameNums["baccarat"];
			let index = 0;
			var item: any;
			for (let i in nums) {
				// if (index > 2) {
				// 	break;
				// }
				let barConfig = nums[i];
				item = new BJLHallBar(nums[i]);
				item.name = "item" + i;
				this.centerGroup.addChild(item);
				item.anchorOffsetX = item.width / 2;
				item.anchorOffsetY = item.height / 2;
				item.y = index * (item.height + 20)+item.height / 2;
				index++;
			}
			egret.Tween.get(this.centerGroup).to({
				alpha: 1
			}, 800);

			this.lock = false;

		}
	}
}