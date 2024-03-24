import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import Box from "@mui/material/Box";

interface CmdInputProps {
    mode: string;
    cmd: string;
    setCmd: React.Dispatch<React.SetStateAction<string>>
}

const CmdInput: React.FC<CmdInputProps> = ({ mode, cmd, setCmd }) => {
    return(
        <Box sx={{
            display:'flex',
            flexDirection:'row',
            gap:'4px'
            }}
            >
             {/* <Typography
                noWrap
                sx={{
                    fontFamily: 'monospace',
                    color: 'inherit',
                    textDecoration: 'none'
                }}
                >
                Keploy {mode}
            </Typography>
            <Input type='text' defaultValue={cmd} sx={{flex: '1'}} onChange={(e) => { setCmd(e.target.value) }} /> */}
            <TextField
                label="Command"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start" sx={{ marginRight: '20px' }}>
                            Keploy {mode}
                        </InputAdornment>
                    ),
                }}
                defaultValue={cmd}
                onChange={(e) => {setCmd(e.target.value)}}
                variant="standard"
                fullWidth={true}
            />
        </Box>
    )
}

export default CmdInput;