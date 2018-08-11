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

## `systemd`

This method is the native solution for linux systems. Firstly it requires the [bash wrapper](#cache-seed-bash-wrapper) provided later in this page.

`/usr/systemd/system/tegola-diffs.service`:
```apache
[Unit]
Description=Service for updating tegola's cache via diffs

[Service]
ExecStart=/path/to/script/seed-by-diffs.sh

[Path]
PathChanged=/path/to/diffs/diff-directory/
```

## Cache Seed Bash Wrapper
`seed-by-diffs.sh`:
```bash
#!/bin/bash
diff_dir="/path/to/diffs/diff-directory/"
# this will be essentially treated as a pidfile
queued_jobs="./in_progress.list"
# output of seeded
completed_jobs="./completed.list"
# a directory to place the worked expiry lists
# THIS MUST BE OUTSIDE OF $diff_dir
completed_dir=$diff_dir"/../purged"

# assert no other jobs are running
if [[ -f $queued_jobs ]]; then
  echo "$queued_jobs exists, is another seed process running?"
  exit
else
  touch $queued_jobs
  if [[ ! $? ]]; then
    rm $queued_jobs
    exit
  fi
fi

# en existance of completed directory
if [[ ! -d $completed_dir ]]; then
  echo "$completed_dir directory not found"
  echo "mkdir $completed_dir"
  mkdir $completed_dir
fi

# files newer than this amount of seconds will
# not be used for this job
imp_time=10
imp_list=`find $diff_dir -type f -mtime +$(echo $imp_time)s`

for f in $imp_list; do
  echo "$f" >> $queued_jobs
done

for f in $imp_list; do
  tegola cache seed --config="config.toml" --tile-list="$(echo $f)" --tile-name-format="/zxy" --min-zoom=4 --max-zoom=14 --tile-name-format="/zxy" --overwrite
  if [[ "$?" != "0" ]]; then
    #error
    echo "error, stopping"
    rm $queued_jobs
    exit
  fi

  echo "$f" >> $completed_jobs
  mv $f $completed_dir
done

rm $queued_jobs

```
