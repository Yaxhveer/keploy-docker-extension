import React, { useEffect, useRef } from 'react';
import AnsiToHtml from 'ansi-to-html';
import Box from "@mui/material/Box";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useMediaQuery } from '@mui/material';

interface TerminalProps {
    output: string[];
    setOut: React.Dispatch<React.SetStateAction<string[]>>;
}

const Terminal: React.FC<TerminalProps> = ({ output, setOut }) => {
    
    const dref = useRef<HTMLInputElement>(null);
    const AnsiToHtmlConverter = new AnsiToHtml();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const mode = prefersDarkMode ? 'dark' : 'light';

    const clearTerminal = async () => {
        setOut([]);
        localStorage.removeItem("keployOutput")
    };

    useEffect(() => {
        dref.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [output])

    return (
        <Box style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            margin: '32px 0',
            padding: '0 8px',
            background: (mode === 'dark' ? '#0b0b0b' : '#ebebeb')
        }}>
            <div onClick={clearTerminal} >
                <DeleteRoundedIcon
                    sx={{
                        height: '24px',
                        width: '24px',
                        paddingTop: '8px',
                        cursor: 'pointer'
                    }}
                />
            </div>
            <hr style={{width: '100%', margin: '0'}}/>
            <Box sx={{
                height: '360px', 
                overflowY: 'scroll',
                width: '100%'
                }}
            >            
                
                {
                    <pre
                        ref={dref}
                        style={{
                            lineHeight: 0.55
                        }}
                        dangerouslySetInnerHTML={{ __html: AnsiToHtmlConverter.toHtml(output.join('<br>')) }}
                    />
                }
            </Box>
        </Box>
    )

}

export default Terminal;
