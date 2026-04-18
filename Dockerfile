FROM nginx:alpine
COPY . /usr/share/nginx/html


# If code change so delete container and build again 
# docker rm -f tasky-container
# docker build -t tasky-app .
# docker run -d -p 8080:80 --name tasky-container tasky-app