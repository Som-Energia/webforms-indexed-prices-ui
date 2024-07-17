#!/bin/bash

function usage () {
    echo "Usage: $0 -s server -P path [-u user] [-p port]" 1>&2
    exit 1
}

function log_message () {
    level="$1"
    msg="$2"
    echo "[$level] [$(date -u +"%Y-%m-%d %H:%M:%S")] $msg"
}

while getopts ":s:P:u:p:b:tm:h" o; do
    case "${o}" in

        s)
            s=${OPTARG}
            ;;
        P)
            P=${OPTARG}
            ;;
        u)
            u=${OPTARG}
            ;;
        p)
            p=${OPTARG}
            ;;
        h)
            usage
            ;;
        b)
            build=$(OPTARG)
            ;;
        *)
            ;;
    esac
done
if [ -z "$s" ]; then usage; fi
if [ -z "$P" ]; then usage; fi
if [ -z "$build" ]; then usage; fi
if [ -z "$u" ]; then user="somdevel"; else user=$u; fi
if [ -z "$p" ]; then port="22"; else port=$p; fi

deploy_server=$s
deploy_path=$P

today=$(date +"%Y-%m-%d_%H%M%S")
dest_dir="$deploy_path/build_$today"
app_dir="$deploy_path/build"
alias_dir="build_$today"

function build () {
    log_message "INFO" "Building project"
    npm run build:$build

    if [ $? != 0 ]
    then
        log_message "ERROR" "An error ocurred building app $?"
        exit -1
    fi
}

function upload () {
    RSYNC_RSH="ssh -p $port"
    export RSYNC_RSH
    log_message "INFO" "Uploading build build_$today to $deploy_server:$port"
    script_path=$(dirname $0)
    rsync -avz $script_path/../dist/* $user@$deploy_server:$dest_dir
    if [ $? != 0 ]
    then
        log_message "ERROR" "An error ocurred uploading code: $?"
        exit -1
    fi

    log_message "INFO" "Linking new build... "
    ssh $user@$deploy_server -p $port "rm $app_dir; ln -s $alias_dir $app_dir"
    if [ $? != 0 ]
    then
        log_message "ERROR" "An error ocurred linking new build $?"
        exit -1
    fi
    unset RSYNC_RSH
}

log_message "INFO" "Building the application"

build
upload
log_message "INFO" "Build finished, I did well my job!!"
log_message "INFO" "REMIND TO CLEAR THE WORDPRESS CACHE! "
