---
author: "ear7h"
date: 2018-03-26
linktitle: Cache Seeding and Purging
title: Cache Seeding and Purging
weight: 4
subtitle: Using the cache command to seed and purge the cache
menu:
  main:
    parent: Documentation
---

## Overview
* [Seeding](#seeding): Seeding the cache with specified tiles
* [Purging](#purging): Purging specified tiles from the cache
* [Flags](#flags): Specifying tiles is done through flags
  - [Bounds](#bounds): Tiles within a longitude and latitude
  - [Slippy](#slippy): Single tile with a [slippy tile](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames) name
  - [File](#file): Specify a file list of tiles
  - [Tile Name Format](#tile-name-format): Specify a name format for reading slippy tiles
  - [Other](#other): Flags not for specifying tiles

* Examples
  - [Simple seed](#seed1)
  - [Simple purge](#purge1)
  - [Bounds](#bounds1)
  - [Tile name format](#tile-name-format1)
  - [Tile name format](#tile-name-format2)
  - [Simple tile list](#tile-list1)
  - [Non-default format tile list](#tile-list2)

**Note:** The `tile-list` methods of fetching tiles is inefficient and will regenerate lower zoom tiles repeatedly.

## Seeding

The `seed` subcommand is used to cache tiles on demand.

Note: the Tegola server does not need to be running for this command to execute. However, your caching backend does.

<a name="seed1">Example: Simple seed</a>
```shell
$ ./tegola cache seed --config="bonn.toml" --tile-name="0/0/0" --overwrite
```
This command will seed the only tile at zoom 0, based on the layers specified in the `bonn.toml` configuration file. The `--overwrite` ensures the previously cached tile gets overwritten.

## Purging

The `purge` command is used to remove tiles from the cache. This can be used to remove outdated data, as Tegola prioritizes the cache.

<a name="purge1">Example: Simple purge</a>
```shell
$ ./tegola cache purge --tile-name="0/0/0" --config="bonn.toml"
```
This command will purge the only tile at zoom 0, based on the layers specified in the `bonn.toml` configuration file.

## Flags
Running `./tegola cache -h` will give a list of the flags with descriptions and defaults

```
Flags:
      --bounds string             lat / long bounds to seed the cache with in the format: minx, miny, maxx, maxy (default "-180,-85.0511,180,85.0511")
      --concurrency int           number of workers to use, defaults to the number of CPUs  (default 4)
  -h, --help                      help for cache
      --map string                map name as defined in the config
      --max-zoom int              max zoom to seed cache to (default -1)
      --min-zoom int              min zoom to seed cache from (default -1)
      --overwrite                 overwrite the cache if a tile already exists
      --tile-list string          path to a file with tile entries separated by newlines and formatted according to tile-name-format
      --tile-name string          operate on a single tile formatted according to tile-name-format
      --tile-name-format string   4 character string where the first character is a non-numeric delimiter followed by "z", "x" and "y" defining the coordinate order (default "/zxy")
```

### Bounds

The `bounds` flag is used to specify latitude and longitude bounds for seeding and purging. Using this command should be used along with the `max-zoom` and `min-zoom` flags.

<a name="bounds1">Example: Bounds</a>
```shell
$ ./tegola cache seed --bounds="-180,-85.0511,180,85.0511" --maxzoom=1
```
This will seed the cache with all the tiles in zooms 0 and 1.

### Slippy

The `tile-name` and `tile-name-format` are used to specify tiles according to the slippy tile scheme. The `tile-name` takes in the tile name with the default format `z/x/y`. See also [tile name format](#tile-name-format).

### Tile-Name-Format

The `tile-name-format` allows this format to be changed. It takes a length-four string, the firs character is the delimiter and the last three characters have to be "x", "y", and "z" in the desired order. For example, the format definition for `z/x/y` is `/zxy`. This flag can be used in conjunction with `file` and  `tile-name` flags.

<a name="tile-name-format1">Example: Tile name format</a>
```shell
$ ./tegola cache seed --tile-name="0-0-18" --tile-name-format="-xyz"
```
In this example the `0-0-18` will be interpreted as `(z:18, x:0, y:0)`

<a name="tile-name-format2">Example: Tile name format</a>
```shell
$ ./tegola cache seed --tile-name="18 0 0" --tile-name-format=" zxy"
```
In this example the `18 0 0` will be interpreted as `(z:18, x:0, y:0)`

### Tile-List

The `tile-list` flag instructs Tegola to read tile names from a file. The file is expected to have one tile per line, and fomatted according to the [`tile-name-format`](#tile-name-format) flag.


<a name="tile-list1">Example: Simple file list</a>
`expired_tiles.txt` (with `/zxy` format):
```
15/0/0
15/0/1
15/1/1
```

```shell
$ ./tegola cache seed --tile-list="expired_tiles.txt" --overwrite
```
This will read the `expired_tiles.txt` and seed the cache with the exact files in the list.

<a name="tile-list1">Example: Non-default format tile list</a>
`expired_tiles.txt` (with `-xyz` format):
```
0-0-15
0-1-15
1-1-15
```

```shell
$ ./tegola cache seed --tile-name-format="-xyz" --tile-list="expired_tiles.txt" --overwrite
```
This will do the same as the [above example](#tile-list1) but using a different format.

### Other

* `concurrency` int: number of workers to will run concurrently
* `map` string: map name as defined in the config
* `max-zoom` int: max zoom to seed cache to. The default value is `-1` which will attempt to imply the zoom
* `min-zoom` int: min zoom to seed cache from. The default value is `-1` which will attempt to imply the zoom
* `overwrite` string: overwrite the cache if a tile already exists
