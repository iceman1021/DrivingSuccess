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

//--External URL--//
function loadURL(url){ 
    if (devicePlatform == 'Android') {
        navigator.app.loadUrl(url, { openExternal:true }); 
    }
    else
    {
        window.open(url, '_system', 'location=no');
        return false;
    }
}

// Load user points and gauge //
function loadPoints(uid) {
    $.ajax({
        type       : "POST",
        url        : formurl,
        crossDomain: true,
        beforeSend : function() {$.mobile.loading('show')},
        complete   : function() {$.mobile.loading('hide')},
        data       : "tipe=getPoints&uid="+uid,
        dataType   : 'json',
        success    : function(response) {
            var gaugeImage = response["gaugeImage"];
            var pointsPre = response["pointsPre"];
            var pointsNow = response["pointsNow"];
            
            $('#gaugeImage').empty();
            $('#gaugeImage').append(gaugeImage); 
            $('#pointsPre').empty();
            $('#pointsPre').append(pointsPre);
            $('#pointsNow').empty();
            $('#pointsNow').append(pointsNow);
        },
        error      : function() {
            console.error("error");
            alert('Unable to connect to server, please try again...');                  
        }
    });
}

function loadRankings(uid) {
    $.ajax({
        type       : "POST",
        url        : formurl,
        crossDomain: true,
        beforeSend : function() {$.mobile.loading('show')},
        complete   : function() {$.mobile.loading('hide')},
        data       : "tipe=getRankings&uid="+uid,
        dataType   : 'json',
        success    : function(response) {
            var rankings = response["rankings"];
            
            $('#rankingsOutput').empty();
            $('#rankingsOutput').append(rankings); 
            $('#rankingsOutput').listview('refresh');
        },
        error      : function() {
            console.error("error");
            alert('Unable to connect to server, please try again...');                  
        }
    });
}

function loadNews() {
    $('#newsOutput').empty();
    
    $.ajax({
        type       : "POST",
        url        : formurl,
        crossDomain: true,
        beforeSend : function() {$.mobile.loading('show')},
        complete   : function() {$.mobile.loading('hide')},
        data       : "tipe=getNews",
        dataType   : 'json',
        success    : function(response) {
            for (var i in response) {
                var newsOut = '<div data-role="collapsible" data-enhanced="true" class="ui-collapsible ui-collapsible-themed-content ui-collapsible-collapsed ui-first-child ui-last-child">'
                                +'<div class="ui-collapsible-heading ui-collapsible-heading-collapsed">'
                                    +'<a href="#" class="ui-collapsible-heading-toggle ui-btn ui-btn-a" style="background-color: transparent; border:none">'
                                        +'<div class="ui-grid-a">'
                                            +'<div class="ui-block-a" style="width:25%"><div style="height:60px; height:60px: overflow:hidden;"><img src="http://myitmanager.co.za/dsCMS/images/campaigns/'+response[i]['campaign_img']+'" style="height: 100%"></div></div>'
                                            +'<div class="ui-block-b" style="width:75%"><div style="height:60px; line-height: 60px; text-transform: uppercase;">'+response[i]['campaign_name']+' - '+response[i]['campaign_date']+'</div></div>'
                                        +'</div>'
                                        +'<span class="ui-collapsible-heading-status"> click to expand contents</span>'
                                    +'</a>'
                                +'</div>'
                                +'<div class="ui-collapsible-content ui-body-inherit ui-collapsible-content-collapsed" aria-hidden="true" style="background-color: transparent; border-color: #D32424">'
                                    +'<p style="color:D32424">'+response[i]['campaign_content']+'</p>'
                                +'</div>'
                            +'</div>';
                $('#newsOutput').append(newsOut); 
            }
            $("#newsOutput").collapsibleset().trigger('create');
        },
        error      : function() {
            console.error("error");
            alert('Unable to connect to server, please try again...');                  
        }
    });
}

$(document).on("pageshow", "#dashboard", function(){ 
    loginName = localStorage.getItem('log_name');
    loginSurname = localStorage.getItem('log_surname');
    loginUID = localStorage.getItem('log_uid');
    $('#userName').empty();
    $('#userName').append(loginName);
    $('#logSurname').empty();
    $('#logSurname').append(loginSurname);
});

$(document).on("pageshow", "#rewards", function(){ 
    loadPoints(localStorage.getItem('log_uid'));
});

$(document).on("pageshow", "#ranking", function(){ 
    loadRankings(localStorage.getItem('log_uid'));
});

$(document).on("pageshow", "#whatsnew", function(){ 
    loadNews();
});

$(document).on("pageshow", "#logout", function(){
    localStorage.log_name = '';
    localStorage.log_surname = '';
    localStorage.log_uid = '';
    localStorage.log_remeber = '';
    localStorage.log_email = '';
    
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

$(document).on("pageshow", "#login", function(){ 
    
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