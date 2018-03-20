---
author: "Jpalms"
date: 2017-11-29
linktitle: Debugging
title: Debugging Tegola
weight: 5
subtitle: Fixing problems in Tegola
menu:
  main:
    parent: Documentation
---

## Environment Variables

The following environment variables can be used for debugging the tegola server:

`SQL_DEBUG`: specify the type of SQL debug information to output. Supports the following values:

- `LAYER_SQL`: print layer SQL as they're parsed from the config file.
- `EXECUTE_SQL`: print SQL that is executed for each tile request and the number of items it returns or an error.
- `LAYER_SQL:EXECUTE_SQL`: print `LAYER_SQL` and `EXECUTE_SQL`.

**Example**

```bash
$ SQL_DEBUG=LAYER_SQL tegola --config=/path/to/conf.toml
```

## Client side

When debugging client side, it's often helpful to to see an outline of a tile along with it's Z/X/Y values. To encode a debug layer into every tile add the query string variable debug=true to the URL template being used to request tiles. For example:

```
http://localhost:8080/maps/mymap/{z}/{x}/{y}.vector.pbf?debug=true
```

The requested tile will be encoded with an additional layer with the name value set to debug and include two features:

- `debug_outline`: a line feature that traces the border of the tile
- `debug_text`: a point feature in the middle of the tile with the following tags:
- `zxy`: a string with the Z, X and Y values formatted as: Z:0, X:0, Y:0