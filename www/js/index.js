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
var routerInfos;
var routerPos;          // Position du routeur
var mapPoints = [];     // Layers Points de la carte
var pointsColors = [];   // Couleurs des points sur la carte
var NTDisplay;

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
        clearInterval(NTDisplay);
        navigator.notification.alert(
            "Application Resumed",
            null,
            "Wifi Detect",
            'Ok'
        );
        app.displayMap();
        app.displayWifi();
    },
    // Fonction d'affichage de la barre de niveau wifi (canvas)
    displayWifi: function(){
        if(routerPos != null){
            var canvas = document.getElementById('wifi');
            var ctx = document.getElementById('wifi').getContext("2d");
            ctx.font = "12px serif";
            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.stroke();
        }
    },
    displayMap: function(){
        app.mapRefresh();
        var delButton = document.getElementById('delete').addEventListener('click', app.onDelete);
        var refreshButton = document.getElementById('refresh').addEventListener('click', app.mapRefresh);
        var gotoButton = document.getElementById('goto-user').addEventListener('click', app.gotoUser);
        var routerButton = document.getElementById('router').addEventListener('click', app.getRouters);
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
        userPos = e.latlng;
        console.log('Vos coordonnées GPS', userPos.lat, userPos.lng);
        var infos = document.getElementById('gps-infos');
        infos.innerHTML = "lat: " + userPos.lat + ", long: " + userPos.lng;
    },
    onLocationError: function(e){
        alert(e.message);
    },
    // Rafraîchissement de la carte
    mapRefresh: function(){
        document.getElementById('wifi-infos').innerHTML = '';
        map.remove();
        map = L.map('map');
        L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 26,
            id: 'wifidetect',
            accessToken: 'pk.eyJ1Ijoib2JlaW5nIiwiYSI6ImNpbmpmYjY1eTAwNXF3MmtsN2I4bWwyN3gifQ.rzppEAcwRd89bvCmZGLWig'
        }).addTo(map);
        map.locate({setView: true, maxZoom: 16});
        if (intensDatas.length > 0) {
            intensDatas.map(app.displayCircle);
        }
        map.on('locationfound', app.onLocationFound);
        map.on('locationerror', app.onLocationError);
        map.on('click', app.onMapClick);
    },
    // dessiner les points sur la carte
    displayCircle: function(e, color){
        var circle = L.circle(e.latlng, 0.5, {
            color: color,
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(map);
        mapPoints.push(circle);
        console.log(circle);
    },
    // Ajouter un point sur la carte
    onMapClick: function(e){
        intensDatas.push(e);
        pointsColors.push('red');
        console.log('datas', intensDatas);
        app.displayCircle(e, 'red');
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
    },
    gotoUser: function(){
        // go to user location
        if(userPos != 'undefined'){
        map.setView(userPos);
        }
    },
    getRouters: function(){
        app.scan();
        app.displayWifi();
    },
    // fonction scan des réseaux wifi
    scan: function(){
        cordova.plugins.hotspot.scanWifi(
            function(e){
                console.log('ok : ', e);
                var infos =  document.getElementById('wifi-infos');
                var wifi = {datas: e};
                var tpl = document.getElementById('tpl').innerHTML;
                var html = Mustache.render(tpl, wifi);
                console.log('render :', html);
                infos.innerHTML = html;
                var refreshList = document.getElementById('refresh-list').addEventListener('click', app.scan);
                var select = document.getElementsByClassName('network');
                for(var i = 0; i < select.length; i++){
                    select[i].addEventListener('click', function(){console.log('clicked')});
                    console.log(i);
                }
                console.log(select);
            },
            function(err){
                console.log('Erreur', err);
            }
        );
    }
};

app.initialize();