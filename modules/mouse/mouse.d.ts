declare namespace mouse {
    class MouseEvent {
        /**
         * @language en_US
         * When the user mouse movements are called.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * ���û�����ƶ�ʱ�����á�
         * @version Egret 3.1.0
         * @platform Web
         */
        static MOUSE_MOVE: string;
        /**
        * @language en_US
        * Called when the mouse is within the area where the object (not covered by other object).
        * @version Egret 3.1.0
        * @platform Web
        */
        /**
         * @language zh_CN
         * ��������ڶ������������ڣ�û�б��������󸲸ǣ�ʱ���á�
         * @version Egret 3.1.0
         * @platform Web
         */
        static MOUSE_OVER: string;
        /**
         * @language en_US
         * Called when the mouse out of the object within the Area.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * ������Ƴ���������������ʱ���á�
         * @version Egret 3.1.0
         * @platform Web
         */
        static MOUSE_OUT: string;
        /**
         * @language en_US
         * When the mouse enters an object within the Area calls.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * ��������������������ڵ��á�
         * @version Egret 3.1.0
         * @platform Web
         */
        static ROLL_OVER: string;
        /**
         * @language en_US
         * Called when the mouse out of the object within the Area.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * ������Ƴ���������������ʱ���á�
         * @version Egret 3.1.0
         * @platform Web
         */
        static ROLL_OUT: string;
        /**
         * @language en_US
         * Called when the mouse wheel scrolls.
         * @version Egret 5.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * �������ֹ���ʱ���á�
         * @version Egret 5.1.0
         * @platform Web
         */
        static MOUSE_WHEEL: string;
    }
}
declare namespace mouse {
    /**
     * @language en_US
     * Enable mouse detection.
     * @version Egret 3.1.0
     * @platform Web
     */
    /**
     * @language zh_CN
     * ����mouse��⡣
     * @version Egret 3.1.0
     * @platform Web
     */
    const enable: (stage: egret.Stage) => void;
    /**
     * @language en_US
     * Set a target of buttonMode property setting is true, when the mouse rolls over the object becomes hand type.
     * @version Egret 3.1.0
     * @platform Web
     */
    /**
     * @language zh_CN
     * ����һ�������buttonMode���ԣ�����Ϊtrue�󣬵���껬���ö��������͡�
     * @version Egret 3.1.0
     * @platform Web
     */
    const setButtonMode: (displayObjcet: egret.DisplayObject, buttonMode: boolean) => void;
    /**
     * @language en_US
     * Setting ON mouseMove event detection, after opening slightly impacts performance, default is not open.
     * @version Egret 3.1.0
     * @platform Web
     */
    /**
     * @language zh_CN
     * ���ÿ���mouseMove�¼���⣬���������ܻ�����Ӱ�죬Ĭ��Ϊ��������
     * @version Egret 3.1.0
     * @platform Web
     */
    const setMouseMoveEnabled: (enabled: boolean) => void;
}