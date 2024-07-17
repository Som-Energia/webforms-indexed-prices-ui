#!/bin/bash

SCRIPTPATH=$(dirname $0)

function usage () {
    echo "Usage: $0 <environment>" 1>&2
    exit 1
}

die() {
    echo -e "\033[31;1m$@\033[0m" >&2
    exit -1
}
function log_message () {
    level="$1"
    msg="$2"
    echo "[$level] [$(date -u +"%Y-%m-%d %H:%M:%S")] $msg"
}

environment="$1"
environment_file="$SCRIPTPATH/deploy-$environment.conf"
    
[ "$1" == "" ]  && {
    usage
}       
        
[ -f "$environment_file" ] || {
    die "Environment '$environment' not available since '$environment_file' does not exist. Read the README for more info"
}

cat "$environment_file"
source "$environment_file"
echo configuration loaded

for var in DEPLOYMENT_BUILD DEPLOYMENT_HOST DEPLOYMENT_PORT DEPLOYMENT_USER DEPLOYMENT_PORT
do
    [ -z "${!var}" ] && die "Config $environment_file missing value for $var"
done

build="$DEPLOYMENT_BUILD"
deploy_server=$DEPLOYMENT_HOST
deploy_path=$DEPLOYMENT_PATH
port="$DEPLOYMENT_PORT"
user="$DEPLOYMENT_USER"

today=$(date +"%Y-%m-%d_%H%M%S")
dest_dir="$deploy_path/build_$today"
app_dir="$deploy_path/build"
alias_dir="build_$today"

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
            build=${OPTARG}
            ;;
        *)
            ;;
    esac
done

today=$(date +"%Y-%m-%d_%H%M%S")
dest_dir="$deploy_path/build_$today"
app_dir="$deploy_path/build"
alias_dir="build_$today"

function build () {
    log_message "INFO" "Building project"
    echo npm run build:$build

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
    echo rsync -avz $script_path/../dist/* $user@$deploy_server:$dest_dir
    if [ $? != 0 ]
    then
        log_message "ERROR" "An error ocurred uploading code: $?"
        exit -1
    fi

    log_message "INFO" "Linking new build... "
    echo ssh $user@$deploy_server -p $port "rm $app_dir; ln -s $alias_dir $app_dir"
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
