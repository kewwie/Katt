FROM nginx:latest

# Set values for conf file
ARG DEV_DOMAIN=localhost
ARG DEV_PORT=80

# Copy the custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf
RUN sed -ir "s/{DEV_DOMAIN}/${DEV_DOMAIN}/g" /etc/nginx/nginx.conf
RUN sed -ir "s/{DEV_PORT}/${DEV_PORT}/g" /etc/nginx/nginx.conf