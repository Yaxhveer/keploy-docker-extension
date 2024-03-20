import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { getVersion } from '../util/util';


function Header() {
    
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

    return (
        <AppBar position="static" sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingX: '8px' }}>
            <Box sx={{ height: '100%', display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
                <img src="https://avatars.githubusercontent.com/u/92252339?s=200&v=4"style={{maxHeight:'32px'}} alt="Keploy Logo"/>
                <Typography
                    noWrap
                    variant="h6"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: "medium",
                        color: 'inherit',
                        textDecoration: 'none'
                    }}
                >
                    Keploy
                </Typography>
            </Box>

            <Typography
                noWrap
                sx={{
                    fontFamily: 'monospace',
                    fontWeight: "medium",
                    color: 'inherit',
                    textDecoration: 'none'
                }}
                >
                {version}
            </Typography>
            
        </AppBar>
    );
}
export default Header;