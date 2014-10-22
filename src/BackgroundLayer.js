/**
 * Created by human on 16.09.2014.
 */
var BackgroundLayer = cc.LayerGradient.extend({
    space: null,
    spriteSheet: null,
    seconds: 0,
    phase: 0,
    lc: [
        {from: COLOR.DARKBLUE, to: COLOR.BLUE,     dur: 3, dir: 1},
        {from: COLOR.BLUE,     to: COLOR.BLUE,     dur: 4, dir: 1},
        {from: COLOR.BLUE,     to: COLOR.DARKBLUE, dur: 3, dir: 1},
        {from: COLOR.DARKBLUE, to: COLOR.DARKBLUE, dur: 4, dir: 0},
        {from: COLOR.DARKBLUE, to: COLOR.BLUE,     dur: 3, dir: 0},
    ],

    /** float colors accumulator */
    colorR: 0,
    colorG: 0,
    colorB: 0,

    ctor:function (space, start, end, v) {
        this._super(start, end, v);
        this.space = space;
        this.init(start, end, v);
    },

    init:function (start, end, v) {
        this._super(start, end, cc.p(0, -1));
        this.scheduleUpdate();
        this.colorR = start.r;
        this.colorG = start.g;
        this.colorB = start.b;
        this.seconds = parseInt(new Date().getTime() / 1000);
    },

    changeColor: function(fC, iC, dt, lim){
        if(dt > 0) {
            if (iC >= lim) return lim;
            return fC >= iC+1 ? iC+1 : iC;
         } else {
            if (iC <= lim) return lim;
            return fC <= iC-1 ? iC-1 : iC;
        }
    },

    update:function (dt) {
        this.y = this.parent.getChildByTag(TagOfLayer.Animation).getEyeY();
        this.foneCircle(dt);
    },

    foneCircle: function(dt) {
        var i = this.phase;
//        cc.log("lc phase#"+i);
        var dr = (this.lc[i].to.r - this.lc[i].from.r) / this.lc[i].dur * dt;
        var dg = (this.lc[i].to.g - this.lc[i].from.g) / this.lc[i].dur * dt;
        var db = (this.lc[i].to.b - this.lc[i].from.b) / this.lc[i].dur * dt;
        this.colorR += dr;
        this.colorG += dg;
        this.colorB += db;

        var colorToChange = this.lc[i].dir ? this.getStartColor() : this.getEndColor();

        var c = new cc.Color(
            this.changeColor(this.colorR, colorToChange.r, dr, this.lc[i].to.r),
            this.changeColor(this.colorG, colorToChange.g, dg, this.lc[i].to.g),
            this.changeColor(this.colorB, colorToChange.b, db, this.lc[i].to.b), 255);

        this.lc[i].dir ? this.setStartColor(c) : this.setEndColor(c);
        var secs = parseInt(new Date().getTime() / 1000);

        if(secs - this.seconds >= this.lc[i].dur && cc.colorEqual(c, this.lc[i].to)) {
            this.phase += 1;
            this.seconds = secs;
            if ( this.phase >= this.lc.length) {
                this.phase = 0;
            }
        }
    }

});
