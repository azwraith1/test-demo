/*
 * @Author: li mengchan 
 * @Date: 2018-07-09 18:46:46 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-07-24 17:24:43
 * @Description: 定时器管理器
 */
module game {
	export class DateTimeManager {
		private static _instance: DateTimeManager;

		public constructor() {
			if (DateTimeManager._instance) {
				throw new Error("DateTimer使用单例");
			}
		}

		public static get instance(): DateTimeManager {
			if (!DateTimeManager._instance) {
				DateTimeManager._instance = new DateTimeManager();
			}
			return DateTimeManager._instance;
		}

		/**
		 * 服务器延迟时间
		 */
		private delayTime: number = 0;


		public updateServerTime(val: number) {
			this.delayTime = Date.now() - val;
		}

		public get now() {
			return Math.floor(Date.now() - this.delayTime);
		}

		public run() {
			this.run1sTicker();
			this.runTicker();
		}

		private _last1sTime: number;

		/**
		 * 启动1s计时器
		 */
		private run1sTicker() {
			var timer: egret.Timer = new egret.Timer(1000);
			timer.addEventListener(egret.TimerEvent.TIMER, this.onOneSecondTimer, this);
			timer.start();
			this._last1sTime = egret.getTimer();
		}


		private onOneSecondTimer() {
			var now: number = egret.getTimer();
			var dt: number = now - this._last1sTime;
			this._last1sTime = now;
			//1s定时器更新
			UpdateTickerManager.onesec.update(dt);
		}


		private _lastFpsTime: number;

		private runTicker() {
			var timer: egret.Timer = new egret.Timer(33);
			timer.addEventListener(egret.TimerEvent.TIMER, this.onEnterFrameTimer, this);
			timer.start();
			this._lastFpsTime = egret.getTimer();
		}


		private onEnterFrameTimer() {
			var now: number = egret.getTimer();
			var dt: number = now - this._lastFpsTime;
			this._lastFpsTime = now;
			//1s定时器更新
			UpdateTickerManager.instance.update(dt);
		}
	}
}