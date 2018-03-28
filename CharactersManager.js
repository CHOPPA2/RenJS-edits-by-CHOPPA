function Character(name,speechColour,scaleX,scaleY){
    this.name = name;
    // RenJS.characters[this.name] = this;
    this.looks = {};
    this.currentLook = null;
    this.speechColour = speechColour;
    if (scaleX !== undefined && scaleY !== undefined) {
      this.scaleX = scaleX;
      this.scaleY = scaleY;
    } else {
      this.scaleX = 1;
      this.scaleY = 1;
    }
    this.addLook = function(lookName,image){
        var look = RenJS.storyManager.characterSprites.create(config.positions.CENTER.x,config.positions.CENTER.y,(image ? image : lookName));
        look.anchor.set(0.5, 1);
        look.alpha = 0;
        look.name = lookName;
        look.scale.setTo(this.scaleX, this.scaleY);
        this.looks[lookName] = look;
        if (!this.currentLook){
            this.currentLook = this.looks[lookName];
        }
    }
}

function CharactersManager(){
    this.characters = {};
    this.showing = {};

    this.add = function(name,displayName,speechColour,looks,scaleX,scaleY){
        this.characters[name] = new Character(displayName,speechColour,scaleX,scaleY);
        _.each(looks,function(filename,look){
            this.characters[name].addLook(look,name+"_"+look);
        },this);
        console.log(displayName + ' but it gay');
    }

    this.show = function(name,transition,props){
        var ch = this.characters[name];
        var oldLook = ch.currentLook;
        ch.currentLook = props.look ? ch.looks[props.look] : ch.looks.normal;

        if (!props.position){
            props.position = (oldLook != null) ? {x:oldLook.x,y:oldLook.y} : config.positions.CENTER;
        }
        if (props.flipped != undefined){
            ch.lastScale = props.flipped ? -1 : 1;
        }
        this.showing[name] = {look: ch.currentLook.name,position:props.position,flipped:(ch.lastScale==-1)};
        transition(oldLook,ch.currentLook,props.position,ch.lastScale,RenJS.storyManager.characterSprites);
    }

    this.hide = function(name,transition){
        var ch = this.characters[name];
        var oldLook = ch.currentLook;
        ch.currentLook = null;
        delete this.showing[name];
        // console.log("hiding ch "+name);
        transition(oldLook,null);
    }

    this.set = function (showing) {
        this.hideAll();
        this.showing = showing;
        _.each(this.showing,function(ch,name) {
            var character = this.characters[name];
            character.currentLook = character.looks[ch.look];
            character.currentLook.x = ch.position.x;
            character.currentLook.y = ch.position.y;
            character.currentLook.scaleX = ch.flipped ? -1 : 1;
            character.currentLook.alpha = 1;
        },this);
    }

    this.hideAll = function(){
        _.each(this.showing,function(showing,name){
            this.hide(name,RenJS.transitions.CUT);
        },this);
    }

}
