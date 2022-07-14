[![Frontend](https://github.com/tomgroenwoldt/3d-typer/actions/workflows/frontend.yml/badge.svg?branch=main)](https://github.com/tomgroenwoldt/3d-typer/actions/workflows/frontend.yml)
[![Backend](https://github.com/tomgroenwoldt/3d-typer/actions/workflows/backend.yml/badge.svg)](https://github.com/tomgroenwoldt/3d-typer/actions/workflows/backend.yml)

# 3d-typer

This project aims to be a racing game for typists.

### Toolchain

##### Frontend

The frontend should utilize [three.js](https://threejs.org/)
inside the [React](https://reactjs.org/) framework.

##### Backend

The backend consists of a simple HTTP server built with [Rocket](https://rocket.rs/). In the near future a
relational database will be added to the stack.

##### Development Setup

###### Local Certificate

Install `mkcert`. Run `mkcert -install` and `mkcert localhost 127.0.0.1 ::1`. Afterwards
copy certificate and key into the `backend/cert/` directory.
