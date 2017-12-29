---
author: "Jpalms"
date: 2017-11-29
linktitle: Tegola Configuration
title: Tegola Configuration
weight: 5
subtitle: Configure Tegola to process your geospatial data
menu:
  main:
    parent: Documentation
---

## Overview

The Tegola config file use [TOML](https://github.com/toml-lang/toml) syntax and is comprised of three primary sections:

- [Webserver](#webserver): webserver configuration.
- [Providers](#providers): data provider configuration (i.e. PostGIS).
- [Maps](#maps): map configuration including map names, layers and zoom levels.


## Webserver

The webserver part of the config has the following parameters:

| Param      | Required |  Default                                                      | Description                                        |
|:-----------|:---------|:--------------------------------------------------------------|:---------------------------------------------------|
| port       | No       | :8080                                                         | A string with the value for port.                  |
| log_file   | No       |                                                               | Location of a log file to write webserver logs to. |
| log_format | No       | {{.Time}}:{{.RequestIP}} —— Tile:{{.Z}}/{{.X}}/{{.Y}}         | Log output format. The Default format can be rearranged as desired. |

**Example Webserver config**

```toml
[webserver]
port = ":8080"
log_file = "/var/log/tegola/tegola.log"
log_format = "{{.Time}}:{{.RequestIP}} —— Tile:{{.Z}}/{{.X}}/{{.Y}}"
```

## Providers

The providers configuration tells Tegola where your data lives. Currently Tegola supports PostGIS as a data provider, but it's positioned to support additional data providers. Data providers each have their own specific configuration, but all are required to have the following two config params:

| Param    | Description                                                                                |
|:---------|:-------------------------------------------------------------------------------------------|
| name     | User defined data provider name. This is used by map layers to reference the data provider.|
| type     | The type of data provider. (i.e. "postgis")                                                |


### PostGIS

In addition to the required `name` and `type` parameters, a PostGIS data provider has the following additional params:

| Param    | Required |  Default | Description                                     |
|:---------|:---------|:---------|:------------------------------------------------|
| host     | Yes      |          | The database host.                              |
| port     | No       | 5432     | The port the database is listening on.          |
| database | Yes      |          | The name of the database                        |
| user     | Yes      |          | The database user                               |
| password | Yes      |          | The database user's password                    |
| srid     | No       | 3857     | The default SRID for this data provider         |

**Example PostGIS Provider config**

```toml
[[providers]]
name = "test_postgis"   # provider name is referenced from map layers
type = "postgis"        # the type of data provider.
host = "localhost"      # postgis database host
port = 5432             # postgis database port
database = "tegola"     # postgis database name
user = "tegola"         # postgis database user
password = ""           # postgis database password
srid = 3857             # The default srid for this provider. If not provided it will be WebMercator (3857)
```

## Provider Layers

Provider Layers are referenced by [Map Layers](#map-layers) using the dot syntax `provder_name.provider_layer_name` (i.e. `my_postgis.rivers`). Provider Layers are required to have a `name` and will typically have additional parameters which are specific to that Provider. A Provider Layer has the following top level configuration parameters:

| Param              | Required | Description                                       |
|:-------------------|:---------|:--------------------------------------------------|
| name               | Yes      | The name that will be referenced from a map layer.|


### PostGIS Provider Layer

PostGIS Provider Layers define how Tegola will fetch data for a layer form a [PostGIS](#postgis) Provider. The configuration requires either `tablename` or `sql` to be defined, but not both. The PostGIS Provider Layer has the following configuration prarameters:

| Param              | Required |  Default | Description                                                      |
|:-------------------|:---------|:---------|:-----------------------------------------------------------------|
| **tablename**      | Yes*     |          | The name of the database table to query.                         |
| **sql**            | Yes*     |          | Custom SQL. Requires a !BBOX! token                              |
| geometry_fieldname | No       | geom     | The name of the geometry field in the table                      |
| id_fieldname       | No       | gid      | The name of the feature ID field in the table                    |
| srid               | No       | 3857     | The SRID for the table. Can be 3857 of 4326.                     |
| fields             | No       |          | Fields to include as tag values. Useful when using **tablename** |


&#42; Either `tablename` or `sql` is required, but not both.


**Example minimum Provider Layer config with `tablename` defined**

```toml
[[providers.layers]]
name = "landuse"
# this table uses 'geom' for the geometry_fieldname and 'gid' for the id_fieldname (the defaults)
tablename = "gis.zoning_base_3857"  
```

**Example minimum Provider Layer config with `sql` defined**

```toml
[[providers.layers]]
name = "landuse"
# note that the geometery field is wraped in ST_AsBinary() and the use of the required !BBOX! token
sql = "SELECT gid, ST_AsBinary(geom) AS geom FROM gis.rivers WHERE geom && !BBOX!"
```

## Maps

Tegola is responsible for serving vector map tiles, which are made up of numerous [Map Layers](#map-layers). The name of the Map is used in the URL of all map tile requests (i.e. /maps/:map_name/:z/:x/:y). Maps have the following configuration parameters:


| Param              | Required | Description                                                      |
|:-------------------|:---------|:-----------------------------------------------------------------|
| name               | Yes      | The map that will be referenced in the URL (i.e. /maps/:map_name.|


```toml
[[maps]]
name = "zoning"		# used in the URL to reference this map (/maps/:map_name)
```

## Map Layers

Map Layers define which [Provider Layers](#provider-layers) to render at what zoom levels. Map Layers have the following configuration parameters:

| Param              | Required | Description                                                                              |
|:-------------------|:---------|:----------------------------------------------------------------------------------------|
| provider_layer     | Yes      | The name of the provider and provider layer using dot syntax. (i.e. my_postgis.rivers).  |
| min_zoom           | No       | The minium zoom to render this layer at.                                                 |
| max_zoom           | No       | The maximum zoom to render this layer at.                                                |


**Example Map Layer**

```toml
[[maps.layers]]
provider_layer = "test_postgis.landuse" # must match a data provider layer
min_zoom = 12                       	# minimum zoom level to include this layer
max_zoom = 16                       	# maximum zoom level to include this layer
```

## Map Layer Default Tags

Map Layer Default Tags provide a convenient way to encode additional tags that are not supplied by a data provider. If a Defalt Tag is defined and the same tag is returned by the Provider, the Provider defined tage will take precedence. 

Default Tags are `key = value` pairs.

**Example Map Layer Default Tags**

```toml
[maps.layers.default_tags]      
class = "park"			# a default tag to encode into the feature
```

## Full Config Example

The following config demonstrates the various concepts discussed above:

```toml
[webserver]
port = ":9090"

# register data providers
[[providers]]
name = "test_postgis"   # provider name is referenced from map layers
type = "postgis"        # the type of data provider. currently only supports postgis
host = "localhost"      # postgis database host
port = 5432             # postgis database port
database = "tegola"     # postgis database name
user = "tegola"         # postgis database user
password = ""           # postgis database password
srid = 3857             # The default srid for this provider. If not provided it will be WebMercator (3857)

	# Example data
    [[providers.layers]]
    name = "landuse"					# will be encoded as the layer name in the tile
    tablename = "gis.zoning_base_3857"	# sql or table_name are required
    geometry_fieldname = "geom"			# geom field. default is geom
    id_fieldname = "gid"				# geom id field. default is gid
    srid = 4326							# the SRID of the geometry field if different than 

    [[providers.layers]]
    name = "roads"						# will be encoded as the layer name in the tile
    tablename = "gis.zoning_base_3857"	# sql or table_name are required
    geometry_fieldname = "geom"			# geom field. default is geom
    id_fieldname = "gid"				# geom id field. default is gid
    fields = [ "class", "name" ]		# Additional fields to include in the select statement.

    [[providers.layers]]
    name = "rivers"                     # will be encoded as the layer name in the tile
    # Custom sql to be used for this layer. 
    # Note that the geometery field is wraped in a ST_AsBinary()
    sql = "SELECT gid, ST_AsBinary(geom) AS geom FROM gis.rivers WHERE geom && !BBOX!"

# maps are made up of layers
[[maps]]
name = "zoning"                         	# used in the URL to reference this map (/maps/:map_name)

    [[maps.layers]]
    provider_layer = "test_postgis.landuse" # must match a data provider layer
    min_zoom = 12                       	# minimum zoom level to include this layer
    max_zoom = 16                       	# maximum zoom level to include this layer

        [maps.layers.default_tags]      	# table of default tags to encode in the tile. SQL statements will override
        class = "park"

    [[maps.layers]]
    provider_layer = "test_postgis.rivers"  # must match a data provider layer
    min_zoom = 10                       	# minimum zoom level to include this layer
    max_zoom = 18                       	# maximum zoom level to include this layer
```