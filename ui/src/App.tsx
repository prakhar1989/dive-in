import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import {
  Typography,
  Card,
  CardActions,
  Divider,
  Stack,
  Grid,
  CardContent,
} from "@mui/material";

interface DockerImage {
  Labels: string[] | null;
  RepoTags: [string];
  Id: string;
}

interface Image {
  name: string;
  id: string;
}

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

function extractId(id: string) {
  return id.replace('sha256:', '').substring(0, 12);
}

export function App() {
  const [images, setImages] = useState<Image[]>([]);
  const [isHiveInstalled, setDiveInstalled] = useState<boolean>(false);
  const ddClient = useDockerDesktopClient();

  const checkDiveInstallation = async() => {
    try {
      const resp = await ddClient.extension.vm?.service?.get("/checkdive");
      console.log('got resp', resp);
    } catch (err) {
      console.log("Got error", err);
      setDiveInstalled(false);
    }
  }

  const getImages = async () => {
    const images = ((await ddClient.docker.listImages()) as DockerImage[])
      .filter((i) => i.Labels && i.RepoTags[0] !== "<none>:<none>")
      .map((i) => ({name: i.RepoTags[0], id: extractId(i.Id)}));
    console.log(images);
    setImages(images);
  };

  useEffect(() => {
    checkDiveInstallation();
    getImages();
  }, []);

  return (
    <>
      <Typography variant="h1">Welcome to Dive-In</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        Use this Docker extension to helps you explore a docker image, layer
        contents, and discover ways to shrink the size of your Docker/OCI image.
      </Typography>
      <Divider sx={{ mt: 4, mb: 4 }} orientation="horizontal" flexItem />
      <Typography variant="h3" sx={{ mb: 2 }}>
        Choose an image below to get started
      </Typography>
      <Grid container spacing={2}>
        {images.map((image, i) => (
          <Grid item xs key={i}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {image.id}
                </Typography>
                <Typography variant="body1" component="div">
                  {image.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined">Explore</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
