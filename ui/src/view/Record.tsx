import Button from "@mui/material/Button";
import { ModeEnum } from "../model/model";
import { setBinary, useDockerDesktopClient } from "../util/util";
import ChangeDir from "../component/ChangeDir";
import CmdInput from "../component/CmdInput";
import Header from "../component/Header";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Terminal from "../component/Terminal";

interface RecordProp {
	cmd: string
	dir: string
	startStream: boolean
	setCmd: React.Dispatch<React.SetStateAction<string>>
	setDir: React.Dispatch<React.SetStateAction<string>>
	setStartStream: React.Dispatch<React.SetStateAction<boolean>>
	setKeployMode: React.Dispatch<React.SetStateAction<ModeEnum>>
	out: string[]
}

const Record: React.FC<RecordProp> = ({ setKeployMode, dir, setDir, cmd, setCmd, out, startStream, setStartStream }) => {

	const ddClient = useDockerDesktopClient();

	const stopKeployRecord = async () => {
		try {
			const res = await ddClient.docker.cli.exec("stop -s SIGINT keploy-v2", [])
			console.log(res.stdout);
		} catch (err) {
			console.log(err);
		} finally {
			setStartStream(false)
			localStorage.removeItem("keployStream")
		}
	}

	const record = async () => {
		try {
			ddClient.desktopUI.toast.success("Record started.")
			let binary = setBinary()
			localStorage.setItem("keployCmd", cmd)
			setStartStream(true)
			localStorage.setItem("keployStream", "true")
			const result = await ddClient.extension.host?.cli.exec(binary, [dir, "record", cmd]);
			console.log(result);
		} catch (err) {
			ddClient.desktopUI.toast.error("Error Occured.")
			console.log(err);
		} finally {
			setStartStream(false)
			localStorage.removeItem("keployStream")
		}
	}

	return (
		<Box sx={{ padding: 0 }}>
			<Header mode="Record" setKeployMode={setKeployMode} />
			<Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{xs: 'stretch', sm: 'flex-end'}} gap={{xs: 0, sm: '16px'}}>
				<Stack flex={1}>
					<ChangeDir dir={dir} setDir={setDir} />
					<CmdInput mode="record" setCmd={setCmd} cmd={cmd} />
				</Stack>
				<Stack direction="column" gap='8px'>
					<Button onClick={stopKeployRecord} sx={{ minWidth: { xs: '100%', sm: '160px', md: '240px' }}}>Stop Keploy</Button>
					<Button onClick={record} disabled={startStream} sx={{ minWidth: { xs: '100%', sm: '160px', md: '240px' }}}>Record</Button>
				</Stack>
			</Stack>
			<Terminal output={out} />
		</Box>
	)
}

export default Record;