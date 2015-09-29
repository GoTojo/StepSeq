//
// button.js
//

function buttonRedraw(idstring)
{
	var obj=$('#'+idstring);
	var led=obj.children('.buttonled');
	//console.log("%s:%s",idstring,obj.attr("status"));
	if (obj.attr("status")=="on") {
		led.css("background-color","red");
	} else {
		led.css("background-color","black");		
	}
}

function buttonMouseDown(obj,e) {
	if ($(obj).attr("status")=="on") {
		$(obj).attr("status","off");
		onButton($(obj).attr('id'),true);
	} else {
		$(obj).attr("status","on");
		 onButton($(obj).attr('id'),false);
	}
	buttonRedraw($(obj).attr('id'));
}

function buttonSet(idstring,status)
{
	$('#'+idstring).attr("status",status);
	buttonRedraw(idstring);
}

function createButton(left,top,w,h,idstring) {
	var htmltext='<div';
	htmltext+=' id="'+idstring+'"';
	htmltext+=' class="button"';
	htmltext+=' style="height:'+h+'px;';
	htmltext+=' width: '+w+'px;';
	htmltext+=' border-style:solid; border-width:1px;';
	htmltext+='"';
	htmltext+=' onmousedown="buttonMouseDown(this,event)"';
	htmltext+=' status="off"';
	htmltext+='>';
	htmltext+='<div';
	htmltext+=' id="'+idstring+'led'+'"';
	htmltext+=' class="buttonled"';
	htmltext+=' style="position:absolute; left:'+(w/2-8/2+1)+'px; top:1px; height:3px; width:8px; background-color:black;"';
	htmltext+='>';
	htmltext+='</div>';
	htmltext+='</div>';
	return htmltext;
}
