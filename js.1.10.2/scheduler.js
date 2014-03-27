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
function makeGroups(col) {
  var group_id = 0;
  var status = false;

  col.find('.appt').each(function() {

    var appt = $(this);
    appt.id = $(this).attr('id');
    appt.start = $(this).attr('data-start');
    appt.end = $(this).attr('data-end');


    if (appt.attr('data-group') == null) {

      appt.attr('data-group', group_id++);
    }


    // TODO Visually label the appts
    appt.text("[id=" + appt.id + "] [data-group= " + appt.attr(
      'data-group') + "]");

    // TODO Ask why this is needed
    appt.css({
      top: apptTop(appt.start) + 'px',
      height: apptHeight(appt.start, appt.end) + 'px'
    });

    col.find('.appt').each(function() { //for each appointment

      //  if it's not the appointment working with above
      if ($(this).attr('id') != appt.id) {

        // you can retrieve appt params like this, 
        var start = parseInt($(this).attr('data-start'));

        // or set them like:  $(this).attr('data-whatever', 'value');
        var end = parseInt($(this).attr('data-end'));
        var appt_start = parseInt(appt.start);
        var appt_end = parseInt(appt.end);

        // Find any overlap
        if (appt_start > end && appt_end < start || appt_end > start &&
          appt_start < end) {

          status = true;

          // this doesn't have a group? create one
          if ($(this).attr('data-group') == null) {

            $(this).attr('data-group', appt.attr('data-group'));

          };

        }

        console.log("resize" + appt.id + " = " + status);

        console.log(appt.id + " calling resizeGroup= " + ($(this).attr(
          'data-set') == null && status));
      }
    });
  });


  return group_id;
}

/**
 * @brief Resizes boxes in a group and changes th
 * @details [long description]
 * 
 * @param l [description]
 * @param d [description]
 * @param t [description]
 * @return [description]
 */
function resizeGroup(col, group_id, set_count) {

  // Incrementing value to offset appts
  var left_offset = 0;
  var box_size;
  var group_selector = '.appt[data-group=' + group_id + ']';

  // Size of boxes
  var box_size = 100 / set_count;

  // Resize all appts in this group
  col.find(group_selector).each(function() {
    
    $(this).css({
      left: (box_size * parseInt($(this).attr('data-set'))) + '%',
      width: box_size + '%'
    });

  });

}

/**
 * makeSets
 * 
 * @brief Makes set of non-overlapping appointments.
 * 
 * @param {Object} col is expected to be a jquery selector of a column.
 * @param {Number} group_id is expected to be the number of a group in the 
 * column.
 * 
 * @return {Number} number of sets found. 
 */
function makeSets(col, group_id) {

  // Used to number sets
  var set_id = 0;
  
  // search term for group
  var group_selector = '.appt[data-group=' + group_id + ']';

  // Find set in the group that don't overlap
  col.find(group_selector).each(function() {

    // Current appointment info 
    var appt = $(this);
    appt.id = $(this).attr('id');
    appt.start = $(this).attr('data-start');
    appt.end = $(this).attr('data-end');

    // Give this appt a set if it does not have one
    if (appt.attr('data-set') == null) {
      appt.attr('data-set', set_id++);
    }

    // Label appointments
    appt.text("[id=" + appt.id + "] [data-group= " + appt.attr(
      'data-group') + "] [data-set=" + appt.attr('data-set') + "]");

    
    col.find(group_selector).each(function() {

      //  if it's not the appointment working with above
      if ($(this).attr('id') != appt.id) {

        // Convert start and end times to integer values
        // for comparison
        var start = parseInt($(this).attr('data-start'));
        var end = parseInt($(this).attr('data-end'));
        var appt_start = parseInt(appt.start);
        var appt_end = parseInt(appt.end);

        // Find members that do not overlap
        if ((appt_start <= end || appt_end >= start) && (appt_end <= start ||
          appt_start >= end)) {


          // this doesn't have a group? create one
          if ($(this).attr('data-set') == null) {

            // Added to the set of the appt its being compared with.
            $(this).attr('data-set', appt.attr('data-set'));

          }

        } 
      }
    });

  });

  return set_id;
}

/**
 * stackCols
 *
 * @brief Cycles through columns resizing appointments to fit.
 *
 * @details This function groups appointments that overlap by calling
 *   makeGroups function, then those groups are cycled through. Sets of
 *   appointments in a group that don't overlap are made using the makeSets
 *   method which returns the number of sets in that group. Finally the group
 *   is resized according to the number of sets in each group.
 *
 * @return [none]
 */
function stackCols() {

  // Cycle through each column
  $('.appt_canvas').each(function() {
    var col = $(this);
    
    // number of groups in a column
    var group_count = makeGroups(col);

    if (group_count != 0) {

      // Cycle through all groups in this column making set 
      // and resizing them to fit
      for (var current_group = 0; current_group <= group_count; current_group++) {

        // Make set and get number of sets in this group
        var set_count = makeSets(col, current_group);

        // Now make them all fit
        resizeGroup(col, current_group, set_count);
      }

    }
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