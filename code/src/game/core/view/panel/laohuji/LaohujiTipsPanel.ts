module game {
	export class TipsPanel extends game.BaseComponent {
		private tip_1: eui.Image;
		private tip_2: eui.Image;
		private tip_3: eui.Image;
		private close_btn_1: eui.Button;
		private close_btn_2: eui.Button;
		private close_btn_3: eui.Button;
		private tip_group_1: eui.Group;
		private tip_group_2: eui.Group;
		private tip_group_3: eui.Group;

		private shp_1: egret.Shape;
		private shp_2: egret.Shape;
		private shp_3: egret.Shape;
		private beginX: number;
		private endX: number;
		private right_1: eui.Button;
		private right_2: eui.Button;
		private left_1: eui.Button;
		private left_2: eui.Button;

		private icon_3X5: eui.BitmapLabel;
		private icon_3X4: eui.BitmapLabel;
		private icon_3X3: eui.BitmapLabel;
		private icon_4X5: eui.BitmapLabel;
		private icon_4X4: eui.BitmapLabel;
		private icon_4X3: eui.BitmapLabel;
		private icon_5X5: eui.BitmapLabel;
		private icon_5X4: eui.BitmapLabel;
		private icon_5X3: eui.BitmapLabel;
		private icon_6X5: eui.BitmapLabel;
		private icon_6X4: eui.BitmapLabel;
		private icon_6X3: eui.BitmapLabel;
		private icon_7X5: eui.BitmapLabel;
		private icon_7X4: eui.BitmapLabel;
		private icon_7X3: eui.BitmapLabel;
		private icon_8X5: eui.BitmapLabel;
		private icon_8X4: eui.BitmapLabel;
		private icon_8X3: eui.BitmapLabel;
		private icon_9X5: eui.BitmapLabel;
		private icon_9X4: eui.BitmapLabel;
		private icon_9X3: eui.BitmapLabel;
		private icon_10X5: eui.BitmapLabel;
		private icon_10X4: eui.BitmapLabel;
		private icon_10X3: eui.BitmapLabel;
		private icon_11X5: eui.BitmapLabel;
		private icon_11X4: eui.BitmapLabel;
		private icon_11X3: eui.BitmapLabel;
		private icon_12X5: eui.BitmapLabel;
		private icon_12X4: eui.BitmapLabel;
		private icon_12X3: eui.BitmapLabel;
		public resizeGroup: eui.Group;

		public constructor() {
			super();
			this.skinName = new TipsPanelSkin();
		}

		protected partAdded(partName: string, instance: any): void {
			super.partAdded(partName, instance);
		}


		protected childrenCreated(): void {
			super.childrenCreated();
			this.tip_group_1.width = this.tip_group_2.width = this.tip_group_3.width = this.stage.width;
			this.initData();
			// this.shp_1 = new egret.Shape();
			// this.shp_1.x = 600;
			// this.shp_1.y = 680;
			// this.shp_1.graphics.lineStyle(10, 0xdd7016);
			// this.shp_1.graphics.beginFill(0xdd7016, 1);
			// this.shp_1.graphics.drawCircle(0, 0, 10);
			// this.shp_1.graphics.endFill();
			// this.addChild(this.shp_1);

			// this.shp_2 = new egret.Shape();
			// this.shp_2.x = 640;
			// this.shp_2.y = 680;
			// this.shp_2.graphics.lineStyle(10, 0xffffff);
			// this.shp_2.graphics.beginFill(0xffffff, 1);
			// this.shp_2.graphics.drawCircle(0, 0, 10);
			// this.shp_2.graphics.endFill();
			// this.addChild(this.shp_2);

			// this.shp_3 = new egret.Shape();
			// this.shp_3.x = 680;
			// this.shp_3.y = 680;
			// this.shp_3.graphics.lineStyle(10, 0xffffff);
			// this.shp_3.graphics.beginFill(0xffffff, 1);
			// this.shp_3.graphics.drawCircle(0, 0, 10);
			// this.shp_3.graphics.endFill();
			// this.addChild(this.shp_3);
			// this.tip_group.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
			// this.tip_group.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
			// this.tip_group.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
			this.close_btn_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			this.close_btn_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			this.close_btn_3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			this.right_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.turnRight1, this);
			this.right_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.turnRight2, this);
			this.left_1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.turnLeft1, this);
			this.left_2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.turnLeft2, this);
		}

		public initData() {
			let data
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(2000));
			this.icon_3X5.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(200));
			this.icon_3X4.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(20));
			this.icon_3X3.text = NumberFormat.handleFloatDecimal(data) + "";

			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(1500));
			this.icon_4X5.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(150));
			this.icon_4X4.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(15));
			this.icon_4X3.text = NumberFormat.handleFloatDecimal(data) + "";

			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(750));
			this.icon_5X5.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(125));
			this.icon_5X4.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(12));
			this.icon_5X3.text = NumberFormat.handleFloatDecimal(data) + "";

			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(500));
			this.icon_6X5.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(100));
			this.icon_6X4.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(10));
			this.icon_6X3.text = NumberFormat.handleFloatDecimal(data) + "";

			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(200));
			this.icon_7X5.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(30));
			this.icon_7X4.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(8));
			this.icon_7X3.text = NumberFormat.handleFloatDecimal(data) + "";

			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(200));
			this.icon_8X5.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(30));
			this.icon_8X4.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(8));
			this.icon_8X3.text = NumberFormat.handleFloatDecimal(data) + "";

			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(150));
			this.icon_9X5.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(20));
			this.icon_9X4.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(5));
			this.icon_9X3.text = NumberFormat.handleFloatDecimal(data) + "";

			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(150));
			this.icon_10X5.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(20));
			this.icon_10X4.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(5));
			this.icon_10X3.text = NumberFormat.handleFloatDecimal(data) + "";

			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(100));
			this.icon_11X5.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(15));
			this.icon_11X4.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(2));
			this.icon_11X3.text = NumberFormat.handleFloatDecimal(data) + "";

			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(100));
			this.icon_12X5.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(15));
			this.icon_12X4.text = NumberFormat.handleFloatDecimal(data) + "";
			data = Number(new Big(LaohuUtils.mul * LaohuUtils.bet).mul(2));
			this.icon_12X3.text = NumberFormat.handleFloatDecimal(data) + "";
		}

		private turnRight1() {
			SoundManager.getInstance().playEffect("button_dntg_mp3");
			this.tip_group_1.visible = false;
			this.tip_group_2.visible = true;
			// egret.Tween.get(this.tip_group_1).to({ x: - this.stage.width }, 500, egret.Ease.sineIn);
			// egret.Tween.get(this.tip_group_2).to({ x: 0 }, 500, egret.Ease.sineIn);
			// egret.Tween.get(this.tip_group_3).to({ x: this.stage.width }, 500, egret.Ease.sineIn);
		}
		private turnRight2() {
			SoundManager.getInstance().playEffect("button_dntg_mp3");
			this.tip_group_1.visible = this.tip_group_2.visible = false;
			this.tip_group_3.visible = true;
			// egret.Tween.get(this.tip_group_1).to({ x: - this.stage.width*2 }, 500, egret.Ease.sineIn);
			// egret.Tween.get(this.tip_group_2).to({ x: -this.stage.width }, 500, egret.Ease.sineIn);
			// egret.Tween.get(this.tip_group_3).to({ x: 0 }, 500, egret.Ease.sineIn);
		}
		private turnLeft1() {
			SoundManager.getInstance().playEffect("button_dntg_mp3");
			this.tip_group_1.visible = true;
			this.tip_group_3.visible = this.tip_group_2.visible = false;
			// egret.Tween.get(this.tip_group_1).to({ x: 0 }, 500, egret.Ease.sineIn);
			// egret.Tween.get(this.tip_group_2).to({ x: this.stage.width }, 500, egret.Ease.sineIn);
			// egret.Tween.get(this.tip_group_3).to({ x: this.stage.width*2 }, 500, egret.Ease.sineIn);
		}
		private turnLeft2() {
			SoundManager.getInstance().playEffect("button_dntg_mp3");
			this.tip_group_2.visible = true;
			this.tip_group_1.visible =this.tip_group_3.visible = false;
			// egret.Tween.get(this.tip_group_1).to({ x: -this.stage.width }, 500, egret.Ease.sineIn);
			// egret.Tween.get(this.tip_group_2).to({ x: 0 }, 500, egret.Ease.sineIn);
			// egret.Tween.get(this.tip_group_3).to({ x: this.stage.width }, 500, egret.Ease.sineIn);
		}
		protected touchBegin(e: egret.TouchEvent) {
			this.beginX = e.stageX;
		}

		protected touchMove(e: egret.TouchEvent) {
			// this.stage.x += this.beginX - this.endX;

		}

		// protected touchEnd(e: egret.TouchEvent) {
		// 	this.endX = e.stageX;
		// 	if (this.beginX - this.endX > 0 && this.tip_group.x > -2560) {
		// 		egret.Tween.get(this.tip_group).to({ x: this.tip_group.x - 1280 }, 500, egret.Ease.sineIn).call(() => {
		// 			switch (this.tip_group.x) {
		// 				case 0:
		// 					this.removeChild(this.shp_1);
		// 					this.shp_1 = new egret.Shape();
		// 					this.shp_1.x = 600;
		// 					this.shp_1.y = 680;
		// 					this.shp_1.graphics.lineStyle(10, 0xdd7016);
		// 					this.shp_1.graphics.beginFill(0xdd7016, 1);
		// 					this.shp_1.graphics.drawCircle(0, 0, 10);
		// 					this.shp_1.graphics.endFill();
		// 					// this.addChild(this.shp_1);
		// 					this.removeChild(this.shp_2);
		// 					this.shp_2 = new egret.Shape();
		// 					this.shp_2.x = 640;
		// 					this.shp_2.y = 680;
		// 					this.shp_2.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_2.graphics.beginFill(0xffffff, 1);
		// 					this.shp_2.graphics.drawCircle(0, 0, 10);
		// 					this.shp_2.graphics.endFill();
		// 					// this.addChild(this.shp_2);
		// 					this.removeChild(this.shp_3);
		// 					this.shp_3 = new egret.Shape();
		// 					this.shp_3.x = 680;
		// 					this.shp_3.y = 680;
		// 					this.shp_3.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_3.graphics.beginFill(0xffffff, 1);
		// 					this.shp_3.graphics.drawCircle(0, 0, 10);
		// 					this.shp_3.graphics.endFill();
		// 					// this.addChild(this.shp_3);
		// 					break;
		// 				case -1280:
		// 					this.removeChild(this.shp_1);
		// 					this.shp_1 = new egret.Shape();
		// 					this.shp_1.x = 600;
		// 					this.shp_1.y = 680;
		// 					this.shp_1.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_1.graphics.beginFill(0xffffff, 1);
		// 					this.shp_1.graphics.drawCircle(0, 0, 10);
		// 					this.shp_1.graphics.endFill();
		// 					// this.addChild(this.shp_1);
		// 					this.removeChild(this.shp_2);
		// 					this.shp_2 = new egret.Shape();
		// 					this.shp_2.x = 640;
		// 					this.shp_2.y = 680;
		// 					this.shp_2.graphics.lineStyle(10, 0xdd7016);
		// 					this.shp_2.graphics.beginFill(0xdd7016, 1);
		// 					this.shp_2.graphics.drawCircle(0, 0, 10);
		// 					this.shp_2.graphics.endFill();
		// 					// this.addChild(this.shp_2);
		// 					this.removeChild(this.shp_3);
		// 					this.shp_3 = new egret.Shape();
		// 					this.shp_3.x = 680;
		// 					this.shp_3.y = 680;
		// 					this.shp_3.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_3.graphics.beginFill(0xffffff, 1);
		// 					this.shp_3.graphics.drawCircle(0, 0, 10);
		// 					this.shp_3.graphics.endFill();
		// 					// this.addChild(this.shp_3);
		// 					break;
		// 				case -2560:
		// 					this.removeChild(this.shp_1);
		// 					this.shp_1 = new egret.Shape();
		// 					this.shp_1.x = 600;
		// 					this.shp_1.y = 680;
		// 					this.shp_1.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_1.graphics.beginFill(0xffffff, 1);
		// 					this.shp_1.graphics.drawCircle(0, 0, 10);
		// 					this.shp_1.graphics.endFill();
		// 					// this.addChild(this.shp_1);
		// 					this.removeChild(this.shp_2);
		// 					this.shp_2 = new egret.Shape();
		// 					this.shp_2.x = 640;
		// 					this.shp_2.y = 680;
		// 					this.shp_2.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_2.graphics.beginFill(0xffffff, 1);
		// 					this.shp_2.graphics.drawCircle(0, 0, 10);
		// 					this.shp_2.graphics.endFill();
		// 					// this.addChild(this.shp_2);
		// 					this.removeChild(this.shp_3);
		// 					this.shp_3 = new egret.Shape();
		// 					this.shp_3.x = 680;
		// 					this.shp_3.y = 680;
		// 					this.shp_3.graphics.lineStyle(10, 0xdd7016);
		// 					this.shp_3.graphics.beginFill(0xdd7016, 1);
		// 					this.shp_3.graphics.drawCircle(0, 0, 10);
		// 					this.shp_3.graphics.endFill();
		// 					// this.addChild(this.shp_3);
		// 					break;

		// 			}
		// 		});
		// 	} else if (this.beginX - this.endX < 0 && this.tip_group.x < -1) {
		// 		egret.Tween.get(this.tip_group).to({ x: this.tip_group.x + 1280 }, 500, egret.Ease.sineIn).call(() => {
		// 			switch (this.tip_group.x) {
		// 				case 0:
		// 					this.removeChild(this.shp_1);
		// 					this.shp_1 = new egret.Shape();
		// 					this.shp_1.x = 600;
		// 					this.shp_1.y = 680;
		// 					this.shp_1.graphics.lineStyle(10, 0xdd7016);
		// 					this.shp_1.graphics.beginFill(0xdd7016, 1);
		// 					this.shp_1.graphics.drawCircle(0, 0, 10);
		// 					this.shp_1.graphics.endFill();
		// 					// this.addChild(this.shp_1);
		// 					this.removeChild(this.shp_2);
		// 					this.shp_2 = new egret.Shape();
		// 					this.shp_2.x = 640;
		// 					this.shp_2.y = 680;
		// 					this.shp_2.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_2.graphics.beginFill(0xffffff, 1);
		// 					this.shp_2.graphics.drawCircle(0, 0, 10);
		// 					this.shp_2.graphics.endFill();
		// 					// this.addChild(this.shp_2);
		// 					this.removeChild(this.shp_3);
		// 					this.shp_3 = new egret.Shape();
		// 					this.shp_3.x = 680;
		// 					this.shp_3.y = 680;
		// 					this.shp_3.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_3.graphics.beginFill(0xffffff, 1);
		// 					this.shp_3.graphics.drawCircle(0, 0, 10);
		// 					this.shp_3.graphics.endFill();
		// 					// this.addChild(this.shp_3);
		// 					break;
		// 				case -1280:
		// 					this.removeChild(this.shp_1);
		// 					this.shp_1 = new egret.Shape();
		// 					this.shp_1.x = 600;
		// 					this.shp_1.y = 680;
		// 					this.shp_1.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_1.graphics.beginFill(0xffffff, 1);
		// 					this.shp_1.graphics.drawCircle(0, 0, 10);
		// 					this.shp_1.graphics.endFill();
		// 					// this.addChild(this.shp_1);
		// 					this.removeChild(this.shp_2);
		// 					this.shp_2 = new egret.Shape();
		// 					this.shp_2.x = 640;
		// 					this.shp_2.y = 680;
		// 					this.shp_2.graphics.lineStyle(10, 0xdd7016);
		// 					this.shp_2.graphics.beginFill(0xdd7016, 1);
		// 					this.shp_2.graphics.drawCircle(0, 0, 10);
		// 					this.shp_2.graphics.endFill();
		// 					// this.addChild(this.shp_2);
		// 					this.removeChild(this.shp_3);
		// 					this.shp_3 = new egret.Shape();
		// 					this.shp_3.x = 680;
		// 					this.shp_3.y = 680;
		// 					this.shp_3.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_3.graphics.beginFill(0xffffff, 1);
		// 					this.shp_3.graphics.drawCircle(0, 0, 10);
		// 					this.shp_3.graphics.endFill();
		// 					// this.addChild(this.shp_3);
		// 					break;
		// 				case -2560:
		// 					this.removeChild(this.shp_1);
		// 					this.shp_1 = new egret.Shape();
		// 					this.shp_1.x = 600;
		// 					this.shp_1.y = 680;
		// 					this.shp_1.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_1.graphics.beginFill(0xffffff, 1);
		// 					this.shp_1.graphics.drawCircle(0, 0, 10);
		// 					this.shp_1.graphics.endFill();
		// 					// this.addChild(this.shp_1);
		// 					this.removeChild(this.shp_2);
		// 					this.shp_2 = new egret.Shape();
		// 					this.shp_2.x = 640;
		// 					this.shp_2.y = 680;
		// 					this.shp_2.graphics.lineStyle(10, 0xffffff);
		// 					this.shp_2.graphics.beginFill(0xffffff, 1);
		// 					this.shp_2.graphics.drawCircle(0, 0, 10);
		// 					this.shp_2.graphics.endFill();
		// 					// this.addChild(this.shp_2);
		// 					this.removeChild(this.shp_3);
		// 					this.shp_3 = new egret.Shape();
		// 					this.shp_3.x = 680;
		// 					this.shp_3.y = 680;
		// 					this.shp_3.graphics.lineStyle(10, 0xdd7016);
		// 					this.shp_3.graphics.beginFill(0xdd7016, 1);
		// 					this.shp_3.graphics.drawCircle(0, 0, 10);
		// 					this.shp_3.graphics.endFill();
		// 					// this.addChild(this.shp_3);
		// 					break;
		// 			}
		// 		});
		// 	}
		// }

		protected closePanel() {
			SoundManager.getInstance().playEffect("button_dntg_mp3");
			this.close_btn_1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			this.close_btn_2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			this.close_btn_3.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);
			game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_LAOHUGAME_TIPS);
		}

	}
}