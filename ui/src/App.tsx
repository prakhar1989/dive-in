import React, { useEffect, useState } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import {
  Typography,
  Card,
  CardActions,
  Divider,
  Stack,
  Grid,
  CircularProgress,
  Alert,
  Button,
  CardContent,
} from "@mui/material";

import Analysis from './analysis';
import { formatBytes, extractId } from "./utils";
import { DiveResponse, Image, AnalysisResult } from "./models";

interface DockerImage {
  Labels: string[] | null;
  RepoTags: [string];
  Id: string;
}

const DIVE_DOCKER_IMAGE = "prakhar1989/dive";

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const [analysis, setAnalysisResult] = useState<AnalysisResult | undefined>(
    undefined
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<Image[]>([]);
  const [isHiveInstalled, setDiveInstalled] = useState<boolean>(false);
  const ddClient = useDockerDesktopClient();

  const checkDiveInstallation = async () => {
    const result = (await readImages()).some((i) =>
      i.RepoTags[0].includes(DIVE_DOCKER_IMAGE)
    );
    setDiveInstalled(result);
  };

  const pullDive = async () => {
    setLoading(true);
    await ddClient.docker.cli.exec("pull", [DIVE_DOCKER_IMAGE]);
    setLoading(false);
    checkDiveInstallation();
  };

  const readImages = async () =>
    (await ddClient.docker.listImages()) as DockerImage[];

  const getImages = async () => {
    const all = await readImages();
    const images = all
      .filter((i) => i.RepoTags && i.RepoTags[0] !== "<none>:<none>")
      .map((i) => ({ name: i.RepoTags[0], id: extractId(i.Id) }));
    setImages(images);
  };

  const analyze = async (image: Image) => {
    setLoading(true);
    const result = await ddClient.docker.cli.exec("run", [
      "--rm",
      "-v",
      "/var/run/docker.sock:/var/run/docker.sock",
      DIVE_DOCKER_IMAGE,
      image.name,
      "--json",
      "result.json",
    ]);
    const dive = JSON.parse(result.stdout) as unknown as DiveResponse;
    console.log(dive);
    setLoading(false);
    setAnalysisResult({ image, dive });
  };

  const queryImageSize = async (id: string) => {
    const result = await ddClient.docker.cli.exec("image", [
      "inspect",
      id,
      "--format='{{.Size}}'"
    ]);
    return formatBytes(Number(result.stdout));
  }

  function ImageCard(props: { image: Image }) {
    return (
      <>
        <Card sx={{ maxWidth: 200 }} variant="outlined">
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {props.image.id}
            </Typography>
            <Typography variant="body1" component="div">
              {props.image.name}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              variant="outlined"
              onClick={() => analyze(props.image)}
            >
              Analyze
            </Button>
          </CardActions>
        </Card>
      </>
    );
  }

  const ImageList = () => (
    <>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Choose an image below to get started
      </Typography>
      <Grid container spacing={2}>
        {images.map((image, i) => (
          <Grid item xs key={i}>
            <ImageCard image={image}></ImageCard>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const HiveInstaller = () => (
    <Stack spacing={2}>
      <Alert severity="warning">
        Dive was not found. Click the button below to install Dive
      </Alert>
      <Button variant="contained" onClick={() => pullDive()}>
        Install Dive
      </Button>
    </Stack>
  );

  useEffect(() => {
    checkDiveInstallation();
    getImages();
  }, []);

  const clearAnalysis = () => {
    setAnalysisResult(undefined);
  }

  return (
    <>
      <Typography variant="h1">Welcome to Dive-In</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Use this Docker extension to helps you explore a docker image, layer
        contents, and discover ways to shrink the size of your Docker/OCI image.
      </Typography>
      <Divider sx={{ mt: 4, mb: 4 }} orientation="horizontal" flexItem />
      {!isHiveInstalled ? (
        <HiveInstaller></HiveInstaller>
      ) : analysis ? (
        <Analysis onExit={clearAnalysis} analysis={analysis}></Analysis>
      ) : (
        <ImageList></ImageList>
      )}
      {isLoading ? (
        <Stack sx={{ mt: 4 }} direction="column" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <></>
      )}
    </>
  );
}
