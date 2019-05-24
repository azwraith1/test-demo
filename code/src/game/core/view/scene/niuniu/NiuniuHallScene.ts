/*
 * @Author: MC Lee 
 * @Date: 2019-05-21 10:04:33 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-22 14:43:45
 * @Description: 牛牛大厅界面
 */
module niuniu {
	export class NiuniuHallScene extends game.BaseHallScene {
		public hallId: string = "blnn";
		public pmdKey: string = "blnn";
		/**
		 * 头像前缀
		 */
		public headerFront: string = "nns";
		/**
		 * 背景音乐
		 */
		public bgMusic: string = "niuniu_bgm_mp3";

		/**
		 * 关闭当前界面的通知
		 */
		public CLOSE_NOTIFY: string = SceneNotify.CLOSE_NIUNIUSELECT;

		/**
		 * 进入正确匹配的通知
		 */
		public MATCHING_NOTIFY: string = SceneNotify.OPEN_NIUNIU_MATCHING;

		/**
		 * 帮助界面的通知
		 */
		public HELP_NOTIFY: string = PanelNotify.OPEN_HELP_SHU;

		/**
		 * 记录界面的通知
		 */
		public RECORD_NOTIFY: string = PanelNotify.OPEN_NIUGAMERECORD;

		/**
		 * 设置界面的通知
		 */
		public SETTING_NOTIFY: string = null;

		/**
		 * 需要加载的资源组
		 */
		public loadGroups: string[] = ['niuniu_game'];

		private centerGroup: eui.Group;

		public constructor() {
			super();
			this.skinName = new NiuniuHallSceneSkin();
		}

		public createChildren() {
			super.createChildren();
			this.resetPMDPosition();
		}

		/**
		 * 修正跑马灯位子
		 */
		protected resetPMDPosition() {
			let publicMsg = PMDComponent.instance;
			publicMsg.anchorOffsetY = 24;
			publicMsg.horizontalCenter = -10;
			publicMsg.top = 120;
		}


		public onAdded() {
			super.onAdded();
			EventManager.instance.addEvent(EventNotify.ENTER_GOLD_SCENE, this.enterScene, this);
		}

		public onRemoved() {
			super.onRemoved();
			EventManager.instance.removeEvent(EventNotify.ENTER_GOLD_SCENE, this.enterScene, this);
		}

		/**
		 * 进入匹配或者重新获取数据
		 * @param  {egret.Event} e?
		 */
		public async enterScene(event) {
			var data = event.data;
			RotationLoadingShu.instance.load(this.loadGroups, "", async () => {
				Global.gameProxy.lastGameConfig = data;
				var handler = ServerPostPath.hall_sceneHandler_c_enter;
				let resp: any = await game.PomeloManager.instance.request(handler, data);
				this.enterSceneCall(resp, data);
			})
		}

		/**
		 * 渲染hallScene
		 */
		public showHallBars() {
			this.centerGroup.alpha = 0;
			var nums = Global.gameProxy.gameNums["blnn"];
			let index = 1;
			var item: any;
			let fonts = [0, 0x083831, 0x0b1e3c, 0x472507, 0x762d09, 0x5a0937, 0x440707];
			for (let i in nums) {
				let barConfig = nums[i];
				let bar = this['bar' + index] as NiuNiuHallSceneBar;
				bar.showBarByConfig(barConfig, index, fonts[index]);
				game.UIUtils.removeSelf(this['yy' + index]);
				bar.visible = barConfig.enable;
				index++;
			}
			egret.Tween.get(this.centerGroup).to({
				alpha: 1
			}, 800);
		}
	}
}
