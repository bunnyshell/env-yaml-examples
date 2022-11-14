FROM php:8.0.25-fpm-alpine AS backend

ARG INSTALL_XDEBUG=0

# add usefull extra tools
RUN apk add --no-cache \
    nano \
    sed \
    tar \
    supercronic

# create user docker
RUN addgroup -g 1000 docker && \
    adduser -u 1000 -G docker -h /home/docker -s /bin/sh -D docker

# install PHP extensions
RUN curl -sSLf \
        -o /usr/local/bin/install-php-extensions \
        https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions && \
    chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions \
    apcu-5.1.21 \
    amqp-1.11.0 \
    intl \
    mongodb-1.12.1 \
    opcache \
    pdo_mysql \
    redis-5.3.7 \
    gmp \
    pcntl

RUN if [[ "$INSTALL_XDEBUG" == "1" ]]; then install-php-extensions xdebug-3.1.5; fi

# install composer
#COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
#ENV COMPOSER_HOME=/tmp/composer

# subdir in the build context where we have some docker related config files
ARG BUILD_CONTEXT_CONFIG_DIR=".docker/backend"

# copy config files
COPY ${BUILD_CONTEXT_CONFIG_DIR}/docker-php-ext-xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
# there's no nice way to do conditional COPY
RUN if [[ "$INSTALL_XDEBUG" == "0" ]]; then rm -f /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; fi
COPY ${BUILD_CONTEXT_CONFIG_DIR}/docker-php-customize.ini /usr/local/etc/php/conf.d/docker-php-customize.ini

# prepare folders for usage
RUN chown -R docker:docker /var/www

# setup workdir and user (next commands will run under this context, but also the running container will inherit this - if not overriden at runtime)
WORKDIR /var/www
USER docker

# - copy composer.json and composer lock (optimise image build - copy only these files and run install, if these change rarely we can reuse this image layer too)
#COPY composer.json composer.lock ./

# - composer install without scripts
#RUN composer install --optimize-autoloader --no-scripts

COPY --chown=docker:docker . .

# expose port for Xdebug 3
EXPOSE 9003
