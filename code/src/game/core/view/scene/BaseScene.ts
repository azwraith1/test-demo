module game {
	export abstract class BaseScene extends BaseComponent {
		public pmdKey: string = "base";
		private ycGroup: eui.Group;
		protected backBtn: eui.Button;
		protected helpBtn: eui.Button;
		protected recordBtn: eui.Button;
		protected settingBtn: eui.Button;
		protected xlbtn1: eui.Button;
		protected xlbtn: eui.Button;
		protected btnsbg: eui.Image;
		/**
		 * 背景音乐名称
		 */
		protected bgMusic: string;
		public constructor() {
			super();
		}

		public onAdded() {
			super.onAdded();
			PMDComponent.currentRunningScene = this.pmdKey;
		}

		public createChildren() {
			super.createChildren();
			this.resetPMDPosition();
			this.showYcGroup();
			if (this.bgMusic) {
				SoundManager.getInstance().playMusic(this.bgMusic);
			}
		}


		protected resetPMDPosition() {


		}

		/**
		 * 界面中有延迟显示则显示
		 */
		private showYcGroup() {
			if (this.ycGroup) {
				let child = GameLayerManager.gameLayer().netStatus;
				if (child) {
					child.x = 0;
					child.y = 0;
					this.ycGroup.addChild(child);
				}
			}
		}

		public onRemoved() {
			super.onRemoved();
			this.pauseHandler.destroy();
		}

		public paomadeng(e: egret.Event) {
			let data = e.data;
			LogUtils.logDJ(data);
		}

		/**
		 * 主要用于监听玩家金币变化
		 */
		public updateGold() {
			super.updateGold();
			if (this['header1'] && this['header1'].updateGold) {
				this['header1'].updateGold(Global.playerProxy.playerData.gold, false);
			}
		}

		protected showBtnsType(num, type?) {
			let numArray = [this.settingBtn, this.recordBtn, this.helpBtn, this.backBtn];
			this.settingBtn.visible = (num == 1) ? false : true;
			this.recordBtn.visible = (num == 1) ? false : true;
			this.backBtn.visible = (num == 1) ? false : true;
			this.helpBtn.visible = (num == 1) ? false : true;
			this.xlbtn1.visible = (num == 1) ? false : true;
			this.xlbtn.visible = (num == 1) ? true : false;
			this.btnsbg.height = 0;
			switch (num) {
				case 1:
					for (let i = 0; i < numArray.length; i++) {
						egret.Tween.get(numArray[i]).to({ top: this.xlbtn.top }, 200);
					}

					egret.Tween.get(this.btnsbg).to({ height: 0 }, 200);
					this.settingBtn.top = this.recordBtn.top = this.backBtn.top = this.helpBtn.top = this.xlbtn1.top = this.xlbtn.top;
					break;
				case 2:
					for (let i = 0; i < numArray.length; i++) {
						egret.Tween.get(numArray[i]).to({ top: 24 + 92 * (i + 1) }, 200);
					}
					egret.Tween.get(this.btnsbg).to({ height: 364 }, 200);
					break;
			}
		}
	}
}