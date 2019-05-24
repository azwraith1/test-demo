class PMDBean {
	/**
	 * 文本内容
	 */
	public text: string;
	/**
	 *  循环次数
	 */
	public time: number;

	public type: number;

	public key: string;

	public time2: number;
}


class PMDFactory {
	private static _instance: PMDFactory;
	public constructor() {
		if (PMDFactory._instance) {
			throw new Error("DateTimer使用单例");
		}
	}
	public static get instance(): PMDFactory {
		if (!PMDFactory._instance) {
			PMDFactory._instance = new PMDFactory();
		}
		return PMDFactory._instance;
	}

	private pmdInterval: any = null; //定时器
	private waitingList: any = []; //等待列表是个数组
	private runningPmd: any = null; //正在提示的框
	public run() {
		this.startInterVal();
		this.waitingList = [];
	}

	public getSize() {
		return this.waitingList.length;
	}

	private startInterVal() {
		var self = this;
		this.pmdInterval = setInterval(function () {
			self.checkHasPMD();
		}, 100);
	}

	public goNext() {
		this.runningPmd = null;
	}

	public deleteMsg() {
		this.waitingList = [];
		clearInterval(this.pmdInterval);
		this.pmdInterval = null;
		return;
	}

	private checkHasPMD() {
		if (this.runningPmd) {
			return;
		}
		if (!this.waitingList || this.waitingList.length < 1) {
			clearInterval(this.pmdInterval);
			this.pmdInterval = null;
			return;
		}
		this.runningPmd = this.waitingList.shift();
		if (this.runningPmd.type == 2) {
			if (this.runningPmd.key != PMDComponent.currentRunningScene) {
				PMDComponent.instance.showCloseAni();
				this.runningPmd = null;
				return;
			}
		}
		PMDComponent.instance.show(this.runningPmd);
	}

	/**
	 * 收到维护消息时的做法，unshift(pmdData);加到第一条播
	 * 
	 */
	public addPMD(pmdData) {
		if (!this.waitingList) {
			this.waitingList = [];
		}
		if (pmdData.type == 1) {
			this.waitingList.unshift(pmdData);
		} else {
			this.waitingList.push(pmdData);
		}
		if (!this.pmdInterval) {
			this.startInterVal();
		}
	}
}