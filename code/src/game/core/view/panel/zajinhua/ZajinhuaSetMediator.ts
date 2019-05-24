module zajinhua {
	export class ZajinhuaSetMediator extends BaseMediator {
		public static NAME: string = "ZajinhuaSetMediator";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(ZajinhuaSetMediator.NAME, viewComponent);
		}
		public viewComponent: ZajinhuaSetPanl;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_ZJHSET,
				PanelNotify.CLOSE_ZJHSET
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
				this.viewComponent = new ZajinhuaSetPanl();
				this.showUI(this.viewComponent, false, 0, 0, 0);
			});
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_ZJHSET:
					if (this.viewComponent) {
						return;
					} else {
						this.showViewComponent();
						//this.showViewComponent(notification.getBody());
					}
					break;
				case PanelNotify.CLOSE_ZJHSET:
					this.closeViewComponent(1);
					break;

			}
		}
	}
}