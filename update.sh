docker stop kewwieapp
docker rm kewwieapp

git pull

docker build -t kewwieapp .
docker run kewwieapp
