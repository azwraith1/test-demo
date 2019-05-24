class HelpShuMediator extends BaseMediator {
    public static NAME: string = "HelpShuMediator";
    public type: string = "panel";
    public constructor(viewComponent: any = null) {
        super(HelpShuMediator.NAME, viewComponent);
    }
    public viewComponent: HelpShuPanel;
    public listNotificationInterests(): Array<any> {
        return [
            PanelNotify.OPEN_HELP_SHU,
            PanelNotify.CLOSE_HELP_SHU
        ];
    }

    public onRegister() {
        super.onRegister();
    }

    public showViewComponent(type) {
        if (this.viewComponent) {
            return;
        }
        RotationLoadingShu.instance.load(["help"], "", () => {
            this.viewComponent = new HelpShuPanel(type);
            this.showUI(this.viewComponent, false, 0, 0, 0);
        });
    }

    public handleNotification(notification: puremvc.INotification): void {
        switch (notification.getName()) {
            case PanelNotify.OPEN_HELP_SHU:
                let type = notification.getBody().type;
                this.showViewComponent(type);
                break;
            case PanelNotify.CLOSE_HELP_SHU:
                this.closeViewComponent(1);
                break;

        }
    }
}