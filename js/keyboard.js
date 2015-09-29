	function getKeyName(note) {
		var keyTbl = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
		return keyTbl[note%12];
	}
	function getNoteName(note) {
		var oct=Math.floor(note/12);
		return getKeyName(note)+(oct-1);
	}
	function getKeyAttr(note) {
		var isWhite=[true,false,true,false,true,true,false,true,false,true,false,true];
		var oct=Math.floor(note/12);
		//var ww = 10;
		//var bw = 7;
		var ww = 6;
		var bw = 4;
		var left=ww*7*oct;
		switch (getKeyName(note)) {
			case "C":
			left+=ww*0;
			break;
			case "Db":
			left+=ww-bw/2;
			break;
			case "D":
			left+=ww*1;
			break;
			case "Eb":
			left+=ww*2-bw/2;
			break;
			case "E":
			left+=ww*2;
			break;
			case "F":
			left+=ww*3;
			break;
			case "Gb":
			left+=ww*4-bw/2;
			break;
			case "G":
			left+=ww*4;
			break;
			case "Ab":
			left+=ww*5-bw/2;
			break;
			case "A":
			left+=ww*5;
			break;
			case "Bb":
			left+=ww*6-bw/2;
			break;
			case "B":
			left+=ww*6;
			break;
		}
		return {left:left,class:isWhite[note%12]?"whitekey":"blackkey", name:getNoteName(note)};
	}
	function createKeyboard(left,top,idstring) {
		var htmltext="<div id='"+idstring+"' class='keyboard' style='height: 20px; width: "+(10*(5*7+5)+40)+"px;'>";
		for (note=0;note<128;note++) {
			var attr=getKeyAttr(note);
			if (attr.class=="blackkey") continue;
			htmltext+='<div';
			htmltext+=' id="'+attr.name+'"';
			htmltext+=' class="whitekey"';
			htmltext+=' note="'+note+'"';
			htmltext+=' style="left: '+(attr.left+left)+'px; top:'+top+'px;"';
			htmltext+=' enable="true"';
			htmltext+=' onmousedown="keyboardMouseDown(this)"';
			htmltext+=' onmouseup="keyboardMouseUp(this)"';
			htmltext+=' onmouseleave="keyboardMouseUp(this)"';
			htmltext+='></div>';
		}
		for (note=0;note<128;note++) {
			var attr=getKeyAttr(note);
			if (attr.class=="whitekey") continue;
			htmltext+='<div';
			htmltext+=' id="'+attr.name+'"';
			htmltext+=' class="blackkey"';
			htmltext+=' note="'+note+'"';
			htmltext+=' style="left: '+(attr.left+left)+'px; top:'+top+'px;"';
			htmltext+=' enable="true"';
			htmltext+=' onmousedown="keyboardMouseDown(this)"';
			htmltext+=' onmouseup="keyboardMouseUp(this)"';
			htmltext+=' onmouseleave="keyboardMouseUp(this)"';
			htmltext+='></div>';
		}
		htmltext+='<div class="keytooltip" style="display: none;"></div>';
		htmltext+='</div>';
		htmltext+='</div>';
		return htmltext;
	}
	function keyboardMouseDown(obj) {
		var kbd=$(obj).parent().attr('id');
		var note=$(obj).attr('note');
		keyDown(kbd,note);
		keyDragStart(kbd,note);
	}
	function keyboardMouseUp(obj) {
		var kbd=$(obj).parent().attr('id');
		var note=$(obj).attr('note');
		keyUp(kbd,note);
		keyDragEnd(kbd,note);
	}
	$(function() {
		$('.whitekey,.blackkey').hover(
			function(e) {
				var name='tooltip'+$(this).attr('id');
				var tooltip=$(this).parent().children('.keytooltip');
				tooltip.text($(this).attr('id')+'('+$(this).attr('note')+')');
				tooltip.css('left',e.clientX-$(this).parent().offset().left);
				tooltip.css('top',e.clientY-$(this).parent().offset().top-35);
			}),
		$('.keyboard').hover(
			function() {
				$(this).children('.keytooltip').show();
			},
			function() {
				$(this).children('.keytooltip').hide();
			})
	})
