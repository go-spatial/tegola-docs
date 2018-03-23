---
author: "Jpalms"
date: 2017-11-29
linktitle: Tegola With OLMS
title: Tegola With OL Mapbox Style (OLMS)
weight: 4
subtitle: An easy way to use Mapbox styles with OpenLayers
menu:
  main:
    parent: Tutorials
---

## Introduction

[Tegola](https://github.com/go-spatial/tegola) is a vector tile server written in Go. Tegola takes geospatial data from a PostGIS Database and slices it into vector tiles that can be efficiently delivered to any client.

[OLMS](https://github.com/boundlessgeo/ol-mapbox-style) is a library used to take Mapbox stylesheets and convert them into OpenLayers scripted styles.

This guide will show you how to use OLMS to convert and utilize a Mapbox style to render a map using OpenLayers.

## Getting Started 

To get setup for using OLMS you'll need a Tegola source, a Mapbox stylesheet, and the OLMS library.

### Tegola source
The first thing you'll need is a Tegola endpoint. You can either setup one locally by following the instructions located in the [Tegola docs](http://tegola.io/getting-started/) or you can use an existing endpoint.

For the following example we'll be pulling in data from a Tegola instance hosted at https://osm.tegola.io.

### Get a Mapbox stylesheet
You may either pull a Mapbox stylesheet from Mapbox directly using an API key, you can craft your own, or you may use a stylesheet provided in this repo in the style directory.

For the following example we'll be using the stylesheet here https://osm.tegola.io.

Note that stylesheets are specific to the layers of a source endpoint. Ensure that whatever styles you are using are compatible.

### Grab the OLMS script
Either get the js file from the [OLMS repo](https://github.com/boundlessgeo/ol-mapbox-style) or you can link to it from these docs here: https://osm.tegola.io.

## Setup the HTML

Next, we make an HTML page that will show the map. The following is a minimal example HTML page for rendering a map with OpenLayers and OLMS. Copy and paste the following code into an empty file and name it index.html.

``` html
<!doctype html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="https://openlayers.org/en/v4.5.0/css/ol.css" type="text/css">
        <style>
            #map{height:600px;width:100%;}
        </style>
        <script src="https://openlayers.org/en/v4.5.0/build/ol.js" type="text/javascript"></script>
        <script src="olms.js" type="text/javascript"></script>
        <title>OpenLayers example</title>
    </head>
    <body>
        <div id="map"></div>
        <script type="text/javascript">
            olms.apply('map','hot-osm.json');
        </script>
    </body>
</html>
```

The piece that is doing all the heavy lifting here is `olms.apply('map','hot-osm.json');`. The first argument `map` is the id of the tag where the map will render. The next, `hot-osm.json` is the path to the style json file in Mapbox style format. Note that there is no source declaration in this HTML file. That is being defined as `https://osm.tegola.io` inside the `hot-osm.json` file.

And here's what you should see when you open up a browser:

![custom styles screenshot](/images/screenshotOLMS.png "Map")

For more information on using OLMS, check out the official documentation: [OL Mapbox Style](https://github.com/boundlessgeo/ol-mapbox-style).


