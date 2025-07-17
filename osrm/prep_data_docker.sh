#!/bin/bash
carte=rhone-alpes

sudo mkdir ./data

#recuperer map
sudo wget -P ./data http://download.geofabrik.de/europe/france/$carte-latest.osm.pbf

sudo docker run -t -v "$PWD/data:/data" osrm/osrm-backend osrm-extract -p /opt/car.lua /data/$carte-latest.osm.pbf

sudo docker run -t -v "$PWD/data:/data" osrm/osrm-backend osrm-partition /data/$carte-latest.osrm

sudo docker run -t -v "$PWD/data:/data" osrm/osrm-backend osrm-customize /data/$carte-latest.osrm

sudo docker run -t -i -p 5000:5000 -v "$PWD/data:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/$carte-latest.osrm

#exemple de commadne pour un trajet : curl "http://localhost:5000/route/v1/driving/45.4369566878477,4.385278639219288;45.4369566878477,4.385278639219288?steps=true"