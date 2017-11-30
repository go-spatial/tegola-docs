---
author: "Jpalms"
date: 2017-11-29
linktitle: Tegola With Open Layers
title: Tegola With Open Layers
weight: 10
subtitle: An open source mapping solution for web and mobile
---

## Introduction

[Tegola](https://github.com/terranodo/tegola) is a map vector tile (MVT) server written in Go. Tegola takes geospatial data from a PostGIS Database and slices it into vector tiles that can be efficiently delivered to any client.

[Open Layers](https://openlayers.org/) is a client library for rendering MVT and raster maps. Combined with Tegola, developers may now render maps in the web or on mobile utilizing all open source technology.

This guide will take you through the steps to get Tegola rendering a map using Open Layers and visualized in a web browser.

## Getting Started 

The first thing you'll need is a Tegola endpoint. You can either setup one locally by following the instructions located in the [Tegola docs](http://tegola.io/getting-started/) or you can use an existing endpoint.

For the following example we'll be pulling in data from a Tegola instance located at https://osm.tegola.io.

## Setup the HTML

Next, we make an HTML page that will show the map. The following is a minimal example HTML page for rendering a map with Open Layers. Copy and paste the following code into an empty file and name it index.html.

``` html
<!doctype html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="https://openlayers.org/en/v4.5.0/css/ol.css" type="text/css">
        <style>
            .map{height:600px;width:100%;}
        </style>
        <script src="https://openlayers.org/en/v4.5.0/build/ol.js" type="text/javascript"></script>
        <title>OpenLayers example</title>
    </head>
    <body>
        <div id="map" class="map"></div>
        <script type="text/javascript">
            var map = new ol.Map({
                target: 'map',
                layers: [
                    new ol.layer.VectorTile({
                        source: new ol.source.VectorTile({
                            format: new ol.format.MVT(),
                            url:'https://osm.tegola.io/maps/osm/{z}/{x}/{y}.pbf'
                        })
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([-117.15,32.72]), //coordinates the map will center on initially
                    zoom: 14
                })
            });
        </script>
    </body>
</html>
```

Open the HTML file in a browser and you should see the following:

![alt text](/images/screenshotMap.png "Map")





