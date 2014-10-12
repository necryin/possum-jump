/**
 * Created by human on 16.09.2014.
 */
var BackgroundLayer = cc.Layer.extend({
    map00:null,
    map01:null,
    mapHeight:0,
    mapIndex:0,
    space:null,
    spriteSheet:null,
    objects:[],

    ctor:function (space) {
        this._super();

        // clean old array here
        this.objects = [];
        this.space = space;

        this.init();
    },

    init:function () {
        this._super();

        var bg = cc.staticShapes
        this.map00 = cc.TMXTiledMap.create(res.bgtile1_tmx);
        this.map00.setPosition(cc.p(0, Math.round(-this.map00.getContentSize().height / 2) ) );
        this.addChild(this.map00);

        this.mapHeight = this.map00.getContentSize().height;

        this.map01 = cc.TMXTiledMap.create(res.bgtile2_tmx);
        this.map01.setPosition(cc.p(0, Math.round(-this.mapHeight - this.map00.getContentSize().height / 2 )));
        this.addChild(this.map01);

        // create sprite sheet
//        cc.spriteFrameCache.addSpriteFrames(res.background_plist);
//        this.spriteSheet = cc.SpriteBatchNode.create(res.background_png);
//        this.addChild(this.spriteSheet);


//        this.loadObjects(this.map00, 0);
//        this.loadObjects(this.map01, 1);

        this.scheduleUpdate();
    },

    loadObjects:function (map, mapIndex) {
        // add coins
//        var coinGroup = map.getObjectGroup("coin");
//        var coinArray = coinGroup.getObjects();
//        for (var i = 0; i < coinArray.length; i++) {
//            var coin = new Coin(this.spriteSheet,
//                this.space,
//                cc.p(coinArray[i]["x"] + this.mapWidth * mapIndex,coinArray[i]["y"]));
//            coin.mapIndex = mapIndex;
//            this.objects.push(coin);
//        }
//
//        // add rock
//        var rockGroup = map.getObjectGroup("rock");
//        var rockArray = rockGroup.getObjects();
//        for (var i = 0; i < rockArray.length; i++) {
//            var rock = new Rock(this.spriteSheet,
//                this.space,
//                    rockArray[i]["x"] + this.mapWidth * mapIndex);
//            rock.mapIndex = mapIndex;
//            this.objects.push(rock);
//        }
    },

    removeObjects:function (mapIndex) {
//        while((function (obj, index) {
//            for (var i = 0; i < obj.length; i++) {
//                if (obj[i].mapIndex == index) {
//                    obj[i].removeFromParent();
//                    obj.splice(i, 1);
//                    return true;
//                }
//            }
//            return false;
//        })(this.objects, mapIndex));
    },

    removeObjectByShape:function (shape) {
//        for (var i = 0; i < this.objects.length; i++) {
//            if (this.objects[i].getShape() == shape) {
//                this.objects[i].removeFromParent();
//                this.objects.splice(i, 1);
//                break;
//            }
//        }
    },

    checkAndReload:function (eyeY) {
        var newMapIndex = -parseInt(eyeY / this.mapHeight);
//        cc.log("index = " + newMapIndex);
        if (this.mapIndex == newMapIndex) {
            return false;
        }

        if (0 == newMapIndex % 2) {
            // change mapSecond
            cc.log("swap = " + 1);
            this.map01.setPositionY(Math.round(-this.mapHeight * (newMapIndex + 1)));
//            this.loadObjects(this.map01, newMapIndex + 1);

        } else {
            // change mapFirst
            cc.log("swap = " + 0);
            cc.log("newMapIndex = " + newMapIndex);
            cc.log("swapto = " + (-this.mapHeight * (newMapIndex + 1)));
            this.map00.setPositionY(Math.round(-this.mapHeight * (newMapIndex + 1)));
//            this.loadObjects(this.map00, newMapIndex + 1);

        }

//        this.removeObjects(newMapIndex - 1);
        this.mapIndex = newMapIndex;

        return true;
    },

    update:function (dt) {
        var animationLayer = this.getParent().getChildByTag(TagOfLayer.Animation);
        var eyeY = animationLayer.getEyeY(dt);
        this.checkAndReload(eyeY);
    }
});
