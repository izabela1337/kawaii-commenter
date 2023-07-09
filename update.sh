name=kawaii-commenter

docker build -t ${name} .
result=$(docker ps -q -f name=${name})

if [[ -n "$result" ]]; then
  docker stop ${name}
  docker rm ${name}
fi

docker run -d --name ${name} -p 3000:3000 -v $(pwd)/.env:/usr/src/app/.env -v /srv/${name}/pictures:/pictures ${name}
