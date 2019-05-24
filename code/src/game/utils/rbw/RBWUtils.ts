module rbwar {
	export class RBWUtils {
		public static getReportWinCount(reports: any[], type) {
			let count = 0;
			for (let i = reports.length - 1; i >= reports.length - 20; i--) {
				if (reports[i] == type) {
					count++;
				}
			}
			return count;
		}


		//-----------------------------------声音控制--------------------------------------

		/**
		 * 自己飞金币
		 */
		public static minePlayFjb() {
			SoundManager.getInstance().playEffect("rbw_minexz_mp3");
		}

		/**
		 * 其他飞金币
		 */
		public static otherPlayFjb() {
			SoundManager.getInstance().playEffect("rbw_fcm_mp3");
		}

		/**
		 * 开始下注停止下注
		 */
		public static beignOrStop(type) {
			if (type == 1) {
				SoundManager.getInstance().playEffect("rbw_ksxz_mp3");
			} else {
				SoundManager.getInstance().playEffect("rbw_tzxz_mp3");
			}
		}


		/**
		 * 显示红黑输赢
		 */
		public static showWinOrLose(type) {
			if (type == 1) {
				SoundManager.getInstance().playEffect("rbw_rwin_mp3");
			} else {
				SoundManager.getInstance().playEffect("rbw_bwim_mp3");
			}
		}


		/**
		 * 发牌
		 */
		public static fanpai() {
			SoundManager.getInstance().playEffect("rbw_fp_mp3");
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