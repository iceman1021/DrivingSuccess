$.support.cors = true;
$.mobile.allowCrossDomainPages = true;

var formurl = "http://www.myitmanager.co.za/dsCMS/mobile/submitions_api.php";
var placeSearch, autocomplete, devicePlatform, loginName, loginSurname, loginUID, loginRemember, loginEmail, files, deviceOSVersion;

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

function getAndroidVersion(ua) {
    var ua = ua || navigator.userAgent; 
    var match = ua.match(/Android\s([0-9\.]*)/i);
    return match ? match[1] : false;
};

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

function prepareUpload(event)
{
    files = event.target.files;
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

function loadRankings(uid,div) {
    $.ajax({
        type       : "POST",
        url        : formurl,
        crossDomain: true,
        beforeSend : function() {$.mobile.loading('show')},
        complete   : function() {$.mobile.loading('hide')},
        data       : "tipe=getRankings&uid="+uid+"&div="+div,
        dataType   : 'json',
        success    : function(response) {
            var rankings = response["rankings"];
            
            $('#rankingsOutput').empty();
            $('#rankingsOutput').append(rankings); 
        },
        error      : function() {
            console.error("error");
            alert('Unable to connect to server, please try again...');                  
        }
    });
}

function loadNews(div) {
    $('#newsOutput').empty();
    
    $.ajax({
        type       : "POST",
        url        : formurl,
        crossDomain: true,
        beforeSend : function() {$.mobile.loading('show')},
        complete   : function() {$.mobile.loading('hide')},
        data       : "tipe=getNews&div="+div,
        dataType   : 'json',
        success    : function(response) {
            var newsOut = response["news"];
            $('#newsOutput').append(newsOut); 
            $("#newsOutput").collapsibleset().trigger('create');
        },
        error      : function() {
            console.error("error");
            alert('Unable to connect to server, please try again...');                  
        }
    });
}

function ChangeToProfile(url){
    $.mobile.changePage(url, {dataUrl: url, transition: "slide"});
}

function loadProfile(id) {
    $.ajax({
        type       : "POST",
        url        : formurl,
        crossDomain: true,
        beforeSend : function() {$.mobile.loading('show')},
        complete   : function() {$.mobile.loading('hide')},
        data       : "tipe=getProfile&uid="+id,
        dataType   : 'json',
        success    : function(response) {
            var profile = response["profile"];
            var previous = response["previous"];
            var next = response["next"];
            
            $('#profileOutput').empty();
            $('#profileOutput').append(profile); 
            $('#pre-but').attr("href", previous);
            $('#next-but').attr("href", next);
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

$(document).on("pageshow", "#jag-ranking", function(){     
    loadRankings(localStorage.getItem('log_uid'), 1);
});

$(document).on("pageshow", "#land-ranking", function(){ 
    loadRankings(localStorage.getItem('log_uid'), 2);
});

$(document).on("pageshow", "#profile", function(){ 
    
    if (!$(this).data("url"))
    {
        var query = window.location.search;
        query = query.replace("?proId=","");
    }
    else 
    {
        var query = $(this).data("url").split("?")[1];
        query = query.replace("proId=","");
    }
    
    loadProfile(query);
});

$(document).on("pageshow", "#whatsnew", function(){ 
    loadNews(1);    
    $( "#newsCollaps" ).collapsible({
        expand: function() {
            $("#newsTitle").css({
                "color": "#d32627",
                "font-size": "14px"
            });
        }
    });
});

$(document).on("pageshow", "#campaigns", function(){ 
    loadNews(2);
    $( "#newsCollaps" ).on( "collapsibleexpand", function( event, ui ) {
        $("#newsTitle").css({
                "color": "#d32627",
                "font-size": "14px"
            });
    } );
});

$(document).on("pageshow", "#article", function() {
    
    if (!$(this).data("url"))
    {
        var query = window.location.search;
        query = query.replace("?cid=","");
    }
    else 
    {
        var query = $(this).data("url").split("?")[1];
        query = query.replace("cid=","");
    }
    
    $('#articleOutput').empty();
    
    $.ajax({
        type       : "POST",
        url        : formurl,
        crossDomain: true,
        beforeSend : function() {$.mobile.loading('show')},
        complete   : function() {$.mobile.loading('hide')},
        data       : "tipe=displayNews&cid="+query,
        dataType   : 'json',
        success    : function(response) {
            var articleOut = response["article"];
            var previous = response["previous"];
            var next = response["next"];
            var campBut = response["campBut"];
            var newsBut = response["newsBut"];
            
            $('#articleOutput').append(articleOut); 
            $('#pre-but').attr("href", previous);
            $('#next-but').attr("href", next);
            $('#jag-but').attr("id", campBut);
            $('#land-but').attr("id", newsBut);
        },
        error      : function() {
            console.error("error");
            alert('Unable to connect to server, please try again...');                  
        }
    }); 
});

$(document).on("pageshow", "#logout", function(){
    localStorage.clear();
    
    $('#loginbut').click(function() {
        console.log($('#loginForm').serialize());
        loading = true;
        $.ajax({
            type       : "POST",
            url        : formurl,
            crossDomain: true,
            beforeSend : function() {$.mobile.loading('show')},
            complete   : function() {$.mobile.loading('hide')},
            data       : "tipe=login&"+$('#loginForm').serialize(),
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
        event.preventDefault();
    });
});

$(document).on("pageshow", "#login", function(){ 
    $('#loginbut').click(function() {
        console.log($('#loginForm').serialize());
        loading = true;
        $.ajax({
            type       : "POST",
            url        : formurl,
            crossDomain: true,
            beforeSend : function() {$.mobile.loading('show')},
            complete   : function() {$.mobile.loading('hide')},
            data       : "tipe=login&"+$('#loginForm').serialize(),
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
        event.preventDefault();
    });
});

$(document).on("pageshow", "#forgot", function(){ 
    
    $('#forgotbut').click(function()
    {
        loading = true;
        $.ajax({
            type       : "POST",
            url        : formurl,
            crossDomain: true,
            beforeSend : function() {$.mobile.loading('show')},
            complete   : function() {$.mobile.loading('hide')},
            data       : "tipe=forgot&"+$('#forgotForm').serialize(),
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
        event.preventDefault();
    });
});

$(document).on("pageshow", "#signup", function(){ 
    
    deviceOSVersion = getAndroidVersion();
    
    if (deviceOSVersion === '4.4.2') {
        $('#getPicture').hide();
    }
    
    $('input[type=file]').on('change', prepareUpload);
    
    $('#signupbut').click(function()
    {
        loading = true;
        
        event.preventDefault();
        var formData = new FormData();
        if (typeof files === 'object') {
            $.each(files, function(key, value)
            {
                formData.append(key, value);
            });
        }
        formData.append('user_name', $('#user_name').val());
        formData.append('user_surname', $('#user_surname').val());
        formData.append('user_email', $('#user_email').val());
        formData.append('user_reemail', $('#user_reemail').val());
        formData.append('user_password', $('#user_password').val());
        formData.append('user_repassword', $('#user_repassword').val());
        formData.append('user_number', $('#user_number').val());
        formData.append('user_country', $('#user_country').val());
        formData.append('user_division', $('#user_division').val());
        formData.append('tipe', 'signup');
        
        $.ajax({
            type: "POST",
            url        : formurl,
            crossDomain: true,
            beforeSend : function() {$.mobile.loading('show')},
            complete   : function() {$.mobile.loading('hide')},
            dataType: 'json',
            processData: false,
            contentType: false,
            data: formData,
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
            error      : function(xhr, textStatus, error){
                console.log(xhr.statusText);
                console.log(textStatus);
                console.log(error);
                alert('Unable to connect to server, please try again...');                  
            }
        });
    });
});