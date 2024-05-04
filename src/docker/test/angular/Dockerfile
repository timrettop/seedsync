FROM seedsync/build/angular/env as seedsync_test_angular
#! this is unsafe but I am aware 
RUN echo "deb http://deb.debian.org/debian buster main contrib non-free" > /etc/apt/sources.list.d/my.list && \
    apt-get -o Acquire::Check-Valid-Until=false update

RUN apt-get update
RUN wget -nv -O /tmp/chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg -i /tmp/chrome.deb; apt-get -fy install > /dev/null

COPY \
    src/angular/tsconfig.json \
    src/angular/tslint.json \
    src/angular/karma.conf.js \
    src/angular/.angular-cli.json \
    /app/

RUN ls -l /app/

# ng src needs to be mounted on /app/src
WORKDIR /app/src

CMD ["/app/node_modules/@angular/cli/bin/ng", "test", \
    "--browsers", "ChromeHeadless", \
    "--single-run"]
