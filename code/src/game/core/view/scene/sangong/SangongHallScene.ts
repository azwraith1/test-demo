/*
 * @Author: li mengchan 
 * @Date: 2018-11-22 15:24:58 
 * @Last Modified by: MC Lee
 * @Last Modified time: 2019-05-22 15:06:19
 * @Description: 三公游戏
 */
module sangong {
	export class SangongHallScene extends game.BaseHallScene {
		public hallId: string = "sangong";
		public pmdKey: string = "sangong";

		private centerGroup: eui.Group;
		private headerGroup: eui.Group;
		private headerImageMask: eui.Image;
		/**
		 * 头像前缀
		 */
		public headerFront: string = "hall_header";
		/**
		 * 背景音乐
		 */
		public bgMusic: string = "niuniu_bgm_mp3";

		/**
		 * 关闭当前界面的通知
		 */
		public CLOSE_NOTIFY: string = SceneNotify.CLOSE_SANGONG_HALL;

		/**
		 * 进入正确匹配的通知
		 */
		public MATCHING_NOTIFY: string = SceneNotify.OPEN_SANGONG_WATING;

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
		public loadGroups: string[] = ['sangong_game'];

		public constructor() {
			super();
			this.skinName = new SangongHallSceneSkin();
		}

		public createChildren() {
			super.createChildren();
			
		}

		/**
		 * 修正跑马灯位子
		 */
		public resetPMDPosition() {
			let publicMsg = PMDComponent.instance;
			publicMsg.anchorOffsetY = 24;
			publicMsg.horizontalCenter = 10;
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

		public showHallBars() {
			this.centerGroup.alpha = 0;
			var nums = Global.gameProxy.gameNums["sangong"];
			let index = 1;
			var item: any;
			for (let i in nums) {
				if (index > 5) {
					break;
				}
				let barConfig = nums[i];
				let bar = this['bar' + index] as SangongHallSceneBar;
				bar.showBarByConfig(barConfig, index);
				bar.visible = barConfig.enable;
				index++
			}
			egret.Tween.get(this.centerGroup).to({
				alpha: 1
			}, 800);
		}
	}
}
