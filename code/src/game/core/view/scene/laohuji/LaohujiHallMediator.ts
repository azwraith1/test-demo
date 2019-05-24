// TypeScript file
module game{
    export class LaohujiHallMediator extends BaseMediator{
        public static NAME: string = "LaohujiHallMediator";
		public type: string = "scene";
		public constructor() {
			super(LaohujiHallMediator.NAME);
		}

		public viewComponent: slotHallSence;
		public listNotificationInterests(): Array<any> {
			return [
				SceneNotify.OPEN_LAOHUJI_HALL,
				SceneNotify.CLOSE_LAOHUJI_HALL
			];
		}

		public onRegister() {
			super.onRegister();
			this.facade.registerMediator(new DNTGGameMediator());
			this.facade.registerMediator(new SettingMediator());
			this.facade.registerMediator(new sdxl.SDXLGameMediator())
			this.facade.registerMediator(new cbzz.CBZZGameMediator())
			this.facade.registerMediator(new dntg.DNTGGameRecordMediator());
		}

		public showViewComponent() {
			this.viewComponent = new slotHallSence();
			var sceneLayer = GameLayerManager.gameLayer().sceneLayer;
			sceneLayer.addChild(this.viewComponent);
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case SceneNotify.OPEN_LAOHUJI_HALL:
					this.showViewComponent();
					break;
				case SceneNotify.CLOSE_LAOHUJI_HALL:
					this.closeViewComponent(1);
					break;
			}
		}
    }
}