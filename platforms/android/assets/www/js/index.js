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

var map = L.map('map');
var mapCenter;
var userPos;
var routerPos;
var circle;

// mapboxgl.accessToken = 'pk.eyJ1Ijoib2JlaW5nIiwiYSI6ImNpbmplcDludjAwNTZ3ZGtsd2R2ejl0cTYifQ.v-S7CcsGW6ASvrQVPlYvKQ';
// var map = new mapboxgl.Map({
//     container: 'map', // container id
//     style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
//     center: [-74.50, 40], // starting position
//     zoom: 9 // starting zoom
// });

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.displayMap();
    },
    displayMap: function(){
        L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 26,
            id: 'wifidetect',
            accessToken: 'pk.eyJ1Ijoib2JlaW5nIiwiYSI6ImNpbmpmYjY1eTAwNXF3MmtsN2I4bWwyN3gifQ.rzppEAcwRd89bvCmZGLWig'
        }).addTo(map);
        console.log(map);
        map.locate({setView: true, maxZoom: 16});

        map.on('locationfound', app.onLocationFound);
        map.on('locationerror', app.onLocationError);
        map.on('click', app.displayCircle);
    },
    onLocationFound: function(e){
        userPos = e.latlong;
        console.log('Vos coordonnées GPS', userPos);
    },
    onLocationError: function(e){
        alert(e.message);
    },
    displayCircle: function(e){
        // dessiner les points sur la carte
        console.log(e);
        circle = L.circle(e.latlng, 2, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(map);
        console.log(circle);
    },
    onMapClick: function(e){
        // Ajouter un point sur la carte
    },
    onDelete: function(){
        // supprimer le dernier point
    },
    onSetRouter: function(e){
        routerPos = e.latlng;
    }
};

app.initialize();