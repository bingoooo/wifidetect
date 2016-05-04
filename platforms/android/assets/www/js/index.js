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
// var appState = {
//     takingPicture: true,
//     imageUri: ""
// };

// var APP_STORAGE_KEY = "exampleAppState";

var map = L.map('map'); // Variable contenant les définitions de la carte
var mapCenter;          // Varible définissant le centre de la carte
var userPos;            // Geolocalisation de l'utilisateur
var intensDatas = [];   // Localisation des différents points de la carte
var routerPos;          // Position du routeur
var mapPoints = [];     // Layers Points de la carte
var pointsColors = []   // Couleurs des points sur la carte

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
        document.addEventListener('load', this.onLoad, false);
    },
    onLoad: function(){
        app.displayLoad();
    },
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);
    onDeviceReady: function() {
        app.displayMap();
        app.displayWifi("No Level");
    },
    onPause: function() {
        window.alert = function(message) {
            navigator.notification.alert(
                message,
                null,
                "Wifi Detct",
                'Ok'
            );
        };
    },
    onResume: function(){
        navigator.notification.alert(
            "Application Resumed",
            null,
            "Wifi Detect",
            'Ok'
        );
        app.displayMap();
        app.displayWifi("No Level");
    },
    // Fonction d'affichage de la barre de niveau wifi (canvas)
    displayWifi: function(level){
        var canvas = document.getElementById('wifi');
        var ctx = document.getElementById('wifi').getContext("2d");
        ctx.font = "12px serif";
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillText = (level, canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = "black";
        ctx.stroke();
        var infos =  document.getElementById('wifi-infos');
        var wifi = cordova.plugins;
        var hotspot = cordova.plugins.hotspot.getConnectionInfo(function(e){return e;}, function(err){return err;});
        infos.innerHTML = hotspot;
        console.log(wifi);
    },
    displayMap: function(){
        app.mapRefresh();
        var delButton = document.getElementById('delete').addEventListener('click', app.onDelete);
        var refreshButton = document.getElementById('refresh').addEventListener('click', app.mapRefresh);
    },
    displayLoad: function(){
        navigator.notification.alert(
            "Loading, please wait",
            null,
            "Wifi Detect",
            'Ok'
        );
    },
    onLocationFound: function(e){
        console.log(e.latlng);
        userPos = e.latlng;
        console.log('Vos coordonnées GPS', userPos.lat, userPos.lng);
        var infos = document.getElementById('gps-infos');
        infos.innerHTML = "lat: " userPos.lat + ", long: " + userPos.lng;
    },
    onLocationError: function(e){
        alert(e.message);
    },
    // Rafraîchissement de la carte
    mapRefresh: function(){
        map.remove();
        map = L.map('map');
        L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 26,
            id: 'wifidetect',
            accessToken: 'pk.eyJ1Ijoib2JlaW5nIiwiYSI6ImNpbmpmYjY1eTAwNXF3MmtsN2I4bWwyN3gifQ.rzppEAcwRd89bvCmZGLWig'
        }).addTo(map);
        console.log(map);
        map.locate({setView: true, maxZoom: 16});
        if (intensDatas.length > 0) {
            intensDatas.map(app.displayCircle);
        }
        map.on('locationfound', app.onLocationFound);
        map.on('locationerror', app.onLocationError);
        map.on('click', app.onMapClick);
    },
    // dessiner les points sur la carte
    displayCircle: function(e){
        var circle = L.circle(e.latlng, 0.5, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(map);
        mapPoints.push(circle);
        console.log(circle);
    },
    // Ajouter un point sur la carte
    onMapClick: function(e){
        intensDatas.push(e);
        console.log('datas', intensDatas);
        app.displayCircle(e);
    },
    // supprimer le dernier point si le tableau contient des données
    onDelete: function(){
        if(mapPoints.length > 0) {
            console.log('Last Point Deleted :', intensDatas.pop());
            console.log('Datas', intensDatas);
            var point = mapPoints.pop();
            map.removeLayer(point);
        }
    },
    onSetRouter: function(e){
        routerPos = e.latlng;
    }
};

app.initialize();