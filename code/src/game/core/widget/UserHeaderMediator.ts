// TypeScript file
class UserHeaderMediator extends BaseMediator {
    public static NAME: string = "UserHeaderMediator";
    public type: string = "scene";
    public constructor(viewComponent: any = null) {
        super(UserHeaderMediator.NAME, viewComponent);
    }
    public viewComponent: UserHeader;
    public listNotificationInterests(): Array<any> {
        return [
            PanelNotify.OPEN_HEADER,
            PanelNotify.CLOSE_HEADER
        ];
    }

    public onRegister() {
        super.onRegister();
    }

    public showViewComponent() {
        if (this.viewComponent) {
            return;
        }
        this.viewComponent = new UserHeader();
        this.showUI(this.viewComponent, false, 0, 0, 1);
    }

    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case PanelNotify.OPEN_HEADER:
                this.showViewComponent();
                break;
            case PanelNotify.CLOSE_HEADER:
                this.closeViewComponent(0);
                break;

        }
    }
}