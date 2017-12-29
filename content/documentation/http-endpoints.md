---
author: "Jpalms"
date: 2017-11-29
linktitle: HTTP Endpoints
title: HTTP Endpoints
weight: 10
subtitle: Tegola API endpoints
menu:
  main:
    parent: Documentation
---

## Introduction

The following endpoints are used for communicating with Tegola over HTTP. All the endpoints expect a HTTP `GET` request.

## /maps/:map/:z/:x/:y

Will return a vector tile from the provided `:map` at the provided `:z`, `:x`: and `:y` values.

### URL parameters

- `:map`: The name of the map as defined in the Tegola [config](/configuration/#maps) file. 
- `:z`: The tile zoom.
- `:x`: The tile row.
- `:y`: The tile column.

## /maps/:map/:layer/:z/:x/:y

Will return a vector tile with a single `:layer` from the provided `:map` at the provided `:z`, `:x`: and `:y` values. 

### URL parameters

- `:map`: The name of the map as defined in the Tegola [config](/configuration/#maps) file. 
- `:layer`: The name of the maps layer, as defined in the Tegola [config](/configuration/#map-layers) file. 
- `:z`: The tile zoom.
- `:x`: The tile row.
- `:y`: The tile column.


## /capabilities

The `/capabilities` endpoint returns JSON with details about the running Tegola instance. 

### Example response

```json
{
	"version": "v0.3.0",
	"maps": [{
		"name": "bonn_osm",
		"uri": "/maps/bonn_osm",
		"layers": [{
			"name": "building",
			"uri": "/maps/bonn_osm/building",
			"minZoom": 14,
			"maxZoom": 20
		}, {
			"name": "road",
			"uri": "/maps/bonn_osm/road",
			"minZoom": 10,
			"maxZoom": 20
		}]
	}]
}
```

## /static

The `/static` endpoint provides a HTTP fileserver that will serve files from the `static/` directory relative to the running Tegola instance. This is helpful during local development when testing Tegola with a client side library.

