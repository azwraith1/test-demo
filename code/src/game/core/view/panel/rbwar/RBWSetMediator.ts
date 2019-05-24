module rbwar {
	export class RBWSetMediator extends BaseMediator {
		public static NAME: string = "RBWSetMediator";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(RBWSetMediator.NAME, viewComponent);
		}
		public viewComponent: RBWSetPanl;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_RBWARSET,
				PanelNotify.CLOSE_RBWARSET
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
				this.viewComponent = new RBWSetPanl();
				this.showUI(this.viewComponent, false, 0, 0, 0);
			});
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_RBWARSET:
					if (this.viewComponent) {
						return;
					} else {
						this.showViewComponent();
					}
					break;
				case PanelNotify.CLOSE_RBWARSET:
					this.closeViewComponent(1);
					break;

			}
		}
	}
}