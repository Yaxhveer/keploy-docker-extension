import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useEffect, useState } from 'react';
import { getVersion } from '../util/util';
import { Button, Stack } from '@mui/material';
import { ModeEnum } from '../model/model';

interface HeaderProps {
    mode: string
    setKeployMode: React.Dispatch<React.SetStateAction<ModeEnum>>
}

const Header:React.FC<HeaderProps> = ({ mode, setKeployMode }) => {
    
    const [version, setVersion] = useState<string | null>(null);

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const keployVersion = localStorage.getItem("keployVersion");
                if (keployVersion) {
                    setVersion(keployVersion)
                } else {
                    const versionResult = await getVersion();
                    if (versionResult instanceof Error) {
                        throw versionResult;
                    }
                    localStorage.setItem("keployVersion", versionResult)
                    console.log(versionResult);
                    setVersion(versionResult)
                }
            } catch (error) {
                // toast.error('Error fetching version information');
                console.error('Error fetching version:', error);
            }
        };

        fetchVersion();
    }, []);

    const handleNavBut = () => {
        if (mode === "Record") {
            localStorage.setItem("keployMode", "test")
            localStorage.removeItem("keployStream")
            setKeployMode(ModeEnum.test)
        } else {
            localStorage.setItem("keployMode", "record")
            localStorage.removeItem("keployStream")
            setKeployMode(ModeEnum.record)
        } 
    }

    return (
        <>
            <Box position="static" sx={{ display:'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingX: '8px', padding: 0 }}>
                <Stack flexDirection="row" gap="8px" alignItems="center">
                    <HomeRoundedIcon 
                        sx={{height:'32px', width:'32px', cursor:"pointer"}} 
                        onClick={() => {
                            localStorage.setItem("keployMode", "off")
                            setKeployMode(ModeEnum.off)
                        }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems:'flex-start', padding: 0}}>
                        <Typography
                            noWrap
                            sx={{
                                fontWeight: "medium",
                                color: 'inherit',
                                textDecoration: 'none',
                                fontSize:'24px'
                            }}
                        >
                            {mode}
                        </Typography>
                        <Typography
                            noWrap
                            sx={{
                                fontFamily: 'monospace',
                                color: 'inherit',
                                textDecoration: 'none'
                            }}
                        >
                            {version}
                        </Typography>
                    </Box>
                </Stack>
                <Stack gap="8px" direction="row">
                    <Button variant='outlined'  disabled sx={{ minWidth: '120px' }}>
                        Config
                    </Button>
                    <Button onClick={handleNavBut} sx={{ minWidth: '120px' }}>
                        {mode === "Record" ? "Test" : "Record"}
                    </Button>
                </Stack>
            </Box>
            <hr />
        </>
    );
}

export default Header;