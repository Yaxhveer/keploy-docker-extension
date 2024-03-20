import { createDockerDesktopClient } from "@docker/extension-api-client";

const ddClient = createDockerDesktopClient();

export const setBinary = (): string => {
    if (ddClient.host.platform === 'win32') {
        return "keploy.cmd";
    }
    return "keploy.sh"
}

export const getVersion = async (): Promise<string | Error> => {
    try {
        let binary = setBinary();
        const result = await ddClient.extension.host?.cli.exec(binary, ["-1", "version"]);

        if (!result || !result.stdout) {
            throw new Error("Unable to retrieve version information");
        }

        const output = result.stdout;
        const index = output.indexOf('Keploy');
        console.log("index: ", index);

        if (index === -1) {
            throw new Error("Keploy not found in output");
        }

        const keployVersion = output.substring(index, output.length).trim();
        console.log('Current Keploy version:', keployVersion);

        return keployVersion;
    } catch (err) {
        console.error(err);
        return err as Error;
    }
};
