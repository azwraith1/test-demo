/**
 * 弹出提示
 */
module game {
	export class AlertMediator extends BaseMediator {
		public static NAME: string = "AlertMediator";
		private alertInterval: any = null; //定时器
		private alertWaiting: any = null; //等待列表是个数组
		private runningAlert: any = null; //正在提示的框
		public type: string = "panel";
		public constructor(viewComponent: any = null) {
			super(AlertMediator.NAME, viewComponent);
		}
		
		public listNotificationInterests(): Array<any> {
			return [
				PanelNotify.OPEN_ALERT,
				PanelNotify.CLOSE_ALERT
			];
		}

		public onRegister() {
			super.onRegister();
			// this.startInterVal();
			// this.alertWaiting = [];
			Global.alertMediator = this;

		}

		public showViewComponent(type = 7) {
			this.viewComponent = new AlertPanel(this.runningAlert);
			this.showUI(this.viewComponent, false, 0, 0, 0);
		}

		public viewComponent: AlertPanel;
		public handleNotification(notification: puremvc.INotification): void {
			var data: any = notification.getBody();
			switch (notification.getName()) {
				case PanelNotify.OPEN_ALERT: {
					if (!this.alertWaiting) {
						this.alertWaiting = [];
					}
					var alertData = notification.getBody();
					this.alertWaiting.push(alertData);
					this.checkHasAlert();
					break;
				}
				case PanelNotify.CLOSE_ALERT:
					this.runningAlert = null;
					this.closeViewComponent(0);
					break;
			}
		}

		public addAlert(content, okCallback = null, noCallback = null, onlyOkBtn = false) {
			this.sendNotification(PanelNotify.OPEN_ALERT, {
				tips: content,
				okCallback: okCallback,
				noCallback: noCallback,
				onlyOkBtn: onlyOkBtn
			});
		}

		private checkHasAlert() {
			if (this.runningAlert) {
				return;
			}
			if (!this.alertWaiting || this.alertWaiting.length < 1) {
				egret.clearInterval(this.alertInterval);
				this.alertInterval = null;
				return;
			}
			this.runningAlert = this.alertWaiting.shift();
			this.showViewComponent();
		}


        /**
         * 初始化面板ui
         */
		public initUI(): void {

		}

        /**
         * 初始化面板数据
         */
		public initData(): void {

		}

	}
}