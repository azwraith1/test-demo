
module rbwar {
	export class RBWHelpPanl extends game.BaseComponent {
		private closeBtn: eui.Button;
		private images: eui.Image;
		public resizeGroup: eui.Group;
		private imageGroup: eui.Group;
		private pfBtn: eui.RadioButton;
		private pxsmBtn: eui.RadioButton;
		private jbgzBtn: eui.RadioButton;
		private rects: eui.Rect;
		private scor: eui.Scroller;
		public constructor() {
			super();
			this.skinName = new RBWHelpPanlSkin();
		}

		protected createChildren() {
			super.createChildren();
			this.jbgzBtn.selected = true;
			this.images.source = RES.getRes(this.imageSource(1));
			this.imageGroup.addChild(this.images);
			this.images.width = 792;
			this.images.height = 800;

		}

		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			this.scor.viewport.scrollV = 0;
			switch (e.target) {
				case this.pfBtn:
					this.images.source = RES.getRes(this.imageSource(3));
					this.imageGroup.addChild(this.images);
					this.images.width = 792;
					this.images.height = 800;
					break;
				case this.pxsmBtn:
					this.images.source = RES.getRes(this.imageSource(2));
					this.imageGroup.addChild(this.images);
					this.images.width = 792;
					this.images.height = 800;
					break;
				case this.jbgzBtn:
					this.images.source = RES.getRes(this.imageSource(1));
					this.imageGroup.addChild(this.images);
					this.images.width = 792;
					this.images.height = 800;
					break;
				case this.closeBtn:
				case this.rects:
					this.rects.visible = false;
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_RBWARHELP);
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
					return "rbw_1_png";
				case 2:
					return "rbw_2_png";
				case 3:
					return "rbw_3_png";
			}

		}

		public onAdded() {
			super.onAdded();
		}
	}
}