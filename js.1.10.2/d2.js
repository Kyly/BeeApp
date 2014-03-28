function initD2(){
    var dialogShell = "<div id='d2'>\n\
                        <div id='d_tile'>\n\
                            <div id='d_min'>&minus;</div>\n\
                            <div id='d_text'></div>\n\
                            <div id='d_close'>&times;</div>\n\
                        </div>\n\
                        <div id='d_content'>\n\
                        </div>\n\
                        <div id='d_controls'>\n\
                        </div>\n\
                    </div>";
    $(dialogShell).appendTo('body');
    $('.dialog').draggable({
        handle: '#d_tile'
    });
    $(document).on('click', '#d_min', function(){
        $('#overlay').hide();
        $('#d_content').css('overflow', 'hidden').animate({'height':'0'}, 200);
    });
    $(document).on('click', '#d_close', function(){
        $('#overlay').hide();
        $('#d2').css('display', 'none');
    });
    $(document).on('click', '.dialog', function(){
        $('#ui-datepicker-div').css('z-index', '200');
    });
    $(document).on('#overlay', 'dblclick', function(){
        unDialog();
    });
}

function showDialog(content, title, size){
    if(size != false){
        setDialogSize(size);
    }
    $('#d_text').html(title);
    $('#d_content').html(content);
    var top = $(document).scrollTop() + 100 + 'px';
    $('#overlay').css('display', 'block');
    $('#d2').css({
        'display': 'block',
        'top' :top
    });
    $('.dialog .dialogDatepicker').datepicker().click(function(){
        $('#ui-datepicker-div').css({
            'z-index': '200'
        });
    });
}
function setDialogSize(width){
    width = parseInt(width);
//    var h1width = width-22;
    var left = Math.floor((width+12)/2)+'px';
    $('.dialog').css({
        'width': width+'px',
        'margin': '0 0 0 -'+left
    });//.children('h1').css('width', h1width+'px');
    
}
$(document).ready(function(){
    initD2();
});