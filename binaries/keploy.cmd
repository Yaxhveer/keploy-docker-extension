@echo off
setlocal enabledelayedexpansion

if not "%1"=="-1" cd %1

@REM removed -it
set keploy=docker run --name keploy-v2 -p 16789:16789 --privileged --pid=host -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/.keploy:/root/.keploy --rm ghcr.io/keploy/keploy

set command=%2

REM shifted the arguments by two positions
set "flags="
set "first=1"
for %%a in (%*) do (
    if "!first!" == "0" set "flags=!flags! %%a"
    set "first=0"
)


if "%command%"=="install" (
    call :install
) else if "%command%"=="version" (
    call :version
) else if "%command%"=="config" (
    call :config
) else if "%command%"=="update" (
    call :update
) else if "%command%"=="record" (
    call :record
) else if "%command%"=="test" (
    call :test
) else (
    echo command not found
    exit /b 1
)

goto :eof

:install
wsl %keploy%
goto :eof

:version
wsl %keploy% -v
goto :eof

:config
wsl %keploy% generate-config
goto :eof

:update
wsl docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/.keploy:/root/.keploy --rm ghcr.io/keploy/keploy
goto :eof

:record
wsl %keploy% record %flags%
goto :eof

:test
wsl %keploy% test %flags%
goto :eof

exit /b 0