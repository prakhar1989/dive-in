FROM golang:1.19-alpine AS builder
ENV CGO_ENABLED=0
WORKDIR /backend
COPY vm/go.* .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go mod download
COPY vm/. .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -trimpath -ldflags="-s -w" -o bin/service

FROM --platform=$BUILDPLATFORM node:18.9-alpine3.15 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
LABEL org.opencontainers.image.title="Dive" \
    org.opencontainers.image.description="Use Dive to  exploring a docker image, layer contents, and discovering ways to shrink the size of your Docker/OCI image" \
    org.opencontainers.image.vendor="Docker Inc." \
    com.docker.desktop.extension.api.version="0.3.0" \
    com.docker.extension.screenshots='[{"alt":"main page", "url":"https://github.com/prakhar1989/dive-in/blob/main/screenshots/1.png?raw=true"}, {"alt":"start containers", "url":"https://github.com/prakhar1989/dive-in/blob/main/screenshots/2.png?raw=true"}]' \
    com.docker.extension.detailed-description="<p><h1>Dive In</h1>A Docker extension that helps you explore a docker image, layer contents, and discover ways to shrink the size of your Docker/OCI image.</p>" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/prakhar1989/dive-in/main/scuba.svg" \
    com.docker.extension.publisher-url="https://prakhar.me" \
    com.docker.extension.categories="utility-tools" \
    com.docker.extension.additional-urls='[{"title":"Documentation","url":"https://github.com/prakhar1989/dive-in"}]' \
    com.docker.extension.changelog="First version"

COPY --from=builder /backend/bin/service /
COPY docker-compose.yaml .
COPY metadata.json .
COPY docker.svg .
COPY scuba.svg .
COPY --from=client-builder /ui/build ui
CMD /service -socket /run/guest-services/extension-dive-in.sock
