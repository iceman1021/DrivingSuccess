$.support.cors = true;
$.mobile.allowCrossDomainPages = true;

var formurl = "http://www.myitmanager.co.za/dsCMS/mobile/submitions_api.php";
var placeSearch, autocomplete, devicePlatform, loginName, loginSurname, loginUID, loginRemember, loginEmail;

document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
    //navigator.splashscreen.show();
    
    window.plugins.socialsharing.available(function(isAvailable) {
        if (isAvailable) {}
    });
    
    devicePlatform = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
}

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

$(document).on("pageshow", "#dashboard", function(){ 
    
    var DocH = $( window ).outerHeight( true );
    var headerH = $( "#header" ).outerHeight( true );
    var titelH = $( "#content-title" ).outerHeight( true );
    var footerH = $( "#footer" ).outerHeight( true );
    
    var contentH = DocH - headerH - titelH - footerH - 60;
    $("#content-body-main").height(contentH);
    
    loginName = localStorage.getItem('log_name');
    loginSurname = localStorage.getItem('log_surname');
    loginUID = localStorage.getItem('log_uid');
    $('#userName').empty();
    $('#userName').append(loginName);
    $('#logSurname').empty();
    $('#logSurname').append(loginSurname);
});

$(document).on("pageshow", "#login", function(){ 
    
    var DocH = $( window ).outerHeight( true );
    var headerH = $( "#header" ).outerHeight( true );
    var titelH = $( "#content-title" ).outerHeight( true );
    var footerH = $( "#footer" ).outerHeight( true );
    
    var contentH = DocH - headerH - titelH - footerH - 60;
    $("#content-body-main").height(contentH);
    
    $('#loginForm').submit(function(e)
    {
        console.log($(this).serialize());
        loading = true;
        $.ajax({
            type       : "POST",
            url        : formurl,
            crossDomain: true,
            beforeSend : function() {$.mobile.loading('show')},
            complete   : function() {$.mobile.loading('hide')},
            data       : "tipe=login&"+$(this).serialize(),
            dataType   : 'json',
            success    : function(response) {
                
                var resultHtml = response["html"];
                var resultError = response["error"];
                loginName = response['name'];
                loginSurname = response['surname'];
                loginUID = response['user_id'];
                loginRemember = response['remember'];
                loginEmail = response['email'];
                
                if (resultError == '1') {
                    $('#loginError').empty();
                    $('#loginError').append(resultHtml);  
                    $('#loginError').popup("open", {transition: "slidedown"});
                } else {
                    localStorage.log_name = loginName;
                    localStorage.log_surname = loginSurname;
                    localStorage.log_uid = loginUID;
                    localStorage.log_remeber = loginRemember;
                    localStorage.log_email = loginEmail;

                    $.mobile.changePage("dashboard.html#dashboard");
                }
            },
            error      : function() {
                console.error("error");
                alert('Unable to connect to server, please try again...');                  
            }
        });
        e.preventDefault();
    });
});

$(document).on("pageshow", "#forgot", function(){ 
    
    var DocH = $( window ).outerHeight( true );
    var headerH = $( "#header" ).outerHeight( true );
    var titelH = $( "#content-title" ).outerHeight( true );
    var footerH = $( "#footer" ).outerHeight( true );
    
    var contentH = DocH - headerH - titelH - footerH - 60;
    $("#content-body-main").height(contentH);
    
    $('#forgotForm').submit(function(e)
    {
        console.log($(this).serialize());
        loading = true;
        $.ajax({
            type       : "POST",
            url        : formurl,
            crossDomain: true,
            beforeSend : function() {$.mobile.loading('show')},
            complete   : function() {$.mobile.loading('hide')},
            data       : "tipe=forgot&"+$(this).serialize(),
            dataType   : 'json',
            success    : function(response) {
                
                var resultHtml = response["html"];
                var resultError = response["error"];
                
                if (resultError == '1') {
                    $('#forgotError').empty();
                    $('#forgotError').append(resultHtml);  
                    $('#forgotError').popup("open", {transition: "slidedown"});
                } else {
                    $('#forgotForm').empty();
                    $('#forgotSuccess').append(resultHtml);
                }
            },
            error      : function() {
                //console.error("error");
                alert('Unable to connect to server, please try again...');                  
            }
        });
        e.preventDefault();
    });
});

$(document).on("pageshow", "#signup", function(){ 
    
    var DocH = $( window ).outerHeight( true );
    var headerH = $( "#header" ).outerHeight( true );
    var titelH = $( "#content-title" ).outerHeight( true );
    var footerH = $( "#footer" ).outerHeight( true );
    
    var contentH = DocH - headerH - titelH - footerH - 60;
    $("#content-body-main").height(contentH);
    
    $('#signupForm').submit(function(e)
    {
        console.log($(this).serialize());
        loading = true;
        
        $.ajax({
            type       : "POST",
            url        : formurl,
            crossDomain: true,
            beforeSend : function() {$.mobile.loading('show')},
            complete   : function() {$.mobile.loading('hide')},
            data       : "tipe=signup&"+$(this).serialize(),
            dataType   : 'json',
            success    : function(response) {
                
                var resultHtml = response["html"];
                var resultError = response["error"];
                
                if (resultError == '1') {
                    $('#signupError').empty();
                    $('#signupError').append(resultHtml);  
                    $('#signupError').popup("open", {transition: "slidedown"});
                } else {
                    $('#signupForm').empty();
                    $('#signupSuccess').append(resultHtml);
                }
            },
            error      : function() {
                console.error("error");
                alert('Unable to connect to server, please try again...');                  
            }
        });
        e.preventDefault();
    });
});