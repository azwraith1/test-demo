class DBFactory {

        private static s_instance: DBFactory;

        private m_factorys: HashMap<string, dragonBones.EgretFactory> = new HashMap<string, dragonBones.EgretFactory>();

        public constructor() {

        }
        /**
         * 获取影片剪辑
         * @param db    龙骨数据名称
         * @param json  龙骨JSON名称
         * @param png   龙骨PNG名称
         * @param name  龙骨名称
         */
        public getDB(fileName: string = ""): dragonBones.EgretArmatureDisplay {
            if (this.m_factorys.get(fileName)) {
                let dbFactory: dragonBones.EgretFactory = this.m_factorys.get(fileName);
                return dbFactory.buildArmatureDisplay(fileName);
            }

            let db = fileName + "_ske_json";
            let json = fileName + "_tex_json";
            let png = fileName + "_tex_png";
            let dragonbonesData: any = RES.getRes(db);
            let jsonData: any = RES.getRes(json);
            let pngData: egret.Texture = RES.getRes(png);
            if (!dragonbonesData || !jsonData || !pngData) {
                LogUtils.logE("资源不存在");
                return;
            }

            let dbFactory: dragonBones.EgretFactory = new dragonBones.EgretFactory();
            dbFactory.parseDragonBonesData(dragonbonesData);
            dbFactory.parseTextureAtlasData(jsonData, pngData);
            this.m_factorys.put(fileName, dbFactory);
            return dbFactory.buildArmatureDisplay(fileName);
        }

        public static get instance(): DBFactory {
            if (DBFactory.s_instance == null) {
                DBFactory.s_instance = new DBFactory();
            }
            return DBFactory.s_instance;
        }

        public getDBAsync1(fileName: string): dragonBones.EgretArmatureDisplay {
            if (this.m_factorys.get(fileName)) {
                let dbFactory: dragonBones.EgretFactory = this.m_factorys.get(fileName);
                return dbFactory.buildArmatureDisplay(fileName);
            }
            let db = fileName + "_ske_json";
            let json = fileName + "_tex_json";
            let png = fileName + "_tex_png";
            let dragonbonesData: any = RES.getRes(db);
            let jsonData: any = RES.getRes(json);
            let pngData: egret.Texture = RES.getRes(png);
            if (!dragonbonesData || !jsonData || !pngData) {
                LogUtils.logI("资源不存在");
                return;
            }
            let dbFactory: dragonBones.EgretFactory= new dragonBones.EgretFactory();
            dbFactory.parseDragonBonesData(dragonbonesData);
            dbFactory.parseTextureAtlasData(jsonData, pngData);
            this.m_factorys.put(fileName, dbFactory)
            return dbFactory.buildArmatureDisplay(fileName);
        }

        /**
	 * 获取影片剪辑
	 * @param db    龙骨数据名称
	 * @param json  龙骨JSON名称
	 * @param png   龙骨PNG名称
	 * @param name  龙骨名称
	 */
        public getDBAsync(fileName: string = "", callback: Function): dragonBones.EgretArmatureDisplay {
            if (this.m_factorys.get(fileName)) {
                let dbFactory: dragonBones.EgretFactory = this.m_factorys.get(fileName);
                return callback(dbFactory.buildArmatureDisplay(fileName));
            }
            let db = fileName + "_ske_json";
            let json = fileName + "_tex_json";
            let png = fileName + "_tex_png";
            let dragonbonesData: any = RES.getRes(db);
            let jsonData: any = RES.getRes(json);
            let pngData: egret.Texture = RES.getRes(png);
            if (!dragonbonesData || !jsonData || !pngData) {
                LogUtils.logI("资源不存在");
                RES.getResAsync(db, (data) => {
                    dragonbonesData = data;
                    RES.getResAsync(json, (data1) => {
                        jsonData = data1;
                        RES.getResAsync(png, (data2) => {
                            pngData = data2;
                            let dbFactory: dragonBones.EgretFactory = new dragonBones.EgretFactory();
                            this.m_factorys.put(fileName, dbFactory)
                            dbFactory.parseDragonBonesData(dragonbonesData);
                            dbFactory.parseTextureAtlasData(jsonData, pngData);
                            callback(dbFactory.buildArmatureDisplay(fileName));
                        }, this);
                    }, this);
                }, this);
                return;
            }

            let dbFactory: dragonBones.EgretFactory = new dragonBones.EgretFactory();
            dbFactory.parseDragonBonesData(dragonbonesData);
            dbFactory.parseTextureAtlasData(jsonData, pngData);
            this.m_factorys.put(fileName, dbFactory)
            return callback(dbFactory.buildArmatureDisplay(fileName));
        }
    }
