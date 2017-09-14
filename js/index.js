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
// console.log(dataConfig.get('scrollPercent'))
const dataUser = new Store({
	name: "user_data",
	defaults: {
	    items: [
	    	{name: 'Math HW', duration: 60, start: -1},
	    	{name: 'English HW', duration: 30, start: -1},
	    	{name: 'Chinese', duration: 30, start: 780}
	    ]
	}
});

var items = dataUser.get('items');
var itemsLength = items.length;


for (i = 0; i < itemsLength; i++) {
	insertItem(i);
}

function insertItem(i) {
	var item = $('<li></li>')
	.attr("itemid", i)
	.addClass('item')
	.css({
		height: items[i].duration,
		lineHeight: items[i].duration +'px'
	})
	.draggable({
		containment: 'document',
		cursor: 'move',
		helper: 'clone',
		start: handleDragStart,
		stop: handleDragStop,
		drag: handleDragDragging,
		snap: '.snapguide'
	})
	.append(
		$('<p></p>').addClass('itemTitle').html(items[i].name)
	);

	if (items[i].start > -1) {

		item
		.addClass('task')
		.css({
			top: items[i].start + 10,
			zIndex: items[i].start + 10
		})

		$('#scheduleList').append( item );
	} else {
		$('#itemsList').append( item );
	}
}

var guideGap = 10;

for (i=0; i<(24*60/guideGap); i++) {
	$('#scheduleGuide')
	.append($('<li class="snapguide"></li>')
		.css({
			top: i*guideGap
		}));
}

// TIMELINE
// $('#scheduleTimeline').append('<ul></ul>');
// for (i = 0; i < 24; i++) {
// 	var time;
// 	if (i == 12) {time = "Noon"} else 
// 		if (i > 12) {time = i - 12 + ':00 pm'} else
// 			{time = i + ':00 am'}
// 	$('#scheduleTimeline ul').append('<li><span>'+time+'</span></li>')
// }

// $('#scheduleList').height($('.column.schedule').prop('scrollHeight'));

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

function handleDragDragging ( event, ui ) {
	var draggable = $(event.target); 
	var i = draggable.attr('itemid');
	$(ui.helper).css({
		zIndex: $('.column.schedule').scrollTop() + ui.offset.top
	});
}

function handleDragStart( event, ui ) {
	var draggable = $(event.target); 
	var i = draggable.attr('itemid');
	draggable.css({
		opacity: '0.5'
	});
	lh = Math.min(30, items[i].duration);
	$(ui.helper)
	.width(draggable.width())
	// .css({
	// 	padding: '0px 10px',
	// 	height: items[i].duration,
	// 	lineHeight: lh+'px',
	// });
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
	var addMargin = 0;
	if (draggable.hasClass('task')) {
		addMargin = 10;
	}
	draggable
	.css({
		opacity: '1',
		padding: '0px 10px',
		top: items[i].start + addMargin,
		height: items[i].duration,
		lineHeight: items[i].duration +'px',
		zIndex: items[i].start + addMargin
	})
	.addClass('task');

	$(this)
	.append(draggable);
	
}

function scheduleOverEvent( event, ui ) {
	var draggable = ui.draggable; 
	var i = draggable.attr('itemid');
	var h = draggable.height();
	// $(ui.helper).detach().appendTo('#itemsList');
	// $(ui.helper)
}

function listDropEvent( event, ui ) {
	var draggable = ui.draggable;
	$('#itemsList').append(draggable);
	draggable
	.removeClass('task')
	.css({
		left: 0,
		top: 0
	});;
}

function listOverEvent( event, ui ) {
	var draggable = ui.draggable;
	// $(ui.helper).detach().appendTo('#itemsList');
	// console.log( 'The square with ID "' + draggable.attr('itemid') + '" is over me!' ) 
}

// DIALOGS

var dialog, form;
	// name = $( "#inputName" ),
	// length = $( "#inputLength" ),
 	// desciption = $( "#inputDescription" );
    // allFields = $( [] ).add( name ).add( length ).add( desciption );
    $( "#inputLength" ).val(30);

dialog = $('#dialogAddItem').dialog({
	autoOpen: false,
	modal: true,
	width: 300,
	height: 500,
	close: function() {
		$( "#inputName" ).val("").removeClass('dialogInputError');
		$( "#inputLength" ).val(30).removeClass('dialogInputError');
		$( "#inputDescription" ).val("").removeClass('dialogInputError');
		// form[ 0 ].reset();
		// allFields.removeClass( "ui-state-error" );
	}
})

function dialogClose() {
	dialog.dialog("close");
}

function toAddItem() {
	$('#dialogAddItem').dialog("open");
}

function toDeleteItem() {

}

function addItem() {

	var name = $( "#inputName" ).val();
	var length = $( "#inputLength" ).val();
	var description = $( "#inputDescription" ).val();

	if ((name != "") && !name.indexOf(' ')==0 ) {
		items.push({name: name, duration: length, start: -1});
		
		insertItem(items.length - 1);
		console.log(items);
		dialogClose();
	} else {
		$( "#inputName" ).addClass('dialogInputError');
	}
}















