module dzmj {
	export class DZMJHelpPanel extends game.BaseComponent {
		private closeBtn: eui.Button;
		private images: eui.Image;
		public resizeGroup: eui.Group;
		private imageGroup: eui.Group;
		private pxgzBtn: eui.RadioButton;
		private jbgzBtn: eui.RadioButton;
		private rects: eui.Rect;
		private scor: eui.Scroller;
		public constructor() {
			super();
			this.skinName = new DZMJHelpPanelSkin();
		}

		protected createChildren() {
			super.createChildren();
			this.jbgzBtn.selected = true;
			this.images.source = RES.getRes(this.imageSource(1));
			this.images.scaleX = this.images.scaleY = 0.5;
			// this.imageGroup.addChild(this.images);
			this.scor.scrollPolicyH = "off";
		}

		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.pxgzBtn:
					this.images.source = RES.getRes(this.imageSource(2));
					this.scor.stopAnimation();
					this.scor.viewport.scrollV = 0;
					this.images.scaleX = this.images.scaleY = 1;
					// this.imageGroup.addChild(this.images);
					break;
				case this.jbgzBtn:
					this.scor.stopAnimation();
					this.scor.viewport.scrollV = 0;
					this.images.source = RES.getRes(this.imageSource(1));
					this.images.scaleX = this.images.scaleY = 0.5;
					// this.imageGroup.addChild(this.images);
					break;
				case this.closeBtn:
				case this.rects:
					this.rects.visible = false;
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_DZMJ_HELP);
					break;
			}


		}
		public textNums() {

		}

		/**
		 * 是否显示或者隐藏文字类容
		 */
		public showOrFalse(number) {

		}

		/**
		 * 左边按钮组互斥
		 */
		private leftBtnChose(num) {

		}

		private imageSource(Image_number) {
			switch (Image_number) {
				case 1:
					return "dzmj_help_jbgz_png";
				case 2:
					return "dzmj_help_fxgz_png";
			}

		}

		public onAdded() {
			super.onAdded();
		}
	}
}