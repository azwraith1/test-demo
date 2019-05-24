/*
 * @Author: Li MengChan 
 * @Date: 2018-06-28 10:27:19 
 * @Last Modified by: li mengchan
 * @Last Modified time: 2018-09-14 10:11:50
 * @Description: 本家出牌集合组
 */
module majiang {
    export class MineChupaiGroup extends BaseChupaiGroup {
        public chupais: MineChupai[] = [];
        public constructor() {
            super();
            // this.skinName = new majiang.MineChupaiGroupSkin();
        }

        public createChildren() {
            super.createChildren();
        }

        /**
         * 根据一定的结构算法，显示层级
         */
        public sortByJieGou() {
            var sort = [0, 1, 2, 3, 6, 5, 4];
            this.sortByXIndexByGroup(sort, this.group1);
            this.sortByXIndexByGroup(sort, this.group2);
            this.sortByXIndexByGroup(sort, this.group3);
        }

        public createByArr(arr) {
            for (var i = 0; i < arr.length; i++) {
                var value = arr[i];
                this.createMineChupaiByIndex(i, value);
            }
            // this.sortByXIndexByGroup(this.group1);
            this.sortByJieGou();
        }

        public createMineChupaiByIndex(index, value) {
            //列数
            var cow = Math.floor(index / 7) + 1;
            //行数
            var row = index % 7 + 1;
            let mineChupai;
            if (cow <= 3) {
                mineChupai = new MineChupai(value);
                mineChupai.initWithIndex(row);
                this['group' + cow].addChild(mineChupai);
                mineChupai.setByRecord(this.recordsJson[index + 1]);
                mineChupai.settingColors(index + 1);
            } else {
                mineChupai = new MineChupai(value);
                mineChupai.initWithIndex(21);
                mineChupai.settingColors(21);
                cow = 3;
                mineChupai.skewX = -1;
                mineChupai.x = 266 + (index - 20) * 45;
                mineChupai.y = 8;
                this['group' + 3].addChild(mineChupai);
            }
            this.chupais.push(mineChupai);
            return mineChupai;
        }


        public addChupai(value) {
            let mineChupai = new MineChupai(value);
            let index = this.chupais.length;
            return this.createMineChupaiByIndex(index, value);
        }

        public sortByXIndexByGroup(sort, group: eui.Group) {
            var sortList = [];
            var sortNum = group.numChildren;
            if (group.numChildren > sort.length) {
                sortNum = sort.length
            }
            for (var i = 0; i < sortNum; i++) {
                var item = group.getChildByName("mj" + sort[i]);
                if (item) {
                    sortList.push(item);
                }
            }
            for (var i = 0; i < sortList.length; i++) {
                group.addChild(sortList[i]);
            }
        }
    }
}