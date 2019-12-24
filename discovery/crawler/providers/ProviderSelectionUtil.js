import iTunesProvider from "./iTunes";

export default function getProvider(url) {
    return new iTunesProvider;
}