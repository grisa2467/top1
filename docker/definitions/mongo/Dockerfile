FROM mongo:3.0.7

ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY mongod.conf /etc/mongod.conf

EXPOSE 27017
CMD ["mongod",  "-f", "/etc/mongod.conf", "--port", "27017"]
