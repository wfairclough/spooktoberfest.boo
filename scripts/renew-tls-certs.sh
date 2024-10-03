#!/bin/bash


sudo docker run -it --rm --name certbot-spook \
            -v "./etc/letsencrypt:/etc/letsencrypt" \
            -v "./var/lib/letsencrypt:/var/lib/letsencrypt" \
            certbot/certbot certonly


