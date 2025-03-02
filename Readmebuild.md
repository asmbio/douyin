```
protoc -I=src/protos/test/ --ts_out=src/api/static_codegen/ --grpc-web_out=import_style=typescript,mode=grpcwebtext:src/api/static_codegen/ user.proto 
```

```
protoc -I ./src/protos/test/ --plugin=./node_modules/.bin/protoc-gen-es.cmd --es_out ./src/api/static_codegen --es_opt target=ts user.proto

protoc -I . --es_out=src/gen --es_opt=target=ts --plugin=protoc-gen-es=./node_modules/.bin/protoc-gen-es proto/example.proto

npx buf generate
```