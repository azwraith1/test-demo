/*
 * @Author: Li MengChan 
 * @Date: 2018-06-28 10:10:59 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-23 10:55:39
 * @Description: 面向玩家手牌
 */
module majiang {
	export class MineShoupai extends game.BaseUI {
		//麻将存储数据格式
		public value: number = 0;
		public bgImage: eui.Image;
		private colorImage: eui.Image;
		public selected: boolean = false;
		public lock: boolean = false;
		private maskRect: eui.Rect;
		private maskRect1: eui.Rect;
		private touchHeight: number = 30;
		public huTip: eui.Image;
		private index: number;
		private tingLock: boolean = false;
		public constructor(value) {
			super();
			this.value = value;
			this.skinName = new MineShoupaiSkin();

		}
		public createChildren() {
			super.createChildren();
			this.touchEnabled = true;
			this.touchHeight = 30;
			this.initWithData(this.value);
			this.maskRect.mask = this.bgImage;
		}

		public onRemoved() {
			super.onRemoved();
			this.removeTouch();
		}

		public addTouch() {
			if(this.hasEventListener(egret.TouchEvent.TOUCH_END)){
				return;
			}
			this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchTap1, this);
		}

		public removeTouch() {
			this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchTap1, this);
		}

		public setPosition(pos) {
			this.index = pos;
		}

		public initWithData(value) {
			if (value == 0) {
				this.visible = false;
			}
			this.colorImage.source = RES.getRes("color_value_" + this.value + "_png");
		}

		public resetValue(value) {
			this.value = value;
			if (this.value == 0) {
				this.colorImage.source = "";
			} else {
				this.colorImage.source = RES.getRes("color_value_" + this.value + "_png");
			}
		}

		public onTouchTap1(e: egret.TouchEvent) {
			majiang.MajiangUtils.playClick();
			if (this.lock) {
				return;
			}
			this.touchOn();
		}

		public touchOn() {
			EventManager.instance.dispatch(EventNotify.SHOUPAI_TOUCH, this);
		}

		public selectUp() {
			this.y = this.touchHeight;
			this.selected = true;
		}

		public selectDown() {
			this.y = this.anchorOffsetY;
			this.selected = false;
		}

		/**
		 * 如果选中就放下 ，否者就升起
		 */
		public selectTouch() {
			if (!this.selected) {
				this.y = this.touchHeight;
				this.selected = true;
			} else {
				this.y = this.anchorOffsetY;
				this.selected = false;
			}
			return this.selected;
		}

		public change2NoSelect() {
			this.y = this.anchorOffsetY;
			this.selected = false;
		}

		/**
		 * 做一个简单地下降动画
		 */
		public showDownAni() {
			this.lock = true;
			this.y = 0;
			egret.Tween.get(this).to({
				y: this.anchorOffsetY
			}, 300).call(() => {
				this.lock = false;
			});
		}

		/**
		 * 显示遮罩层
		 * @param  {} isVisible
		 */
		public setLihight(isVisible: boolean) {
			this.maskRect.visible = isVisible;
		}

		public colorIsLight(color) {
			if (this.lock) {
				return;
			}
			if (this.tingLock) {
				return;
			}
			let mjColor = Math.floor(this.value / 10);
			this.setLihight(game.Utils.valueEqual(color, mjColor));
		}

		public huLight() {
			this.maskRect.visible = true;
			this.lock = true;
			this.touchEnabled = false;
		}

		public tingLight() {
			this.tingLock = true;
			// this.touchEnabled = false;
			this.maskRect.visible = true;
			this.change2NoSelect();
		}

		public huUnLight() {
			this.maskRect.visible = false;
			this.lock = false;
			this.touchEnabled = true;
		}

	}
}