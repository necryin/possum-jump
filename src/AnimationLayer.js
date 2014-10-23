/**
 * Created by human on 17.09.2014.
 */

var AnimationLayer = cc.Layer.extend({
    spriteSheet: null,
    sprite: null,
    space: null,
    body: null,
    shape: null,
    recognizer: null,

    runningAction: null,
    bgObjs: [],
    start: true,
    pauseLayer: null,
    heroY: null,
    keysDown: [],

    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();

        //chipmunk debug
        this._debugNode = cc.PhysicsDebugNode.create(this.space);
        this._debugNode.setVisible(false);
        this.addChild(this._debugNode, 10);
    },
    init: function () {
        this._super();
        this.heroY = 3;
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
        this.body = new cp.Body(1, 0.1); //cp.momentForBox(1, contentSize.width, contentSize.height)
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

        this.schedule(this.addEnemy, 3);
        this.schedule(this.addYummy, 3);
        this.schedule(this.addOb, 2);

        this.pauseLayer = new PauseLayer();
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
                var target =  event.getCurrentTarget();
                cc.log("pressed: " + keyCode);
                var isInArray = false;
                for(var i = 0; i < target.keysDown.length; i++) {
                    if(target.keysDown[i] == keyCode) {
                        isInArray = true;
                        break;
                    }
                }
                if(!isInArray) {
                    target.keysDown.push(keyCode);
                }

                if (keyCode == 40) { //accelerete
                    event.getCurrentTarget().moveDown();
                }
                if (keyCode == 38) { //stop
                    event.getCurrentTarget().moveUp();
                }
                if (keyCode == 37) { //left
                    event.getCurrentTarget().moveLeft();
                }
                if (keyCode == 32) { //pause
                    self = event.getCurrentTarget();
                    if (self.start) {
                        cc.director.pause();
                        self.pauseLayer.y = self.getEyeY();
                        self.addChild(self.pauseLayer);
                    } else {
                        cc.director.resume();
                        self.removeChild(self.pauseLayer);
                    }
                    self.start = !self.start;

                }
                if (keyCode == 39) { //right
                    event.getCurrentTarget().moveRight();
                }
            },
            onKeyReleased: function (keyCode, event) {
                var target =  event.getCurrentTarget();
                cc.log("released: " + keyCode);
                cc.log(target.keysDown);
                for(var i=0; i < target.keysDown.length; i++) {
                    if(target.keysDown[i] == keyCode) {
                        target.keysDown.splice(i, 1);
                        break;
                    }
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

    moveRight: function () {
        cc.log("right");
        this.body.applyImpulse(cp.v(g_heroSpeed, -10), cp.v(0, 0));
    },

    moveLeft: function () {
        cc.log("left");
        this.sprite.x -= 0.01;
        this.body.applyImpulse(cp.v(-g_heroSpeed, -10), cp.v(0, 0));
    },

    moveUp: function () {
        cc.log("up");
        this.heroY += 0.05;
        this.body.applyImpulse(cp.v(0, 0), cp.v(0, 0));
    },

    moveDown: function () {
        cc.log("down");
        this.heroY -= 0.05;
        this.body.applyImpulse(cp.v(0, 0), cp.v(0, 0));
    },

    getEyeY: function () {
        //попутно определяет положение героя
        return  Math.round(this.sprite.getPositionY() -  this.heroY * g_heroStartY);
    },

    addEnemy: function () {
        var yy = this.getEyeY();
        var type = Math.round(Math.random());
        cc.log("er" + type);
        var enemy = new Rod(this, this.space, 60, yy - 50, type);
        enemy.body.applyImpulse(cp.v(1, 0), cp.v(0, 0));
        this.bgObjs.push(enemy);
    },

    addOb: function () {
        var yy = this.getEyeY();
        var winSize = cc.director.getWinSize();
        var l = parseInt(rand(120, winSize.width));
        var ob = new BgObject(this, this.space, l, yy - 300);
        this.bgObjs.push(ob);
    },

    addYummy: function () {
        var yy = this.getEyeY();
        var winSize = cc.director.getWinSize();
        var l = parseInt(rand(40, winSize.width));
        var yummy = new Yummy(this, this.space, l, yy - 200);
        this.bgObjs.push(yummy);
    },

    deleteBgByShape: function (shape) {
        for (var i = 0; i < this.bgObjs.length; i++) {
            if (this.bgObjs[i].shape.hashid == shape.hashid) {
                this.bgObjs[i].removeFromParent();
                this.bgObjs.splice(i, 1);
                cc.log("delete shape#" + this.bgObjs[i].shape.hashid);
                break;
            }
        }
    },

    update: function (dt) {
        //стены по бокам
        var winSize = cc.director.getWinSize();
        if (this.sprite.getPositionX() > winSize.width - this.sprite.width / 2) {
            this.sprite.x = winSize.width - this.sprite.width / 2;
        }
        if (this.sprite.getPositionX() < this.sprite.width / 2) {
            this.sprite.x = this.sprite.width / 2;
        }
        //TODO полезный кусок кода про анимацию
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