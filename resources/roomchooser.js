/**
 * Created by gqadonis on 5/27/15.
 */
/**
 * Handling space chooser user input
 */

$(document).ready(function () {

    var chosen = []; // Array for visible space menu entries
    var arrPosition = ""; // Save the current position inside the chosen array

    /**
     * Open space chooser and load user spaces
     */
    $('#room-menu').click(function () {

        if (jQuery('#room-menu-rooms').hasClass('notLoaded')) {
            // load user spaces
            jQuery('#room-menu-rooms').removeClass('notLoaded');

            $.ajax({
                'url': scRoomsListUrl,
                'cache': false,
                'data': jQuery(this).parents("form").serialize(),
                'success': function (html) {


                    // show loaded room entries
                    jQuery("#loader_rooms").replaceWith(html)

                    // fill array with visible space entries
                    $("#room-menu-dropdown ul li").each(function (index) {
                        chosen.push(index);
                    });

                    // select the first space entry
                    $('#room-menu-dropdown li ul li:eq(' + chosen[0] + ')').addClass('selected');

                }});
        }
        // use setIntervall to setting the focus
        var spaceFocus = setInterval(setFocus, 10);

        function setFocus() {
            // set focus
            $('#room-menu-search').focus();
            // stop interval
            clearInterval(spaceFocus);
        }

    })

    /**
     * Show and navigate through spaces depends on user input
     */
    $('#room-menu-search').keyup(function (event) {

        if (event.keyCode == 40) {

            // set current array position
            if (arrPosition === "") {
                arrPosition = 1;
            } else if ((arrPosition) < chosen.length - 1) {
                arrPosition++;
            }

            // remove selection from last space entry
            $('#room-menu-dropdown li ul li').removeClass('selected');

            // add selection to the current space entry
            $('#room-menu-dropdown li ul li:eq(' + chosen[arrPosition] + ')').addClass('selected');

            return false;

        } else if (event.keyCode == 38) {

            // set current array position
            if (arrPosition === "") {
                arrPosition = 1;
            } else if ((arrPosition) > 0) {
                arrPosition--;
            }

            $('#room-menu-dropdown li ul li').removeClass('selected');

            // add selection to the current space entry
            $('#room-menu-dropdown li ul li:eq(' + chosen[arrPosition] + ')').addClass('selected');

            return false;

        } else if (event.keyCode == 13) {

            // check if one space is selected
            if ($('#room-menu-rooms li').hasClass("selected")) {

                // move to selected space, by hitting enter
                window.location.href = $('#room-menu-dropdown li ul li.selected a').attr('href');
            }

        } else {

            // lowercase and save entered string in variable
            var input = $(this).val().toLowerCase();

            if (input > 0) {
                // remove max-height property to hide the nicescroll scrollbar
                $('#room-menu-rooms').css({'max-height': 'none'});
            } else {
                // set max-height property to show the nicescroll scrollbar
                $('#room-menu-rooms').css({'max-height': '400px'});
            }

            // empty variable and array
            chosen = [];
            arrPosition = "";

            $("#room-menu-dropdown li ul li").each(function (index) {

                // remove selected classes from all space entries
                $('#room-menu-dropdown li ul li').removeClass('selected');


                // lowercase and save space strings in variable
                var str = $(this).text().toLowerCase();

                if (str.search(input) == -1) {
                    // hide elements when not matched
                    $(this).css('display', 'none');
                } else {
                    // show elements when matched
                    $(this).css('display', 'block');

                    // update array with the right li element
                    chosen.push(index);
                }

            });


            // add selection to the first space entry
            $('#room-menu-dropdown li ul li:eq(' + chosen[0] + ')').addClass('selected');

            // check if entered string is empty or not
            if (input.length == 0) {
                // reset inputs
                resetSpaceSearch();
            } else {
                // show search reset icon
                $('#room-search-reset').fadeIn('fast');
            }

            // remove hightlight
            $("#room-menu-dropdown li ul li").removeHighlight();

            // add new highlight matching strings
            $("#room-menu-dropdown li ul li").highlight(input);


        }

        //return event.returnValue;

    })

    /**
     * Disable enter key
     */
    $('#room-menu-search').keypress(function (event) {
        if (event.keyCode == 13) {
            // deactivate the standard press event
            event.preventDefault();
            return false;
        }
    });


    /**
     * Click handler to reset user input
     */
    $('#room-search-reset').click(function () {
        resetRoomSearch();
    })

    /**
     * Reset user input
     */
    function resetRoomSearch() {

        // fade out the cross icon
        $('#room-search-reset').fadeOut('fast');

        // empty input field
        $('#room-menu-search').val('');

        // set focus to input field
        $('#room-menu-search').focus();

        $("#room-menu-dropdown li ul li").each(function () {

            // show all space entries
            $(this).css('display', 'block');

            // remove search result highlighting
            $("#room-menu-dropdown li ul li").removeHighlight();

            // remove the curren tspace entry selection
            $('#room-menu-dropdown li ul li').removeClass('selected');

        });

        // set max-height property to show the nicescroll scrollbar
        $('#room-menu-rooms').css({'max-height': '400px'});
    }

});