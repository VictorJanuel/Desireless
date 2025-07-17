#!/bin/bash
sudo ./osrm/prepare_osrm.sh

sudo docker compose up --build -d
