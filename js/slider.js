//
// slider.js
//

function sliderRedraw(obj) {
	var h=$(obj).height();
	var knob=$(obj).children('.sliderknob');
	var knobh=knob.height();
	var value=$(obj).attr("cur");
	var y=sliderKnobPosY(h,knobh,value);
	knob.css('top',y);
}

function sliderMouseDo(obj,e) {
	var h=$(obj).height();
	var knob=$(obj).children('.sliderknob');
	var knobh=knob.height();
	var value=sliderKnobValue(h,knobh,e.offsetY);
	$(obj).attr("cur",value);
	onSlider($(obj).attr('id'),value);
	sliderRedraw(obj);
}

function sliderMouseDown(obj,e) {
	// console.log("mousedown");
	// console.log(e);
	$(obj).children('.sliderknob').attr('down',true);
	sliderMouseDo(obj,e);
}

function sliderMouseMove(obj,e) {
	// console.log("slidermousemove");
	if ($(obj).children('.sliderknob').attr('down')=='true') sliderMouseDo(obj,e);
}

function sliderMouseUp(obj,e) {
	// console.log("mouseup");
	$(obj).children('.sliderknob').attr('down',false);
}
function sliderKnobValue(h,knobh,y) {
	var ratio=1.0-y/h;
	if (ratio<0) ratio=0;
	return ratio;
}
function sliderKnobPosY(h,knobh,ratio) {
	//h-=knobh;
	y=Math.round(h-h*ratio);
	if (y>(h-knobh)) y=h-knobh+1;
	return y;
}

function sliderSetValue(idstring,ratio) {
	var obj=$('#'+idstring);
	obj.attr("cur",ratio);
	sliderRedraw(obj);
}

function createSlider(left,top,w,h,knobh,idstring) {
	var htmltext='<div';
	htmltext+=' id="'+idstring+'"';
	htmltext+=' class="slider"';
	htmltext+=' style="height:'+h+'px;';
	htmltext+=' width: '+w+'px;';
	htmltext+=' border-style:solid; border-width:1px;';
	htmltext+='"';
	htmltext+=' down="false"';
	htmltext+=' onmousedown="sliderMouseDown(this,event)"';
	htmltext+=' onmousemove="sliderMouseMove(this,event)"';
	htmltext+=' onmouseup="sliderMouseUp(this,event)"';
	htmltext+=' onmouseleave="sliderMouseUp(this,event)"';
	htmltext+=' cur="'+0.0+'"';
	htmltext+='>';
	htmltext+='<div';
	htmltext+=' id="'+idstring+'knob'+'"';
	htmltext+=' class="sliderknob"';
	htmltext+=' style="position:absolute; z-index:-1; left: 1px; top: '+sliderKnobPosY(h,knobh,0.0)+'px; height: '+knobh+'px; width: '+w+'px; background-color:#000000;"';
	htmltext+='>';
	htmltext+='</div>';
	htmltext+='</div>';
	return htmltext;
}
