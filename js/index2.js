const Store = require('electron-store');
const dataConfig = new Store({
	defaults: {
		scrollPercent: 0
	}
});
const dataUser = new Store({
	name: "user_data",
	defaults: {
	    items: [
	    	{name: 'Math HW', duration: 10, start: -1},
	    	{name: 'English HW', duration: 10, start: -1},
	    	{name: 'Chinese', duration: 30, start: 780}
	    ]
	}
});

// SET CONSTANTS
var timelineOffsetTop = 10

// LOAD DATA
var items = dataUser.get('items');
var itemsLength = items.length;

// SCROLLING
	// Save and Load the scroll height
	var timelineScrollHeight = 
		$('.column-l').prop('scrollHeight') - $(document).height();
	// Setup the schedule scroll percentage
	$('.column-l').scrollTop(dataConfig.get('scrollPercent') * timelineScrollHeight);
	// Setup the schedule scrolling so that the scroll bar hides.
	$('.column-l').addClass('hide-scrollbar');
	$('.column-l').scroll(function() {
		$(this).removeClass('hide-scrollbar');
		clearTimeout($.data(this, 'scrollTimer'));
		$.data(this, 'scrollTimer', setTimeout(function (){
			// after 250ms of not scrolling;
			$('.column-l').addClass('hide-scrollbar');
			dataConfig.set('scrollPercent', 
				$('.column-l').scrollTop() / timelineScrollHeight);
		}, 500));
	});

// INITIALISE
// BACKGROUND
	// Generate Droppables
		
// FOREGROUND
	// Generate Draggables
		for (i = 0; i < itemsLength; i++) {
			var item = 
			$('<li></li>').addClass('item')
			.attr("itemid", i)
			.css({
				top: items[i].start + 10,
				height: items[i].duration,
				lineHeight: items[i].duration +'px'
			})
			.draggable({
				containment: 'document',
				cursor: 'move',
				grid: [1, 5],
				helper: 'clone',
				start: handleDragStart,
				stop: handleDragStop
			})
			.append(
				$('<p></p>').addClass('itemTitle').html(items[i].name)
			)
			if (items[i].start > -1) {
				$('#scheduleList').append(item);
				updateItemPos(item);	
			}

		}

// FUNCTIONS
	function updateItemPos(item) {
		var id = item.attr('itemid');
		console.log(id);
		// item.css({
		// 	top: items[id].start + timelineOffsetTop;
		// });
	}


// DRAG EVENTS
	function handleDragStart( event, ui ) {
		var draggable = $(event.target); 
		var i = draggable.attr('itemid');
		draggable.css({
			opacity: '0.5'
		});
		lh = Math.min(30, items[i].duration);
		$(ui.helper)
		.width(draggable.width())
		.css({
			padding: '0px 10px',
			height: items[i].duration,
			lineHeight: lh+'px'
		});
	}

	function handleDragStop( event, ui ) {
		var draggable = $(event.target); 
		draggable.css({
			opacity: '1'
		});
	}

// DROP EVENTS
	function scheduleDropEvent( event, ui ) {
		var draggable = ui.draggable;
		var i = draggable.attr('itemid');
		items[i].start = $('.column.schedule').scrollTop() + ui.offset.top - 10;
		draggable
		.css({
			opacity: '1',
			padding: '0px 10px',
			top: items[i].start + 10,
			height: items[i].duration,
			lineHeight: items[i].duration +'px'
		})
		.addClass('task');

		

		console.log(items[i].start);

		$(this)
		.append(draggable);
	}

	function listDropEvent( event, ui ) {
		var draggable = ui.draggable;
		$('#itemsList').append(draggable);
		draggable
		.css({
			height: '50px',
			padding: '10px 10px',
			lineHeight: '10px'
		})
		.removeClass('task')
		.animate({
			left: 0,
			top: 0
		});;
	}

// HOVER EVENTS	
	function scheduleOverEvent( event, ui ) {
		var draggable = ui.draggable; 
		var i = draggable.attr('itemid');
		var h = draggable.height();

		draggable.draggable( "option", "grid", [ 1, 5 ] );
		// $(ui.helper)
	}

	function listOverEvent( event, ui ) {
		var draggable = ui.draggable;
		console.log( 'The square with ID "' + draggable.attr('itemid') + '" is over me!' ) 
	}	