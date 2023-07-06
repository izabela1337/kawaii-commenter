# kawaii-commenter

> A GitHub App built with [Probot](https://github.com/probot/probot) that Very important app. You need to use it. Trust me bro.

## Setup

#### Prerequisites
- Github app created
- Account for chatgpt and getimg, along with API keys
- Server to recive webhooks (for local development smee.io can be used)
- .env file created with correct api keys etc. (see .env.example for reference)

```sh

# Install dependencies
npm install

# Run the bot
npm start
```

## Docker + nginx
Nginx needs to be installed and configured to proxy trafic from port 3000.
Also serving `/srv/kawaii-commenter/pictures` as pictures generated will be placed there.
Example nginx config made with certbot (recommended):
```
  server {
  server_name kawaii-commenter.nordvik2077.xyz;
        # root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {


        proxy_pass http://127.0.0.1:3000$request_uri;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header X-Forwarded-Scheme $scheme;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Accept-Encoding "";
        proxy_set_header Host $host;

        client_body_buffer_size 512k;
        proxy_read_timeout 86400s;
        client_max_body_size 0;

        # Websocket
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection $connection_upgrade;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }

        location /pictures/ {
          autoindex on;
          root /srv/kawaii-commenter/;
        }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/kawaii-commenter.nordvik2077.xyz/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/kawaii-commenter.nordvik2077.xyz/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot




  }

  server {
    if ($host = kawaii-commenter.nordvik2077.xyz) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


  server_name kawaii-commenter.nordvik2077.xyz;
    listen 80;
    return 404; # managed by Certbot


  }
```
Next, update.sh script can be run. (It also updates exising containter!)

```sh
bash update.sh #you need to have .env in working directory
```

## Contributing

If you have suggestions for how kawaii-commenter could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2023 izabela1337
