module rbwar {
	export class RBWSetPanl extends game.BaseComponent {
		private closeBtn: eui.Button;
		private musicGroup: eui.Group;
		private soundGroup: eui.Group;
		private musicBtn: eui.ToggleSwitch;
		private soundBtn: eui.ToggleSwitch;
		public resizeGroup: eui.Group;
		private rect: eui.Rect;
		public constructor() {
			super();
			this.skinName = new RBWSetSkin();
		}

		protected createChildren() {
			super.createChildren();
			this.musicBtn.selected = SoundManager.getInstance().musicVolume == 1;
			this.soundBtn.selected = SoundManager.getInstance().effectVolume == 1;
		}

		public onTouchTap(e: egret.TouchEvent) {
			e.stopPropagation();
			switch (e.target) {
				case this.closeBtn:
				case this.rect:
					this.rect.visible = false;
					game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_RBWARSET);
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
