sudo mkdir ./data

#recuperer map
sudo wget -P ./data http://download.geofabrik.de/europe/france/rhone-alpes-latest.osm.pbf

sudo docker run -t -v "$PWD/data:/data" osrm/osrm-backend osrm-extract -p /opt/car.lua /data/rhone-alpes-latest.osm.pbf

sudo docker run -t -v "$PWD/data:/data" osrm/osrm-backend osrm-partition /data/rhone-alpes-latest.osrm

sudo docker run -t -v "$PWD/data:/data" osrm/osrm-backend osrm-customize /data/rhone-alpes-latest.osrm

sudo docker run -t -i -p 5000:5000 -v "$PWD/data:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/rhone-alpes-latest.osrm

#exemple de commadne pour un trajet : curl "http://localhost:5000/route/v1/driving/45.4369566878477,4.385278639219288;45.4369566878477,4.385278639219288?steps=true"