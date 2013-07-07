function getOffset( el ) {
    var x = 0,
        y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        x += el.offsetLeft - el.scrollLeft;
        y += el.offsetTop - el.scrollTop;
        el = el.parentNode;
    }
    return { top: y, left: x };
};

function getHTML(href, dataHandler){
    var loadedData = "";
    return $.ajax({
        url: href,
        complete:function(data){
        	dataHandler(data.responseText);
        }
    });
};

function titleFader(){

    var scrolling = false,
        scrollPosition,
        headerPosition, 
        postTop,
        viewTop,
        viewBottom,
        postBottom;

        var upperTitle = $(document.getElementById('upperCurrentTitle'));

    $(document).on('scroll',function(){
        scrolling = true;            
    });

    var scrollInterval = setInterval(function(){
        if (scrolling){
            scrollPosition = window.pageYOffset;
            headerPosition = getOffset(document.getElementById('titleHeader')).top;

            if(headerPosition <= -61){
                upperTitle.addClass('fadeIn');
            }
            else{
                upperTitle.removeClass('fadeIn');
            }

            scrolling = false;
        }
    }, 1000);
}

function tapBehaviour(){
	var link = "a";

	var timeoutFn;

	$(document)
	.on("touchstart", link, function(){
		var that = $(this)
		timeoutFn = setTimeout(function(){
			that.addClass('tapped');
		}, 0);
	})
	.on("touchend", link, function(){
		clearTimeout(timeoutFn);
		$(this).removeClass('tapped');
	})
	.on("touchmove", link, function(){
		clearTimeout(timeoutFn);
		$(this).removeClass('tapped');
	})
}
