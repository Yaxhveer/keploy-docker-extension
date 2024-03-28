#!/bin/bash

if [ "$1" != "-1" ]; then
cd $1
fi

# remove -rm and add it after a timeout in record and test

# removed -it
keploy="docker run --name keploy-v2 -p 16789:16789 --privileged --pid=host -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/.keploy:/root/.keploy ghcr.io/keploy/keploy"

command=$2

# shifting to remaining arguments
shift 2
flags="$@"


case $command in
    install)
        gnome-terminal -- bash -c "docker pull ghcr.io/keploy/keploy:latest && sleep 2"
        docker rm keploy-v2 -f
        ;;

    version)
        $keploy -v
        docker rm keploy-v2 -f
        ;;

    config)
        $keploy generate-config
        docker rm keploy-v2 -f
        ;;

    update)
        gnome-terminal -- bash -c "docker pull ghcr.io/keploy/keploy:latest && sleep 2"
        ;;

    record)
        $keploy record $flags
        sleep 1
        docker rm keploy-v2 -f
        ;;
        
    test)
        $keploy test $flags
        sleep 1
        docker rm keploy-v2 -f
        ;;

    *)
        echo "Invalid command: $command"
        display_usage
        exit 1
        ;;
esac
