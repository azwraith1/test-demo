/*
 * @Author: MC Lee 
 * @Date: 2019-05-20 19:15:54 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-22 10:12:31
 * @Description: 游戏选场大厅基础类
 */
module game {
	export abstract class BaseHallScene extends BaseScene {
		/**
		 * 大厅主键
		 */
		abstract hallId: string;
		/**
		 * 返回按钮
		 */
		protected backBtn: eui.Button;
		/**
		 * 设置按钮
		 */
		protected settingBtn: eui.Button;
		/**
		 * 帮助按钮
		 */
		protected helpBtn: eui.Button;
		/**
		 * 记录按钮
		 */
		protected recordBtn: eui.Button;
		/**
		 * 充值按钮
		 */
		protected addGoldBtn: eui.Button;

		/**
		 * 玩家头像
		 */
		protected headerImage: eui.Image;
		/**
		 * 玩家名称
		 */
		protected nameLabel: eui.Label;

		/**
		 * 金币
		 */
		protected goldLabel: eui.Label;

		/**
		 * 头像前缀
		 */
		abstract headerFront: string;

		/**
		 * 关闭当前界面的通知
		 */
		abstract CLOSE_NOTIFY: string;

		/**
		 * 进入正确匹配的通知
		 */
		abstract MATCHING_NOTIFY: string;

		/**
		 * 记录界面的通知
		 */
		abstract RECORD_NOTIFY: string;

		/**
		 * 帮助界面的通知
		 */
		abstract HELP_NOTIFY: string;

		/**
		 * 设置界面的通知
		 */
		abstract SETTING_NOTIFY: string;

		abstract loadGroups: string[];

		public constructor() {
			super();
		}

		public createChildren() {
			super.createChildren();
			//控制返回按钮
			if (ServerConfig.OP_RETURN_TYPE == "3") {
				this.backBtn.visible = false;
			}
			if (ServerConfig.RECHARGE_URL && ServerConfig.RECHARGE_URL != "null") {
				if (this.addGoldBtn) {
					this.addGoldBtn.visible = true;
				} else {
					this.addGoldBtn.visible = false;
				}
			}
			this.renderPlayerInfo();
			this.checkReconnect();
			this.showHallBars();
		}

		/**
		 * 玩家信息
		 */
		protected renderPlayerInfo() {
			let playerInfo = Global.playerProxy.playerData;
			this.nameLabel.text = playerInfo.nickname;
			let headerImage = `${this.headerFront}_${Global.playerProxy.playerData.sex}_${Global.playerProxy.playerData.figure_url}_png`;
			this.headerImage.source = headerImage;
			this.updateGold();
		}

		abstract showHallBars();

		/**
		 * 重连检测
		 */
		protected checkReconnect() {
			let roomState = Global.gameProxy.roomState;
			if (roomState && roomState.state == 1) {
				if (GameConfig.CURRENT_ISSHU) {
					RotationLoadingShu.instance.load(this.loadGroups, "", () => {
						this.enterScene({ data: roomState });
					});
				} else {
					RotationLoading.instance.load(this.loadGroups, "", () => {
						this.enterScene({ data: roomState });
					});
				}
			}
		}

		/**
		 * 进入房间
		 */
		abstract async enterScene(event);

		/**
		 * 进入房间回调
		 */
		protected enterSceneCall(resp, data) {
			if(!resp){
				return;
			}
			if(resp && resp.error && resp.error.code){
				Global.alertMediator.addAlert(resp.error.msg, null, null, true);
				return;
			}
			if (resp.reconnect) {
				HallForwardFac.redirectScene(resp, data, () => {
					game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
				});
			} else {
				game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
				game.AppFacade.getInstance().sendNotification(this.MATCHING_NOTIFY, data);
			}
		}


		public onTouchTap(event: egret.TouchEvent) {
			event.stopPropagation();
			switch (event.target) {
				case this.backBtn://
					this.backBtnTouch();
					break;
				case this.recordBtn:
					this.recordBtnTouch();
					break;
				case this.helpBtn:
					this.helpBtnTouch();
					break;
				case this.settingBtn:
					this.settingBtnTouch();
					break;
				case this.addGoldBtn:
					this.addGoldBtnTouch();
					break;
			}
		}


		protected addGoldBtnTouch() {
			FrameUtils.goRecharge();
		}

		/**
		 * 返回按钮
		 */
		protected backBtnTouch() {
			if (ServerConfig.OP_RETURN_TYPE == "2") {
				FrameUtils.goHome();
				return;
			}
			game.AppFacade.getInstance().sendNotification(this.CLOSE_NOTIFY);
			game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_MAIN_HALL);
		}

		/**
		 * 记录按钮
		 */
		public recordBtnTouch() {
			game.AppFacade.getInstance().sendNotification(this.RECORD_NOTIFY, Global.gameProxy.gameIds[this.hallId]);
		}

		/**	
		 * 帮助按钮
		 */
		public helpBtnTouch() {
			game.AppFacade.getInstance().sendNotification(this.HELP_NOTIFY, { type: this.hallId });
		}

		public settingBtnTouch() {
			game.AppFacade.getInstance().sendNotification(this.SETTING_NOTIFY, { type: this.hallId });
		}
	}
}