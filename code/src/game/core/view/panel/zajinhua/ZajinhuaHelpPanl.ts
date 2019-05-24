module zajinhua {
	export class ZajinhuaHelpPanl extends game.BaseComponent {
		private closeBtn: eui.Button;
		private images: eui.Image;
		public resizeGroup: eui.Group;
		private imageGroup: eui.Group;
		private pxsmBtn: eui.RadioButton;
		private jbgzBtn: eui.RadioButton;
		private rects: eui.Rect;
		private scor: eui.Scroller;
		public constructor() {
			super();
			this.skinName = new ZajinhuaHelpSkin();
		}

		protected createChildren() {
			super.createChildren();
			this.jbgzBtn.selected = true;
			this.images.source = RES.getRes(this.imageSource(1));
			this.imageGroup.addChild(this.images);
			// this.images.width = 680;
			// this.images.height = 803;
			this.scor.scrollPolicyH = "off";
			// this.scor.bounces = false;

		}

		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.pxsmBtn:
					this.images.source = RES.getRes(this.imageSource(2));
					this.scor.viewport.scrollV = 0;
					// this.imageGroup.addChild(this.images);
					break;
				case this.jbgzBtn:
					this.scor.viewport.scrollV = 0;
					this.images.source = RES.getRes(this.imageSource(1));
					// this.imageGroup.addChild(this.images);
					break;
				case this.closeBtn:
				case this.rects:
					this.rects.visible = false;
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_ZJHHELP);
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
					return "zjh_rule_png";
				case 2:
					return "zjh_pxjs_png";
			}

		}

		public onAdded() {
			super.onAdded();
		}
	}
}