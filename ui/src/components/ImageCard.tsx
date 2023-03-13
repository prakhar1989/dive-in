import { Card, CardContent, Typography, CardActions, Box, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { Image } from "../models";

interface ImageCardProps {
    image: Image;
    analyze: (image: Image) => Promise<void>;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, analyze }) => {
    const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
    return (
      <>
        <Card sx={{ minWidth: 200 }} variant="outlined">
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
            <Box sx={{ position: "relative" }}>
              <Button
                variant="outlined"
                disabled={analysisLoading}
                onClick={() => {
                  setAnalysisLoading(true);
                  analyze(image);
                }}
              >
                Analyze
                {analysisLoading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </Button>
            </Box>
          </CardActions>
        </Card>
      </>
    );
  }

export default ImageCard;