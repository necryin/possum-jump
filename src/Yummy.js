/**
 * Created by human on 01.10.2014.
 */
var Yummy = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    body: null,

    ctor: function (spriteSheet, space, pos) {
        this.space = space;
        // TODO need more yummies !!!
        this.sprite = cc.PhysicsSprite.create(res.yummy1_png);
        this.body = new cp.Body(10, 0.5);
        this.body.setPos(pos);
        this.sprite.setBody(this.body);

        this.shape = new cp.BoxShape(this.body, this.sprite.getContentSize().width, this.sprite.getContentSize().height);
        this.shape.setCollisionType(SpriteTag.yummy);
        this.space.addShape(this.shape);
        spriteSheet.addChild(this.sprite, 1);
    },

    removeFromParent: function () {
        this.space.removeShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    }

});