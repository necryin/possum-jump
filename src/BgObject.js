/**
 * Created by human on 06.10.2014.
 */
var BgObject = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    body: null,

    ctor: function (spriteSheet, space, pos) {
        this.space = space;

        this.sprite = cc.PhysicsSprite.create(res.bg1_png);
        var contentSize = this.sprite.getContentSize();
        this.sprite.opacity = rand(30, 100);

        this.body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height));
        this.body.setPos(pos);

        this.sprite.setBody(this.body);

        this.shape = new cp.BoxShape(this.body, contentSize.width, contentSize.height);
        this.shape.setCollisionType(SpriteTag.bg_obj);
        this.shape.setSensor(true);

        this.space.addShape(this.shape);
        spriteSheet.addChild(this.sprite, 2);
    },

    removeFromParent: function () {
        this.space.removeShape(this.shape);
        this.shape = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    }

});
