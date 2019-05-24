module zajinhua {
	export class ZajinhuaSetPanl extends game.BaseComponent {
		private musicBtn: eui.ToggleSwitch;
		private soundBtn: eui.ToggleSwitch;
		private closeBtn: eui.Button;
		public constructor() {
			super();
			this.skinName = new ZajinhuaSetSkin();
		}
		protected createChildren() {
			super.createChildren();
			this.musicBtn.selected = SoundManager.getInstance().musicVolume == 1;
			this.soundBtn.selected = SoundManager.getInstance().effectVolume == 1;
		}
		private rect: eui.Rect;
		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.closeBtn:
				case this.rect:
					this.rect.visible = false;
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_ZJHSET);
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
}