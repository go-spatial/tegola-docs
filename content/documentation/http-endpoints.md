---
author: "Jpalms"
date: 2017-11-29
linktitle: HTTP Endpoints
title: HTTP Endpoints
weight: 4
subtitle: Tegola API endpoints
menu:
  main:
    parent: Documentation
---

## `GET` /maps/:map/:z/:x/:y

Will return a vector tile from the provided `:map` at the provided `:z`, `:x`: and `:y` values.

**URL parameters**

- `:map`: The name of the map as defined in the Tegola [config](/documentation/configuration/#maps) file. 
- `:z`: The tile zoom.
- `:x`: The tile row.
- `:y`: The tile column.

## `GET` /maps/:map/:layer/:z/:x/:y

Will return a vector tile with a single `:layer` from the provided `:map` at the provided `:z`, `:x`: and `:y` values. 

**URL parameters**

- `:map`: The name of the map as defined in the Tegola [config](/documentation/configuration/#maps) file. 
- `:layer`: The name of the maps layer, as defined in the Tegola [config](/documentation/configuration/#map-layers) file. 
- `:z`: The tile zoom.
- `:x`: The tile row.
- `:y`: The tile column.

## `GET` /capabilities

The `/capabilities` endpoint returns JSON with details about the running Tegola instance. 

**Example response**

```json
{
  "version": "v0.6.1",
  "maps": [{
    "name": "bonn_osm",
    "uri": "/maps/bonn_osm",
    "layers": [{
        "name": "building",
        "uri": "/maps/bonn_osm/building",
        "minZoom": 14,
        "maxZoom": 20
      },{
        "name": "road",
        "uri": "/maps/bonn_osm/road",
        "minZoom": 10,
        "maxZoom": 20
      }]
  }]
}
```

## `GET` /capabilities/:map.json

Returns information about a map matching the [TileJSON 2.1 specification](https://github.com/mapbox/tilejson-spec/tree/master/2.1.0).

**URL parameters**

- `:map`: The name of the map as defined in the Tegola [config](/documentation/configuration/#maps) file.

**Example response**

```json
{
  "attribution": "Open Street Map",
  "bounds": [-180, -85.0511, 180, 85.0511],
  "center": [-76.275329586789, 39.153492567373, 8],
  "format": "pbf",
  "minzoom": 0,
  "maxzoom": 20,
  "name": "osm",
  "description": null,
  "scheme": "xyz",
  "tilejson": "2.1.0",
  "tiles": ["https://tegola-osm-demo.go-spatial.org/v1/maps/osm/{z}/{x}/{y}.pbf"],
  "grids": [],
  "data": [],
  "version": "1.0.0",
  "template": null,
  "legend": null,
  "vector_layers": [{
    "version": 2,
    "extent": 4096,
    "id": "populated_places",
    "name": "populated_places",
    "geometry_type": "point",
    "minzoom": 0,
    "maxzoom": 20,
    "tiles": ["https://tegola-osm-demo.go-spatial.org/v1/maps/osm/populated_places/{z}/{x}/{y}.pbf"]
  }, {
    "version": 2,
    "extent": 4096,
    "id": "country_lines",
    "name": "country_lines",
    "geometry_type": "line",
    "minzoom": 0,
    "maxzoom": 10,
    "tiles": ["https://tegola-osm-demo.go-spatial.org/v1/maps/osm/country_lines/{z}/{x}/{y}.pbf"]
  }]
}
```
