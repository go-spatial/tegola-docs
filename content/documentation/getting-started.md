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

## 1. Download Tegola

### Executable
[Choose the binary](https://github.com/go-spatial/tegola/releases) that matches the operating system Tegola will run on. Find the Tegola file that was downloaded, unzip it, and move it into a fresh directory. Rename this file `tegola`.

### Docker Image
Tegola provides an official Docker release with support for both PostGIS and GeoPackage data providers.  Use `docker pull gospatial/tegola` to get the latest image.

[Check out the docs on Docker Hub](https://hub.docker.com/r/gospatial/tegola/) for details and examples of using the image.

## 2. Set up a data provider

Tegola needs geospatial data to run. Currently, Tegola supports PostGIS which is a geospatial extension for PostgreSQL, and GeoPackage. If you don't have PostGIS installed, [download PostGIS](http://postgis.net/install/).

Next, you'll need to load PostGIS with data. For your convenience you can download [PostGIS data for Bonn, Germany](https://github.com/go-spatial/tegola-example-data/raw/master/bonn_osm.sql.tar.gz).

Create a new database named `bonn`, and use a restore command to import the unzipped SQL file into the database. Documentation can be found [here](https://www.postgresql.org/docs/current/static/backup.html) under the section titled "Restoring the dump". The command should look something like this:

```sh
psql bonn < bonn_osm.sql
```

To enable Tegola to connect to the database, create a database user named `tegola` and grant the privileges required to read the tables in the `public` schema of the `bonn` database, using these commands:

```sh
psql -c "CREATE USER tegola;"
psql -d bonn -c "GRANT SELECT ON ALL TABLES IN SCHEMA public TO tegola;"
```

## 3. Create a configuration file

Tegola utilizes a single configuration file to coordinate with data provider(s). This configuration file is written in [TOML format](https://github.com/toml-lang/toml).

Create your configuration file in the same directory as the Tegola binary and name it `config.toml`. Next, copy and paste the following into this file:

```toml
[webserver]
port = ":8080"

# register data providers
[[providers]]
name = "bonn"           # provider name is referenced from map layers
type = "postgis"        # the type of data provider. currently only supports postgis
host = "localhost"      # postgis database host
port = 5432             # postgis database port
database = "bonn"       # postgis database name
user = "tegola"         # postgis database user
password = ""           # postgis database password
srid = 4326             # The default srid for this provider. If not provided it will be WebMercator (3857)

  [[providers.layers]]
  name = "road"
  geometry_fieldname = "wkb_geometry"
  id_fieldname = "ogc_fid"
  sql = "SELECT ST_AsBinary(wkb_geometry) AS wkb_geometry, name, ogc_fid FROM all_roads WHERE wkb_geometry && !BBOX!"

  [[providers.layers]]
  name = "main_roads"
  geometry_fieldname = "wkb_geometry"
  id_fieldname = "ogc_fid"
  sql = "SELECT ST_AsBinary(wkb_geometry) AS wkb_geometry, name, ogc_fid FROM main_roads WHERE wkb_geometry && !BBOX!"

  [[providers.layers]]
  name = "lakes"
  geometry_fieldname = "wkb_geometry"
  id_fieldname = "ogc_fid"
  sql = "SELECT ST_AsBinary(wkb_geometry) AS wkb_geometry, name, ogc_fid FROM lakes WHERE wkb_geometry && !BBOX!"

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

Note: This configuration file is specific to the Bonn data provided in step 2 if you're using another dataset reference the [Configuration Documentation](/documentation/configuration/).

## 4. Start Tegola

### Executable

Navigate to the Tegola directory in your computer's terminal and run this command:

```sh
./tegola serve --config=config.toml
```

You should see a message confirming the config file load and Tegola being started on port 8080. If your computer's port 8080 is being used by another process, change the port in the config file to an open port.

### Docker Image
If you're using the docker image, starting Tegola will be slightly different in order to pass your config and possibly your data into the container.

[Check out the docs on Docker Hub](https://hub.docker.com/r/gospatial/tegola/) for details and examples of using the image.


## 5. Create an HTML Page

Tegola delivers geospatial vector tile data to any requesting client. For simplicity, we'll be setting up a basic HTML page as our client that will display the rendered map. We'll be using the [OpenLayers](http://openlayers.org/) client side library to display and style the vector tile content.

Create a new HTML file, copy in the contents below, and open in a browser:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Tegola Sample</title>
    <link rel="stylesheet" href="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/css/ol.css" type="text/css">
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
              attributions:'© <a href="http://www.openstreetmap.org/copyright">' +
              'OpenStreetMap contributors</a>',
              format: new ol.format.MVT(),
              tileGrid: ol.tilegrid.createXYZ({maxZoom: 22}),
              tilePixelRatio: 16,
              url:'/maps/bonn/{z}/{x}/{y}.vector.pbf?debug=true'
            })
          })
        ],
        target: 'map',
        view: new ol.View({
          center: [790793.4954921771, 6574927.869849075], //coordinates the map will center on initially
          zoom: 14
        })
      });
    </script>
  </body>
</html>
```

If everything was successful, you should see a map of Bonn in your browser. 

![Bonn, Germany](/images/bonn.png)
