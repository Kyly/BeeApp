$(document).ready(function() {
  //globals
  resizing = false;
  debug_finest = false;
  debug_finer = true;
  debug_fine = true;
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

// Find if there are any overlapping appts
function makeGroup(col) {

  var status;

  console.log("isOverlapping");

  col.find('.appt').each(function() {

    console.log("1");

    var appt = $(this);
    appt.id = $(this).attr('id');
    appt.start = $(this).attr('data-start');
    appt.end = $(this).attr('data-end');

    // TODO Ask why this is needed
    appt.css({
      top: apptTop(appt.start) + 'px',
      height: apptHeight(appt.start, appt.end) + 'px'
    });

    col.find('.appt').each(function() { //for each appointment

      console.log("2");

      //  if it's not the appointment working with above
      if ($(this).attr('id') != appt.id) {

        console.log("3");
        // you can retrieve appt params like this, 
        var start = parseInt($(this).attr('data-start'));

        // or set them like:  $(this).attr('data-whatever', 'value');
        var end = parseInt($(this).attr('data-end'));
        var appt_start = parseInt(appt.start);
        var appt_end = parseInt(appt.end);


        // Find any overlap
        if (appt_start > end && appt_end < start || appt_end > start &&
          appt_start < end) {

          console.log('4');
          status = true;
        } else
          status = false;
      }
    });
  });

return status;
}

function makeSet() {

}

function stackCols() {



  // This is the function that needs work
  $('.appt_canvas').each(function() { // run through each collumn
    var col = $(this);
    var group_id = 0;

    console.log(isOverlapping(col));

    // Counter to better understand iteration of the find function
    var iter0 = 0;

    // find each one of this collumns appointments
    $(this).find('.appt').each(function() {

      var iter1 = 0; // This is used in debug messages
      var appt = $(this);
      appt.id = $(this).attr('id');
      appt.start = $(this).attr('data-start');
      appt.end = $(this).attr('data-end');


      if (appt.attr('data-group') == null) {

        appt.attr('data-group', group_id++);
      }


      // TODO Visually label the appts
      appt.text("id: " + appt.id + ",  data-group: " + appt.attr(
        'data-group'));

      // @Debug
      if (debug_finest) {
        iter0++;
        console.log("appt data-group: " + appt.attr('data-group'));
        console.log(iter0 + ":Outer find is running on " + appt.id);
      };


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


        // @Debug
        if (debug_finest) {
          iter1++;
          console.log(iter0 + "." + iter1 + ":Inner find is running on " +
            $(this).attr('id'));
        }


        //  if it's not the appointment working with above
        if ($(this).attr('id') != appt.id) {

          // you can retrieve appt params like this, 
          var start = parseInt($(this).attr('data-start'));

          // or set them like:  $(this).attr('data-whatever', 'value');
          var end = parseInt($(this).attr('data-end'));
          var appt_start = parseInt(appt.start);
          var appt_end = parseInt(appt.end);


          if (debug_finer) {
            console.log($(this).attr('id') + " is being compared to " +
              appt.id);
          };

          // Find any overlap
          if (appt_start > end && appt_end < start || appt_end > start &&
            appt_start < end) {

            // @Debug f+
            if (debug_fine) {
              console.log(appt.attr('id') + " overlaps " + $(this).attr(
                'id') + "\n");
            }


            // this doesn't have a group? create one
            if ($(this).attr('data-group') == null) {

              $(this).attr('data-group', appt.attr('data-group'));

              // @Debug f+
              if (debug_fine) {
                console.log($(this).attr('id') + " is in the group " +
                  $(this).attr("data-group"));
              };

            }

          }

          // If no overlap was found found this is not in a group
          // next overlap will be in a new group
          else if ($(this).attr('data-group') == null) {

            // Incrementing value to offset appts
            var left_offset = 0;
            var group_length;
            var box_size;
            var group_selector = '.appt[data-group=' + appt.attr(
              'data-group') + ']';

            //Find sub groups. These will be item that do not overlap in
            // the group
            col.find(group_selector).each(function() {
              // Select on Item than check through all the item
              // and see if there is an item that does not overlap
              // then add another tag 'sub-group' and number the 
              // subgroups. 
            });

            group_length = $(group_selector).length;

            // Size of boxes
            var box_size = 100 / group_length;

            col.find(group_selector).each(function() {

              $(this).css({
                left: (box_size * left_offset++) + '%',
                width: box_size + '%'
              });

            });

            // @Debug
            if (debug_finer) {
              console.log($(this).attr('id') + " does not overlap " +
                appt.id);
              console.log("its group remains " + $(this).attr(
                'data-group'));
            }
          }

        }

        // @Debug
        if (debug_finest) {
          console.log("group_id: " + group_id);
        }

      });
    });
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

    //make sure this is a direct click
    if ($(e.originalEvent.target).hasClass('appt_canvas')) {
      var pos = Math.round($('.hour_mouse_tracker').css('top').replace('px',
        '')); // / 37) * 37;
      var apt = $('<div id="new_appt" class="appt"></div>').appendTo(this);
      resizing = true;
      apt.css('top', pos + 'px');
    }
  });
}

function mouseTracker() {
  // Tracks mouse position and highlights the hour
  $(document).on('mousemove', function(e) {
    var y = e.clientY + $('#viewport').scrollTop() - ($('#nav').height() +
      $(
        '#titles').height()) - 10;
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