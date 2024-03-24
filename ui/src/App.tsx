
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { useEffect, useState } from 'react';
import { setBinary, sleep } from './util/util';
import { ModeEnum } from './model/model';
import Record from './view/Record';
import Test from './view/Test';
import Home from './view/Home';


export function App() {
    const [keployMode, setKeployMode] = useState<ModeEnum>(ModeEnum.off)
    const [cmd, setCmd] = useState<string>('')
    const [dir, setDir] = useState<string>("-1")
    const [out, setOut] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [startStream, setStartStream] = useState<boolean>(false)
    const [keployExist, setKeployExist] = useState<boolean>(false)
    const ddClient = createDockerDesktopClient();

    const checkKeployImage = async () => {
        try {
            const keployImage = await ddClient.docker.cli.exec("images ghcr.io/keploy/keploy", [])
            const exists = keployImage.stdout.includes("ghcr.io/keploy/keploy")
            setKeployExist(exists)
        } catch (err) {
            console.log(err);
            ddClient.desktopUI.toast.error(`Error while checking keploy image, ${err}`)
        }
    }

    let content = <Home
        keployExist={keployExist}
        setKeployExist={setKeployExist}
        setKeployMode={setKeployMode}
    />

    switch (keployMode) {
        case ModeEnum.record:
            content = <Record
                setKeployMode={setKeployMode}
                cmd={cmd}
                dir={dir}
                setCmd={setCmd}
                setDir={setDir}
                out={out}
                setStartStream={setStartStream}
                startStream={startStream}
                setOut={setOut}
            />
            break;
        case ModeEnum.test:
            content = <Test
                setKeployMode={setKeployMode}
                cmd={cmd}
                dir={dir}
                setCmd={setCmd}
                setDir={setDir}
                setStartStream={setStartStream}
                out={out}
                startStream={startStream}
                setOut={setOut}
            />
            break;
        default:
            content = <Home
                keployExist={keployExist}
                setKeployExist={setKeployExist}
                setKeployMode={setKeployMode}
            />
            break;
    }

    useEffect(() => {
        let isMounted = true;

        const getStream = async () => {
            while (startStream && isMounted) {
                try {
                    const res = await ddClient.docker.cli.exec("logs keploy-v2", [])
                    setOut(res.lines())
                    localStorage.setItem("keployOutput", JSON.stringify(res.lines()))
                    await sleep(100);
                } catch (err) {
                    console.log(err);
                    if (!startStream) break;
                }
            }
        }
        if (startStream) {
            getStream()
        }

        return () => {
            isMounted = false;
        };
    }, [startStream])

    useEffect(() => {
        checkKeployImage()
        const kDir = localStorage.getItem("keployDir");
        const kCmd = localStorage.getItem("keployCmd");
        const kmode = localStorage.getItem("keployMode");
        const kout = localStorage.getItem("keployOutput");
        const kStream = localStorage.getItem("keployStream");
        kDir && setDir(kDir);
        kCmd && setCmd(kCmd);
        kout && setOut(JSON.parse(kout));
        kStream && setStartStream(true);
        if (kmode === "test") {
            setKeployMode(ModeEnum.test)
        } else if (kmode === "record") {
            setKeployMode(ModeEnum.record)
        } else {
            setKeployMode(ModeEnum.off)
        }
        setLoading(false);
    }, [])

    return (
        <>
            {!loading && content}
        </>
    );
}