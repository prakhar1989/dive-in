export interface DiveResponse {
  layer: DiveLayer[];
  image: DiveImageStats;
}

export interface DiveImageStats {
  sizeBytes: number;
  inefficientBytes: number;
  efficiencyScore: number;
  fileReference: FileReference[];
}

export interface FileReference {
  count: number;
  sizeBytes: number;
  file: string;
}

export interface DiveLayer {
  index: number;
  id: string;
  digestId: string;
  sizeBytes: number;
  command: string;
}

export interface AnalysisResult {
  image: Image;
  dive: DiveResponse;
}

export interface Image {
  name: string;
  id: string;
}