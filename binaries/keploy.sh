#!/bin/bash

if [ "$1" != "-1" ]; then
cd $1
fi

# remove -rm and add it after a timeout in record and test

# removed -it
keploy="docker run --name keploy-v2 -p 16789:16789 --privileged --pid=host -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/.keploy:/root/.keploy --rm ghcr.io/keploy/keploy"

command=$2

# shifting to remaining arguments
shift 2
flags="$@"


case $command in
    install)
        gnome-terminal -- bash -c "$keploy && sleep 2"
        ;;

    version)
        $keploy -v
        ;;

    config)
        $keploy generate-config
        ;;

    update)
        gnome-terminal -- bash -c "$docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/.keploy:/root/.keploy --rm ghcr.io/keploy/keploy && sleep 2"
        ;;

    record)
        $keploy record $flags
        ;;
        
    test)
        $keploy test $flags
        ;;

    *)
        echo "Invalid command: $command"
        display_usage
        exit 1
        ;;
esac
