module game {
    export class AudioManager {
        private static _audioManager: AudioManager;
        private constructor() {
            let sound: string = egret.localStorage.getItem(GameConfig.SOUND_NAME);
            if (sound) {
                if (parseInt(sound) == 1)
                    this._isPlaySound = true;
                else if (parseInt(sound) == 0)
                    this._isPlaySound = false;
            }
            else {
                this._isPlaySound = true;
                egret.localStorage.setItem(GameConfig.SOUND_NAME, "1");
            }
            let music: string = egret.localStorage.getItem(GameConfig.MUSIC_NAME);
            if (music) {
                if (parseInt(music) == 1)
                    this._isPlayMusic = true;
                else if (parseInt(music) == 2)
                    this._isPlayMusic = false;
            }
            else {
                this._isPlayMusic = true;
                egret.localStorage.setItem(GameConfig.MUSIC_NAME, "1");
            }
        }

        private _isPlaySound: boolean;
        private _isPlayMusic: boolean;
        private pauseMusic: boolean = null;
        private currentMusicName: string = "";
        public static getInstance(): AudioManager {
            if (!this._audioManager)
                this._audioManager = new AudioManager();
            return this._audioManager;
        }

        private backgroundMuisc: egret.Sound;
        private backgroundMuiscChannel: egret.SoundChannel;

        /**
         * 背景音乐
         */
        public playBackgroundMusic(muscName) {
            if (this.currentMusicName == muscName) {
                return;
            }
            this.currentMusicName = muscName;
            this.stopMusic();
            if (!this.isPlayMusic) {
                return;
            }
            if (this.backgroundMuiscChannel) {
                this.backgroundMuiscChannel.stop();
                this.backgroundMuisc = null;
            }
            if (!this.backgroundMuisc) {
                this.backgroundMuisc = this.getMusic(muscName);
                if (!this.backgroundMuisc) {
                    return;
                }
            }

            if (this.playBackgroundMusic) {
                this.backgroundMuiscChannel = this.backgroundMuisc.play(0);
            }
        }

        /**
         * 关闭首页背景
         * @param  {} muscName
         */
        public closeBackgroundMusic() {
            if (this.backgroundMuiscChannel) {
                this.backgroundMuiscChannel.stop();
                this.backgroundMuisc = null;
            }
        }

        public playMusic() {
            this.playBackgroundMusic(this.currentMusicName);
        }

        public stopMusic() {
            this.closeBackgroundMusic();
        }

        /**
         * 获取音乐资源
         * @param  {} name
         */
        private getMusic(name) {
            let data = GameCacheManager.instance.getCache(name);
            if (!data) {
                data = RES.getRes(this.currentMusicName);
                if (data) {
                    GameCacheManager.instance.setCache(name, data);
                }
            }
            return data;
        }

        private sound: any = {};
        playSound(url: string) {
            if (this._isPlaySound && GameConfig.IS_RUNNING) {
                // url += "_mp3";
                if (this.sound[url] && this.sound[url].sound) {
                    try {
                        this.sound[url].channel = this.sound[url].sound.play(0, 1);
                    } catch (e) {
                        LogUtils.logI("playMusic 报错" + url);
                    }
                }
                else {
                    let sound = RES.getRes(url);
                    if (!sound) {
                        return;
                    }
                    if (sound) {
                        this.sound[url] = new SoundItem();
                        this.sound[url].sound = sound;
                    }
                    if (this.sound[url].sound) {
                        try {
                            this.sound[url].channel = this.sound[url].sound.play(0, 1);
                        } catch (e) {
                            LogUtils.logI("播放出错")
                        }

                    }
                }
            }
        }

        stopSound(url: string) {
            // url += "_mp3";
            if (this.sound && this.sound[url]) {
                this.sound[url].channel.stop();
            }
        }



        public set isPlayMusic(value: boolean) {
            if (value) {
                this._isPlayMusic = true;
                let name = this.currentMusicName;
                this.currentMusicName = null;
                this.playBackgroundMusic(name);
                egret.localStorage.setItem(GameConfig.MUSIC_NAME, "1");
            }
            else {
                this._isPlayMusic = false;
                this.stopMusic();
                egret.localStorage.setItem(GameConfig.MUSIC_NAME, "0");
            }
        }

        public get isPlayMusic() {
            return this._isPlayMusic;
        }

        public set isPlaySound(value: boolean) {
            if (value) {
                this._isPlaySound = true;
                egret.localStorage.setItem(GameConfig.SOUND_NAME, "1");
            }
            else {
                this._isPlaySound = false;
                egret.localStorage.setItem(GameConfig.SOUND_NAME, "0");
            }
        }

        public get isPlaySound() {
            return this._isPlaySound;

        }

        /**
         * 播放出牌的声音。
         * sex性别，value打的牌面值。
         */
        public playSoundBySex(sex, value, template: string) {
            let sexStr = sex == 1 ? "male" : "female";
            template = template.replace("sex", sexStr) + value + "_mp3";
            game.AudioManager.getInstance().playSound(template);
        }
    }

    class SoundItem {
        public url: string;
        public sound: egret.Sound;
        public channel: egret.SoundChannel;
    }


}