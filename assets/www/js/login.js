/*global $, jQuery, parser, browserTest, device*/

var login = {
    // application Constructor
    init: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, true);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'login.receivedEvent(...);'
    onDeviceReady: function() {

        //show the login overlay "logging in..." when ajax is happening on this page
        $(document).on('ajaxStart', function(){

                $('#loginOverlay').addClass('reveal');

            
        }).on('ajaxStop', function(){

                $('#loginOverlay').removeClass('reveal');
        });

        //When the page has loaded, fade it in
        $('#main').animate(
            {opacity: 1}, 
        500);

        //Then run the handler
        login.loginHandler();


    },

    loginHandler: function(){

        //Store the fields in vars and if there are locally stored usernames/passwords on the device, get them
        var username = $('#Benutzername'), 
            password = $('#Passwort'),
            savedUName = window.localStorage.getItem("validUsername"),
            savedUPass = window.localStorage.getItem("validPassword");

        //On pressing login... do the stuff
        $('#login').on('touchstart',function(){

            var thereIsInternet = login.checkNetwork(),
                usernameIsValid,
                passwordIsValid;


            if(thereIsInternet){

                usernameIsValid = login.checkInputField(username);
                passwordIsValid = false;

                //If there's a username in the box, check the password field
                if (usernameIsValid){
                        passwordIsValid = login.checkInputField(password);
                }
                //and then if there's a password in the box, try to login
                if(passwordIsValid){
                        login.tryToLogin(username, password);
                }
            }

        });

        //If there are local credentials that were valid, auto login
        if(savedUName && savedUPass){
            username.val(savedUName);
            password.val(savedUPass);
            $('#login').trigger('touchstart');
        }
        
    },

    tryToLogin: function(username, password){

        //Remove whitespace
        var logUser = $.trim(username.val()),
            logPass = $.trim(password.val());

        //Transition pages
        function initialPageSwitch(newPage){
            window.location = newPage;
        }


        //Login attempt takes data as an argument from the AJAX below
        function loginAttempt(data){

            //On login attempt. hide all previous errors.
            login.errorHide();

            var loginResponse = data.responseText;

            console.log(loginResponse);

            //This is where it gets messy. Look for keywords in the response to determine if the login was successful
            //HTTP codes seem lost on Llamaguy. It returns 200 whatever, really. Kinda sucks.
            if(loginResponse.contains("main.php")){
                window.localStorage.username = logUser;
                window.localStorage.password = logPass;

                $.get('https://endoftheinter.net/main.php', function(data){
                    console.log(data);
                    window.localStorage.initView = data;
                    // window.localStorage.initView = loginResponse;

                    window.localStorage.setItem("validUsername", logUser);
                    window.localStorage.setItem("validPassword", logPass);

                    $('#main').animate({opacity: 0}, 500);
                    initialPageSwitch('mainView.html');
                });


                                
            }
            else if(loginResponse.contains("verifyaccnt.php")){
                login.errorShow('Wrong password, brah');
            }
            else if(loginResponse.contains("Sie haben das Anmelden zu viele Male gefehlt")){
                login.errorShow('Too many attempts, brah. Wait 15 minutes');
            }
            else{
                login.errorShow('Connection error, brah');
            }
        }
        
        //When trying to login, post the details off to the LUE servers and get back a response
        $.ajax({
            type: "POST",
            url: "https://iphone.endoftheinter.net",
            data: ({username: logUser, password: logPass}),
            dataType: "text",
            async: "false",
            complete:function(data){
                loginAttempt(data);
            }
        }).responseText


    },

    //Should be self explanatory
    checkInputField: function(field){
        if (field.val().length === 0){
            login.errorShow("You need a " + field.attr('id') + ", brah");
            field.addClass('fieldErrorHighLight');

            return false;
        }
        else{
            field.removeClass('fieldErrorHighLight');
            return true;
        }
    },

    checkNetwork: function(){
        //This is a phonegap function
        var networkCheck = check_network();

        if(networkCheck === "No network connection"){
            login.errorShow("You gots no internet, brah");
            return false;
        }
        else {
            return true;
        }
    },

    //Show errors with text as an argument
    errorShow: function(errorText) {
        var errorArea = $('#main').find('#errorArea .label');
        errorArea.text(errorText).removeClass('visible').addClass('visible');
    },
    //Hide all errors
    errorHide: function() {
        var errorArea = $('#main').find('#errorArea .label');
        errorArea.removeClass('visible');
    }
};



String.prototype.contains = function(it) { 
    return this.indexOf(it) !== -1; 
};
