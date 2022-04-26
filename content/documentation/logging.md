---
author: "iwpnd"
date: 2022-04-25
linktitle: Logging
title: Logging in Tegola
weight: 6
subtitle: Managing logging output in Tegola
menu:
  main:
    parent: Documentation
---

## Log Levels

In decreasing order of severity. Logs below the set level will be ignored.

- `FATAL` - only log events that prevent the program from continuing i.e. can't allocate additional memory 
- `ERROR` - only log event that prevent a valid execution, i.e. can't connect to a database
- `WARN` - only log event that are unusual but don't prevent a valid execution, i.e. deprecation warnings
- `INFO` - (default) least severe, helpful for debugging bot not too verbose
- `DEBUG` - log high level info for developers, verbose
- `TRACE` - very verbose

### Set Log Levels

Log levels can be set on start up

```bash
/opt/tegola serve --log-level INFO

```


