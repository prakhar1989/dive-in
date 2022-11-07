import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { AnalysisResult } from "./models";
import { formatBytes } from "./utils";
import CircularProgressWithLabel from "./ring";
import ImageTable from "./imagetable";
import LayersTable from "./layerstable";

export default function Analysis(props: {
  analysis: AnalysisResult;
  onExit: () => any;
}) {
  const { image, dive } = props.analysis;
  return (
    <>
      <Stack direction="column" spacing={4} align-items="baseline">
        <Button sx={{maxWidth: 150}} variant="outlined" onClick={props.onExit}>
          Back to images
        </Button>
        <Typography variant="h3">Analyzing: {image.name}</Typography>
        <Stack direction="row" spacing={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Total Size
              </Typography>
              <Typography variant="h2">
                {formatBytes(dive.image.sizeBytes)}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Inefficient Bytes
              </Typography>
              <Typography variant="h2">
                {formatBytes(dive.image.inefficientBytes)}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Efficiency Score
              </Typography>
              <CircularProgressWithLabel
                value={dive.image.efficiencyScore * 100}
              ></CircularProgressWithLabel>
            </CardContent>
          </Card>
        </Stack>
        <Stack spacing={2}>
            <Typography variant="h3">Largest Files (sorted by size)</Typography>
            <ImageTable rows={dive.image.fileReference}></ImageTable>
        </Stack>
        <Stack spacing={2}>
            <Typography variant="h3">Layers</Typography>
            <LayersTable rows={dive.layer}></LayersTable>
        </Stack>
      </Stack>
    </>
  );
}