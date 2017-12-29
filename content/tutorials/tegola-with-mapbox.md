---
author: "Jpalms"
date: 2017-11-29
linktitle: Tegola With Mapbox
title: Tegola With Mapbox GL JS
weight: 10
subtitle: A mapping solution utilizing Mapbox
menu:
  main:
    parent: Tutorials
---

## Introduction

[Tegola](https://github.com/terranodo/tegola) is a vector tile server written in Go. Tegola takes geospatial data from a PostGIS Database and slices it into vector tiles that can be efficiently delivered to any client.

[Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/) is a client library for rendering MVT and raster maps. Combined with Tegola, beautiful maps may be rendered with complete control.

This guide will take you through the steps to get Tegola rendering a map using Mapbox GL JS and visualized in a web browser.

## Getting Started 

The first thing you'll need is a Tegola endpoint. You can either setup one locally by following the instructions located in the [Tegola docs](http://tegola.io/getting-started/) or you can use an existing endpoint.

For the following example we'll be pulling in data from a Tegola instance hosted at https://osm.tegola.io.

## Setup the HTML

Next, we make an HTML page that will show the map. The following is a minimal example HTML page for rendering a map with Open Layers. Copy and paste the following code into an empty file and name it index.html.

``` html
<!doctype html>
<html lang="en">
    <head>
        <style>
            #map{height:600px;width:100%;}
        </style>
        <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.42.2/mapbox-gl.js'></script>
        <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.42.2/mapbox-gl.css' rel='stylesheet' />
        <title>Mapbox example</title>
    </head>
    <body>
        <div id="map"></div>
        <script type="text/javascript">
            var map = new mapboxgl.Map({
                container: 'map', // map tag id
                style: '', // style json location
                center: [-117.15,32.72], // starting position [lng, lat]
                zoom: 9 // starting zoom
            });
        </script>
    </body>
</html>
```

We are including the Mapbox GL JS library from https://api.tiles.mapbox.com/mapbox-gl-js/v0.42.2/mapbox-gl.js and the matching css file in the head of the document. In the body, we define `<div id="map"></div>` which is the container that will hold the rendered map.

To render the map we will use a javascript snippet.

``` javascript
var map = new mapboxgl.Map({
    container: 'map', // map tag id
    style: '', // style json location
    center: [-117.15,32.72], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
```

Important details to note in this snippet are the `container:'map'` piece which tells Mapbox to instantiate the map into the div with an id of map. The `style` property which is the path to the style json file. Inside the styule file is a source property which defines the map data that will be imported. In this case we are using a Tegola endpoint which serves up Open Street Maps (OSM) data.

Open the HTML file in a browser and you should see the following:

![basic map screenshot](/images/screenshotMapbox.png "Map")

A map of San Diego, CA rendered with the stylesheet we defined.

For more information on Mapbox GL JS check out the official documentation: [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/).


