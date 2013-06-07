var WLS = window.WLS || [];
WLS = {
	init : function( side_init ) {

		// initial window sizes
		var initWidth = $(window).width();
		var initHeight = $(window).height()
		// initial page load output
		$('#screen').append( initWidth +'x'+ initHeight );
		getTypes = jQuery('*[data-type^="screen"]');
		if( initWidth < 480 ) {
			getTypes.toggleClass('mobile');
		} 
/*		else if( initWidth > 769 && initWidth < 999 ) {
			getTypes.toggleClass('tablet');
		}
*/		// listener for browser size changes and adjust output
		$(window).bind('resize', function() {
			// create win var and attach to sizes
			var viewWidth = $(window).width();
			var viewHeight = $(window).height();
			var viewSize = viewWidth +'x'+ viewHeight;
			$('#screen').text( viewSize );
			getWrapper = $('wrapper');
			if( viewWidth < 480 ) {
				getWrapper.addClass('mobile');
//				getWrapper.removeClass('tablet');
			} else
/*			if( viewWidth > 768 && viewWidth < 1100 ) {
				getWrapper.addClass('tablet');
				getWrapper.removeClass('mobile');
			} else
*/			if( viewWidth > 481 ) {
//				getWrapper.removeClass('tablet');
				getWrapper.removeClass('mobile');
			}

		})
		WLS.runBase();
		WLS.parseSide( side_init );
	},
	runBase : function() {
		$.getJSON("js/base.js", function(data) {
			$.each(data.links, function(index, value) {
				$.each(value, function(index, value) {
					WLS.parseBase(index, value);
				});
			});
		//console.log('base is run');
		WLS.setSide();
		WLS.linksInNewWindow();
		WLS.setMasonry();
		});
	},
	parseBase : function(index, value) {
		var html = '';
		if( index === 'side' ) {
			html += '<ul id="side">';
		} else {
			html = '<ul>';
		}
		html += '<li class="hdr">'+index+'</li>';
		$.each(value, function(index, value) {
			if( $('#wrapper').hasClass('mobile') ) {
				value = value.split('^').join('');
				value = value.split('*').join('-');
				html += '<li><a href="'+index+'">'+value+'</a></li>';
			} else {
				var isMore = '*';
				var hasMore = '^';
				var needsMore = ( value.indexOf(hasMore) === -1) ? 0 : 1 ;
				var addMore = ( value.indexOf(isMore) === -1) ? 0 : 1 ;
				if( addMore === 1 ) { 
					html += '<li class="more">';
					if ( value.substring(1, 2) === isMore ) {
						html += '<a href="'+index+'">'+value.substring(2, 3)+'</a>';
					} else {
						html += '<a href="'+index+'">- '+value.substring(1, 2)+'</a>';
					}
				} else if( needsMore === 1 ) {
					html += '<li class="needs-more">';
					html += '<a href="'+index+'">'+value.substring(1)+'</a>';
				} else {
					html += '<li>';
					html += '<a href="'+index+'">'+value+'</a>';
				}
				html += '</li>';
			}

		});
		html += '</ul>';

		if( $('#wrapper').hasClass('mobile') ) {
			if( index === 'side' ) {
				$("#sideon").prepend( html );
			} else {
				$("#container").append( html );
			}
		} else {
			$("#container").append( html );
		}
	},
	parseSide : function(link) {
		$.getJSON('js/'+link+'.js', function(data) {
			var html = '<ul>';
			$.each(data.links, function(index, value) {
				if (value === "") {
						html += '<h4>'+index+'</h4>';
					} else {
					html += '<li><a target="_blank" href="'+value+'">'+index+'</a></li>';
				}
			});
			html += '</ul>';
			$("#addon").html( html );
			return false;
		});
	},
	setMasonry : function() {
		$('#container').masonry({ itemSelector : 'ul' });
		//console.log('set masonry');
	},
	setSide : function() {
	 	$('#side li a').click( function() {
	 		var link = $(this).text();
	 		WLS.parseSide(link);
			return false;
		});
		//console.log('set side');
	},		
	linksInNewWindow : function() {
		$('body a[href^="http://"]').attr('target','_blank');
		$('body a[href^="https://"]').attr('target','_blank');
		//console.log('links in new window');
	}
};
