/*
 * @Author: He Bing 
 * @Date: 2018-07-03 14:36:22 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-11-07 15:00:49
 @Description: 选择游戏场景控制层
 */

module majiang {
	export class MjiangSelectMediator extends BaseMediator {
		public static NAME: string = "MjiangSelectMediator";
		public type: string = "scene";
		public constructor() {
			super(MjiangSelectMediator.NAME);
		}

		public viewComponent: MajiangSelectScene;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_HOME,
				SceneNotify.CLOSE_HOME
			];

		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new majiang.MajiangWatingMediator());
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
			this.viewComponent = new MajiangSelectScene();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}


		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_HOME:
					RES.loadGroup("majiang");
					// LoadingScene.instance.load("majiang", "majiang_bg_jpg", () => {
					this.showViewComponent();
					// });
					break;
				case SceneNotify.CLOSE_HOME:
					this.closeViewComponent(1);
					break;
			}

		}
	}
}