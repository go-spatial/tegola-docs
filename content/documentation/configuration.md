---
author: "Jpalms"
date: 2017-11-29
linktitle: Configuration
title: Tegola Configuration
weight: 3
subtitle: Configure Tegola to process your geospatial data
menu:
  main:
    parent: Documentation
---

## Overview

The Tegola config file uses [TOML](https://github.com/toml-lang/toml) syntax with additional support for [environment variables](#env-var). It is comprised of five primary sections:

- [Global](#global): global options
- [Webserver](#webserver): webserver configuration.
- [Providers](#providers): data provider configuration (i.e. PostGIS).
- [Maps](#maps): map configuration including map names, layers and zoom levels.
- [Cache](#cache): cache configurations.

## Global

Unlike the other sections, global config options do not have `[[]]` heading.

| Param            | Requered     | Default      | Description                                           |
|------------------|:-------------|:-------------|:------------------------------------------------------|
| tile_buffer      | No           | 64           | The number of pixels to extend a tile's clipping area |

## Webserver

The webserver part of the config has the following parameters:

| Param                 | Required |  Default                    | Description                                                                    |
|-----------------------|:---------|:----------------------------|:-------------------------------------------------------------------------------|
| port                  | No       | :8080                       | A string with the value for port.                                              |
| hostname              | No       | HTTP Hostname in request    | Set the hostname used to generate URLs for JSON based responses.               |
| uri_prefix            | No       |                             | A prefix to add to all API routes. This is useful when tegola is behind a proxy (i.e. example.com/tegola). The prefix will be added to all URLs included in the capabilities endpoint responses.|


### Headers

Allows tegola to respond to tile request with user defined headers. Default [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers values:

| Header                       | Default        |
|------------------------------|:---------------|
| Access-Control-Allow-Origin  | "*"            |
| Access-Control-Allow-Methods | "GET, OPTIONS" |


**Example Webserver config**

```toml
[webserver]
port = ":8080"
hostname = "tiles.example.com"

  [webserver.headers]
  # redefine default cors origin
  Access-Control-Allow-Origin = "http://map.example.com"

  # define CDN max age
  Cache-Control = "s-maxage=300"
```

## Providers

The providers configuration tells Tegola where your data lives. Data providers each have their own specific configuration, but all are required to have the following two config params:

| Param    | Description                                                                                |
|:---------|:-------------------------------------------------------------------------------------------|
| name     | User defined data provider name. This is used by map layers to reference the data provider.|
| type     | The type of data provider. (i.e. "postgis", "mvt_postgis")                                                |


### PostGIS & MVT_PostGIS

Load data from a Postgres/PostGIS database. In addition to the required `name` and `type` parameters, a PostGIS data provider supports the following parameters:

| Param               | Required |  Default | Description                                        |
|:--------------------|:---------|:---------|:---------------------------------------------------|
| uri                 | Yes      |          | The database connection string.                    |
| srid                | No       | 3857     | The default SRID for this data provider            |

**Example**

```
# {protocol}://{user}:{password}@{host}:{port}/{database}?{options}=

postgres://tegola:supersecret@localhost:5432/tegola?sslmode=prefer&pool_max_conns=10
```

**Options**

- `sslmode`: [Optional] PostGIS SSL mode. Default: "prefer"
- `pool_max_conns`: [Optional] The max connections to maintain in the connection pool. Defaults to 100. 0 means no max.
- `pool_min_conns`: [Optional] The min connections to maintain in the connection pool. Defaults to 0. 0 mean there are no open connections in the pool if not needed.
- `pool_max_conn_idle_time`: [Optional] The maximum time an idle connection is kept alive. Defaults to "30m".
- `pool_max_conn_lifetime` [Optional] The maximum time a connection lives before it is terminated and recreated. Defaults to "1h".
- `pool_health_check_period` [Optional] Time in between health checks. Defaults to "1m".

**Example PostGIS Provider config**

```toml
[[providers]]
name = "test_postgis"       # provider name is referenced from map layers (required)
type = "postgis"            # the type of data provider must be "postgis" for this data provider (required)

uri = "postgres://tegola:supersecret@localhost:5432/tegola?sslmode=prefer" # PostGIS connection string (required)
srid = 3857             # The default srid for this provider. If not provided it will be WebMercator (3857)
```

### GeoPackage

Load data from a [GeoPackage](http://www.geopackage.org) database. The GeoPackage provider requires that Tegola is built with CGO. You can [find prebuilt CGO binaries on GitHub](https://github.com/go-spatial/tegola/releases).

In addition to the required `name` and `type` parameters, a GeoPackage data provider has the following
additional params:

| Param    | Required |  Default | Description                                                         |
|:---------|:---------|:---------|:--------------------------------------------------------------------|
| filepath | Yes      |          | The system file path to the GeoPackage you wish to connect to.      |

**Example GeoPackage Provider config**

```toml
[[providers]]
name = "sample_gpkg"
type = "gpkg"
filepath = "/path/to/my/sample_gpkg.gpkg"
```


## Provider Layers

Provider Layers are referenced by [Map Layers](#map-layers) using the dot syntax `provder_name.provider_layer_name` (i.e. `my_postgis.rivers`). Provider Layers are required to have a `name` and will typically have additional parameters which are specific to that Provider. A Provider Layer has the following top level configuration parameters:

| Param              | Required | Description                                       |
|:-------------------|:---------|:--------------------------------------------------|
| name               | Yes      | The name that will be referenced from a map layer.|


### PostGIS

PostGIS Provider Layers define how Tegola will fetch data for a layer from a [PostGIS](#postgis) Provider. The configuration requires either `tablename` or `sql` to be defined, but not both. The PostGIS Provider Layer has the following configuration parameters:

| Param              | Required |  Default | Description                                                      |
|:-------------------|:---------|:---------|:-----------------------------------------------------------------|
| **tablename**      | Yes*     |          | The name of the database table to query                          |
| **sql**            | Yes*     |          | Custom SQL. Requires a `!BBOX!` token                            |
| geometry_fieldname | No       | geom     | The name of the geometry field in the table                      |
| id_fieldname       | No       | gid      | The name of the feature ID field in the table. Only positive integer IDs are supported. |
| srid               | No       | 3857     | The SRID for the table. Can be 3857 or 4326.                     |
| fields             | No       |          | Fields to include as tag values. Useful when using **tablename** |
| geometry_type      | No       |          | The layer geometry type. If not set, the table will be inspected at startup to try and infer the geometry type. Valid values are: `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`, `GeometryCollection`. |


&#42; Either `tablename` or `sql` is required, but not both.


#### Supported SQL Tokens

The `sql` configuration supports the following tokens

| Token               | Required | Description                                                      |
|:--------------------|:---------|:-----------------------------------------------------------------|
| !BBOX!              | Yes      | Will be replaced with the bounding box of the tile before the query is sent to the database. !bbox! and !BOX! are supported as well for compatibility with queries from Mapnik and MapServer styles. |
| !ZOOM!              | No       | Will be replaced with the "Z" (zoom) value of the requested tile.|
| !SCALE_DENOMINATOR! | No       | Scale denominator, assuming 90.7 DPI (i.e. 0.28mm pixel size)    |
| !PIXEL_WIDTH!       | No       | The pixel width in meters, assuming 256x256 tiles.               |
| !PIXEL_HEIGHT!      | No       | The pixel height in meters, assuming 256x256 tiles.              |
| !ID_FIELD!          | No       | The id field name.                                               |
| !GEOM_FIELD!        | No       | The geom field name.                                             |
| !GEOM_TYPE!         | No       | The geom type if defined otherwise.              |


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
# note that the geometry field is wrapped in ST_AsBinary() and the use of the required !BBOX! token
sql = "SELECT gid, ST_AsBinary(geom) AS geom FROM gis.rivers WHERE geom && !BBOX!"
```

### MVT_PostGIS

The PostGIS MVT provider (`mvt_postgis`) manages querying for tile requests against a Postgres database (version 12+) with the [PostGIS](http://postgis.net/)(version 3.0+) extension installed and leverages [ST_AsMVT](https://postgis.net/docs/ST_AsMVT.html) to handle the MVT encoding at the database.

When using the PostGIS MVT Provider the `ST_AsMVTGeom()` MUST be used. The MVT provider otherwise shares connection options, SQL tokens and layer configuration with the PostGIS Provider.

**Example mvt_postgis and map config**

```toml
[[providers.layers]]
name = "landuse"
# MVT data provider must use SQL statements
# this table uses "geom" for the geometry_fieldname and "gid" for the id_fieldname so they don't need to be configured
# Wrapping the geom with ST_AsMVTGeom is required. 
sql = "SELECT ST_AsMVTGeom(geom,!BBOX!) AS geom, gid FROM gis.landuse WHERE geom && !BBOX!"
```

### GeoPackage

| Param              | Required |  Default | Description                                                                        |
|:-------------------|:---------|:---------|:-----------------------------------------------------------------------------------|
| **tablename**      | Yes*     |          | The name of the database table to query against.                                   |
| **sql**            | Yes*     |          | Custom SQL to use. Requires a `!BBOX!` token.                                      |
| id_fieldname       | No       | `fid`    | The name of the feature id field. Only positive integer IDs are supported         |
| fields             | No       |          | A list of fields (column names) to include as feature tags when using **tablename**.|

&#42; Either `tablename` or `sql` is required, but not both.

When using the **sql** param with GeoPackage:

- You must join your feature table to the spatial index table: i.e. `JOIN feature_table ft rtree_feature_table_geom si ON ft.fid = rt.si`
- Include the following fields in your SELECT clause: `si.minx, si.miny, si.maxx, si.maxy`
- Note that the id field for your feature table may be something other than `fid`

**Example GeoPackage Provider Layer with `sql`**

```toml
[[providers.layers]]
name = "a_points"
sql = """
    SELECT
        fid, geom, amenity, religion, tourism, shop, si.minx, si.miny, si.maxx, si.maxy
    FROM
        land_polygons lp
    JOIN
        rtree_land_polygons_geom si ON lp.fid = si.id
    WHERE
        !BBOX!
"""
```


## Maps

Tegola is responsible for serving vector map tiles, which are made up of numerous [Map Layers](#map-layers). The name of the Map is used in the URL of all map tile requests (i.e. /maps/:map_name/:z/:x/:y). Maps have the following configuration parameters:


| Param              | Required | Description                                                                                                                      |
|:-------------------|:---------|:---------------------------------------------------------------------------------------------------------------------------------|
| name               | Yes      | The map that will be referenced in the URL (i.e. /maps/:map_name.                                                                |
| attribution        | No       | Attribution string to be included in the TileJSON.                                                                               |
| bounds             | No       | The bounds in latitude and longitude values, in the order left, bottom, right, top. Default: `[-180.0, -85.0511, 180.0, 85.0511]`|
| center             | No       | The center of the map to be displayed in the preview. (`[lon, lat, zoom]`).                                                      |
| tile_buffer        | No       | The number of pixels to extend a tile's clipping area, defaults to `64` or the [global](#global) value                           |


```toml
[[maps]]
name = "zoning"		# used in the URL to reference this map (/maps/:map_name)
attribution = "Natural Earth v4"
center = [-76.275329586789, 39.153492567373, 5.0]
```

### Map Layers

Map Layers define which [Provider Layers](#provider-layers) to render at what zoom levels. Map Layers have the following configuration parameters:

| Param              | Required | Description                                                                                                                              |
|:-------------------|:---------|:-----------------------------------------------------------------------------------------------------------------------------------------|
| provider_layer     | Yes      | The name of the provider and provider layer using dot syntax. (i.e. my_postgis.rivers).                                                  |
| name               | No       | Overrides the `provider_layer` name. Can also be used to group multiple `provider_layers` under the same namespace.                      |
| min_zoom           | No       | The minimum zoom to render this layer at.                                                                                                |
| max_zoom           | No       | The maximum zoom to render this layer at.                                                                                                |
| default_tags       | No       | Default tags to be added to features on this layer.                                                                                      |
| dont_simplify      | No       | Boolean to prevent feature simplification from being applied.                                                                            |


**Example Map Layer**

```toml
[[maps.layers]]
provider_layer = "test_postgis.landuse" # must match a data provider layer
min_zoom = 12                       	# minimum zoom level to include this layer
max_zoom = 16                       	# maximum zoom level to include this layer
```

#### Default Tags

Map Layer Default Tags provide a convenient way to encode additional tags that are not supplied by a data provider. If a Default Tag is defined and the same tag is returned by the Provider, the Provider defined tag will take precedence.

Default Tags are `key = value` pairs.

**Example Map Layer Default Tags**

```toml
[maps.layers.default_tags]
class = "park"			# a default tag to encode into the feature
```


## Cache

This section configures caches for generated tiles. All cache configs have the following parameters:

| Param    | Required | Description                                                  |
|:---------|:---------|:-------------------------------------------------------------|
| type     | Yes      | The type of cache to use (`file`, `redis`, or `s3`)          |
| max_zoom | No       | The max zoom which should be cached.                         |

### File

Cache tiles in a directory on the local filesystem.

| Param    | Required | Description                                                  |
|:---------|:---------|:-------------------------------------------------------------|
| basepath | Yes      | A directory on the file system to write the cached tiles to. |

### Redis

Cache tiles in [Redis](https://redis.io/).

When no parameters are supplied, this cache will try and connect to a local Redis
instance with default configuration.

| Param    | Required | Default        | Description                                                  |
|:---------|:---------|:---------------|:-------------------------------------------------------------|
| network  | No       | `tcp`          | The type of connection (`tcp` or `unix`)                     |
| address  | No       | 127.0.0.1:6379 | The address of Redis in the form `ip:port`.                  |
| password | No       |                | Password to use when connecting.                             |
| db       | No       |                | Database to use (int).                                       |
| ssl      | No       | false          | Encrypt connection to the Redis server.                      |

### S3

Cache tiles in Amazon S3.

| Param    | Required | Default        | Description                                                         |
|:---------|:---------|:---------------|:--------------------------------------------------------------------|
| bucket   | Yes      |                | The name of the S3 bucket to use.                                   |
| basepath | No       |                | A path prefix added to all cache operations inside the S3 bucket |
| region   | No       | us-east-1      | The region the bucket is in.                                        |
| aws_access_key_id | No |             | The AWS access key id to use.                                       |
| aws_secret_access_key | No |         | The AWS secret access key to use.                                   |

If the `aws_access_key_id` and `aws_secret_access_key` are not set, then the
[credential provider chain](https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html)
will be used. The provider chain supports multiple methods for passing credentials, one of which is
through environment variables. For example:

```bash
$ export AWS_REGION=us-west-2
$ export AWS_ACCESS_KEY_ID=YOUR_AKID
$ export AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
```

## Env Var

Environmental variables can be used in any configuration option. However, they must be written within quotes as a string:

```toml
tile_buffer = "${TEGOLA_TILE_BUFFER}"     # note that tile buffer expects an integer, tegola will handle the conversion

[cache]
type = "redis"
password = "${SECRET_REDIS_PASSWORD}"
```

## Full Config Example

The following config demonstrates the various concepts discussed above:

```toml
tile_buffer = 64

[webserver]
port = ":9090"

[cache]
type="file"             # cache type
basepath="/tmp/tegola"  # cache specific config

# register data providers
[[providers]]
name = "test_postgis"   # provider name is referenced from map layers
type = "postgis"        # the type of data provider. currently only supports postgis
uri = "postgres://tegola:supersecret@localhost:5432/tegola?sslmode=prefer" # PostGIS connection string (required)
srid = 3857             # The default srid for this provider. If not provided it will be WebMercator (3857)

    # Example data
    [[providers.layers]]
    name = "landuse"                      # will be encoded as the layer name in the tile
    tablename = "gis.zoning_base_3857"    # sql or table_name are required
    geometry_fieldname = "geom"           # geom field. default is geom
    id_fieldname = "gid"                  # geom id field. default is gid
    srid = 4326                           # the SRID of the geometry field if different than

    [[providers.layers]]
    name = "roads"                         # will be encoded as the layer name in the tile
    tablename = "gis.zoning_base_3857"	   # sql or table_name are required
    geometry_fieldname = "geom"            # geom field. default is geom
    id_fieldname = "gid"                   # geom id field. default is gid
    fields = [ "class", "name" ]           # Additional fields to include in the select statement.

    [[providers.layers]]
    name = "rivers"                        # will be encoded as the layer name in the tile
    # Custom sql to be used for this layer.
    # Note that the geometry field is wrapped in a ST_AsBinary()
    sql = "SELECT gid, ST_AsBinary(geom) AS geom FROM gis.rivers WHERE geom && !BBOX!"

# maps are made up of layers
[[maps]]
name = "zoning"                             # used in the URL to reference this map (/maps/:map_name)
tile_buffer = 0                             # number of pixels to extend a tile's clipping area

    [[maps.layers]]
    provider_layer = "test_postgis.landuse" # must match a data provider layer
    min_zoom = 12                           # minimum zoom level to include this layer
    max_zoom = 16                           # maximum zoom level to include this layer

        [maps.layers.default_tags]          # table of default tags to encode in the tile. SQL statements will override
        class = "park"

    [[maps.layers]]
    provider_layer = "test_postgis.rivers"  # must match a data provider layer
    min_zoom = 10                           # minimum zoom level to include this layer
    max_zoom = 18                           # maximum zoom level to include this layer
```
