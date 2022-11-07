# Dive In

A Docker extension that helps you explore a docker image, layer contents, and discover ways to shrink the size of your Docker/OCI image.

Built on the top of excellent CLI tool - https://github.com/wagoodman/dive

![i1](screenshots/1.png)
![i2](screenshots/2.png)

## Installation

Make sure your Docker desktop supports extensions. Currently, this extension is not yet available on the marketplace so the best way to try it out to is to build and install it locally.

```
$ git clone https://github.com/prakhar1989/dive-in.git
$ cd dive-in
$ make build-extension
$ make install-extension
```

## Development

Go through [the official docs](https://docs.docker.com/desktop/extensions-sdk/quickstart/) to understand the basic setting up of the Docker extension.
