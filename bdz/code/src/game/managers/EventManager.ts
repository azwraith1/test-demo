class EventAutoRelease {
	public type: string;
	public callback: Function;
	public thisObj: egret.DisplayObject;

	public constructor(type: string, callback: Function, targetObj: any) {
		this.type = type;
		this.callback = callback;
		this.thisObj = targetObj;
	}
}
class EventManager extends egret.EventDispatcher {
	private static _instance: EventManager;
	public lock: boolean = false;;
	public constructor(target?: any) {
		super(target);
		if (EventManager._instance) {
			throw new Error("EventManager使用单例 ");
		}

		this.init();
	}

	public static get instance(): EventManager {
		if (!EventManager._instance) {
			EventManager._instance = new EventManager();
		}
		return EventManager._instance;
	}

	private init() {
		var timer: egret.Timer = new egret.Timer(2000);
		timer.addEventListener(egret.TimerEvent.TIMER, this.autoReleaseTick, this);
		timer.start();
	}


	private autoReleaseArr: EventAutoRelease[] = [];

	public addEvent(type: string, callback: Function, targetObj: any, autoRelease: boolean = false) {
		this.addEventListener(type, callback, targetObj);
		if (autoRelease && targetObj instanceof egret.DisplayObject) {
			this.autoReleaseArr.push(new EventAutoRelease(type, callback, targetObj));
		}
	}

	public removeEvent(type: string, callback: Function, targetObj: any) {
		this.removeEventListener(type, callback, targetObj);
	}

	public dispatch(type: string, data: any = null) {
		if(this.lock){
			return;
		}
		this.dispatchEventWith(type, false, data);
	}

	/**
	 * 自动释放
	 */
	private autoReleaseTick() {
		for (var i = this.autoReleaseArr.length - 1; i >= 0; i--) {
			var vo: EventAutoRelease = this.autoReleaseArr[i];
			if (!vo.thisObj.stage) {
				this.removeEvent(vo.type, vo.callback, vo.thisObj);
				this.autoReleaseArr.splice(i, 1);
			}
		}
	}
}