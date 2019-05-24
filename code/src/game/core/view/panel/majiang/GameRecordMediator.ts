module majiang {
	export class GameRecordMediator extends BaseMediator {
		public static NAME: string = "GameRecordMediator";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(GameRecordMediator.NAME, viewComponent);
		}
		public viewComponent: GameRecordPanel;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_GAMERECORD,
				PanelNotify.CLOSE_GAMERECORD
			];
		}
		public onRegister() {
			super.onRegister();
		}

		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			this.viewComponent = new GameRecordPanel();
			this.showUI(this.viewComponent, false, 0, 0, 0);

		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_GAMERECORD:
					if (this.viewComponent) {
						return;
					} else {
						this.showViewComponent();
					}
					break;
				case PanelNotify.CLOSE_GAMERECORD:
					this.closeViewComponent(1);
					break;

			}
		}
	}
}