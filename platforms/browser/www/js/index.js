/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var localStorage = window.localStorage;
 var form_title, form_content, form_media;
 var clicked = false;
 var positionContent, lat, long;
 //var splitPos = []; //to save latitude and longitude
 var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        //document.getElementById("videoCapture").addEventListener("click", videoCapture);
        //document.getElementById("cameraGetPicture").addEventListener("click", cameraGetPicture);
        //document.getElementById("getPosition").addEventListener("click", getPosition);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


/************************
*          MENU         *
************************/
// Initialize collapse button
$(".button-collapse").sideNav();

var hidden = false;
function hideMenu() {
    $('#menu').animate({ height: '0px' }, 250, function() {
        $(this).slideUp();
    });
}

function showMenu() {
    $('#menu').animate({ height: '64px' }, 150, function() {
        $(this).slideDown();
    });
}

function toggleMenu() {
    if (hidden == false) {
        hideMenu();
        hidden = true;
    } 
    else {
        showMenu();
        hidden = false;
    }
}

$("#swap_navbar").click(function(event) {
    event.preventDefault();
    $("#sidenav-overlay").fadeTo(100, 0);
})




/************************
*          FORM         *
************************/
$('#content').trigger('autoresize');



/************************
*        ARTICLES       *
************************/

//For maps, add latitude & longitude attributes
class Article {
    constructor(id, title, date, content, media, position, latitude, longitude) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.content = content;
        this.media = media;
        this.position = position;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    static fromJSON(string){
        return this.fromObject(JSON.parse(string));
    }

    static fromObject(object) {
        return new Article (
            object.id,
            object.title,
            object.date,
            object.content,
            object.media,
            object.position,
            object.latitude,
            object.longitude
            )
    }

    toHTML(){
        var picture = "<br>";
        var map = "<div id='map" + this.id + "' style='width:100%; height:175px; background-color: grey;'></div>"
        var geolocation = "<div class='geolocation'>" + "<span class='positionData'>" + this.position + "</span>" + map
        + "</div>";

        if(this.position === undefined){
            this.position = "";
            map = "</div>";
            geolocation = "";
        }

        if (this.media !== undefined) {
            picture = "<img src='" + this.media + "'>";
            return "<div class='col s12'>"
            + "<div class='card'>"
            + "<div class='card-image'>"
            + picture
            + "<span class='card-title'>" + this.title + "</span>"
            + "</div>"
            + "<div class='card-content'>"
            + "<span>" + this.date + "</span>"
            + "<div class='article_content'><p>" + this.content + "</p></div>"
            + geolocation
            + "</div>";
        }

        else {
            return "<div class='col s12'>"
            + "<div class='card'>"
            + "<div class='card-content'>"
            + "<span class='card-title'>" + this.title + "</span>"
            + "<span>" + this.date + "</span>"            
            + "<div class='card-action'>"
            + picture
            + "<p>" + this.content + "</p>"
            + geolocation
            + "</div>"
            + "</div>"
            + "</div>";
        }



    }
}

function addArticle(article) {
    localStorage.setItem(article.id, JSON.stringify(article));
}

function listerArticles() {
    var articles = [];
    $.each(localStorage, function(key, value) {
        articles.push(Article.fromJSON(value));
    });
    return articles;
}

function showArticle(article) {
    if(article.id%2 == 0)
        $('#left').prepend(article.toHTML());
    else
        $('#right').prepend(article.toHTML());
}

//$('#articles_container>div.row').prepend(article.toHTML());

function showArticles(){
    $.each(listerArticles(),function(i,article) {
        showArticle(article);
    });
}



function getFormValues(){
    if ($("#title").val().length === 0) {
        form_title = "Mais ... mais ... ?";
    }
    else {
        form_title = $("#title").val();
    }

    if ($("#content").val().length === 0) {
        form_content = "Où est le titre ?";
    }
    else {
        form_content = $("#content").val();
    }
}

function formToArticle(){
    getFormValues();
    return new Article(
        localStorage.length,
        form_title,
        new Date(),
        form_content,
        form_media,
        positionContent,
        lat,
        long
        );
}


/** ADD ARTICLE + SET THE MEDIA IF SELECTED **/
$("#submit").click(function(event) {
    if ($("#title").val().length !== 0 || $("#content").val().length !== 0)
        clicked = true;

    if (clicked == false) {
        form_media = "https://media.giphy.com/media/GpUeJjdxvTIek/giphy.gif";
    }
    addArticle(formToArticle());
});


/** SHOW FORM TO ADD ARTICLE **/
$(".btn_add").click(function(event) {
    event.preventDefault();
    $("#articles").hide();
    $("#add_article").fadeIn(100);
});

/** DELETE ALL ARTICLES **/
$(".btn_delete").click(function(event) {
    if(confirm("Êtes-vous sûr de vouloir supprimer tous les articles ?")) {
        localStorage.clear();
    }
});



$("#add_article").hide();
showArticles();
//showArticle(Article.fromJSON(localStorage.getItem(1)));

/************************
*    FONCTIONNALITIES   *
************************/

/** PICTURE **/
$("#cameraGetPicture").click(function(event) {
    clicked = true;
    cameraGetPicture();
});



function cameraGetPicture() {
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        supporttype: 2
    });

    function onSuccess(imageData) {
        var image = document.getElementById('img_preview');
        image.src = "data:image/jpeg;base64," + imageData;
        form_media = "data:image/jpeg;base64," + imageData;
        $("#img_preview").addClass('card');
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}


/** VIDEO **/
$("#videoCapture").click(function(event) {
    videoCapture();
});

function videoCapture() {
    var options = {
        limit: 1,
        duration: 10
    };

    navigator.device.capture.captureVideo(onSuccess, onError, options);

    function onSuccess(mediaFiles) {
        var i, path, len;

        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            console.log(mediaFiles);
        }
    }

    function onError(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    }
}


/** GEOLOCATION **/
$("#getPosition").click(function(event) {
    getPosition();
});

function getPosition() {

    var options = {
        enableHighAccuracy: true,
        maximumAge: 3600000
    }

    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    function onSuccess(position) {
        //push latitude and longitude in the array
        /*splitPos.push(position.coords.latitude);
        splitPos.push(position.coords.longitude);*/

        lat = position.coords.latitude;
        long = position.coords.longitude;

        positionContent = 
        'Latitude: '          + position.coords.latitude          + '<br>' +
        'Longitude: '         + position.coords.longitude         /*+ '\n' +
        'Altitude: '          + position.coords.altitude          + '\n' +
        'Accuracy: '          + position.coords.accuracy          + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        'Heading: '           + position.coords.heading           + '\n' +
        'Speed: '             + position.coords.speed             + '\n' +
        'Timestamp: '         + position.timestamp                */;
        
        alert("Votre position a été ajoutée à l'article ! \n \n" + position.coords.latitude + '\n' + position.coords.longitude);
    };

    function onError(error) {
        alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }
}

/** MAPS **/

//Non fonctionnel

function initMap() {
    for (i=0; i<localStorage.length; i++) {
        var article = localStorage.getItem(i);
        var data = JSON.parse(article);

        if(data['position'] !== undefined) {
            var lati = data['latitude'];
            var longi = data['longitude'];

            var posArticle = {lat: Number(lati), lng: Number(longi)};
            var map = new google.maps.Map(document.getElementById('map'+i), {
                zoom: Math.floor((Math.random() * 13) + 9),
                center: posArticle
            });
            var marker = new google.maps.Marker({
                position: posArticle,
                map: map
            });
        }
    }
}


app.initialize();