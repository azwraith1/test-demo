module game {
	export class BaseItemRender extends eui.ItemRenderer {
		public constructor() {
			super();
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
		}

		/**
		 * 当添加到舞台上
		 */
		protected onAdded() {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
		}

		/**
		 * 当添加到舞台上
		 */
		protected onRemoved() {
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
			this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);

			UIUtils.removeButtonScaleEffects(this);
		}

		protected createChildren() {
			super.createChildren();

			UIUtils.addButtonScaleEffects(this);
		}

		protected onTouchTap(e: egret.TouchEvent) {

		}
	}
}