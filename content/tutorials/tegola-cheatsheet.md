---
author: "ear7h"
date: 2018-03-28
linktitle: Cache Manipulation With Expiry List
title: Cache Manipulation With Expiry List
weight: 2
subtitle: Managing expired tiles from a list
menu:
  main:
    parent: Tutorials
---


## Adding Tegola to your `PATH`

While the Tegola binary can be run in any directory, it's helpful to move it somewhere along your `$PATH` variable. This can be done with the following commands:

```shell
# make a directory for binaries in your home directory
$ mkdir ~/bin
$ mv tegola ~/bin
$ cd ~/bin
# this command appends your .bashrc so you can access binaries in the new directory
$ echo "export PATH=\"\$PATH:$(pwd)\"" >> ~/.bashrc
$ source ~/.bashrc # change this to '~/.zshrc' if you use zsh
```
