---
author: "Jpalms"
date: 2017-11-29
linktitle: Getting Started
title: Getting Started with Tegola
weight: 2
subtitle: Run your own open source vector tile server
menu:
  main:
    parent: Documentation
---

The quickest way to your first vector tile server is via using this
example [repository](https://github.com/iwpnd/tegola-example-bonn).
At the end of this exercise you will have an understanding of how
to setup and configure Tegola. You will also have created your first
client application utilizing vector tiles.

Let's get started!

## Prerequisites

- [Install Docker](https://docs.docker.com/get-docker/) for your OS.

Clone the example repository into a location of your choosing.

```bash
git clone https://github.com/go-spatial/tegola-example-bonn.git
cd tegola-example-bonn
```

Next up, you start Tegola and Postgres/PostGIS in a containerized environment

```bash
docker compose up
```

This will take care of

- unpacking the example data
- starting all required services
- database migration

wait until the migration step exits and you're done.

## Tegola viewer

This example comes with the `mvt_postgis` provider. After you ran the prerequisites,
you can access the tegola viewer via `http://localhost:8080`.

(for more on the differences see
[provider layers]({{< ref "/documentation/configuration#provider-layers" >}} "provider layers").

![Bonn, Germany](/images/bonn_internal_viewer.png)

## Your first vector map

Tegola delivers geospatial vector tile data to any requesting client. For simplicity,
we'll be setting up a basic HTML page as our client that will display the rendered
map. We'll be using the [OpenLayers](http://openlayers.org/) client side
library to display and style the vector tile content.

Create a new HTML file, copy in the contents below, and open in a browser:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Tegola Sample</title>
    <link
      rel="stylesheet"
      href="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/css/ol.css"
      type="text/css"
    />
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js"></script>
    <style>
      #map {
        width: 100%;
        height: 100%;
        position: absolute;
        background: #f8f4f0;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = new ol.Map({
        layers: [
          new ol.layer.VectorTile({
            source: new ol.source.VectorTile({
              attributions:
                '© <a href="http://www.openstreetmap.org/copyright">' +
                "OpenStreetMap contributors</a>",
              format: new ol.format.MVT(),
              tileGrid: ol.tilegrid.createXYZ({ maxZoom: 22 }),
              tilePixelRatio: 16,
              url: "/maps/bonn/{z}/{x}/{y}.vector.pbf?debug=true",
            }),
          }),
        ],
        target: "map",
        view: new ol.View({
          //coordinates the map will center on initially
          center: [790793.4954921771, 6574927.869849075],
          zoom: 14,
        }),
      });
    </script>
  </body>
</html>
```

If everything was successful, you should see a map of Bonn in your browser.

![Bonn, Germany](/images/bonn.png)

## Next steps

- Check out how to create your own
  [config]({{< ref "/documentation/configuration" >}} "tutorials")
- Check out our other [tutorials]({{< ref "/tutorials" >}} "tutorials") and start
  using your own data!
- Join [gophers#go-spatial on slack](https://app.slack.com/client/T029RQSE6/C029RQSEE/)
  and show us what you built with tegola!
