FROM golang:1.19-alpine AS builder
ENV CGO_ENABLED=0
WORKDIR /backend
COPY backend/go.* .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go mod download
COPY backend/. .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -trimpath -ldflags="-s -w" -o bin/service

FROM --platform=$BUILDPLATFORM node:18.12-alpine3.16 AS client-builder
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
LABEL org.opencontainers.image.title="Keploy" \
    org.opencontainers.image.description="Developer-centric API testing tool that creates backend tests along with built-in-mocks, faster than unit tests." \
    org.opencontainers.image.vendor="Keploy" \
    com.docker.desktop.extension.api.version=">= 0.3.4" \
    com.docker.desktop.extension.icon="https://avatars.githubusercontent.com/u/92252339?s=64&v=4" \
    com.docker.extension.screenshots="[ \
        {\"alt\": \"Welcome page - light\", \"url\": \"https://raw.githubusercontent.com/Yaxhveer/keploy-docker-extension/main/images/welcome-light.png\"}, \
        {\"alt\": \"Welcome page - dark\", \"url\": \"https://raw.githubusercontent.com/Yaxhveer/keploy-docker-extension/main/images/welcome-dark.png\"}, \
        {\"alt\": \"Record page - light\", \"url\": \"https://raw.githubusercontent.com/Yaxhveer/keploy-docker-extension/main/images/record-light.png\"}, \
        {\"alt\": \"Record page - dark\", \"url\": \"https://raw.githubusercontent.com/Yaxhveer/keploy-docker-extension/main/images/record-dark.png\"}, \
        {\"alt\": \"Test page - light\", \"url\": \"https://raw.githubusercontent.com/Yaxhveer/keploy-docker-extension/main/images/test-light.png\"}, \
        {\"alt\": \"Test page - dark\", \"url\": \"https://raw.githubusercontent.com/Yaxhveer/keploy-docker-extension/main/images/test-dark.png\"} \
    ]" \
    com.docker.extension.detailed-description="<p>Keploy record API calls and replays them during testing, making it easy to use, powerful, and extensible.</p> \
        <h2 id="-features">✨ Here are Keploy's core features</h2> \
        <ul> \
        <li>Combined Test Coverage: Merge your Keploy Tests with your fave testing libraries(JUnit, go-test, py-test, jest) to see a combined test coverage.</li> \
        <li>EBPF Instrumentation: Keploy uses EBPF like a secret sauce to make integration code-less, language-agnostic, and oh-so-lightweight.</li> \
        <li>CI/CD Integration: Run tests with mocks anywhere you like—locally on the CLI, in your CI pipeline (Jenkins, Github Actions..) , or even across a Kubernetes cluster</li> \
        <li>Record-Replay Complex Flows: Keploy can record and replay complex, distributed API flows as mocks and stubs. It's like having a time machine for your tests—saving you tons of time!</li> \
        <li>Multi-Purpose Mocks: You can also use keploy Mocks, as server Tests!</li> \
        </ul> \
    " \
    com.docker.extension.publisher-url="https://keploy.io/" \
    com.docker.extension.additional-urls="[{\"title\":\"Getting started\",\"url\":\"https://keploy.io/docs/keploy-explained/introduction\"},{\"title\":\"Source code\",\"url\":\"https://github.com/Yaxhveer/keploy-docker-extension\"}]" \
    com.docker.extension.changelog="<ul>\
    <li>Version 1.0.0</li> \
    </ul>" \
    com.docker.extension.categories="1.0.0"


COPY --from=builder /backend/bin/service /

COPY --chmod=0777 binaries/keploy.sh /host/keploy.sh
COPY --chmod=0777 binaries/keploy.cmd /host/keploy.cmd
COPY docker-compose.yaml .
COPY metadata.json .
COPY logo.svg .
COPY --from=client-builder /ui/build ui

CMD /service -socket /run/guest-services/docker.sock