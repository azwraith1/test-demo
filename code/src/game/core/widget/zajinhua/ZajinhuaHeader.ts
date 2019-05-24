module zajinhua {
	export class ZajinhuaHeader extends BaseHeader {
		//protected goldLabel: eui.BitmapLabel;
		//private nameLabel: eui.Label;
		//public headerImage: eui.Image;
		//private playerInfo;
		private beishuLabel: eui.BitmapLabel;
		private beishuGroup: eui.Group;
		//public zhuangImage: eui.Image;
		public indexLabel: eui.Label;
		private liushuiLabel: eui.BitmapLabel;
		private gold: number;
		public headerImage_k: eui.Image;
		public playerStus: number = 0;
		public headerImage_mask: eui.Image;
		//public index;

		public isLook: boolean = false;

		private xiqian: eui.BitmapLabel;
		private beishuDb: eui.Image;
		//w1-w3
		private w1: eui.Image;
		private w2: eui.Image;
		private w3: eui.Image;

		private qpGroup: eui.Group;

		public bpLose: eui.Image;
		
		private bipaiLose: eui.Image;
		private xiqianGroup: eui.Group;
		private xiqianImage: eui.Image;
		public constructor() {
			super();
			this.skinName = new ZajinhuaHaederSkin();
		}

		public createChildren() {
			super.createChildren();
			this.headerImage.mask = this.headerImage_mask;
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchOn, this);
			this.liushuiLabel.text = "";
		}

		public bpwin2lose(isAni) {
			if (isAni) {
				this.addChild(this.bipaiLose);
				this.bipaiLose.scaleX = 1;
				this.bipaiLose.scaleY = 1;
				this.bipaiLose.visible = true;
				egret.Tween.get(this.bipaiLose).to({ scaleX: 0.6, scaleY: 0.6 }, 500);
			} else {
				this.bipaiLose.visible = true;
			}

		}

		public islook(num: boolean) {
			this.isLook = num;
		}

		public setIndex(index) {
			this.index = index;
			//this.indexLabel.text = index + "";
		}

		public showText(text) {
			this.beishuGroup.visible = true;
			this.beishuLabel.text = text;
		}

		public showBeishu(value) {
			this.beishuLabel.visible = value > 0;
			this.beishuLabel.y = this.beishuLabel.y - 1;
			if (value > 0) {
				this.beishuLabel.text = "x" + value;
			}
			this.beishuGroup.visible = true;
		}

		public hideBeishu() {
			this.beishuGroup.visible = false;
		}



		public showBeishuGroup() {
			this.beishuGroup.visible = true;
		}

		public initWithPlayer(playerInfo) {
			if (!playerInfo) {
				this.nameLabel.text = Global.playerProxy.playerData.nickname;
				this.headerImage.source = `hall_header_${Global.playerProxy.playerData.sex}_${Global.playerProxy.playerData.figure_url}_png`;
				this.goldLabel.text = NumberFormat.formatGold_scence(Global.playerProxy.playerData.gold);
			} else {
				this.playerInfo = playerInfo;
				this.goldLabel.text = NumberFormat.formatGold_scence(playerInfo.gold);
				this.nameLabel.text = playerInfo.nickname;
				let headerId = playerInfo['figureUrl'] || playerInfo.figure_url;
				let headerSex = playerInfo['sex'] || playerInfo.sex;
				this.headerImage.source = `hall_header_${headerSex}_${headerId}_png`;
			}
			this.gold = Global.playerProxy.playerData.gold;
		}

		public showIsZhuang(isZhuang) {
			this.zhuangImage.visible = isZhuang;
			this.zhuangImage.scaleX = this.zhuangImage.scaleY = 0;
			egret.Tween.get(this.zhuangImage).to({ scaleX: 0, scaleY: 0 }, 50).to({ scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 200);
		}

		public exchange45(dir) {
			if (dir == 4 || dir == 5) {
				this.beishuGroup.x = 113;
				this.beishuDb.scaleX = -1;
				this.beishuLabel.x = 15;
			}
		}

		public change2Left() {
			this.beishuGroup.x = 30 - this.beishuGroup.width;
		}



		private timer: any;
		private gainGold: any;
		public showLiushuiLabel(gainGold, xiqian?) {
			this.liushuiLabel.visible = true;
			if (xiqian > 0) {
				this.xiqianGroup.visible = true;
				this.xiqian.font = "zjh_win_number_fnt"
				this.xiqian.text = "+" + xiqian;
				//this.xiqian.x = 180 / 2 - this.xiqian.width / 2;
				this.xiqianImage.x = this.xiqian.x + this.xiqian.width + 10;
			}
			this.gainGold = gainGold;
			this.liushuiLabel.alpha = 0;
			this.liushuiLabel.y = this.liushuiLabel.y + 20;
			egret.Tween.get(this.liushuiLabel).to({ alpha: 0, y: this.liushuiLabel.y }, 50).to({ alpha: 1, y: this.liushuiLabel.y - 20 }, 200);
			this.timer = egret.setInterval(() => {
				this.scoreAddOrNo();
			}, this, 30);
			let player = Global.roomProxy.getPlayerInfoByIndex(this.index);
			this.goldLabel.text = NumberFormat.formatGold_scence(player.gold);
			// egret.setTimeout(()=>{
			// 	this.updatePlayerGold();
			// }, this, 500);
		}

		/**
		 * 分数加减动画
		 */
		private count: number = 0;
		private sumFen: number = 0;
		//	private goldTime: number = 0;//根据金币不同来调用速度
		private scoreAddOrNo() {
			this.count++;
			let finalNum = this.gainGold;
			let step = Math.abs(finalNum) / 30;
			this.sumFen = this.sumFen + Math.ceil(step);
			if (this.count >= 20) {
				egret.clearInterval(this.timer);
				if (this.gainGold >= 0) {
					this.liushuiLabel.font = "zjh_win_number_fnt"
					this.liushuiLabel.text = "+" + finalNum.toFixed(2);
				} else {
					this.liushuiLabel.font = "zjh_lose_number_fnt"
					this.liushuiLabel.text = "" + finalNum.toFixed(2);
				}

			} else {
				if (this.gainGold >= 0) {
					this.liushuiLabel.font = "zjh_win_number_fnt"
					this.liushuiLabel.text = "+" + this.sumFen;
				} else {
					this.liushuiLabel.font = "zjh_lose_number_fnt"
					this.liushuiLabel.text = "-" + this.sumFen;
				}

			}
		}

		public updatePlayerGold() {
			let player = Global.roomProxy.getPlayerInfoByIndex(this.index);
			egret.Tween.get(this, { onChange: this.onChange, onChangeObj: this }).to({ gold: player.gold }, 500, egret.Ease.quadInOut);
		}

		private onChange(): void {
			this.goldLabel.text = NumberFormat.formatGold_scence(this.gold);
		}

		private isBoolen: boolean = false;
		public showBiPai(value) {
			this.headerImage_k.visible = value;
			this.isBoolen = value;
		}


		private touchOn() {
			let num = { index: this.index, value: this.isBoolen }
			EventManager.instance.dispatch(EventNotify.ZJH_HEADER_TOUCH, num);
		}


		public closeBipai() {
			this.headerImage_k.visible = false;
			this.isBoolen = false;
		}


		public qpVisible(value) {
			this.qpGroup.visible = value;
		}

		public bplose(value) {
			this.bpLose.visible = value;
		}
	}
}