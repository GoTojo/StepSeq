// seq.js


var Step = function(x,y,w,h,idstring,parent) {
	this.note=60;
	this.soundnote=-1;
	this.curstep=false;
	this.selected=false;
	this.changed=false;
	this.sw=false;
	var htmltext='<div';
	htmltext+=' id="'+idstring+'"';
	htmltext+=' class="step"';
	htmltext+=' style="';
	htmltext+=' position:absolute;';
	htmltext+=' left:'+x+'px;';
	htmltext+=' top:'+y+'px;';
	htmltext+=' width:'+w+'px;';
	htmltext+=' height:'+h+'px;';
	htmltext+=' border-style:solid; border-width:1px;';
	htmltext+=' "';
	htmltext+='>';
	htmltext+='</div>';
	var elem=document.createElement("div");
	elem.innerHTML=htmltext;
	parent.appendChild(elem);
	this.element=document.getElementById(idstring);
	this.element.addEventListener("mousedown",(function(_this){
      return function(e){
        _this.ondown();
      };
    })(this),false);
	this.element.addEventListener("mouseup",(function(_this){
      return function(e){
        _this.onup();
      };
    })(this),false);
	this.update();
}

Step.prototype = {
	update: function() {
		if (this.selected) {
			this.element.style.backgroundColor="green";
		} else if (this.curstep) {
			this.element.style.backgroundColor="red";
		} else if (this.sw) {
			this.element.style.backgroundColor="white";
		} else {
			this.element.style.backgroundColor="gray";			
		}
	},
	set: function(note) { this.note=note; this.changed=true; },
	ondown : function() { 
		this.selected=true;
		this.update(); 
	},
	onup : function() {
		this.selected=false;
		if (!this.changed) {
			this.sw=!this.sw;
		}
		this.changed=false;
		this.update(); 
	},
	isdown: function() { return this.selected; },
	noteon : function(timestamp) {
		if (this.sw==true&&this.note>=0) {
			noteon(timestamp,this.note);
			this.soundnote=this.note;
		}
		this.curstep=true;
		this.update();
	},
	noteoff : function(timestamp) {
		if (this.soundnote>=0) {
			noteoff(timestamp,this.soundnote);
			this.soundnote=-1;
		}
		this.curstep=false;
		this.update();
	},
	on : function() { this.sw=true; },
	off : function() { this.sw=false; },
};

// Sequencerの仕様
// 16step
// step数は1-16で可変
// tempoはstep処理時に変更(同期しないので良しとする)
// 10ms毎の処理をsetIntervalで起動,
// window.performance.now()で正確な時間を取得、20ms以内のイベントをタイムスタンプ付きでWebMIDIに渡す
var Seq = function(parent) {
	this.step=new Array(16);
	var x=0;
	var y=0;
	var w=20;
	var h=40;
	var gapX=w+10;
	for (var step=0; step<16; step++) {
		this.step[step]=new Step(x,y,w,h,'step'+step,parent);
		//console.log(step,this.step[step]);
		x+=gapX;
	}
	this.setlaststep(15);
	this.interval=this.settempo(120); // tempo:120における16分音符の時間間隔
	this.targettime=0;
	this.f8count=0;
	this.setstep(0);
	this.playing=false;
	this.parent=parent;
	this.intervalid=null;
};

Seq.prototype = {
	start: function() {
		this.curstep=0;
		this.nextstep=0;
		this.playing=true;
		var curtime=Math.round(performance.now());
		this.targettime=curtime+this.interval;
		this.f8count=0;
		this.doInterval();
		this.intervalid=setInterval((function(_this){
      		return function(e){
        	_this.doInterval();
      		};
    	})(this),10);
    	output.send([0xFA],curtime);
	},
	stop: function() {
		this.playing=false;
		clearInterval(this.intervalid);
		for (var step=0;step<16;step++) this.step[step].noteoff(40);
		this.setstep(0);
    	output.send([0xFC],performance.now()+50);
	},
	isplaying: function() { return this.playing; },
	setstep: function(step) {
		if (step>this.laststep) step=0;
		this.curstep=step;
		this.nextstep=step+1;
		if (this.nextstep>this.laststep) {
			this.nextstep=0;
		}
	},
	settempo: function(tempo) {
		return this.interval=Math.round(60000.0/tempo/24.0);
	},
	setlaststep: function(laststep) { 
		if (laststep>0&&laststep<16) this.laststep=laststep; 
	},
	set: function(note) {
		for (var step=0; step<16; step++) {
			if (this.step[step].isdown()) {
				this.step[step].set(note);
			}
		}
	},
	doInterval: function() {
		var curtime=Math.round(performance.now());
		if (this.targettime-curtime<10) {
			if (++this.f8count>3) {
				this.step[this.curstep].noteoff(this.targettime);
				this.step[this.nextstep].noteon(this.targettime);
				this.setstep(this.nextstep);
				this.f8count=0;
			}
			this.targettime+=this.interval;
    		output.send([0xF8],this.targettime);
		}		
	}
};

