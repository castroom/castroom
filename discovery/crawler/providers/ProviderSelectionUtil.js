import iTunesProvider from "./iTunes";

export default function getProvider(url) {
  if (url.includes("podcasts.apple.com")) {
    return iTunesProvider;
  }

  return null;
}
