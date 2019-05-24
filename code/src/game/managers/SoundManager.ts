class SoundManager {
	private static s_instance: SoundManager;
	/**
	 * 声音值0-1
	 */
	private _musicVolume: number;
	/**
	 * 特效值0-1
	 */
	private _effectVolume: number;
	/**
	 * 当前music
	 */
	private music: Howl;
	/**
	 * 特效集合
	 */
	private effectList: Howl[] = [];
	/**
	 * 上一次播放的声音值
	 */
	private _lastmusicVolume: number;
	/**
	 * 上一次播放的特效值
	 */
	private _lasteffectVolume: number;
	/**
	 * 当前声音文件名
	 */
	private musicSource: string;
	/**
	 * 当前是否循环
	 */
	private musicLoop: boolean;

	/**
	 * key value 形式
	 */
	private effectJsons: any = {};

	public set musicVolume(value) {
		this._musicVolume = value;
		egret.localStorage.setItem(GameConfig.SOUND_VOMULE, value + "");
		this.music && this.music.volume(value);
	}

	public get musicVolume() {
		return this._musicVolume;
	}

	public set effectVolume(value) {
		this._effectVolume = value;
		egret.localStorage.setItem(GameConfig.EFFECT_VOMULE, value + "");
		for (var i = 0; i < this.effectList.length; i++) {
			this.effectList[i].volume(value);
		}
	}

	public get effectVolume() {
		return this._effectVolume;
	}

	public static getInstance(): SoundManager {
		if (SoundManager.s_instance == null) {
			SoundManager.s_instance = new SoundManager();
			SoundManager.s_instance.init();
		}
		return SoundManager.s_instance;
	}


	public init() {
		let sound: string = egret.localStorage.getItem(GameConfig.SOUND_VOMULE);
		if (sound) {
			if (parseInt(sound) == 1)
				this._musicVolume = 1;
			else if (parseInt(sound) == 0)
				this._musicVolume = 0;
		}
		else {
			this._musicVolume = 1;
			egret.localStorage.setItem(GameConfig.SOUND_VOMULE, "1");
		}
		let music: string = egret.localStorage.getItem(GameConfig.EFFECT_VOMULE);
		if (music) {
			if (parseInt(music) == 1)
				this._effectVolume = 1;
			else if (parseInt(music) == 0)
				this._effectVolume = 0;
		}
		else {
			this._effectVolume = 1;
			egret.localStorage.setItem(GameConfig.EFFECT_VOMULE, "1");
		}
	}


	public constructor() {
		EventManager.instance.addEventListener(EventNotify.RUN_BACKEND, this.appPause, this);
		EventManager.instance.addEventListener(EventNotify.RUN_FORTEND, this.appResume, this);
	}

	/**
	 * app暂停
	 */
	private appPause() {
		this._lastmusicVolume = this._musicVolume, this._lasteffectVolume = this._effectVolume;
		if (this._musicVolume != 0) {
			this._musicVolume = 0;
		}
		if (this._effectVolume != 0) {
			this._effectVolume = 0;
		}
		this.stopAllEffects();
	}
	/**
	 * app重新开始
	 */
	private appResume() {
		if (this._lastmusicVolume != 0) {
			this._musicVolume = this._lastmusicVolume;
			this._lastmusicVolume = 0;
		}
		if (this._lasteffectVolume != 0) {
			this._effectVolume = this._lasteffectVolume;
			this._lasteffectVolume = 0;
		}
	}
	/**
	 * 播放声音
	 * @param  {string} musicName
	 * @param  {} loop=true
	 */
	public playMusic(musicName: string, loop = true) {
		let self = this;
		if (musicName) {
			if (this.musicSource == musicName) {
				return;
			}
			if (this.music) {
				this.music.stop(), this.music = null
			}
			this.musicSource = musicName;
			this.musicLoop = loop;
			var musicRes = RES.getRes(musicName);
			if (musicRes) {
				this.music = new Howl({
					src: [musicRes.url],
					loop: loop,
					volume: this._musicVolume
				});
				this.music.play();
			} else {
				RES.getResAsync(musicName, function (musicRes, t) {
					t == self.musicSource && self.playMusic(self.musicSource, self.musicLoop)
				}, this)
			}
		}
	}


	public stopMusic() {
		this.musicSource = null, this.music && (this.music.stop(), this.music = null);
	}


	public pauseMusic() {
		if (this.music) {
			this.music.stop();
		}
	}

	public remuseMusic() {
		if (this.music) {
			this.music.play();
		}
	}

	/**
	 * 播放特效
	 * @param  {} effectName
	 * @param  {} loop
	 * @param  {} volume
	 */
	public playEffect(effectName, loop = false, volume = this._effectVolume) {
		if(Global.runBack){
			return;
		}
		let playVolue = !volume ? this._effectVolume : volume;
		let effectRes = RES.getRes(effectName);
		if (effectRes) {
			let holw = new Howl({
				src: [effectRes.url],
				loop: loop,
				volume: playVolue,
				onload: () => {
					for (let i = 0; i < this.effectList.length; i++) {
						if (this.effectList[i] == holw) {
							this.effectList.splice(i, 1);
						}
					}
					this.effectList.push(holw);
					this.effectJsons[effectName] = holw;
					holw.play();
				}
			});
		} else {
			RES.getResAsync(effectName, function (e, t) {
			}, this)
		}
	}

	/**
	 * 停止所有特效
	 */
	public stopAllEffects() {
		for (; this.effectList.length;) this.effectList.shift().stop()
	}

	/**
	 * 停止音效
	 */
	public stopEffectByName(effectName) {
		if (this.effectJsons[effectName]) {
			this.effectJsons[effectName].stop();
			delete this.effectJsons[effectName];
		}

	}
}