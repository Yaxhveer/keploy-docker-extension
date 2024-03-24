import Button from "@mui/material/Button";
import { ModeEnum } from "../model/model";
import { setBinary, useDockerDesktopClient } from "../util/util";
import ChangeDir from "../component/ChangeDir";
import CmdInput from "../component/CmdInput";
import Header from "../component/Header";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import Terminal from "../component/Terminal";

interface TestProp {
    cmd: string
    dir: string
    startStream: boolean
    setOut: React.Dispatch<React.SetStateAction<string[]>>
    setCmd: React.Dispatch<React.SetStateAction<string>>
    setDir: React.Dispatch<React.SetStateAction<string>>
    setStartStream: React.Dispatch<React.SetStateAction<boolean>>
    setKeployMode: React.Dispatch<React.SetStateAction<ModeEnum>>
    out: string[]
}

const Test: React.FC<TestProp> = ({ setKeployMode, dir, setDir, cmd, setCmd, setStartStream, out, setOut, startStream }) => {

    const ddClient = useDockerDesktopClient();

    const stopKeployTest = async () => {
        try {
            const res = await ddClient.docker.cli.exec("stop keploy-v2", [])
            console.log(res.stdout);
            ddClient.desktopUI.toast.success("keploy stopped")
        } catch (err) {
            console.log(err);
        } finally {
            setStartStream(false)
            localStorage.removeItem("keployStream")
        }
    }

    const test = async () => {
        try {
            ddClient.desktopUI.toast.success("Test started.")
            let binary = setBinary()
            localStorage.setItem("keployCmd", cmd)
            setStartStream(true)
            localStorage.setItem("keployStream", "true")
            const result = await ddClient.extension.host?.cli.exec(binary, [dir, "test", cmd]);
            console.log(result);
        } catch (err) {
            ddClient.desktopUI.toast.error("Error Occured.")
            console.log(err);
        } finally {
            setStartStream(false)
            localStorage.removeItem("keployStream")
        }
    }

    useEffect(() => {

    }, [])

    return (
        <Box sx={{ padding: 0 }}>
            <Header mode="Test" setKeployMode={setKeployMode} />
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'flex-end' }} gap={{ xs: 0, sm: '16px' }}>
                <Stack flex={1}>
                    <ChangeDir dir={dir} setDir={setDir} />
                    <CmdInput mode="test" setCmd={setCmd} cmd={cmd} />
                </Stack>
                <Stack direction="column" gap='8px'>
                    <Button onClick={stopKeployTest} sx={{ minWidth: { xs: '100%', sm: '160px', md: '240px' } }}>Stop Keploy</Button>
                    <Button onClick={test} disabled={startStream} sx={{ minWidth: { xs: '100%', sm: '160px', md: '240px' } }}>Test</Button>
                </Stack>
            </Stack>
            <Terminal output={out} setOut={setOut}/>
        </Box>
    )
}

export default Test;









{/* <Header />
          
          <Button onClick={generateConfig}>
            Generate Config
          </Button>
          <Button onClick={updateKeploy}>
            Update keploy
          </Button>
          <Button onClick={stopKeployRecord}>
            StopKeployRecord
          </Button>
          <CmdInput mode='record' cmd={cmd} setCmd={setCmd} />
          <Button onClick={record}>
            Record
          </Button>
          <Button onClick={test}>
            Test
          </Button>
          <Button onClick={() => { setYoo(!yoo) }}>
            Start/Stop
          </Button> */}

{/* <Typography
            sx={{
              fontFamily: 'monospace',
              fontWeight: "medium",
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            {out}
          </Typography> */}
{/* <Terminal output={out} /> */ }