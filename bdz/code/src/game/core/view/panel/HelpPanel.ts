/*
 * @Author: he bing 
 * @Date: 2018-07-31 15:05:10 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-11-19 14:16:05
 * @Description: 
 */
class HelpPanel extends game.BaseComponent {
	private closebtn: eui.Button;
	private texts: eui.Image;
	public resizeGroup: eui.Group;
	private jbgz: eui.Image;
	private jbgz_1: eui.Image;
	private pxjs: eui.Image;
	private pxjs_1: eui.Image;
	private tsgz: eui.Image;
	private tsgz_1: eui.Image;
	private textGroup: eui.Group;	//左侧按钮组
	private xl_up: eui.Image;
	private xl_upw: eui.Image;
	private xl_down: eui.Image;
	private xl_downw: eui.Label;
	private xz_up: eui.Image;
	private xz_upw: eui.Image;
	private xz_down: eui.Image;
	private xz_downw: eui.Label;
	private rects: eui.Rect;
	private help_scroller: eui.Scroller;
	public constructor() {
		super();
		this.skinName = new HelpSkin();
	}

	protected createChildren() {
		super.createChildren();
		this.showOrFalse(1);
		this.leftBtnChose(1);
		this.textNums();
	}

	//记录选择的游戏帮助的按钮
	private btnTimer: number = 0;
	public onTouchTap(e: egret.TouchEvent) {
		e.stopPropagation();
		switch (e.target) {
			case this.xl_up:
			case this.xl_upw:
			case this.xl_down:
			case this.xl_downw:
				// game.AudioManager.getInstance().playSound("ui_click_mp3");//管理声音的
				this.textGroup.removeChildren();
				this.help_scroller.viewport.scrollV = 0;
				this.leftBtnChose(1);
				this.showOrFalse(1);
				ImageUtils.showRes(this.texts, this.imageSource(1));
				this.btnTimer = 0;
				this.textGroup.addChild(this.texts);
				this.texts.width = 473;
				this.texts.height = 893;
				break;
			case this.xz_up:
			case this.xz_upw:
			case this.xz_down:
			case this.xz_downw:
				// game.AudioManager.getInstance().playSound("ui_click_mp3");//管理声音的
				this.textGroup.removeChildren();
				this.help_scroller.viewport.scrollV = 0;
				this.leftBtnChose(2);
				this.showOrFalse(1);
				ImageUtils.showRes(this.texts, this.imageSource(4));
				this.btnTimer = 1;
				this.textGroup.addChild(this.texts);
				this.texts.width = 473
				this.texts.height = 944;
				break;

			case this.jbgz_1:
			case this.jbgz:
				// game.AudioManager.getInstance().playSound("ui_click_mp3");//管理声音的
				this.showOrFalse(1);
				this.textGroup.removeChildren();
				this.help_scroller.viewport.scrollV = 0;
				if (this.btnTimer == 0) {
					ImageUtils.showRes(this.texts, this.imageSource(1));
					this.texts.height = 893;
				} else {
					ImageUtils.showRes(this.texts, this.imageSource(4));
					this.texts.height = 944;
				}
				this.textGroup.addChild(this.texts);
				this.texts.width = 473

				break;
			case this.pxjs_1:
			case this.pxjs:
				game.AudioManager.getInstance().playSound("ui_click_mp3");//管理声音的
				this.showOrFalse(2);
				this.textGroup.removeChildren();
				this.help_scroller.viewport.scrollV = 0;
				ImageUtils.showRes(this.texts, this.imageSource(2));
				this.texts.height = 1704.5;
				// if (this.btnTimer == 0) {
				// 	ImageUtils.showRes(this.texts, this.imageSource(2));
				// 	this.texts.height = 1704.5;
				// } else {
				// 	ImageUtils.showRes(this.texts, this.imageSource(5));
				// 	this.texts.height = 1589.5;
				// }
				this.textGroup.addChild(this.texts);
				this.texts.width = 473
				break;
			case this.tsgz_1:
			case this.tsgz:
				game.AudioManager.getInstance().playSound("ui_click_mp3");//管理声音的
				this.showOrFalse(3);
				this.textGroup.removeChildren();
				this.help_scroller.viewport.scrollV = 0;
				ImageUtils.showRes(this.texts, this.imageSource(3));
				this.textGroup.addChild(this.texts);
				this.texts.width = 473
				this.texts.height = 623.5;
				break;
			case this.closebtn:
			case this.rects:
				this.rects.visible = false;
				game.AppFacade.getInstance().sendNotification(PanelNotify.CLOSE_HELP);
				break;
		}
	}
	public textNums() {
		ImageUtils.showRes(this.texts, this.imageSource(1));
		this.texts.width = 473
		this.texts.height = 893;
	}

	/**
	 * 是否显示或者隐藏文字类容
	 */
	public showOrFalse(number) {
		switch (number) {
			case 1:
				this.jbgz.visible = true;
				this.jbgz_1.visible = false;
				this.pxjs_1.visible = true;
				this.tsgz_1.visible = true;
				break;
			case 2:
				this.pxjs.visible = true;
				this.pxjs_1.visible = false;
				this.jbgz_1.visible = true;
				this.tsgz_1.visible = true;
				break;
			case 3:
				this.tsgz.visible = true;
				this.tsgz_1.visible = false;
				this.jbgz_1.visible = true;
				this.pxjs_1.visible = true;
				break;
		}
	}

	/**
	 * 左边按钮组互斥
	 */
	private leftBtnChose(num) {
		if (num == 1) {
			this.xl_up.visible = true;
			this.xl_upw.visible = true;
			this.xz_down.visible = true;
			this.xz_downw.visible = true;
			this.xl_down.visible = false;
			this.xl_downw.visible = false;
			this.xz_up.visible = false;
			this.xz_upw.visible = false;
		} else {
			this.xl_down.visible = true;
			this.xl_downw.visible = true;
			this.xz_up.visible = true;
			this.xz_upw.visible = true;
			this.xl_up.visible = false;
			this.xl_upw.visible = false;
			this.xz_down.visible = false;
			this.xz_downw.visible = false;
		}
	}

	private imageSource(Image_number) {
		switch (Image_number) {
			case 1:
				return "mj_1_png";
			case 2:
				return "mj_2_png";
			case 3:
				return "mj_3_png";
			case 4:
				return "mj_4_png";
			case 5:
				return "mj_5_png";
		}

	}

	public onAdded() {
		super.onAdded();
	}
}