echo "Starting deploy"

echo "- Executing command: sh fetch.sh"
sh scripts/fetch.sh

echo "- Executing command: sudo systemctl start docker"
sudo systemctl start docker

echo "- Executing command: sudo npm start"
sudo npm start

echo "Successfully finished deploy"