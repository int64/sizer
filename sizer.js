/**
 * Sizer
 * =====
 * Image sizer =) (c) Bond, James Bond
 * @author int64
 * @var source - source element
 * @var params:
 * 		padding - padding from window
 * 		closeOnScroll - will be close overlay by scroll
 */

function getOffset(elem) {
	if (elem.getBoundingClientRect) {
		// "правильный" вариант
		return getOffsetRect(elem)
	} else {
		// пусть работает хоть как-то
		return getOffsetSum(elem)
	}
}

function getOffsetSum(elem) {
	var top=0, left=0
	while(elem) {
		top = top + parseInt(elem.offsetTop)
		left = left + parseInt(elem.offsetLeft)
		elem = elem.offsetParent
	}

	return {top: top, left: left}
}

function getOffsetRect(elem) {
	// (1)
	var box = elem.getBoundingClientRect()

	// (2)
	var body = document.body
	var docElem = document.documentElement

	// (3)
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
	var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

	// (4)
	var clientTop = docElem.clientTop || body.clientTop || 0
	var clientLeft = docElem.clientLeft || body.clientLeft || 0

	// (5)
	var top  = box.top +  scrollTop - clientTop
	var left = box.left + scrollLeft - clientLeft

	return { top: Math.round(top), left: Math.round(left) }
}

var sizer = function(source,params) {

	if (source.sizer) {
		return false;
	}

	source.sizer = true;

	var init = function(){

		var padding = (params.padding != undefined ? params.padding : 5) / 100;
		var overlay = document.createElement("div");
		var clone = document.createElement('img');

		var scrollFunc = function(){
			close();
		}

		var close = function(){
			overlay.style.backgroundColor = 'transparent';
			clone.style.width = origW + 'px';
			clone.style.height = origH + 'px';
			clone.style.left = offsetLeft + 'px';
			clone.style.top = (offsetTop - window.scrollY) + 'px';
			setTimeout(function(){
				source.style.opacity = 1;
				overlay.parentNode.removeChild(overlay);
			},300);
			if (params.closeOnScroll) {
				window.removeEventListener('scroll',scrollFunc);
			}
		}

		source.style.opacity = 0;

		overlay.style.top = 0;
		overlay.style.left = 0;
		overlay.style.position = 'fixed';
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.backgroundColor = 'transparent';
		overlay.style.transition = '0.3s ease background-color';
		overlay.style.zIndex = 5000;
		document.body.appendChild(overlay);
		overlay.appendChild(clone);

		clone.src = source.src;
		clone.style.position = 'absolute';
		clone.style.transition = 'all 300ms';

		var origW = source.width;
		var origH = source.height;
		var imgW = source.naturalWidth;
		var imgH = source.naturalHeight;
		var winW = window.innerWidth;
		var winH = window.innerHeight;
		var offsetLeft = getOffset(source).left + parseInt(window.getComputedStyle(source, null).borderLeftWidth);
		var offsetTop = getOffset(source).top + parseInt(window.getComputedStyle(source, null).borderTopWidth);
		var dw = winW / imgW;
		var dh = winH / imgH;
		if (dw > dh) {
			var resultHeight = dh > 1 ? (imgH - imgH * padding) : (winH - winH * padding);
			var resultWidth = origW * (resultHeight / origH);
		} else {
			var resultWidth = dw > 1 ? (imgW - imgW * padding) : (winW - winW * padding);
			var resultHeight = origH * (resultWidth / origW);
		}

		var leftW = (winW - resultWidth) / 2;
		var topH = (winH - resultHeight) / 2;

		overlay.style.backgroundColor = '#fff';
		overlay.addEventListener('click',close)

		if (params.closeOnScroll) {
			window.addEventListener('scroll',scrollFunc);
		}

		clone.style.width = origW + 'px';
		clone.style.height = origH + 'px';
		clone.style.left = offsetLeft + 'px';
		clone.style.top = (offsetTop - window.scrollY) + 'px';

		setTimeout(function(){
			clone.style.width = resultWidth + 'px';
			clone.style.height = resultHeight + 'px';
			clone.style.left = leftW + 'px';
			clone.style.top = topH + 'px';
		},10);

		return false;
	}

	source.addEventListener('click',init);

	source.removeSizer = function() {
		delete source.sizer;
		source.removeEventListener('click',init);
	}
};