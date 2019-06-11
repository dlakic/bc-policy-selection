FROM mongo:4.0

#Copy the dump
COPY db-dump/ /dump/

CMD mongod --fork --logpath /var/log/mongodb.log; \
    mongorestore --nsInclude policy-framework.*; \
    mongod --shutdown; \
    docker-entrypoint.sh mongod