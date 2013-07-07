/*global $, jQuery, parser, browserTest, device*/

//These are things which constantly change in the app
var boards, topics, posts, goingBack = false;

//ENTRY POINT
(function(){

    "use strict";

    var app = angular.module('eti', []);
    directives.init(app);
    routes.init(app);
    controllers.init(app);

    var mainView = {

        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function(){
            
            document.addEventListener('deviceready', mainView.onDeviceReady, false);
            
            //Browsertest is a variable in Mainview.html that lets you test the functionality in Google Chrome on a computer
            if(browserTest === true){
                mainView.onDeviceReady();
            }

        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicity call 'mainView.receivedEvent(...);'
        onDeviceReady: function(){

            //show the overlay "fetching" when ajax is happening on this page
            $(document).on('ajaxStart', function(){
                    $('#loadingOverlay').fadeIn('fast');
                
            }).on('ajaxStop', function(){
                setTimeout(function(){
                    $('#loadingOverlay').fadeOut('fast');
                }, 100)
                    
            });

            document.addEventListener("backbutton", onBackKey, false);

            function onBackKey(){
                goingBack = true;
                history.back();
            }
            
            // $('#username').text(window.localStorage["validUsername"]);
            $('#username').text("me");

            $('#main').animate(
                {opacity: 1}, 
            500);

            //In the public file
            titleFader();
            tapBehaviour();

        },

    }  

    //Initiate
    mainView.bindEvents();

}());