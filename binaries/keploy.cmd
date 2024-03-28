@echo off
setlocal enabledelayedexpansion

if not "%1"=="-1" cd %1

@REM removed -it
set keploy=docker run --name keploy-v2 -p 16789:16789 --privileged --pid=host -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/.keploy:/root/.keploy ghcr.io/keploy/keploy

set command=%2

REM shifted the arguments by two positions
set "flags="
set "count=0"
for %%A in (%*) do (
    set /a "count+=1"
    if !count! gtr 2 (
        if defined flags (
            set "flags=!flags! %%A"
        ) else if not "%%A" == "" (
            set "flags=%%A"
        )
    )
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
start cmd /c "docker pull ghcr.io/keploy/keploy:latest && timeout /t 2"
docker rm keploy-v2 -f
goto :eof

:version
wsl %keploy% -v
docker rm keploy-v2 -f
goto :eof

:config
wsl %keploy% generate-config
docker rm keploy-v2 -f
goto :eof

:update
start cmd /c "docker pull ghcr.io/keploy/keploy && timeout /t 2"

goto :eof

:record
wsl %keploy% record %flags%
timeout /t 1
docker rm keploy-v2 -f
goto :eof

:test
wsl %keploy% test %flags%
timeout /t 1
docker rm keploy-v2 -f
goto :eof

exit /b 0