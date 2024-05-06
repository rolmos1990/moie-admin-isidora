FROM nginx:1.19.1-alpine
COPY ./build /var/www
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]

#docker build -t rolmos/moie-admin .
#docker run -d -p 80:80 rolmos/moie-admin
