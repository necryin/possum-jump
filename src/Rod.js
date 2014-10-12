/**
 * Created by human on 01.10.2014.
 */
var Rod = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    _map: 0,// which map belong to

    get map() {
        return this._map;
    },
    set map(newMap) {
        this._map = newMap;
    },

    /**
     *
     * @param spriteSheet
     * @param space
     * @param posX
     * @param posY
     */
    ctor:function (spriteSheet, space, posX, posY) {
        this.space = space;

        this.sprite = cc.PhysicsSprite.create(res.rod_png);
        var body = new cp.StaticBody();
        body.setPos(cc.p(posX, posY));
        this.sprite.setBody(body);

        this.shape = new cp.BoxShape(body,
            this.sprite.getContentSize().width-40,
            this.sprite.getContentSize().height-30);

        this.shape.setCollisionType(SpriteTag.rod);

        this.space.addStaticShape(this.shape);
        spriteSheet.addChild(this.sprite);
    },

    removeFromParent:function () {
        this.space.removeStaticShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    getShape:function () {
        return this.shape;
    }
});