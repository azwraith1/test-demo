/*
 * @Author: li mengchan 
 * @Date: 2018-07-11 19:23:30 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-08-23 18:50:51
 * @Description: 麻将功能条
 */
module majiang {
	export class MajiangTaskBar extends game.BaseUI {
		//胡
		private btn1: eui.Button;
		//杠
		private btn2: eui.Button;
		//碰
		private btn3: eui.Button;
		//过
		private btn4: eui.Button;

		private effect1: egret.MovieClip;
		private effect2: egret.MovieClip;
		private effect3: egret.MovieClip;

		private majiangScene: MajiangScene;

		private selectGang: SelectGang;
		public constructor() {
			super();
			this.skinName = new TaskBarSkin();
		}

		public setRoot(majiangScene) {
			this.majiangScene = majiangScene;
		}

		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.GANG_SELECT, this.gangSelect, this);
		}
		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(EventNotify.GANG_SELECT, this.gangSelect, this);
			// game.MCUtils.reclaim("gang_task", this.effect2);
			// game.MCUtils.reclaim("hu_task", this.effect1);
			// game.MCUtils.reclaim("peng_task", this.effect3);
		}

		public gangSelect(e: egret.TouchEvent) {
			this.selectGang.visible = false;
			let value = e.data;
			this.sendGangReq(value);
		}

		/**
         * 胡碰杠
         * @param  {} direction
         * @param  {} effectName
         */
		private addEffectAni(effectName, callback) {
			GameCacheManager.instance.getMcCache(effectName, "mine_" + effectName, (mv: egret.MovieClip) => {
				callback && callback(mv);
			});
			// game.MCUtils.getMc(effectName, (mv: egret.MovieClip) => {
			// 	callback && callback(mv);
			// });
		}

		public createEffect() {
			this.addEffectAni("gang_task", (mv: egret.MovieClip) => {
				if (mv) {
					this.addChild(mv);
					mv.scaleX = mv.scaleY = 1.5;
					mv.x = this.btn2.x - 116;
					mv.y = this.btn2.y - 89 - 5;
					// game.UIUtils.setAnchorPot(mv);
					this.effect2 = mv;
					mv.visible = false;
					this.btn2.alpha = 0;
					mv.play(-1);
				}
			});
			this.addEffectAni("hu_task", (mv: egret.MovieClip) => {
				if (mv) {
					this.addChild(mv);
					mv.scaleX = mv.scaleY = 1.5;
					mv.x = this.btn1.x - 116;
					mv.y = this.btn1.y - 89 - 5;
					// game.UIUtils.setAnchorPot(mv);
					this.effect1 = mv;
					mv.visible = false;
					this.btn1.alpha = 0;
					mv.play(-1);
				}
			});

			this.addEffectAni("peng_task", (mv: egret.MovieClip) => {
				if (mv) {
					this.addChild(mv);
					mv.scaleX = mv.scaleY = 1.5;
					mv.x = this.btn3.x - 116;
					mv.y = this.btn3.y - 89 - 5;
					// game.UIUtils.setAnchorPot(mv);
					this.effect3 = mv;
					mv.visible = false;
					mv.play(-1);
					this.btn3.alpha = 0;
				}
			});
		}

		public createChildren() {
			super.createChildren();
			// this.scaleX = this.scaleY = 0.8;
			this.createEffect();
			this.hideAllBtns();
		}

		public hideAllBtns() {
			this.btn1.visible = this.btn2.visible = this.btn3.visible = this.btn4.visible = false;
			for (var i = 1; i <= 3; i++) {
				if (this['effect' + i]) {
					this['effect' + i].visible = false;
					this['effect' + i].stop();
				}
			}
			this.selectGang.hide();
		}

		/**
		 * 
		 * 根据DATA显示
		 */
		private task1 = [];
		private task2 = [];
		private task3 = [];
		private taskIndex: number;
		public showBtnsByData(taskData) {
			let tasks = taskData.hangupTasks;
			let showPass = taskData.hidePass;
			this.taskIndex = taskData.taskIndex;
			this.task1 = [];
			this.task2 = [];
			this.task3 = [];
			let flag = false;
			for (var key in tasks) {
				let task = tasks[key];
				if (!this['task' + key]) {
					this['task' + key] = [];
				}
				this['task' + key].push(task);
				if (this['btn' + key]) this['btn' + key].visible = true;
				flag = true;
			}
			// if(flag){
			this.visible = flag;
			// }
			this.btn4.visible = !showPass;
			// //胡牌中
			// if (this.task1.length > 0) {
			// 	if (Global.gameProxy.roomInfo.publicCardNum < 4) {
			// 		this.btn4.visible = false;
			// 	}
			// }

			// let huCards = Global.gameProxy.getMineGameData().huCards;
			// if (huCards.length > 0) {
			// 	for (var i = 0; i < this.task1.length; i++) {
			// 		let card = this.task1[i].card;
			// 		if (huCards.indexOf(card) > -1) {
			// 			this.btn4.visible = false;
			// 			break
			// 		}
			// 	}
			// }
			this.setPositions();
		}


		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.btn3:
					this.playerPeng();
					break;
				case this.btn2:
					this.playerGang();
					break;
				case this.btn1:
					this.PlayerHu();
					break;
				case this.btn4:
					this.playerPass();
					break;

			}
		}


		private async sendGangReq(value) {
			let route = ServerPostPath.game_mjHandler_c_gangTask;
			this.visible = false;
			let data = { selectGang: value, taskIndex: this.taskIndex };
			let resp: any = await Global.pomelo.request(route, data);
			if (!resp) {
				return;
			}
			if (resp.error.code == 0) {
				this.hideAllBtns();
				Global.gameProxy.clearTasks();
				this.majiangScene.lockChupai = true;
			}
		}

		public async playerGang() {
			let gangArray = this.task2[0].gangArray;
			// this.task2 = [{card: 22}, {card: 34}];
			if (gangArray.length > 1) {
				this.selectGang.visible = true;
				this.selectGang.initWithTask(gangArray);
				this.selectGang.x = -this.selectGang.getMaxWidth();
				this.addChild(this.selectGang);
				return;
			}
			this.sendGangReq(gangArray[0].card);
		}


		public async playerPeng() {
			let route = ServerPostPath.game_mjHandler_c_pengTask;
			this.visible = false;
			let resp: any = await Global.pomelo.request(route, {taskIndex: this.taskIndex});
			if (!resp) {
				return;
			}
			if (resp.error.code == 0) {
				this.hideAllBtns();
				Global.gameProxy.clearTasks();
				// this.majiangScene.lockChupai = true;
				// Global.gameProxy.clearCurPlay();
			}
		}

		public async playerPass() {
			let route = ServerPostPath.game_mjHandler_c_passTask;
			this.visible = false;
			let resp: any = await Global.pomelo.request(route, {taskIndex: this.taskIndex});
			if (!resp) {
				return;
			}
			if (resp.error.code == 0) {
				this.hideAllBtns();
				Global.gameProxy.clearTasks();
				// this.majiangScene.lockChupai = true;
				// Global.gameProxy.clearCurPlay();
			}
		}


		public async PlayerHu() {
			let route = ServerPostPath.game_mjHandler_c_huTask;
			this.visible = false;
			let resp: any = await Global.pomelo.request(route, {taskIndex: this.taskIndex});
			if (!resp) {
				return;
			}
			if (resp.error.code == 0) {
				this.hideAllBtns();
				Global.gameProxy.clearTasks();
				// this.majiangScene.lockChupai = true;
				// Global.gameProxy.clearCurPlay();
			}
		}


		public setPositions() {
			// let number = 0;
			let number = 140;
			let index = 4;
			for (let i = 4; i >= 1; i--) {
				if (this['btn' + i].visible) {
					this['btn' + i].x = number * (index - 1);
					if (this['effect' + i]) {
						this['effect' + i].visible = true;
						this['effect' + i].x = this['btn' + i].x - 32 - 65;
						this['effect' + i].play(-1);
					}
					index--;
				}
			}
		}
	}
}