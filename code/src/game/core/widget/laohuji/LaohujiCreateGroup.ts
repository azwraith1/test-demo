// TypeScript file
module game {
    export class LaohujiCreateGroup {
        public static createRoundGroup(atr_1: Array<number>, atr_2: Array<number>, length: number, canvas: any, group: eui.Group) {
            let bitmap: eui.Image;
            for (let i = 1; i < length * 2; i++) {
                bitmap = new eui.Image();
                let n1 = this.createNum_1();
                bitmap.source = RES.getRes("icon_3_json." + n1 + "");
                switch (i) {
                    case 2:
                        bitmap.source = RES.getRes("icon_3_json." + atr_1[0] + "");
                        break;
                    case 3:
                        bitmap.source = RES.getRes("icon_3_json." + atr_1[1] + "");
                        break;
                    case 4:
                        bitmap.source = RES.getRes("icon_3_json." + atr_1[2] + "");
                        break;
                    case this.length * 10 - 5:
                        bitmap.source = RES.getRes("icon_3_json." + atr_2[0] + "");
                        break;
                    case this.length * 10 - 4:
                        bitmap.source = RES.getRes("icon_3_json." + atr_2[1] + "");
                        break;
                    case this.length * 10 - 3:
                        bitmap.source = RES.getRes("icon_3_json." + atr_2[2] + "");
                        break;
                }
                bitmap.horizontalCenter = 0;
                bitmap.y = (i - 1) * 172;
                canvas.width = group.width;
                canvas.addChild(bitmap);
                canvas.x = 0;
                canvas.y = -(this.length -4) * 172;
                group.addChild(canvas);
            }
            return group;
        }

        public static createNum_1(): number {
            let n1 = Math.ceil(Math.random() * 12);
            if (n1 == 1) return this.createNum_1();
            return n1;
        }

        public static createNum_2(): number {
            let n1 = Math.ceil(Math.random() * 12);
            if (n1 == 2) return this.createNum_2();
            return n1;
        }

        private static createNum_1_2(): number {
            let n1 = Math.ceil(Math.random() * 12);
            if (n1 == 1 || n1 == 2) return this.createNum_1_2();
            return n1;
        }
    }
}