class FrameUtils {
	public static isError: boolean = false;
	public static topFrame: string = "http://192.168.2.5:9023";
	public static postMessage(msg) {
		if (!window.parent) {
			return;
		}
		if (FrameUtils.isError) {
			return;
		}
		
		// if(GameConfig.CURRENT_ISSHU){
		// 	return;
		// }
		try {
			if (window.parent && window.parent['showTips']) {
				window.parent['showTips'](msg);
				return;
			}
		} catch (e) {
			FrameUtils.isError = true;
		}
	}

	public static checkSafariStart() {
		if (FrameUtils.isError) {
			return;
		}
		try {
			if (window.parent && window.parent['checkSafiraStart']) {
				window.parent['checkSafiraStart']();
				return true;
			}
			return false;
		} catch (e) {
			FrameUtils.isError = true;
			return false;
		}
	}

	public static showTips(msg) {
		if (FrameUtils.isError) {
			return;
		}
		try {
			if (window.parent && window.parent['showTips']) {
				window.parent['showTips'](msg);
				return true;
			}
			return false;
		} catch (e) {
			FrameUtils.isError = true;
			return false;
		}
	}

	public static tipsToggle() {
		if (FrameUtils.isError) {
			return;
		}
		try {
			if (window.parent && window.parent['toggle']) {
				window.parent['toggle']();
				return true;
			}
			return false;
		} catch (e) {
			FrameUtils.isError = true;
			return false;
		}
	}


	public static iphoneXScreen(width, height) {
		if (width == 1280 && (height >= 735 && height <= 780)) {
			this.showTips(0);
		} else if (width == 1436 && height == 720) {
			this.showTips(1);
		} else if (width == 1468 && height == 720) {
			this.showTips(1);
		} else if (width == 1594 && height == 720) {
			this.showTips(0);
		} else if ((width >= 1630 && width <= 1740) && height == 720) {
			this.showTips(0);
		}
		else if ((width >= 1570 && width <= 1630) && height == 720) {
			this.showTips(0);
		} else {
			this.showTips(1);
		}
	}


	public static flushWindow() {
		// if (FrameUtils.isError) {
		// 	return;
		// }
		if (window.parent) {
			window.location.reload();
			// window.parent.location.href = window.parent.location.href;
		} else {
			window.location.reload();
		}

	}

	public static goRecharge() {
		if (ServerConfig.RECHARGE_URL && ServerConfig.RECHARGE_URL != "null") {
			Global.alertMediator.addAlert("是否前往充值界面？", () => {
				window.open(ServerConfig.RECHARGE_URL);
			}, null);
		}
	}

	public static goHome() {
		if (ServerConfig.HOME_PAGE_URL && ServerConfig.HOME_PAGE_URL != "null") {
			Global.alertMediator.addAlert("是否确定返回平台？", () => {
				window.open(ServerConfig.HOME_PAGE_URL);
			}, null);
		}
	}

	private static resetZise;
	public static eventResize() {
		GameConfig.WINSIZE_WIDTH = GameConfig.curStage().stageWidth;
		GameConfig.WINSIZE_HEIGHT = GameConfig.curStage().stageHeight;
		var beforeData = { wBili: GameConfig.WINSIZE_BILI_WIDTH, hBili: GameConfig.WINSIZE_BILI_HEIGHT };
		GameConfig.WINSIZE_BILI_WIDTH = GameConfig.WINSIZE_WIDTH / 1280;
		GameConfig.WINSIZE_BILI_HEIGHT = GameConfig.WINSIZE_HEIGHT / 720;
		EventManager.instance.dispatch(EventNotify.EVENT_RESIZE, beforeData);
		if (this.resetZise) {
			egret.clearTimeout(this.resetZise);
			this.resetZise = null;
		}
		this.resetZise = egret.setTimeout(() => {
			GameConfig.CURRENT_WIDTH = GameConfig.curStage().stageWidth;
			GameConfig.CURRENT_HEIGHT = GameConfig.curStage().stageHeight;
			this.resetZise = null;
		}, this, 500);

	}
}