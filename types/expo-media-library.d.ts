interface MediaLibraryAsset {
  id: string;
  filename: string;
  uri: string;
  mediaType: "photo" | "video" | "audio";
  width: number;
  height: number;
  creationTime: number;
  modificationTime: number;
  duration?: number;
}
