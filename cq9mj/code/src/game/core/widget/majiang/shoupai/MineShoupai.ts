/*
 * @Author: Li MengChan 
 * @Date: 2018-06-28 10:10:59 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-03 19:03:06
 * @Description: 面向玩家手牌
 */
module majiang {
	export class MineShoupai extends eui.Component {
		//麻将存储数据格式
		public value: number = 0;
		private bgImage: eui.Image;
		private colorImage: eui.Image;
		public selected: boolean = false;
		public lock: boolean = false;
		private maskRect: eui.Rect;
		private maskRect1: eui.Rect;
		private touchHeight: number = 30;
		public huTip: eui.Image;
		private index: number;
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
			this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchTap, this);
			// this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startMove, this);
			// this.addEventListener(egret.TouchEvent.TOUCH_END, this.stopMove, this);
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

		public onTouchTap(e: egret.TouchEvent) {
			majiang.MajiangUtils.playClick();
			if (this.lock) {
				return;
			}
			this.touchOn();
		}

		public touchOn() {
			EventManager.instance.dispatch(EventNotify.SHOUPAI_TOUCH, this);
		}

		public selectUp(){
			this.y = this.touchHeight;
			this.selected = true;
		}	

		public selectDown(){
			this.y = this.anchorOffsetY;
			this.selected = false;
		}	

		/**
		 * 如果选中就放下 ，否者就升起
		 */
		public selectTouch() {
			if (this.y == this.anchorOffsetY) {
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
			let mjColor = Math.floor(this.value / 10);
			this.setLihight(game.Utils.valueEqual(color, mjColor));
		}

		public huLight() {
			this.maskRect.visible = true;
			this.lock = true;
			this.touchEnabled = false;
		}

		// //要拖拽的对象
		// private draggedObject: egret.Shape;
		// private offsetX: number;
		// private offsetY: number;
		// private copyPai: MineShoupaiCopy;
		// public startMove(e: egret.TouchEvent): void {
		// 	//把手指按到的对象记录下来
		// 	this.draggedObject = e.currentTarget;
		// 	this.copyPai = new MineShoupaiCopy(this.draggedObject["value"]);
		// 	this.copyPai.x = this.draggedObject.x;
		// 	this.copyPai.y = this.draggedObject.y;
		// 	//计算手指和要拖动的对象的距离
		// 	this.offsetX = e.stageX - this.copyPai.x;
		// 	this.offsetY = e.stageY - this.copyPai.y;
		// 	//把触摸的对象放在显示列表的顶层

		// 	//手指在屏幕上移动，会触发 onMove 方法
		// 	this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
		// }
		// public stopMove(e: egret.TouchEvent) {
		// 	this.parent.removeChild(this.copyPai);
		// 	//手指离开屏幕，移除手指移动的监听
		// 	this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
		// }
		// public onMove(e: egret.TouchEvent): void {
		// 	this.parent.addChild(this.copyPai);
		// 	//通过计算手指在屏幕上的位置，计算当前对象的坐标，达到跟随手指移动的效果
		// 	this.copyPai.x = e.stageX - this.offsetX;
		// 	this.copyPai.y = e.stageY - this.offsetY;
		// }

	}
}