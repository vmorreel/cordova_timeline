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



/************************
*          FORM         *
************************/
$('#content').trigger('autoresize');



/************************
*        ARTICLES       *
************************/

class Article {
    constructor(id, title, date, content, media) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.content = content;
        this.media = media;
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
            object.media
            )
    }

    toHTML(){
        var picture = "<br><img src='" + this.media + "' style='max-width:20%;'>"

        if (this.media === undefined) {
            picture = "<br>"
        }

        return "<div class='card blue darken-3 darken-1'>"
        + "<div class='card-content white-text'>"
        + "<span class='card-title'>" + this.title + "</span>"
        + "<span>" + this.date + "</span>"
        + picture
        + "<p>" + this.content + "</p>"
        + "</div>";
    }
}

function addArticle(article) {
    localStorage.setItem(article.id, JSON.stringify(article));
}

function deleteArticle(article) {
    localStorage.removeItem(article.id);
}

function listerArticles() {
    var articles = [];
    $.each(localStorage, function(key, value) {
        articles.push(Article.fromJSON(value));
    });
    return articles;
}

function showArticles(){
    $.each(listerArticles(),function(i,article) {
        showArticle(article);
    });
}

function showArticle(article) {
    $('#articles_container').prepend(article.toHTML());
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
        form_media
        );
}

var div_loading = $("#loading_gif");

function showLoading() {
    div_loading.show();
    setTimeout(hideLoading, 5000);  // 5 seconds
}

function hideLoading() {
    div_loading.hide();
}


$("#submit").click(function(event) {
    if ($("#title").val().length !== 0 || $("#content").val().length !== 0)
        clicked = true;

    if (clicked == false) {
        form_media = "https://media.giphy.com/media/GpUeJjdxvTIek/giphy.gif";
    }
    addArticle(formToArticle());
});

$(".btn_add").click(function(event) {
    event.preventDefault();
    $("#articles").hide();
    $("#add_article").fadeIn(100);
});


$("#add_article").hide();
$("#loading_gif").hide();
showArticles();
//showArticle(Article.fromJSON(localStorage.getItem(1)));

/************************
*    FONCTIONNALITIES   *
************************/

$("#cameraGetPicture").click(function(event) {
    clicked = true;
    cameraGetPicture();
});

$("videoCapture").click(function(event) {
    videoCapture();
});


function cameraGetPicture() {
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });

    function onSuccess(imageData) {
        //var image = document.getElementById('myImage');
        form_media = "data:image/jpeg;base64," + imageData;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}



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




app.initialize();