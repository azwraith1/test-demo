module rbwar {
	export class RBWRecordMediator extends BaseMediator {
		public static NAME: string = "RBWRecordMediator";
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(RBWRecordMediator.NAME, viewComponent);
		}
		public viewComponent: RBWRecordPanl;
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_RBWARJL,
				PanelNotify.CLOSE_RBWARJL
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
				this.viewComponent = new RBWRecordPanl();
				this.showUI(this.viewComponent, false, 0, 0, 0);
			});
		}

		public handleNotification(notification: puremvc.INotification): void {
			switch (notification.getName()) {
				case PanelNotify.OPEN_RBWARJL:
					if (this.viewComponent) {
						return;
					} else {
						this.showViewComponent();
					}
					break;
				case PanelNotify.CLOSE_RBWARJL:
					this.closeViewComponent(1);
					break;

			}
		}
	}
}