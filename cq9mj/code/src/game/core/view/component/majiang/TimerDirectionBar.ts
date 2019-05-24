/*
 * @Author: Li MengChan 
 * @Date: 2018-06-28 16:41:05 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:04:02
 * @Description: 麻将计时器带东西南北控制
 * ewsn: 暗色东西南北 EWSN 高亮东西南北
 */
module majiang {
	export class TimerDirectionBar extends eui.Component implements IUpdate {
		// private timeLabel: eui.BitmapLabel;
		private leftBg: eui.Image;
		private rightBg: eui.Image;
		private mineBg: eui.Image;
		private topBg: eui.Image;
		private timeLabel1: eui.BitmapLabel
		public constructor() {
			super();
			// this.skinName = new TimerDirectionBarSkin();
		}

		public createChildren() {
			super.createChildren();
			this.changeToUnLight();
		}

		/**
		 * 回复出事默认状态
		 */
		public changeToUnLight() {
			this.leftBg.visible = this.rightBg.visible = this.mineBg.visible = this.topBg.visible = false;
		}

		/**
		 * 展现方向
		 * @param  {} direcion
		 */
		public showLightByDirection(direcion) {
			this.changeToUnLight();
			this[direcion + "Bg"].visible = true;
			this.removeAllTween();
			egret.Tween.get(this[direcion + "Bg"], { loop: true }).to({
				alpha: 0.5
			}, 300).to({
				alpha: 1
			}, 300)
		}

		public removeAllTween() {
			egret.Tween.removeTweens(this.leftBg);
			this.leftBg.alpha = 1;
			egret.Tween.removeTweens(this.rightBg);
			this.rightBg.alpha = 1;
			egret.Tween.removeTweens(this.topBg);
			this.topBg.alpha = 1;
			egret.Tween.removeTweens(this.mineBg);
			this.mineBg.alpha = 1;
		}

		private root: MajiangScene;
		public startTime(root) {
			this.root = root;
			game.UpdateTickerManager.instance.add(this);
		}

		public update(dt: number) {
			if (Global.gameProxy.roomInfo && Global.gameProxy.roomInfo.countdown) {
				let endTime = Global.gameProxy.roomInfo.countdown.end;
				let startTime = game.DateTimeManager.instance.now;
				let cha = endTime - startTime;
				if (cha <= 0) {
					this.timeLabel1.text = "00";
					return;
				}
				this.timeLabel1.text  = NumberFormat.getTimeStr(cha);
			}
		}

		public removeTimer() {
			// this.timeLabel1.text = "00";
			game.UpdateTickerManager.instance.remove(this);
		}
	}
}