import { Typography, Grid } from "@mui/material";
import { Image } from "../models";
import ImageCard from "./ImageCard";

interface ImageListProps {
    images: Image[];
    analyze: (image: Image) => Promise<void>;
}

const ImageList: React.FC<ImageListProps> = ({ images, analyze }) => (
    <>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Choose an image below to get started
      </Typography>
      <Grid container spacing={2}>
        {images.map((image, i) => (
          <Grid item xs key={i}>
            <ImageCard analyze={analyze} image={image}></ImageCard>
          </Grid>
        ))}
      </Grid>
    </>
  );

export default ImageList;