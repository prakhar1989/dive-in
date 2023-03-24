import { Stack, Alert, Button } from "@mui/material";

interface HiveInstallerProps {
    pullDive: () => void;
}

const HiveInstaller: React.FC<HiveInstallerProps> = ({ pullDive }) => (
    <Stack spacing={2}>
        <Alert severity="warning">
        Dive was not found. Click the button below to install Dive
        </Alert>
        <Button variant="contained" onClick={() => pullDive()}>
        Install Dive
        </Button>
    </Stack>
);

export default HiveInstaller;