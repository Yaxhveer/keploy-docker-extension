import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import KeployLogo from '../../public/assests/logo.png'
import { setBinary, useDockerDesktopClient, sleep } from "../util/util";
import { useState } from 'react';
import { ModeEnum } from '../model/model';

interface HomeProp {
    keployExist: boolean
    setKeployExist: React.Dispatch<React.SetStateAction<boolean>>
    setKeployMode: React.Dispatch<React.SetStateAction<ModeEnum>>
}

const Home: React.FC<HomeProp> = ({ keployExist, setKeployExist, setKeployMode }) => {

    const [installing, setInstalling] = useState<boolean>(false)

    const ddClient = useDockerDesktopClient();



    const updateKeploy = async () => {
        try {
            setInstalling(true);
            let binary = setBinary()
            const result = await ddClient.extension.host?.cli.exec(binary, ["-1", "update"]);
            console.log(result);
            setKeployExist(true);
            ddClient.desktopUI.toast.success("Keploy Updated")
        } catch (err) {
            console.log(err);
            ddClient.desktopUI.toast.error("Error Occured")
        } finally {
            setInstalling(false);
        }
    }

    const installKeploy = async () => {
        try {
            setInstalling(true);
            let binary = setBinary();
            const result = await ddClient.extension.host?.cli.exec(binary, ["-1", "install"]);
            console.log(result);
            setKeployExist(true);
            ddClient.desktopUI.toast.success("Keploy Installed")
        } catch (err) {
            console.log(err);
            ddClient.desktopUI.toast.error(`Error while installing keploy image, ${err}`)
        } finally {
            setInstalling(false);
        }
    };

    return (
        <div>
            <Stack
                sx={{
                    flexGrow: 1,
                    height: '90vh',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Stack direction="row" alignItems="center">
                    <Box
                        m={4}
                        sx={{
                            height: 160,
                        }}
                        component="img"
                        src={KeployLogo}
                        alt="Keploy Logo"
                    />
                    <Typography
                        noWrap
                        sx={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            color: 'inherit',
                            textDecoration: 'none',
                            fontSize: '72px'
                        }}
                    >
                        Keploy
                    </Typography>
                </Stack>
                <Stack spacing={2} direction="row">
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={installing}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={keployExist ? updateKeploy : installKeploy}
                        sx={{ minWidth: '160px', marginLeft: "32px" }}
                    >
                        {keployExist ? "Update" : "Install"}
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => { 
                            localStorage.setItem("keployMode", "record");
                            setKeployMode(ModeEnum.record);
                        }}
                        sx={{ minWidth: '160px' }}
                        disabled={!keployExist}
                    >
                        Launch Keploy
                    </Button>
                </Stack>
            </Stack>
            {/* footer todo */}
            {/* <Footer>
            </Footer> */}
        </div>
    )
}

export default Home;