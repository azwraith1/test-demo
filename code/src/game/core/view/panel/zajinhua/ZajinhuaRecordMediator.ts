module zajinhua {
	export class ZajinhuaRecordMediator extends BaseMediator {
		public static NAME: string = "ZajinhuaRecordMediator";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(ZajinhuaRecordMediator.NAME, viewComponent);
		}
		public viewComponent: ZajinhuaRecordPanl;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_ZJHRECORD,
				PanelNotify.CLOSE_ZJHRECORD
			];
		}
		public onRegister() {
			super.onRegister();
		}

		public showViewComponent() {
			if (this.viewComponent) {
				return;
			}
			RotationLoading.instance.load(["record"], "", () => {
				this.viewComponent = new ZajinhuaRecordPanl();
				this.showUI(this.viewComponent, false, 0, 0, 0);
			});
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_ZJHRECORD:
					if (this.viewComponent) {
						return;
					} else {
						this.showViewComponent();
						//this.showViewComponent(notification.getBody());
					}
					break;
				case PanelNotify.CLOSE_ZJHRECORD:
					this.closeViewComponent(1);
					break;

			}
		}
	}
}