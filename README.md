# Argentum

Argentum is a cashless cash register web application. The cash register system is intended to be used alongside cheap USB RFID card scanners and everyday handheld devices such as tablets and phones.

This is a private hobby project and not certified, nor intended for commercial use.

This project is licensed under the terms of the MIT license

# Setup

This project requires Python 3.6+, Node.js 12+, Docker, and Docker Compose. Please refer to their respective installation instructions:
- [Python 3](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)
- [Node.js](https://github.com/nodesource/distributions/blob/master/README.md)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

# Build

1. Follow the development setup instructions for [argentum-ui](argentum-ui/README.md). Note that `argentum-api` does not require a specific setup procedure.

1. Build the frontend application `argentum-ui` using `ng build --aot --prod`. Make sure you are using the Angular binary `ng` installed in your `argentum-ui/node_modules/.bin`.

1. Copy your certificate files `cert.pem`, `chain.pem`, `fullchain.pem`, and `privkey.pem` to `production/certs`.

1. Copy `docker/default.env` to `.env` and fill in the variables:

    - `POSTGRES_PASSWORD`: The password for the postgres database user `postgres`. The database is exposed via port `5432`.
    - `DJANGO_KEY`: The [Django secret key](https://docs.djangoproject.com/en/dev/ref/settings/#secret-key).
    - `API_REMOTE_TAG`: (optional) A remote Docker repository URL when using `docker push` to upload the `argentum-api` docker image to a remote server (e.g. AWS ECR).
    - `UI_REMOTE_TAG`: (optional) Remote Docker repository URL for `argentum-ui`.

1. Change directory to `docker` and run `docker-compose build`.

# Run

1. Change to the `docker` directory and run `docker-compose up`.

# Build for ARM32v7 (Raspberry Pi 3) on an x86 host

1. Change to the `docker-arm32v7` directory and run `./get-qemu.sh` to download the QEMU ARM emulator.

1. Register QEMU with Docker: `docker run --rm --privileged multiarch/qemu-user-static:register`

1. Follow the regular build instructions but use the `docker-arm32v7` directory instead of the `docker` directory.

Note: this may take a lot longer than a regular host architecture build.

# Build on ARM32v7

1. Change to the `docker-arm32v7` directory and create a dummy QEMU file: `touch qemu-arm-static`.

1. Follow the regular build instructions but use the `docker-arm32v7` directory instead of the `docker` directory.

# Build with a Docker container registry.

1. Follow the regular build instructions for your target platform.

1. Make sure your images are tagged correctly for your remote repository using `docker images`.

1. Push your two Docker images using `docker push <remote-tag>`

# Run using a Docker container registry.

1. Install Docker and Docker Compose.

1. Change to `production/docker` and copy `default.env` to `.env`.

1. Fill out `.env` according to the variable documentation above.

1. Run `docker-compose up`.
