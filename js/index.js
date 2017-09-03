// TODO
// 1. Add over event
// 1. When dropped
// 		1. move the element to new parent
// 		2. save the new time to file
// 2. Destroy the origional block
// 3. Add new block at correct position
// Minor: Make the TASKS title editable

const Store = require('electron-store');
const dataConfig = new Store({
	defaults: {
		scrollPercent: 0
	}
});
console.log(dataConfig.get('scrollPercent'))
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

var items = dataUser.get('items');
var itemsLength = items.length;


for (i = 0; i < itemsLength; i++) {
	if (items[i].start > -1) {
		$('#scheduleList').append(
			$('<li></li>').addClass('item task')
			.attr("itemid", i)
			.css({
				top: items[i].start + 10,
				height: items[i].duration,
				lineHeight: items[i].duration +'px'
			})
			.draggable({
				containment: 'document',
				cursor: 'move',
				helper: 'clone',
				start: handleDragStart,
				stop: handleDragStop
			})
			.append(
				$('<p></p>').addClass('itemTitle').html(items[i].name)
			)
		)
	} else {
		$('#itemsList').append(
			$("<li></li>").addClass('item')
			.attr("itemid", i)
			.draggable({
				containment: 'document',
				cursor: 'move',
				helper: 'clone',
				start: handleDragStart,
				stop: handleDragStop
			})
			.append(
				$('<p></p>').addClass('itemTitle').html(items[i].name)
			) 
		)
	}
}

// TIMELINE

$('#scheduleList').height($('.column.schedule').prop('scrollHeight'));

// SCROLLING
var timelineScrollHeight = 
	$('.column.schedule').prop('scrollHeight') - $(document).height();
// Setup the schedule scroll percentage
$('.column.schedule').scrollTop(dataConfig.get('scrollPercent') * timelineScrollHeight);
// Setup the schedule scrolling so that the scroll bar hides.
$('.column.schedule').addClass('hide-scrollbar');
$('.column.schedule').scroll(function() {
	$(this).removeClass('hide-scrollbar');
	clearTimeout($.data(this, 'scrollTimer'));
	$.data(this, 'scrollTimer', setTimeout(function (){
		// after 250ms of not scrolling;
		$('.column.schedule').addClass('hide-scrollbar');
		dataConfig.set('scrollPercent', 
			$('.column.schedule').scrollTop() / timelineScrollHeight);
	}, 500));
});


$('#scheduleList').droppable({
	accept: '.item',
	drop: scheduleDropEvent,
	over: scheduleOverEvent
})

$('.column.tasks').droppable({
	accept: '.task',
	drop: listDropEvent,
	over: listOverEvent
})

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

function scheduleOverEvent( event, ui ) {
	var draggable = ui.draggable; 
	var i = draggable.attr('itemid');
	var h = draggable.height();
	// $(ui.helper)
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

function listOverEvent( event, ui ) {
	var draggable = ui.draggable;
	console.log( 'The square with ID "' + draggable.attr('itemid') + '" is over me!' ) 
}














