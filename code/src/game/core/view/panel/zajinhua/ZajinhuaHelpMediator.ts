module zajinhua {
	export class ZajinhuaHelpMediator extends BaseMediator {
		public static NAME: string = "ZajinhuaHelpMediator";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(ZajinhuaHelpMediator.NAME, viewComponent);
		}
		public viewComponent: ZajinhuaHelpPanl;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_ZJHHELP,
				PanelNotify.CLOSE_ZJHHELP
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
				this.viewComponent = new ZajinhuaHelpPanl();
				this.showUI(this.viewComponent, false, 0, 0, 0);
			});
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_ZJHHELP:
					if (this.viewComponent) {
						return;
					} else {
						this.showViewComponent();
						//this.showViewComponent(notification.getBody());
					}
					break;
				case PanelNotify.CLOSE_ZJHHELP:
					this.closeViewComponent(1);
					break;

			}
		}
	}
}