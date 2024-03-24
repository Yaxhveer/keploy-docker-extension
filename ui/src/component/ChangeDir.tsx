import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { useDockerDesktopClient } from "../util/util";
import TextField from "@mui/material/TextField";

interface ChangeDirProps {
    dir: string
    setDir: React.Dispatch<React.SetStateAction<string>>
}

const ChangeDir: React.FC<ChangeDirProps> = ({ dir, setDir }) => {

    const ddClient = useDockerDesktopClient()

    const changeDir = async () => {
        try {
            const dir = await ddClient.desktopUI.dialog.showOpenDialog({ properties: ['openDirectory'] })
            const dd = dir.filePaths
            console.log(dir, dd);
            setDir(dd[0])
            localStorage.setItem("keployDir", dd[0])
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Button onClick={changeDir} variant="text" sx={{padding: 0}}>
            <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'flex-end', gap:'4px' }}>  
                <TextField
                    label="Directory"
                    defaultValue={ dir === "-1" ? "" : dir}
                    value={ dir }
                    InputProps={{
                        readOnly: true,
                    }}
                    variant="standard"
                    fullWidth={true}
                    placeholder="Directory"
                    sx={{cursor: 'pointer'}}
                />
                <FolderRoundedIcon sx={{ height: '32px', width: '32px' }} />
            </Box>
        </Button >
    )
}

export default ChangeDir;