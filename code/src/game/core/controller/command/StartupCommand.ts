/*
 * @Author: Li MengChan 
 * @Date: 2018-06-25 14:25:35 
 * @Last Modified by:   Li MengChan 
 * @Last Modified time: 2018-06-25 14:25:35 
 * @Description: 开始应用框架入口
 */
module game {

	export class StartupCommand extends puremvc.MacroCommand {

		public constructor() {
			super();
		}
		public initializeMacroCommand(): void {
			this.addSubCommand(ControllerPrepCommand);
			this.addSubCommand(ModelPrepCommand);
			this.addSubCommand(ViewPrepCommand);
		}
	}
}