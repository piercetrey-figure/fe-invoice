# Provenance.io | Invoice Service

### Get Started:

1) Run `npm i`
2) Run `npm run start` to run a file watch + local server.
  - Note:
    - If it doesn't automatically, navigate to `http://localhost:3000/`

* At this point, any changes you make to files should kick off a rebuilt and be visible in the application

### Envoy Proxy
To run a local envoy proxy allowing for grpc-web interaction with your local node, run `./start_envoy.sh` from within the `envoy` directory (note: docker must be running)
