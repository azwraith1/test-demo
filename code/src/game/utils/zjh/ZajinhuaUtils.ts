module zjh {
	export class ZajinhuaUtils {
		public constructor() {
		}
		//-----------------------------------声音控制--------------------------------------

		/**
		 * 飞筹码
		 */
		public static PlayFcm() {
			SoundManager.getInstance().playEffect("rbw_minexz_mp3");
		}

		/**
		 * 其他飞金币
		 */
		public static otherPlayFjb() {
			SoundManager.getInstance().playEffect("rbw_fcm_mp3");
		}

		/**
		 * 炸弹
		 */
		public static PlayBoom() {
			SoundManager.getInstance().playEffect("zjh_boom_mp3");
		}

		/**
		 * 跟注
		 */
		public static playGz(sex) {
			let sound = "zjh_gz_" + sex + "_mp3";
			SoundManager.getInstance().playEffect(sound);
		}

		/**
		 * 加注
		 */
		public static playJz(sex) {
			let sound = "zjh_jz_" + sex + "_mp3";
			SoundManager.getInstance().playEffect(sound);
		}

		/**
		 *孤注一掷
		 */
		public static playGzyz(sex) {
			let sound = "zjh_gzyz_" + sex + "_mp3";
			SoundManager.getInstance().playEffect(sound);
		}

		/**
		 *比牌
		 */
		public static playBp(sex) {
			let sound = "zjh_bp_" + sex + "_mp3";
			SoundManager.getInstance().playEffect(sound);
		}

		/**
		 * 发牌
		 */
		public static fapai() {
			SoundManager.getInstance().playEffect("nns_fapai_mp3");
		}


		/**
		 * 自己赢
		 */
		public static mineWin() {
			SoundManager.getInstance().playEffect("rbw_win_mp3");
		}


		/**
		 * 展示分数
		 */
		public static playSoundByFen(fen) {
			SoundManager.getInstance().playEffect("rbw_" + fen + "_mp3");
		}
	}
}