#!/bin/bash

set -e  # Arrête le script en cas d'erreur
carte="rhone-alpes"
carte_file="$carte-latest"
pbf_file="./osrm/data/$carte_file.osm.pbf"
osrm_file="./osrm/data/$carte_file.osrm"

mkdir -p ./osrm/data

# 1. Télécharger la carte si elle n’existe pas
if [ ! -f "$pbf_file" ]; then
  echo "Téléchargement de la carte..."
  wget -P "$PWD/osrm/data" http://download.geofabrik.de/europe/france/$carte_file.osm.pbf
else
  echo "Carte déjà présente, téléchargement ignoré."
fi

# 2. osrm-extract
if [ ! -f "$osrm_file" ]; then
  echo "Extraction OSRM..."
  docker run --rm -v "$PWD/osrm/data:/data" osrm/osrm-backend osrm-extract -p /opt/car.lua /data/$carte_file.osm.pbf
else
  echo "Fichier OSRM déjà extrait."
fi

# 3. osrm-partition
if [ ! -f "./osrm/data/$carte_file.osrm.partition" ]; then
  echo "Partition OSRM..."
  docker run --rm -v "$PWD/osrm/data:/data" osrm/osrm-backend osrm-partition /data/$carte_file.osrm
else
  echo "Partition déjà effectuée."
fi

# 4. osrm-customize
if [ ! -f "./osrm/data/$carte_file.osrm.cells" ] && [ ! -f "./osrm/data/$carte_file.osrm.datasource_names" ]; then
  echo "Customisation OSRM..."
  docker run --rm -v "$PWD/osrm/data:/data" osrm/osrm-backend osrm-customize /data/$carte_file.osrm
else
  echo "Customisation déjà effectuée."
fi

echo "Préparation OSRM terminée."


#exemple de commadne pour un trajet : curl "http://localhost:5000/route/v1/driving/45.4369566878477,4.385278639219288;45.4369566878477,4.385278639219288?steps=true"