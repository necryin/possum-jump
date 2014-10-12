/**
 * Created by human on 17.09.2014.
 */

var AnimationLayer = cc.Layer.extend({
    spriteSheet: null,
    runningAction: null,
    sprite: null,
    space: null,
    body: null,
    shape: null,
    vetka: null,
    yummy: null,
    recognizer: null,
    index: 0,
    seconds: 0,
    bgObjs: [],


    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();

        this._debugNode = cc.PhysicsDebugNode.create(this.space);
        this._debugNode.setVisible(false);
        // Parallax ratio and offset
        this.addChild(this._debugNode, 10);
    },
    init: function () {
        this._super();

        this.seconds = parseInt(new Date().getTime() / 1000);

        // create sprite sheet
        cc.spriteFrameCache.addSpriteFrames(res.hero_plist);
        this.spriteSheet = cc.SpriteBatchNode.create(res.hero_png);
        this.addChild(this.spriteSheet);

        //init  actions
        this.initAction();


        //create runner through physic engine
        this.sprite = cc.PhysicsSprite.create("#hero1.png");
        var contentSize = this.sprite.getContentSize();
        // init body
        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        this.body.p = cc.p(g_heroStartX, -100);
        this.body.v_limit = g_heroMaxSpeed;

        this.body.applyImpulse(cp.v(0, -g_heroSpeed - 10), cp.v(0, 0));//run speed
        this.space.addBody(this.body);
        //init shape
        this.shape = new cp.BoxShape(this.body, contentSize.width, contentSize.height);
        this.space.addShape(this.shape);

        this.sprite.setBody(this.body);
        this.sprite.runAction(this.runningAction);

        this.spriteSheet.addChild(this.sprite);

        //initialize the recognizer
//        this.recognizer = new SimpleRecognizer();
//
//        cc.eventManager.addListener({
//            event: cc.EventListener.TOUCH_ONE_BY_ONE,
//            swallowTouches: true,
//            onTouchBegan: this.onTouchBegan,
//            onTouchMoved: this.onTouchMoved,
//            onTouchEnded: this.onTouchEnded
//        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                cc.log("press" + keyCode);
                if (keyCode == 37) { //left
                    event.getCurrentTarget().moveLeft();
                }
                if (keyCode == 39) { //right
                    event.getCurrentTarget().moveRight();
                }
            }
        }, this);

        this.scheduleUpdate();
    },

    onExit: function () {
        this._super();
    },

    initAction: function () {
        // init runningAction
        var animFrames = [];
        // num equal to spriteSheet
        for (var i = 1; i < 3; i++) {
            var str = "hero" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = cc.Animation.create(animFrames, 0.1);
        this.runningAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this.runningAction.retain();
    },

    onTouchBegan: function (touch, event) {
//        var pos = touch.getLocation();
//        event.getCurrentTarget().recognizer.beginPoint(pos.x, pos.y);
//        return true;
    },

    onTouchMoved: function (touch, event) {
//        var pos = touch.getLocation();
//        event.getCurrentTarget().recognizer.movePoint(pos.x, pos.y);
    },

    onTouchEnded: function (touch, event) {
//        var rtn = event.getCurrentTarget().recognizer.endPoint();
//        cc.log("rnt = " + rtn);
//        switch (rtn) {
//            case "up":
//                event.getCurrentTarget().jump();
//                break;
//            default:
//                break;
//        }
    },

    modVelocity: function (v) {
        if (v < 0) return -v;
        return v;
    },

    moveRight: function () {
        cc.log("right");
        this.body.applyImpulse(cp.v(g_heroSpeed, -g_heroSpeed), cp.v(0, 0));
    },

    moveLeft: function () {
        cc.log("left");
        this.body.applyImpulse(cp.v(-g_heroSpeed, -g_heroSpeed), cp.v(0, 0));
    },

    getEyeY: function (dt) {
        var yy = Math.round(this.sprite.getPositionY() - 3 * g_heroStartY);
        var nindex = -parseInt(this.sprite.getPositionY() / 600);
        var winSize = cc.director.getWinSize();
        if(nindex != this.index) {
            this.index = nindex;
        }
        if(!this.yummy) {
            this.yummy = new Yummy(this, this.space, Math.random() * (200 - 10) + 10, yy - 200);
        }
        if(!this.vetka) {
            if(this.index % 2) {
                this.vetka =  new Rod(this,
                    this.space, 100, yy -100);
            } else {
                this.vetka =  new Rod(this,
                    this.space, 400, yy - 100);
            }

            //Sensors only call collision callbacks, and never generate real collisions
//            this.shape.setSensor(true);
        }
        var seconds = parseInt(new Date().getTime() / 1000);
        if (this.seconds + 3 == seconds) {
            this.seconds = seconds;
            this.bgObjs.push(new BgObject(this, this.space, Math.random() * ( winSize.width - 120) + 120, yy - winSize.height / 2 - 100));
        }

        return yy;
    },

    deleteBgByShape: function (shape) {
        for(var i=0; i < this.bgObjs.length; i++) {
            if( this.bgObjs[i].shape.hashid == shape.hashid) {
                this.bgObjs[i].removeFromParent();
                this.bgObjs.splice(i, 1);
                cc.log("deleted");
                cc.log(this.bgObjs);
                break;
            }
        }
    },

    update: function (dt) {

        var winSize = cc.director.getWinSize();
        if( this.sprite.getPositionX() > winSize.width - this.sprite.width / 2) {
            this.sprite.x =winSize.width - this.sprite.width / 2;
        }
        if( this.sprite.getPositionX() < this.sprite.width / 2) {
            this.sprite.x = this.sprite.width / 2;
        }



        // update meter
//        var statusLayer = this.getParent().getParent().getChildByTag(TagOfLayer.Status);
//        statusLayer.updateMeter(this.sprite.getPositionX() - g_runnerStartX);

        // check and update runner stat
//        var vel = this.body.getVel();
//        if (this.stat == RunnerStat.jumpUp) {
//            if (vel.y < 0.1) {
//                this.stat = RunnerStat.jumpDown;
//                this.sprite.stopAllActions();
//                this.sprite.runAction(this.jumpDownAction);
//            }
//        } else if (this.stat == RunnerStat.jumpDown) {
//            if (vel.y == 0) {
//                this.stat = RunnerStat.running;
//                this.sprite.stopAllActions();
//                this.sprite.runAction(this.runningAction);
//            }
//        }

    }

});