---
author: "Benjamin Ramser"
date: 2022-12-04
linktitle: Tegola With MapLibre
title: Tegola With MapLibre
weight: 2
subtitle: Load Tegola-served content on a MapLibre Map!
menu:
  main:
    parent: Tutorials
---

## Introduction

[Tegola](https://github.com/go-spatial/tegola) is a vector tile server written
in Go. Tegola takes geospatial data from a PostGIS Database and slices it into
vector tiles that can be efficiently delivered to any client.

[MapLibre](https://maplibre.org/) is an open-source TypeScript library for
publishing maps on your websites. Fast displaying of maps is possible thanks
to GPU-accelerated vector tile rendering. Originated as an open-source fork of
mapbox-gl-js, the library is intended to be a drop-in replacement for
the Mapbox’s version with additional functionality.

This guide will take you through the steps to get Tegola rendering a map using
MapLibre and visualized in a web browser.

## Getting Started

### Build the Tegola Server

The first thing you'll need is a Tegola endpoint. You can either set one up
locally by following the instructions located in the
[getting started guide](http://tegola.io/documentation/getting-started/) or you
can use an existing endpoint.

## Set up the HTML

Next, we make an HTML page that will show the map. The following is a minimal
example HTML page for rendering a map with MapLibre. Copy and paste the following
code into an empty file and name it index.html.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Add a vector tile source</title>
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <script src="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js"></script>
    <link
      href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css"
      rel="stylesheet"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = new maplibregl.Map({
        container: "map",
        center: [7.0982, 50.7374],
        zoom: 11,
        style:
          "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
      });
    </script>
  </body>
</html>
```

We are including the MapLibre library and the matching CSS file in the head
of the document. In the body, we define `<div id="map"></div>` which is the
container that will hold the rendered map.

To render the map we will use a JavaScript snippet.

```js
var map = new maplibregl.Map({
  container: "map",
  center: [7.0982, 50.7374],
  zoom: 11,
  style:
    "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
});
```

Important details to note in this snippet are the `container:'map'` piece which
tells MapLibre to instantiate the map into the div with an id of map.
The `style` property which is the path to the style json file.
Inside the style file is a source property which defines the map data that will
be imported. In this case we are using a
Tegola endpoint which serves up OpenStreetMap (OSM) data.

A map of Bonn, Germany is rendered with the stylesheet we defined.

For more information on MapLibre check out the official documentation:
[MapLibreJS](https://maplibre.org/).

## Add the Layers served by Tegola

Now that we have the basemap and the server, we will finish this tutorial by
adding the two. The following assumes that you've setup the
[getting-started]({{< ref "/getting-started" >}} "provider layers") for
tegola using Bonn.

### Choosing your layers

Let's have a look at your toml file first:

```toml
[[maps]]
name = "bonn"

  [[maps.layers]]
  provider_layer = "bonn.road"
  min_zoom = 10
  max_zoom = 20

  [[maps.layers]]
  provider_layer = "bonn.main_roads"
  min_zoom = 5
  max_zoom = 20

  [[maps.layers]]
  provider_layer = "bonn.lakes"
  min_zoom = 5
  max_zoom = 20
```

The name of this source is `bonn`. This will be part of the API call you make
to retrieve the layers. Next, you have the names of the layers.
In this source, you see `road`, `lakes`, `main_roads`. Each layer shows the
content of the source, which can style from within the browser when we
call the individual layers. Let's add the roads:

First, we need to choose the trigger when the map content gets loaded.
We will use the `'load'` trigger (You can read more about the triggers available
[here](https://maplibre.org/maplibre-gl-js-docs/api/map/#map.event:load)):

```js
  map.on('load', function () { ... });
```

Now, we add the source:

```js
  map.on('load', function () {
    map.addSource('bonn', {
      'type': 'vector',
      "tiles": ["http://localhost:8080/maps/bonn/{z}/{x}/{y}.vector.pbf?"],
      "tolerance": 0
    });
  }
```

You'll notice here that we're selecting content from the `bonn` map which we
configured in the toml file earlier. Now, we add a layer:

```js
map.addLayer({
  id: "road",
  source: "bonn",
  "source-layer": "road",
  type: "line",
  paint: {
    "line-color": "#000000",
    "line-width": 1,
  },
});
```

This provides the browser with the instruction on how we want to style the layer.
Together, it all looks like the following:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title></title>
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <script src="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js"></script>
    <link
      href="https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css"
      rel="stylesheet"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
      }

      #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
    </style>
  </head>

  <body>
    <div id="map"></div>
    <script>
      var map = new maplibregl.Map({
        container: "map",
        center: [7.0982, 50.7374],
        zoom: 11,
        style:
          "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
      });

      map.on("load", function () {
        map.addSource("bonn", {
          type: "vector",
          tiles: ["http://localhost:8080/maps/bonn/{z}/{x}/{y}.vector.pbf?"],
          tolerance: 0,
        });
        map.addLayer({
          id: "road",
          source: "bonn",
          "source-layer": "road",
          type: "line",
          paint: {
            "line-color": "#FF0000",
            "line-width": 1,
          },
        });
      });
    </script>
  </body>
</html>
```

Now you should see the road layers populate in red on top of the basemap.

From here, you can load other layers from the same source.
Keep in mind that you aren't limited to lines, fills (polygon fills) and points.
Be sure to consult the [MapLibre](https://maplibre.org/maplibre-gl-js-docs/api/)
to learn more about other ways you can symbolize layers using MapLibre!
