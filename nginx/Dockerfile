FROM nginx:latest

# Set values for conf file
ARG DOMAIN
ARG PORT

RUN apt-get update && apt-get install -y openssl

RUN openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout /etc/ssl/kewi-cert.key -out /etc/ssl/kewi-cert.crt -subj "/CN=${DOMAIN}" 

# Copy the custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf
RUN sed -ir "s/{DOMAIN}/${DOMAIN}/g" /etc/nginx/nginx.conf
RUN sed -ir "s/{PORT}/${PORT}/g" /etc/nginx/nginx.conf