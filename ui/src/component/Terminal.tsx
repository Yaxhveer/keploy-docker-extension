import React, { useEffect, useRef } from 'react';
import AnsiToHtml from 'ansi-to-html';
import Box from "@mui/material/Box";
import { useMediaQuery } from '@mui/material';

interface TerminalProps {
    output: string[];
}

const Terminal: React.FC<TerminalProps> = ({ output }) => {
    
    const dref = useRef<HTMLInputElement>(null);
    const AnsiToHtmlConverter = new AnsiToHtml();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const mode = prefersDarkMode ? 'dark' : 'light';

    useEffect(() => {
        dref.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [output])

    return (
        <Box sx={{
            height: '420px', 
            overflowY: 'scroll', 
            margin: '32px 0', 
            padding: '0 8px',
            background: (mode === 'dark' ? '#1c262d' : '#f2f2f2')
            }}
            
        >
            {
                <pre
                    ref={dref}
                    style={{
                        lineHeight: 1.3
                    }}
                    dangerouslySetInnerHTML={{ __html: AnsiToHtmlConverter.toHtml(output.join('<br>')) }}
                />
            }
        </Box>
    )

}

export default Terminal;
