class SettingPanel extends game.BaseComponent {
	private closeBtn: eui.Button;
	private musicGroup: eui.Group;
	private soundGroup: eui.Group;
	private musicBtn: eui.ToggleSwitch;
	private soundBtn: eui.ToggleSwitch;
	public resizeGroup: eui.Group;
	public constructor(setIndex: number = null) {
		super();
		if (setIndex == 1) {
			this.skinName = new SettingMainSkin();
			return;
		} else if (setIndex == 2) {
			this.skinName = new DZMJSettingSkin();
			return;
		}
		if (GameConfig.CURRENT_ISSHU && SettingShuSkin) {
			this.skinName = new SettingShuSkin();
			return;
		}
		this.skinName = new SettingSkin();
	}

	protected createChildren() {
		super.createChildren();
		this.musicBtn.selected = SoundManager.getInstance().musicVolume == 1;
		this.soundBtn.selected = SoundManager.getInstance().effectVolume == 1;
	}
	private rects: eui.Rect;
	public onTouchTap(e: egret.TouchEvent) {
		e.stopPropagation();
		switch (e.target) {
			case this.closeBtn:
			case this.rects:
				this.rects.visible = false;
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_SETTING);
				break;
			case this.musicBtn://音乐开关
				if (SoundManager.getInstance().musicVolume) {
					SoundManager.getInstance().musicVolume = 0;
				} else {
					SoundManager.getInstance().musicVolume = 1;
				}
				break;
			case this.soundBtn://声音开关
				if (SoundManager.getInstance().effectVolume) {
					SoundManager.getInstance().effectVolume = 0;
				} else {
					SoundManager.getInstance().effectVolume = 1;
				}
				break;
		}
	}

	public onAdded() {
		super.onAdded();
	}
}
