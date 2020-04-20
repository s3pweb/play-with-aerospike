# play-with-aerospike
Some simple Nodejs scripts to play with aerospike

# Lunch an aerospike container
docker run -d -e "NAMESPACE=test" -p 3000:3000 -p 3001:3001 -p 3002:3002 -p 3003:3003 aerospike/aerospike-server

# Before install aerospike node client : install library prerequisites
read this page -> https://www.aerospike.com/docs/client/nodejs/install/index.html

For ubuntu : sudo apt-get install libssl0.9.8 libssl-dev liblua5.1-dev

