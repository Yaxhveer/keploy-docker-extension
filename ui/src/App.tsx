import { Grid, Button, Typography, Input, Container, Box, Backdrop, CircularProgress } from '@mui/material';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { useEffect, useState } from 'react';
import Header from './component/Header';
import { setBinary } from './util/util';
import Terminal from './component/Terminal';

export function App() {
  const [install, setInstall] = useState<boolean>(false)
  const [out, setOut] = useState<string[]>([])
  const [yoo, setYoo] = useState<boolean>(false)
  const [flags, setFlags] = useState<string>('')
  const [dir, setDir] = useState<string>("-1")
  const [loading, setLoading] = useState<boolean>(true)
  const ddClient = createDockerDesktopClient();
  // const keploy = 'docker run --pull always --name keploy-ebpf -p 16789:16789 --network keploy-network --privileged --pid=host -it -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy'

  const generateConfig = async () => {
    try {
      let binary = setBinary()
      console.log(dir);
      const result = await ddClient.extension.host?.cli.exec(binary, [dir, "config"]);
      console.log(result);
    } catch (err) {
      console.log(err);
      setOut([JSON.stringify(err)]);
    }
  }

  const updateKeploy = async () => {
    try {
      let binary = setBinary()
      console.log(dir);
      const result = await ddClient.extension.host?.cli.exec(binary, [dir, "update"]);
      ddClient.desktopUI.toast.success("Keploy Updated")
      console.log(result);
    } catch (err) {
      console.log(err);
      setOut([JSON.stringify(err)]);
    }
  }

  const stopKeployRecord = async () => {
    try {
      const res = await ddClient.docker.cli.exec("stop -s SIGINT keploy-v2", [])
      console.log(res.stdout);
    } catch (err) {
      console.log(err);
    }
  }

  const changeDir = async () => {

    try {
      const dir = await ddClient.desktopUI.dialog.showOpenDialog({ properties: ['openDirectory']})
      const dd = dir.filePaths
      console.log(dir, dd);
      setDir(dd[0])
      localStorage.setItem("keployDir", dd[0])
    } catch (err) {
      console.log(err);
    }
  }

  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const getStream = async () => {
    try {
      while (true) {
        if (!yoo) break
        const res = await ddClient.docker.cli.exec("logs keploy-v2", [])
        setOut(res.lines())
        await sleep(500);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const record = async () => {
    try {
      let binary = setBinary()
      localStorage.setItem("keployFlags", flags)

      // const flagsArray: string[] = flags.split(" ");
      const result = await ddClient.extension.host?.cli.exec(binary, [dir, "record", flags]);
      console.log(result);
    } catch (err) {
      console.log(err);
      setOut([JSON.stringify(err)]);
    }
  }

  const test = async () => {
    try {
      let binary = setBinary()
      localStorage.setItem("keployFlags", flags)
      console.log(`dir: ${dir}, flags: ${flags}`);
      const flagsArray: string[] = flags.split(" ");
      const result = await ddClient.extension.host?.cli.exec(binary, [dir, "test", ...flagsArray]);
      console.log(result);
    } catch (err) {
      console.log(err);
      setOut([JSON.stringify(err)]);
    }
  }

  useEffect(() => {
    getStream()
  }, [yoo])

  useEffect(() => {
    const run = async () => {
      try {
        const keployExists = sessionStorage.getItem("keployExists")
        if (!keployExists) {
          const keployImage = await ddClient.docker.cli.exec("images ghcr.io/keploy/keploy", [])
          const exist = keployImage.stdout.includes("ghcr.io/keploy/keploy")
          if (!exist) {
            console.log("Keploy not found it is being installed");

            setInstall(true);
            let binary = setBinary();
            const result = await ddClient.extension.host?.cli.exec(binary, [dir, "install"]);
            // todo add check when it is not installed (check stdErr)
            console.log(result);
            setInstall(false);
            sessionStorage.setItem("keployExists", "true")
          }
        }
      } catch (err) {
        console.log(err);
        
      } finally {
        setLoading(false)
      }
    };
    run();
  }, []);

  // localStoreage or sessionStorage
  useEffect(() => {
    const keployDir = localStorage.getItem("keployDir");
    const keployFlags = localStorage.getItem("keployFlags");
    keployDir && setDir(keployDir);
    keployFlags && setFlags(keployFlags);
  }, [])

  return ( 
    <> 
      { loading ?
        ( install ?
          <>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={install}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <Typography sx={{margin:'auto'}}>
              Installing Keploy
            </Typography>
          </>
          :
          <Typography>
            Checking Keploy local image
          </Typography>
        )
        :
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '0' }}>
          <Header />
          <Button onClick={changeDir}>
            Change Dir
          </Button>
          <Button onClick={generateConfig}>
            Generate Config
          </Button>
          <Button onClick={updateKeploy}>
            Update keploy
          </Button>
          <Button onClick={stopKeployRecord}>
            StopKeployRecord
          </Button>
          <Input type='text' onChange={(e) => {setFlags(e.target.value)}}/>
          <Button onClick={record}>
            Record
          </Button>
          <Button onClick={test}>
            Test
          </Button>
          <Button onClick={() => {setYoo(!yoo)}}>
            Start/Stop
          </Button>

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
          {/* <Terminal output={out} /> */}
        </Box>
      }
    </>
  );
}