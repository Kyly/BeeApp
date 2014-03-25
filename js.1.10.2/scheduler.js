$(document).ready(function() {
  //globals
  resizing = false;
  hourHeight = $('.hour').outerHeight();
  //initialize 
  viewport();
  appts();
  toolbar();
  mouseTracker();
  newAppts();
  newApptForm();
  stackCols();
});

function stackCols() {


  var group_id = 0;

  // This is the function that needs work
  $('.appt_canvas').each(function() { // run through each collumn
    var col = $(this);

    // find each one of this collumns appointments
    $(this).find('.appt').each(function() {

      var appt = $(this);
      appt.id = $(this).attr('id');
      appt.start = $(this).attr('data-start');
      appt.end = $(this).attr('data-end');

      // Default group is zero TODO <--This may not be needed
      appt.attr({
        'data-group': group_id
      });

      // TODO Visually label the appts
      appt.text(appt.id + " group " + appt.attr('data-group'));

      // if your browser doesn't have a console, install firebug
      appt.css({
        top: apptTop(appt.start) + 'px',
        height: apptHeight(appt.start, appt.end) + 'px'
      });

      // All good up to this point. The height of the appointment and the 
      // appointments distance to the top are easy to figure out. What we 
      // need to do is compare the appointment to every other appointment
      // in the same col
      col.find('.appt').each(function() { //for each appointment

        //  if it's not the appointment working with above
        if ($(this).attr('id') != appt.id) {


          // basically feel free to re-write anything inside of 
          // this col.find function here's where I'm going nuts

          // you can retrieve appt params like this, 
          var start = $(this).attr('data-start');

          // or set them like:  $(this).attr('data-whatever', 'value');
          var end = $(this).attr('data-end');

          if (start <= appt.start && end > appt.end) { //these overlap

            console.log($(this).attr('id') + " overlaps " + appt.attr('id'));

            // this doesn't have a group? create one
            if ($(this).attr('data-group') == null) {

              $(this).attr({

                // this is how you mark them in groups. 
                // This part isn't fleshed out
                'data-group': group_id

              });

              $(this).append(" group " + $(this).attr('data-group'));

              console.log($(this).id + " is in the group " + $(this).attr("data-group"));
            }

            //When you decide what the appointments width and distance from the left should be, assign like this:
            // appt.css({
            //   left: 0,
            //   width: '100%'
            // });
            // // or something like
            // appt.css({
            //   left: '33%',
            //   width: '33%'
            // });

          }
          
        }
      });
    });
    group_id++;
  });
}

function apptTop(start) {
  // separate hours & minutes
  var hours = Math.floor(start / 100);
  var minutes = start - (hours * 100);

  //TODO: minutes height
  return hours * hourHeight;
}

function apptHeight(start, end) {
  return apptTop(end - start);
}

function appts() {
  $(document).on('mouseover', '.appt', function() {
    if (!$(this).hasClass('draggable')) {
      $(this).draggable().addClass('draggable');
    }
  });
  $('.appt_canvas').droppable({
    drop: function(event, ui) {
      $(ui.draggable[0]).css('left', '').appendTo(this);
    }
  });
}

function newAppts() {
  //  Creates a new appointment div when you click and drag in a collumn 
  $(document).on('mousedown', '.appt_canvas', function(e) {
    if ($(e.originalEvent.target).hasClass('appt_canvas')) { //make sure this is a direct click
      var pos = Math.round($('.hour_mouse_tracker').css('top').replace('px', '')); // / 37) * 37;
      var apt = $('<div id="new_appt" class="appt"></div>').appendTo(this);
      resizing = true;
      apt.css('top', pos + 'px');
    }
  });
}

function mouseTracker() {
  // Tracks mouse position and highlights the hour
  $(document).on('mousemove', function(e) {
    var y = e.clientY + $('#viewport').scrollTop() - ($('#nav').height() + $('#titles').height()) - 10;
    $('.hour_mouse_tracker').css('top', y + 'px');
    if (resizing) { //resize new appointments
      var t = $('#new_appt').css('top');
      t = t.replace('px', '');
      $('#new_appt').css('height', (y - t) + 'px');
    }
  });

  $(document).on('mouseup', '.appt_canvas', function(e) {
    if (resizing == true) {
      resizing = false;
      $('#new_appt').removeAttr('id');
      showDialog($('#add_appt').html(), 'New Appointment', 570);
    }
  });
}

function viewport() {
  $(window).on('resize', function() {
    var height = $(window).height();
    height = height - $('#nav').height();
    height = height - $('#sch_titles').height();
    height = height - $('#controls').height();
    $('#viewport').css('height', height + 'px');
  });
  setTimeout("scrollViewport()", 200);
}

function scrollViewport() {
  $(window).trigger('resize');
  $('#viewport').scrollTop('266');
}

function toolbar() {
  $('.datepicker').datepicker({
    dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'The', 'Fri', 'Sat']
  });
  $(document).on('click', '#calendar', function() {
    $('#datepicker').toggle();
  });
}

function newApptForm() {
  $(document).on('click', '.misc_appt', function() {
    $('.appt_type_btns').hide();
    $('.misc_appt_form').show();
  });
  $(document).on('click', '.service_stop', function() {
    $('.appt_type_btns').hide();
    $('.service_appt_form').show();
  });
}