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
    enemies: [],
    start: true,
    pauseLayer: null,
    keysDown: {
        down:  false,
        up:    false,
        left:  false,
        right: false
    },

    ctor: function (space) {
        this._super();
        this.space = space;
        this.init();

        //chipmunk debug
        this._debugNode = cc.PhysicsDebugNode.create(this.space);
        this._debugNode.setVisible(false);
        this.addChild(this._debugNode, 10);

    },


    keyDownFree: function() {
        this.keysDown.down = false;
        this.keysDown.up = false;
        this.keysDown.left = false;
        this.keysDown.right = false;
    },

    init: function () {
        this._super();

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
        this.body.setPos(cc.p(g_heroStartX, g_heroStartY));
//        this.body.v_limit = g_heroMaxSpeed;

//        this.body.applyImpulse(cp.v(0, -g_heroSpeed), cp.v(0, 0));//run speed
        this.space.addBody(this.body);
        //init shape
        this.shape = new cp.BoxShape(this.body, contentSize.width, contentSize.height);
        this.space.addShape(this.shape);

        this.sprite.setBody(this.body);
        this.sprite.runAction(this.runningAction);

        this.spriteSheet.addChild(this.sprite);

        this.schedule(this.addEnemy, 1.11);
        this.schedule(this.addYummy, 2.83);
        this.schedule(this.addOb, 2.17);

        cc.tintTo
        this.pauseLayer = new PauseLayer();
        this.pauseLayer.setLocalZOrder(666);
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
                var target = event.getCurrentTarget();
                cc.log("pressed: " + keyCode);

                if (keyCode == 40) { //accelerete
                    target.keysDown.down = true;
//                    target.moveDown();
                }
                if (keyCode == 38) { //stop
                    target.keysDown.up = true;
//                    target.moveUp();
                }
                if (keyCode == 37) { //left
                    target.keysDown.left = true;
//                    target.moveLeft();
                }
                if (keyCode == 39) { //right
                    target.keysDown.right = true;
//                    target.moveRight();
                }
                if (keyCode == 32) { //pause
                    if (target.start) {
                        cc.director.pause();
                        target.addChild(target.pauseLayer);
                    } else {
                        cc.director.resume();
                        target.removeChild(target.pauseLayer);
                    }
                    target.start = !target.start;
                }
            },
            onKeyReleased: function (keyCode, event) {
                var target = event.getCurrentTarget();
                if (keyCode == 40) { //accelerete
                    target.keysDown.down = false;
                }
                if (keyCode == 38) { //stop
                    target.keysDown.up = false;
                }
                if (keyCode == 37) { //left
                    target.keysDown.left = false;
                }
                if (keyCode == 39) { //right
                    target.keysDown.right = false;
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
        this.sprite.x += g_heroSpeed;
//        this.body.applyImpulse(cp.v(g_heroSpeed, -10), cp.v(0, 0));
    },

    moveLeft: function () {
        cc.log("left");
        this.sprite.x -= g_heroSpeed;
    },

    moveUp: function () {
        cc.log("up");
        this.sprite.y += g_heroSpeed;
//        this.body.applyImpulse(cp.v(0, 0), cp.v(0, 0));
    },

    moveDown: function () {
        cc.log("down");
        this.sprite.y -= g_heroSpeed;
//        this.body.applyImpulse(cp.v(0, 0), cp.v(0, 0));
    },

    addEnemy: function () {
        var winSize = cc.director.getWinSize();
        var type = Math.round(Math.random());
        cc.log("er" + type);
        var enemy = new Rod(this, this.space, cc.p(-20, 0), type);
        this.bgObjs.push(enemy);
        var r = rand(100, winSize.height);
        cc.log(r);

        switch( enemy.type) {
            case ENEMY.BLUEBIRD_L:
                var move = cc.MoveBy.create(2, cc.p(winSize.width + 100, r)).easing(cc.easeIn(5.0));
                break;
            case ENEMY.BLUEBIRD_R:
                var move = cc.MoveTo.create(2, cc.p(-100, r)).easing(cc.easeIn(5.0));
                break;
        }
        enemy.sprite.runAction(move);
    },

    addOb: function () {
        var winSize = cc.director.getWinSize();
        var l = parseInt(rand(0, winSize.width));
        var ob = new BgObject(this, this.space, cc.p(l, -100));
        this.bgObjs.push(ob);
    },

    addYummy: function () {
        var winSize = cc.director.getWinSize();
        var l = parseInt(rand(0, winSize.width));
        var yummy = new Yummy(this, this.space, cc.p(l, -100));
        this.bgObjs.push(yummy);
    },

    deleteBgByShape: function (shape) {
        for (var i = 0; i < this.bgObjs.length; i++) {
            if (this.bgObjs[i].shape.hashid == shape.hashid) {
                cc.log("delete shape#" + this.bgObjs[i].shape.hashid);
                this.bgObjs[i].removeFromParent();
                this.bgObjs.splice(i, 1);
                break;
            }
        }
    },

    update: function (dt) {
        //стены
        var winSize = cc.director.getWinSize();
        if (this.sprite.getPositionX() > winSize.width - this.sprite.width / 2) {
            this.sprite.x = winSize.width - this.sprite.width / 2;
        }
        if (this.sprite.getPositionX() < this.sprite.width / 2) {
            this.sprite.x = this.sprite.width / 2;
        }
        if (this.sprite.getPositionY() > winSize.height - this.sprite.height / 2) {
            this.sprite.y = winSize.height - this.sprite.height / 2;
        }
        if (this.sprite.getPositionY() < this.sprite.height / 2) {
            this.sprite.y = this.sprite.height / 2;
        }

        //двигаем объекты
        for (var i = 0; i < this.bgObjs.length; i++) {
            if(this.bgObjs[i] instanceof Rod) {
                this.bgObjs[i].sprite.y += dt * g_bg_speed;
            } else {
                this.bgObjs[i].sprite.y += dt * g_bg_speed;
            }
        }

        //moves
        if (this.keysDown.down) {
            this.sprite.y -= dt * g_heroSpeed;
        }
        if (this.keysDown.up) {
            this.sprite.y += dt * g_heroSpeed;;
        }
        if (this.keysDown.left) {
            this.sprite.x -= dt * g_heroSpeed;;
        }
        if (this.keysDown.right) {
            this.sprite.x += dt * g_heroSpeed;;
        }
    }

});