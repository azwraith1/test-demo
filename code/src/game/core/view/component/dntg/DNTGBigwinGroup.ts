/*
 * @Author: wangtao 
 * @Date: 2019-03-27 13:55:32 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 15:00:40
 * @Description: 
 */
module dntg {
	export class DNTGBigwinGroup extends game.BaseComponent {
		public bigwinGroup: eui.Group;
		public bigwinStopRect: eui.Rect;
		public countWonLabel: eui.BitmapLabel;
		public bigwinTitle: eui.Image;

		public timer: egret.Timer;
		public testShowNum: number = 0;
		public score: number = 0;
		private scoreguang: DBComponent;

		public constructor() {
			super();
			this.skinName = new DNTGBigWinSkin();
		}
		public createChildren() {
			super.createChildren();
			game.LaohuUtils.scoreguang = DBComponent.create("dntg_scoreguang", "dntg_bigwin_guang");
			// game.LaohuUtils.scoreguang = new DBComponent("dntg_bigwin_guang");
		}
		public big_win_fire: DBComponent; //底部火焰特效
		public goldDown: eui.Group; //金币掉落的金币对象池资源组
		public changeTitleAni: DBComponent; //标题更换时底部光
		private isPlayingMusic: boolean = false; //是否在播放背景音乐
		private titleAniTimeout: any; //标题特效timeout
		private megaWinTextAni: DBComponent = DBComponent.create("dntg_megaWinTextAni", "dntg_megawin"); //megawin字体特效
		private superWinTextAni: DBComponent = DBComponent.create("dntg_superWinTextAni", "dntg_superwin"); //superwin字体特效
		/**
		 * 调用方法，展示bigwin特效
		 * @param  {number} score
		 * @param  {Function} callback?
		 */
		public scoreShow(score: number, callback?: Function) {
			this.score = score;
			this.testShowNum = 0;
			this.bigwinStopRect.alpha = 0;
			this.bigwinStopRect.touchEnabled = false;
			//延迟置灰屏幕，添加数字标题放大效果
			this.setAutoTimeout(() => {
				this.bigwinStopRect.touchEnabled = true;
				this.bigwinStopRect.alpha = this.bigwinTitle.alpha = this.countWonLabel.alpha = 1;
				this.bigwinTitle.scaleX = this.countWonLabel.scaleX = 0.2;
				this.countWonLabel.anchorOffsetX = this.countWonLabel.width / 2;
				this.countWonLabel.anchorOffsetY = this.countWonLabel.height / 2
				// this.big_win_fire = new DBComponent("huoguang");
				this.big_win_fire = DBComponent.create("dntg_big_win_fire", "huoguang");
				this.big_win_fire.play("fire_small", 0);
				this.big_win_fire.horizontalCenter = 0;
				this.big_win_fire.bottom = 0;
				this.big_win_fire.scaleX = 2;
				this.big_win_fire.scaleY = 2;
				this.big_win_fire.touchEnabled = false;
				this.bigwinTitle.scaleY = this.countWonLabel.scaleY = 0.2;
				egret.Tween.get(this.bigwinTitle).to({ scaleX: 1, scaleY: 1, y: this.bigwinTitle.y }, 200).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50);
				egret.Tween.get(this.countWonLabel).to({ scaleX: 1, scaleY: 1 }, 200)
				game.LaohuUtils.scoreguang.play("", 1);
				game.LaohuUtils.scoreguang.left = 650;
				game.LaohuUtils.scoreguang.bottom = 130;
				this.bigwinGroup.addChild(game.LaohuUtils.scoreguang);
				this.bigwinGroup.addChild(this.countWonLabel);
				this.addGoldDown();
				this.bigwinGroup.addChild(this.goldDown);
				SoundManager.getInstance().playEffect("bigwincombo_mp3");
				this.bigwinStopRect.fillAlpha = 0.7;
				SoundManager.getInstance().pauseMusic();
				let index1, index2, index3: number = 0
				this.timer = new egret.Timer(20);
				let is_maga, is_super, is_big: boolean = false;

				// game.LaohuUtils.titaleChangeAni = new DBComponent("win_change");
				game.LaohuUtils.titaleChangeAni = DBComponent.create("dntg_titaleChangeAni", "win_change");
				game.LaohuUtils.titaleChangeAni.touchEnabled = false;
				// game.LaohuUtils.titaleChangeAni.horizontalCenter = 250;
				// game.LaohuUtils.titaleChangeAni.bottom = 130;
				// game.LaohuUtils.titaleChangeAni.touchEnabled = false;

				// game.LaohuUtils.titaleChangeAni.play("super_win", -1);
				this.bigwinGroup.addChild(this.bigwinTitle);
				// game.LaohuUtils.titaleChangeAni.resetPosition();
				this.bigwinGroup.addChild(this.countWonLabel);
				this.bigwinGroup.addChild(this.big_win_fire);
				this.big_win_fire.resetPosition();
				//设置每帧添加的数值算法
				if (score) {
					if (score >= (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) * 15 && score < (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) * 30) {
						index1 = score / 200;
					}
					else if (score >= (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) * 30 && score < (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) * 50) {
						index1 = 30 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) / 200;
						index2 = (score - 30 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) / 350;
					}
					else if (score >= (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) * 50) {
						index1 = 30 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) / 200;
						index2 = 50 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) / 350;
						index3 = (score - 50 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) / 350;
					}
				}
				//开始计数
				this.timer.start();
				this.timer.addEventListener(egret.TimerEvent.TIMER, () => {
					if (this.testShowNum < (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) * 30 && this.testShowNum < score) {
						this.testShowNum += index1;
						//判断是否添加了动画
						if (!is_big) {
							game.LaohuUtils.titaleChangeAni.play("big_win", 0);
							game.LaohuUtils.titaleChangeAni.bottom = 400;
							game.LaohuUtils.titaleChangeAni.horizontalCenter = 0;
							this.bigwinGroup.addChild(game.LaohuUtils.titaleChangeAni);
							game.LaohuUtils.titaleChangeAni.resetPosition();
							this.bigwinGroup.addChild(this.bigwinTitle);
							this.bigwinGroup.addChild(this.countWonLabel);
						}
						is_big = true;
						this.bigwinTitle.source = "bigwinplist_json.big_win";

						this.countWonLabel.text = NumberFormat.handleFloatDecimal(this.testShowNum * 100, 0) + "";
					}
					else if (this.testShowNum < 50 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) && this.testShowNum >= 30 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) && this.testShowNum < score) {
						this.testShowNum += index2;
						//判断是否添加了动画
						if (!is_maga) {
							this.megaWinTextAni = DBComponent.create("dntg_megaWinTextAni", "dntg_megawin");
							// this.megaWinTextAni = new DBComponent("dntg_megawin");
							this.megaWinTextAni.touchEnabled = false;
							egret.Tween.get(this.bigwinTitle).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
								this.megaWinTextAni.play("dntg_megawin", 0);
								this.megaWinTextAni.horizontalCenter = 39;
								this.megaWinTextAni.bottom = 418;
								this.bigwinGroup.addChild(this.megaWinTextAni);
							});
							this.big_win_fire.play("fire_small", 0);
							game.LaohuUtils.titaleChangeAni.horizontalCenter = 0;
							game.LaohuUtils.titaleChangeAni.bottom = 400;
							this.bigwinGroup.addChild(game.LaohuUtils.titaleChangeAni);
							game.LaohuUtils.titaleChangeAni.play("mega_win", 0);
							game.LaohuUtils.scoreguang.play("", 1);
							game.LaohuUtils.scoreguang.left = 650;
							game.LaohuUtils.scoreguang.bottom = 130;
							this.bigwinGroup.addChild(this.bigwinTitle);
							this.bigwinGroup.addChild(game.LaohuUtils.scoreguang);
							this.bigwinGroup.addChild(this.countWonLabel);
							game.LaohuUtils.titaleChangeAni.resetPosition();

						}

						is_maga = true;
						this.bigwinTitle.source = "bigwinplist_json.MEGA_WIN";
						this.countWonLabel.text = NumberFormat.handleFloatDecimal(this.testShowNum * 100, 0) + "";
					}
					else if (this.testShowNum >= 50 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50) && this.testShowNum < score) {
						this.testShowNum += index3;
						//判断是否添加了动画
						if (!is_super) {
							this.superWinTextAni = DBComponent.create("dntg_superWinTextAni", "dntg_superwin");
							// this.superWinTextAni = new DBComponent("dntg_superwin");
							this.superWinTextAni.touchEnabled = false;
							egret.Tween.get(this.bigwinTitle).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
								game.UIUtils.removeSelf(this.megaWinTextAni);
								this.superWinTextAni.play("dntg_superwin", 0);
								this.superWinTextAni.horizontalCenter = 465;
								this.superWinTextAni.bottom = 420;
								this.bigwinGroup.addChild(this.superWinTextAni);
							});
							this.big_win_fire.play("fire_small", 0);
							game.LaohuUtils.titaleChangeAni.horizontalCenter = 0;
							game.LaohuUtils.titaleChangeAni.bottom = 400;
							this.bigwinGroup.addChild(game.LaohuUtils.titaleChangeAni);
							game.LaohuUtils.titaleChangeAni.play("super_win", 0);
							game.LaohuUtils.titaleChangeAni.resetPosition();
							game.LaohuUtils.scoreguang.play("", 1);
							game.LaohuUtils.scoreguang.left = 650;
							game.LaohuUtils.scoreguang.bottom = 130;
							this.bigwinGroup.addChild(this.bigwinTitle);
							this.bigwinGroup.addChild(game.LaohuUtils.scoreguang);
							this.bigwinGroup.addChild(this.countWonLabel);

						}
						is_super = true;

						this.bigwinTitle.source = "bigwinplist_json.SUPER_WIN";
						this.countWonLabel.text = NumberFormat.handleFloatDecimal(this.testShowNum * 100, 0) + "";
					} else {
						//满足条件timer结束，调用callback方法
						this.timer.stop();
						this.countWonLabel.text = NumberFormat.handleFloatDecimal(score * 100, 0) + "";
						SoundManager.getInstance().stopAllEffects();
						SoundManager.getInstance().playEffect("bigwincomboend_mp3");
						this.removeThisPanel(callback);
						//刚好满足bet的倍数时补加特效
						if (score == 30 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) {
							egret.Tween.get(this.bigwinTitle).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
								this.megaWinTextAni.play("dntg_megawin", 0);
								this.megaWinTextAni.horizontalCenter = 39;
								this.megaWinTextAni.bottom = 418;
								game.LaohuUtils.titaleChangeAni.horizontalCenter = 0;
								game.LaohuUtils.titaleChangeAni.bottom = 400;
								this.bigwinGroup.addChild(game.LaohuUtils.titaleChangeAni);
								game.LaohuUtils.titaleChangeAni.play("mega_win", 1);
								this.bigwinGroup.addChild(this.bigwinTitle);
								this.bigwinGroup.addChild(this.megaWinTextAni);
								game.LaohuUtils.titaleChangeAni.resetPosition();
							})

						}
						if (score == 50 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) {
							egret.Tween.get(this.bigwinTitle).to({ scaleX: 0.2, scaleY: 0.2 }, 20).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineOut).to({ scaleX: 0.8, scaleY: 0.8 }, 80).to({ scaleX: 1.1, scaleY: 1.1 }, 60).to({ scaleX: 0.9, scaleY: 0.9 }, 60).to({ scaleX: 1, scaleY: 1 }, 50).call(() => {
								game.UIUtils.removeSelf(this.megaWinTextAni);
								this.superWinTextAni.play("dntg_superwin", 0);
								this.superWinTextAni.horizontalCenter = 465;
								this.superWinTextAni.bottom = 420;
								game.LaohuUtils.titaleChangeAni.horizontalCenter = 0;
								game.LaohuUtils.titaleChangeAni.bottom = 400;
								this.bigwinGroup.addChild(game.LaohuUtils.titaleChangeAni);
								game.LaohuUtils.titaleChangeAni.play("super_win", 1);
								game.LaohuUtils.titaleChangeAni.resetPosition();
								this.bigwinGroup.addChild(this.bigwinTitle);
								this.bigwinGroup.addChild(this.superWinTextAni);
								this.bigwinGroup.addChild(this.countWonLabel);
							})

						}
						if (score >= 30 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) {
							game.LaohuUtils.titaleChangeAni.play("mega_win", 0); this.bigwinTitle.source = "bigwinplist_json.MEGA_WIN";
							this.megaWinTextAni.play("dntg_megawin", 0);
							this.megaWinTextAni.horizontalCenter = 39;
							this.megaWinTextAni.bottom = 418;
							this.bigwinGroup.addChild(this.megaWinTextAni);
						}
						if (score >= 50 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) {
							game.LaohuUtils.titaleChangeAni.play("super_win", 0); this.bigwinTitle.source = "bigwinplist_json.SUPER_WIN";
							game.UIUtils.removeSelf(this.megaWinTextAni);
							this.superWinTextAni.play("dntg_superwin", 0);
							this.superWinTextAni.horizontalCenter = 465;
							this.superWinTextAni.bottom = 420;
							this.bigwinGroup.addChild(this.superWinTextAni);
						}
					}
				}, this);
			}, this, 1500)

		}
		/**
		 * 金币对象池金币效果
		 */
		private timer2: egret.Timer
		private addGoldDown() {
			this.timer2 = new egret.Timer(250);
			this.timer2.addEventListener(egret.TimerEvent.TIMER, () => {
				if (this.goldDown.numChildren < 25) {
					let gold_right1 = game.GoldDownPanel.createGold("coin_r1");
					this.goldDown.addChild(gold_right1);
					let gold_right2 = game.GoldDownPanel.createGold("coin_r2");
					this.goldDown.addChild(gold_right2);
					let gold_left1 = game.GoldDownPanel.createLeftGold("coin_l1");
					this.goldDown.addChild(gold_left1);
					let gold_left2 = game.GoldDownPanel.createLeftGold("coin_l2");
					this.goldDown.addChild(gold_left2);
				}
			}, this);
			this.timer2.start();
		}
		// public onTouchTap(e: egret.TouchEvent) {
		// 	switch (e.target) {
		// 		case this.bigwinStopRect:
		// 			this.stopShowBigWin()
		// 			break;
		// 	}
		// }
		private isTouched: boolean = false;
		/**
		 * bigwin播放结束调用方法
		 * @param  {Function} callback?
		 */
		public stopShowBigWin(callback?: Function) {
			//禁止重复点击
			if (!this.isTouched) {
				this.isTouched = true;
				SoundManager.getInstance().playEffect("bigwincomboend_mp3");
				this.timer.stop();
				SoundManager.getInstance().stopEffectByName("bigwincombo_mp3");
				if (this.score >= 30 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) {
					game.LaohuUtils.titaleChangeAni.play("mega_win", 0); this.bigwinTitle.source = "bigwinplist_json.MEGA_WIN";
					this.megaWinTextAni.play("dntg_megawin", 0);
					this.megaWinTextAni.horizontalCenter = 39;
					this.megaWinTextAni.bottom = 418;
					this.bigwinGroup.addChild(this.megaWinTextAni);
				}
				if (this.score >= 50 * (game.LaohuUtils.bet * game.LaohuUtils.mul * 50)) {
					game.LaohuUtils.titaleChangeAni.play("super_win", 0); this.bigwinTitle.source = "bigwinplist_json.SUPER_WIN";
					game.UIUtils.removeSelf(this.megaWinTextAni);
					this.superWinTextAni.play("dntg_superwin", 0);
					this.superWinTextAni.horizontalCenter = 465;
					this.superWinTextAni.bottom = 420;
					this.bigwinGroup.addChild(this.superWinTextAni);
				}
				this.countWonLabel.text = NumberFormat.handleFloatDecimal(this.score * 100, 0) + "";
				this.removeThisPanel(callback);
			}
		}
		/**
		 * 移除bigwin效果方法（外部调用）
		 * @param  {Function} callback?
		 */
		public removeThisPanel(callback?: Function) {
			ObjectPool.cancelPool("coin_r1");
			ObjectPool.cancelPool("coin_r2");
			ObjectPool.cancelPool("coin_l1");
			ObjectPool.cancelPool("coin_l1");
			this.goldDown.removeChildren();
			game.UIUtils.removeSelf(game.LaohuUtils.titaleChangeAni);
			this.isTouched = true;
			this.timer2.stop();
			this.setAutoTimeout(() => {
				game.UIUtils.removeSelf(this.big_win_fire);
				SoundManager.getInstance().stopEffectByName("bigwincomboend_mp3");
				//恢复背景音乐
				SoundManager.getInstance().remuseMusic();
				this.bigwinStopRect.fillAlpha = 0;
				this.countWonLabel.alpha = 0;
				this.bigwinTitle.alpha = 0;
				callback && callback();
				game.UIUtils.removeSelf(this.megaWinTextAni);
				game.UIUtils.removeSelf(this.superWinTextAni);
				this.removeChildren();
				if (this.parent) {
					this.parent.removeChild(this);
				}
			}, this, 4000)
		}

		public showpanel() {
			this.visible = true;
		}
	}
}