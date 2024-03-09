
echo Updating...

docker compose stop

git pull

docker compose up -d --build

echo Update Complete