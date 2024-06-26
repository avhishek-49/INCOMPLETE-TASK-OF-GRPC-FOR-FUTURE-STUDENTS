'use strict';
/*
 *@server grpc-node-server
 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});
console.log(path.resolve(process.cwd(), '.env'));
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const { dbHelper } = require('./helpers');
const packageDefinition = protoLoader.loadSync('./proto/simple_crud.rpc.proto', {
  keepCase: true,
  longs: 'string',
  defaults: true,
});
const server = new grpc.Server();
const simpleProto = grpc.loadPackageDefinition(packageDefinition);
// Grpc Methods
const simpleServiceCtl = require('./modules/simple_crud');
server.addService(simpleProto.example.simple_crud.rpc.SimpleCrudService.service, {
  create: simpleServiceCtl.create,
  update:simpleServiceCtl.update

});


server.bindAsync(
  `${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(`Server bind failed: ${err}`);
    } else {
      console.log(`Server listening on ${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`);
      // Start the server once it's bound
      server.start();
      if (server.started) {
        dbHelper.init();
        console.log(`listening to port ${process.env.GRPC_PORT}, host ${process.env.GRPC_HOST}, date: ${new Date()}`);
      }
      
    }
  });



