import Container from '@mui/material/Container';
import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

interface TerminalProps {
    output: string[];
}

const Terminal: React.FC<TerminalProps> = ({ output }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const terminal = useRef<XTerm | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        // Create an xterm.js instance
        const term = new XTerm();
        terminal.current = term;

        // Add fit addon to make terminal resizable
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        // Handle terminal input
        term.onData((data) => {
            // Handle data input here
            console.log('Input:', data);
        });

        return () => {
            if (terminal.current) {
                terminal.current.dispose();
                terminal.current = null;
            }
        };
    }, []);

    // Update terminal output when the output prop changes
    useEffect(() => {
        terminal.current?.clear()
        if (terminal.current) {
            // Write each line from the output array to the terminal
            output.forEach((line) => {
                terminal.current?.writeln(line);
            });
        }
        terminal.current?.scrollToBottom();
    }, [output]);

    return <Container ref={terminalRef} style={{ height: '400px' , overflow: 'scroll'}} />;
};

export default Terminal;
