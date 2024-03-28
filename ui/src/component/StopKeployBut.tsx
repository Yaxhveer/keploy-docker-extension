import Button from "@mui/material/Button";
import { useDockerDesktopClient } from "../util/util";

interface ChangeDirProps {
    setStartStream: React.Dispatch<React.SetStateAction<boolean>>
}

const StopKeployBut: React.FC<ChangeDirProps> = ({ setStartStream }) => {

    const ddClient = useDockerDesktopClient()

    const stopKeployRecord = async () => {
        try {
            const res = await ddClient.docker.cli.exec("stop -s SIGINT keploy-v2", [])
            console.log(res.stdout);
            ddClient.desktopUI.toast.success("keploy stopped")
        } catch (err) {
            console.log(err);
        } finally {
            setStartStream(false)
            localStorage.removeItem("keployStream")
        }
    }

    return (
        <Button onClick={stopKeployRecord} sx={{ minWidth: { xs: '100%', sm: '160px', md: '240px' } }}>Stop Keploy</Button>
    )
}

export default StopKeployBut;