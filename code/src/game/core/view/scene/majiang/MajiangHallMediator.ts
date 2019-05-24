/*
 * @Author: He Bing 
 * @Date: 2018-07-03 14:36:22 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-21 17:56:16
 @Description: 选择游戏场景控制层
 */

module majiang {
	export class MajiangHallMediator extends BaseMediator {
		public static NAME: string = "MajiangHallMediator";
		public type: string = "scene";
		public constructor() {
			super(MajiangHallMediator.NAME);
		}

		public viewComponent: MajiangHallScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_MAJIANG_HALL,
				SceneNotify.CLOSE_MAJIANG_HALL
			];

		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new majiang.MajiangMatchingMediator());
			this.facade.registerMediator(new majiang.MajiangMediator());
			this.facade.registerMediator(new majiang.MajiangJiesuanMediator());
			this.facade.registerMediator(new majiang.GameRecordMediator())
		}

		/**
		 * 固有写法
		 */
		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			this.viewComponent = new MajiangHallScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}


		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_MAJIANG_HALL:
					// RES.loadGroup("majiang");
					this.showViewComponent();
					break;
				case SceneNotify.CLOSE_MAJIANG_HALL:
					this.closeViewComponent(1);
					break;
			}

		}
	}
}