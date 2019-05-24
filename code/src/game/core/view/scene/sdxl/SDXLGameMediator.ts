/*
 * @Author: wangtao 
 * @Date: 2019-04-08 12:06:56 
 * @Last Modified by: wangtao
 * @Last Modified time: 2019-04-08 16:02:48
 * @Description: 
 */

module sdxl{
    export class SDXLGameMediator extends BaseMediator{
        public static NAME: string = "SDXLGameMediator";
		public type: string = "scene";
		public constructor() {
			super(SDXLGameMediator.NAME);
		}

		public viewComponent: SDXLGameMain;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_SDXL,
				SceneNotify.CLOSE_SDXL
			];
		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new game.LaohujiHallMediator());
			this.facade.registerMediator(new SettingMediator());
			this.facade.registerMediator(new SDXLTipsPanelMediator());
			this.facade.registerMediator(new game.CloseLaohuMediator());
			this.facade.registerMediator(new game.LaohuAutoMediator());
			this.facade.registerMediator(new MainHallMediator());
			this.facade.registerMediator(new dntg.DNTGGameRecordMediator());
			this.facade.registerMediator(new sdxl.SDXLautoGamelMediator());
			
		}

		public showViewComponent() {
			this.viewComponent = new SDXLGameMain();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_SDXL:
					this.showViewComponent();
					break;
				case SceneNotify.CLOSE_SDXL:
					this.closeViewComponent(1);
					break;
			}
		}
    }
}