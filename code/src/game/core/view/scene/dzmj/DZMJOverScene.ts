/*
 * @Author: He Bing 
 * @Date: 2018-07-06 16:29:49 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-10 18:04:03
 @Description: 麻将结算界面
 */

module majiang {
	export class DZMJOverScene extends game.BaseComponent {
		//下一局
		private playBtn: eui.Button;
		private backBtn: eui.Button;
		private score1: eui.BitmapLabel;
		private score2: eui.Label;
		private score3: eui.Label;
		private score4: eui.Label;
		private contentGroup: eui.Group;

		private scrollers: eui.Scroller;
		private tipLabel: eui.Label;

		private header1: WidgetHeader;
		private header2: WidgetHeader;
		private header3: WidgetHeader;
		private header4: WidgetHeader;

		private group1: eui.Group;
		private group2: eui.Group;
		private group3: eui.Group;
		private group4: eui.Group;

		private fanLabel: eui.BitmapLabel;
		private settleData;
		private paiGroup: eui.Group;
		public constructor(settleData) {
			super();
			this.settleData = settleData;
			this.skinName = new DZMJOverSceneSkin();
		}

		public onAdded() {
			// roundPatternScore
			// roundPattern
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.EVENT_RESIZE, this.resetPosition, this);
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.addEvent(EventNotify.EVENT_RESIZE, this.resetPosition, this);
		}

		public resetPosition(e?: egret.Event) {
			var data = e.data;
		}

		private initHeaders() {
			//排序
			let roomInfo = Global.gameProxy.roomInfo;
			let players = roomInfo.players;
			let settlePlayers = this.settleData.players;
			//赢家和第一的换
			let winSettle = [];
			let failSettle = [];
			for (let key in settlePlayers) {
				let settle = settlePlayers[key];
				if (settle.gainGold > 0) {
					winSettle.push(key);
				} else {
					failSettle.push(key);
				}
			}
			for (let i = 0; i < winSettle.length; i++) {
				let index = winSettle[i];
				let playerData = players[index];
				this.header1.initWithData(playerData, null);
				this.header1.hideGold();
				let settle = settlePlayers[index];
				this.score1.text = "+" + NumberFormat.handleFloatDecimal(settle.gainGold);
				this.fanLabel.text = settle.roundPatternScore;
				// this.showPais(settle);
				this.showFans(settle.roundPattern, settle.roundPatternScoreArray);
			}

			let headerIndex = 2;
			for (let i = 0; i < failSettle.length; i++ , headerIndex++) {
				let index = failSettle[i];
				let playerData = players[index];
				let header = this[`header${headerIndex}`];
				header.initWithData(playerData, null);
				header.hideGold();
				let settle = settlePlayers[index];
				if(Global.gameProxy.checkIndexIsMe(index)){
					this[`tip${headerIndex}`].visible = true;
					
				}
				this[`score${headerIndex}`].text = NumberFormat.handleFloatDecimal(settle.gainGold);
				this[`score${headerIndex}`].textColor = this.socreW2L(settle.gainGold);
			}
		}

		public createChildren() {
			super.createChildren();
			this.showPais(this.settleData.players[this.settleData.winPlayer]);
			this.initHeaders();
			this.paiGroup.touchChildren = false;
			this.paiGroup.touchThrough = false;
			this.group1.alpha = this.group2.alpha = this.group3.alpha = this.group4.alpha = 0;
			// this.show();
			egret.Tween.get(this.group1).to({ alpha: 0 }).to({ alpha: 1 }, 500);
			egret.Tween.get(this.group2).wait(200).to({ alpha: 0 }).to({ alpha: 1 }, 500);
			egret.Tween.get(this.group3).wait(400).to({ alpha: 0 }).to({ alpha: 1 }, 500);
			egret.Tween.get(this.group4).wait(600).to({ alpha: 0 }).to({ alpha: 1 }, 500);


		}


		private showFans(fans, scores) {
			for (let i = 0; i < fans.length; i = i + 2) {
				let fanCount = new DZMJOverItem(fans[i], scores[i], fans[i + 1], scores[i + 1]);
				this.contentGroup.addChild(fanCount);
			}
		}


		private createPai(value) {
			let shoupai = new MineShoupai(value);
			shoupai.resetValue(value);
			shoupai.scaleX = shoupai.scaleY = 0.45;
			this.paiGroup.addChild(shoupai);
			return shoupai;
		}

		private showPais(playerData) {
			//吃 碰 杠
			let x = 0;
			let chiCards = playerData.chiCards;//selectCard
			// chiCards = [14];
			for (let i = 0; i < chiCards.length; i++) {
				for (let j = 2; j >= 0; j--) {
					let shoupai = this.createPai(chiCards[i].selectCard - j);
					shoupai.x = x;
					x += shoupai.width * shoupai.scaleX - 0.75;
				}
				x += 5;
			}

			let pengCards = playerData.pengCards;//number
			for (let i = 0; i < pengCards.length; i++) {
				for (let j = 2; j >= 0; j--) {
					let shoupai = this.createPai(pengCards[i]);
					shoupai.x = x;
					x += shoupai.width * shoupai.scaleX - 0.75;
				}
				x += 5;
			}

			let gangCards = playerData.gangCards;//card
			// gangCards = [14];
			for (let i = 0; i < gangCards.length; i++) {
				for (let j = 1; j <= 4; j++) {
					
					// if(j > 1){
						// let card = new eui.Image("mj_yp_bg_png");

					// }else{
					let shoupai = this.createPai(gangCards[i].card);
					shoupai.x = x;
					x += shoupai.width * shoupai.scaleX - 0.75;
					// }
					
				}
				x += 5;
			}

			// return;
			let huaCards = playerData.huaCards;//Number
			// huaCards = [55, 56, 57, 58];
			for (let i = 0; i < huaCards.length; i++) {
				let shoupai = this.createPai(huaCards[i]);
				shoupai.x = x;
				x += shoupai.width * shoupai.scaleX - 0.75;
				// x += 5;
			}
			x += 5;
			// return;
			let handCards = playerData.handCards;//number	
			// handCards = { 12: 2, 13: 3, 14: 2 };
			for (let key in handCards) {
				let handCount = handCards[key];
				for (let i = 0; i < handCount; i++) {
					let shoupai = this.createPai(Number(key));
					shoupai.x = x;
					x += shoupai.width * shoupai.scaleX - 0.75;
				}
			}
			//间隔
			x += 5;
			let huCards = playerData.huCards;//number	
			// huCards = [13];
			let shoupai = this.createPai(huCards[0]);
			shoupai.x = x;
		}

		/**
		 * 判断分数正负颜色
		 */
		public socreW2L(color) {
			if (color < 0) {
				return 0x9EAEEE;
			} else {
				return 0xffffff;
			}
		}

		private lockReq: boolean;
		private async nextBtnTouch() {
			if (this.lockReq) {
				return;
			}
			this.lockReq = true;
			let backHall = () => {
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DZMJ_OVER);
				game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DZMJ);
				game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_DZMJ_HALL);
			}
			egret.setTimeout(() => {
				this.lockReq = false;
			}, this, 5000);
			let roomInfo = Global.gameProxy.roomInfo;
			let sceneConfig = Global.gameProxy.getSceneConfigByGame(roomInfo.gameId, roomInfo.sceneId);
			let betMin = sceneConfig.gold_min;
			if (Global.playerProxy.playerData.gold <= 0 || Global.playerProxy.playerData.gold < betMin) {
				Global.alertMediator.addAlert("金币不足", null, null, true);
				backHall();
				return;
			} else {
				let quitResp: any = await Global.pomelo.request(ServerPostPath.game_roomHandler_c_quitRoom, {});
				if (quitResp.gold) {
					Global.playerProxy.playerData.gold = quitResp.gold;
				}
				if (quitResp) {
					if (quitResp.error && quitResp.error.code != ErrorCode.ROOM_NOT_EXIST) {
						if (quitResp.error.code != ErrorCode.ROOM_PLAYING) {
							backHall();
						}
						Global.alertMediator.addAlert(quitResp.error.msg, () => {
						}, null, true);
						return;
					}
					delete Global.gameProxy.lastGameConfig['roomId'];
					let data = _.clone(Global.gameProxy.lastGameConfig);
					data['isContinue'] = true;
					let quitResp1: any = await Global.pomelo.request(ServerPostPath.hall_sceneHandler_c_enter, data)
					if (quitResp1) {
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_DZMJ_MATCHING, Global.gameProxy.lastGameConfig);
						game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DZMJ_OVER);
						game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DZMJ);
					} else {
						Global.alertMediator.addAlert("开始失败，请重新开始!", () => {
							backHall();
						}, null, true);
					}
				} else {
					Global.alertMediator.addAlert("开始失败，请重新开始!", () => {
						backHall();
					}, null, true);
				}
			}

		}

		/**
		 * 点击方法
		 */
		public async onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.playBtn://下一局
					this.nextBtnTouch();
					break;
				case this.backBtn://退出
					let quitResp: any = await Global.pomelo.request(ServerPostPath.game_roomHandler_c_quitRoom, {});
					if (quitResp.gold) {
						Global.playerProxy.playerData.gold = quitResp.gold;
					}
					Global.gameProxy.clearLastGameConfig();
					if (quitResp) {
						game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DZMJ_OVER);
						game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DZMJ);
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_DZMJ_HALL);
					} else {
						game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DZMJ_OVER);
						game.AppFacade.getInstance().sendNotification(SceneNotify.CLOSE_DZMJ);
						game.AppFacade.getInstance().sendNotification(SceneNotify.OPEN_DZMJ_HALL);
					}
					break;
			}
		}

	}
}