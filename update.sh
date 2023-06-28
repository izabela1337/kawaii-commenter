docker build -t kawaii-commenter .
docker stop kawaii-commenter
docker rm kawaii-commenter
docker run -d --name kawaii-commenter -p 3000:3000 -v $(pwd)/.env:/usr/src/app/.env kawaii-commenter
