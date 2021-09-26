echo "Starting deploy"

echo "- Executing command: sh fetch.sh"
sh fetch.sh

echo "- Executing command: sudo systemctl start docker"
sudo systemctl start docker

echo "- Executing command: sudo docker-compose down"
sudo docker-compose down

echo "- Executing command: sudo docker-compose up --build --detach"
sudo docker-compose up --build --detach

echo "Successfully finished deploy"