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
# Overview
The cache command manually manipulates Tegola's cache

**Examples**

- [Simple seed](#seed1)
- [Simple purge](#purge1)
- [tile_name](#seed_tile_name)
- [Simple tile list](#tile-list1)
- [Tile name format](#tile-name-format1)

**Note:** The `tile-list` methods of fetching tiles is inefficient and will regenerate lower zoom tiles repeatedly.

### Global Flags

Global Flags are valid for all subcommands

Running `./tegola cache -h` will give a lost of flags with descriptions:

```text
Available Commands:
  seed        seed tiles to the cache
  purge       purge tiles from the cache

Flags:
  -h, --help   help for cache
Global Flags:
      --config string   path to config file (default "config.toml")
```


## Seeding/Purging

These subcommands are used to manipulate Tegola's cache.

#### Flags

```text
Available Commands:
  tile-list   operate on a list of tile names separated by new lines
  tile-name   operate on a single tile formatted according to --format

Flags:
      --bounds string     lng/lat bounds to seed the cache with in the format: lng, lat, lng, lat (default "-180,-85.0511,180,85.0511")
      --concurrency int   the amount of concurrency to use. defaults to the number of CPUs on the machine (default 8)
  -h, --help              help for seed
      --map string        map name as defined in the config
      --max-zoom uint     max zoom to seed cache to (default 22)
      --min-zoom uint     min zoom to seed cache from
      --overwrite         overwrite the cache if a tile already exists (default false)
```

* bounds -- The `bounds` flag is used to specify latitude and longitude bounds for seeding and purging. Using this command should be used along with the `max-zoom` and `min-zoom` flags.
* max-zoom -- max zoom to seed the cache, will default to 22. 
* min-zoom -- min zoom to seed the cache, will default to 0.


[Global Flags](#global-flags)


### cache seed

The `seed` subcommand is used to cache tiles on demand.

Note: the Tegola server does not need to be running for this command to execute. However, your caching backend does.

##### Example

<a name="seed1">Example: Simple seed</a>
```shell
$ ./tegola cache seed --bounds "-117.25,32.5,-117.0,32.75"
```
This command will seed the only tile at zoom 0, based on the layers specified in the `bonn.toml` configuration file. The `--overwrite` ensures the previously cached tile gets overwritten.

### cache purge

The `purge` command is used to remove tiles from the cache. This can be used to remove outdated data, as Tegola prioritizes the cache.

##### Example

<a name="purge1">Example: Simple purge</a>
```shell
$ ./tegola cache purge --bounds "-117.25,32.5,-117.0,32.75"
```
This command will purge the only tile at zoom 0, based on the layers specified in the `bonn.toml` configuration file.


### cache [seed|purge] tile-name

The `tile-name` command and `format` flag are used to specify tiles according to the slippy tile scheme. The `tile-name` command takes in the tile described by the format.


##### Flags

```
Flags:
      --format string   4 character string where the first character is a non-numeric delimiter followed by 'z', 'x' and 'y' defining the coordinate order (default "/zxy")
  -h, --help            help for tile-name
      --max-zoom uint   max zoom to seed cache to
      --min-zoom uint   min zoom to seed cache from
```

* min-zoom -- If specified; Tegola will generate a range of tiles (from min-zoom to max-zoom (defaults to 22)) for each tile listed in the file.
* max-zoom -- If specified; Tegola will generate a range of tiles (from min-zoom (defaults to 0) to max-zoom) for each tile listed in the file.
* format -- 4 characters string defining the tile format. See: [tile_format](#tile-name-format).

[Global Flags](#global-flags)


##### Example
<a name="seed_tile_name">Example: Simple seed tile-name</a>
```shell
$ ./tegola cache seed tile-name 0/0/0
```


### cache [seed|purge] tile-list

The `tile-list` command instructs Tegola to read tile names from a file. The file is expected to have one tile per line, where each tile is formatted according to the format flag.

##### Flags

```
Flags:
      --format string   4 character string where the first character is a non-numeric delimiter followed by 'z', 'x' and 'y' defining the coordinate order (default "/zxy")
  -h, --help            help for tile-list
      --max-zoom uint   max zoom to seed cache to
      --min-zoom uint   min zoom to seed cache from
```

* min-zoom -- If specified; Tegola will generate a range of tiles (from min-zoom to max-zoom (defaults to 22)) for each tile listed in the file.
* max-zoom -- If specified; Tegola will generate a range of tiles (from min-zoom (defaults to 0) to max-zoom) for each tile listed in the file.
* format -- 4 characters string defining the tile format. See: [tile_format](#tile-name-format).

[Global Flags](#global-flags)

##### Example

<a name="tile-list1">Example: Simple file list</a>
`expired_tiles.txt` (with `/zxy` format):
```
15/0/0
15/0/1
15/1/1
```

```shell
$ ./tegola cache seed tile-list expired_tiles.txt
```
This will read the `expired_tiles.txt` and seed the cache with the exact tiles as listed in the file.

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

<a name="tile-list1">Example: Simple file list with zooms</a>
`expired_tiles.txt` (with `/zxy` format):
```
15/0/0
```

```shell
$ ./tegola cache seed tile-list expired_tiles.txt --min-zoom=14
```
This will read the `expired_tiles.txt` and seed the cache with tiles ranging from zoom level from 14-22 that are above and below the 15/0/0 tile.


### Tile-Name-Format

The `format` allows the slippy tile format to be changed. The flag takes a string of length four, where the first character is the delimiter and the following three characters have to be "x", "y", and "z" in the desired order. For example, the definition for `z/x/y` is `/zxy`. 

<a name="tile-name-format1">Example: Tile name format</a>
```shell
$ ./tegola cache seed tile-name "0-0-18" --format="-xyz"
```
In this example the `0-0-18` will be interpreted as `(z:18, x:0, y:0)`

<a name="tile-name-format2">Example: Tile name format</a>
```shell
$ ./tegola cache seed tile-name "18 0 0" --format=" zxy"
```
In this example the `18 0 0` will be interpreted as `(z:18, x:0, y:0)`

### Global Flags

Global Flags are valid for all subcommands

* concurrency -- the amount of concurrency to use.
* config -- path to config file (default “config.toml”)
* map -- the name of the map to use from the config file 
* overwrite -- if the tile already exists overwrite it.
