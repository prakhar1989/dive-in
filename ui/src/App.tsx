import { useEffect, useState } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import {
  Typography, 
  Divider,
  Stack, 
  CircularProgress,
  Alert, 
  Button
} from "@mui/material";
import Analysis from "./analysis";
import { extractId } from "./utils";
import { DiveResponse, Image, AnalysisResult } from "./models";
import ImageList from "./components/ImageList";
import HiveInstaller from "./components/HiveInstaller";

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
      i.RepoTags[0]?.includes(DIVE_DOCKER_IMAGE)
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
    setAnalysisResult({ image, dive });
  };

  useEffect(() => {
    checkDiveInstallation();
    getImages();
  }, []);

  const clearAnalysis = () => {
    setAnalysisResult(undefined);
  };

  return (
    <>
      <Typography variant="h1">Dive-In</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Use this Docker extension to helps you explore a docker image, layer
        contents, and discover ways to shrink the size of your Docker/OCI image.
      </Typography>
      <Divider sx={{ mt: 4, mb: 4 }} orientation="horizontal" flexItem />
      {isLoading ? (
        <Stack sx={{ mt: 4 }} direction="column" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <></>
      )}
      {!isHiveInstalled ? (
        <HiveInstaller></HiveInstaller>
      ) : analysis ? (
        <Analysis onExit={clearAnalysis} analysis={analysis}></Analysis>
      ) : (
        <ImageList analyze={analyze} images={images}></ImageList>
      )}
    </>
  );
}
