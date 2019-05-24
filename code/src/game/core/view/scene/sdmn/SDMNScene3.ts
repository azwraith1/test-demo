// TypeScript file
module sdmn {
    export class SDMNScene3 extends game.BaseScene {
        public resizeGroup: eui.Group;
        public freeGroup: eui.Group;
        public freebg: eui.Image;
        public freewinGroup: eui.Group;
        public freeTimesLabel: eui.BitmapLabel;
        public freewinLabel: eui.BitmapLabel;
        public freemulGroup: eui.Group;
        public bei2: eui.Image;
        public bei5: eui.Image;
        public bei10: eui.Image;
        public selectGroup: eui.Group;

        public constructor() {
            super();
            this.skinName = "SDMNScene3Skin";
        }
        public onAdded() {
            super.onAdded();
        }

        public onRemoved() {
            super.onRemoved();
        }

    }
}