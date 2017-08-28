// TODO
// 1. When dropped, save the new time to file
// 2. Destroy the origional block
// 3. Add new block at correct position

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
			$('<li></li>').addClass('item')
			.attr("itemid", i)
			.css({
				top: items[i].start + 10,
				height: items[i].duration,
				lineHeight: items[i].duration +'px'
			})
			.draggable({
				containment: 'parent',
				cursor: 'move',
				start: handleDragStart,
				stop: handleDragStop,
				revert: "invalid"
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
				start: handleDragStart,
				stop: handleDragStop,
				revert: "invalid"
			})
			.append(
				$('<p></p>').addClass('itemTitle').html(items[i].name)
			) 
		)
	}
}

// Setup the schedule timeline
$('#scheduleTimeline').append('<ul></ul>');
for (i = 0; i < 24; i++) {
	var time;
	if (i == 12) {time = "Noon"} else 
		if (i > 12) {time = i - 12 + ':00 pm'} else
			{time = i + ':00 am'}
	$('#scheduleTimeline ul').append('<li><span>'+time+'</span></li>')
}

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
	drop: handleDropEvent

})

function handleDragStart( event, ui ) {
  // $(ui.helper).width($(event.target).width());
}

function handleDragStop( event, ui ) {
  // var offsetXPos = parseInt( ui.offset.left );
  // var offsetYPos = parseInt( ui.offset.top );
  // alert( "Drag stopped!\n\nOffset: (" + offsetXPos + ", " + offsetYPos + ")\n");
}

function handleDropEvent( event, ui ) {
  var draggable = ui.draggable;
  alert( 'The square with ID "' + draggable.attr('itemid') + '" was dropped onto me!' );
}
