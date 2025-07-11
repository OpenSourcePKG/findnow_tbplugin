FROM golang:1.14-buster AS easy-novnc-build

WORKDIR /src

RUN go mod init build && \
    go get github.com/geek1011/easy-novnc@v1.1.0 && \
    go build -o /bin/easy-novnc github.com/geek1011/easy-novnc

FROM debian:11

ARG TB_VERSION="140.0b3"
ARG TB_TAR_FILE="thunderbird-$TB_VERSION.tar.xz"
ARG TB_URL="https://download-installer.cdn.mozilla.net/pub/thunderbird/releases/$TB_VERSION/linux-x86_64/de/$TB_TAR_FILE"

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openbox tigervnc-standalone-server supervisor gosu && \
    rm -rf /var/lib/apt/lists && \
    mkdir -p /usr/share/desktop-directories

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends lxterminal nano wget openssh-client \
    rsync ca-certificates xdg-utils htop tar xzip gzip bzip2 zip unzip && \
    rm -rf /var/lib/apt/lists

RUN apt-get update -y && \
    apt-get install -y thunderbird && \
    rm -rf /var/lib/apt/lists

RUN apt-get update && apt-get upgrade -y --fix-missing
RUN apt-get install apt-utils -y
RUN apt-get -y install wget bzip2 xz-utils pwgen && \
    rm -rf /var/lib/apt/lists

RUN apt-get update && apt-get upgrade -y --fix-missing
RUN apt-get install libasound2 -y

RUN cd /opt && wget -O "$TB_TAR_FILE" "$TB_URL" && tar -xvf "$TB_TAR_FILE"

COPY --from=easy-novnc-build /bin/easy-novnc /usr/local/bin/
COPY menu.xml /etc/xdg/openbox/
COPY supervisord.conf /etc/
EXPOSE 8080

RUN groupadd --gid 1000 app && \
    useradd --home-dir /data --shell /bin/bash --uid 1000 --gid 1000 app && \
    mkdir -p /data
VOLUME /data

CMD ["sh", "-c", "chown app:app /data /dev/stdout && exec gosu app supervisord"]