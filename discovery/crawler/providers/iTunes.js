import axios from 'axios';

export default class iTunesProvider {  
    getCrawlableUrls(data, currentUrl) {
        var clickableUrls = data.match(/https:\/\/podcasts.apple.com\/\w{2}\/((genre\/podcasts-.+?\/id\d{4}(\?letter=.(\&amp;page=\d\d?#page)?)?)|podcast\/(((\d+|\w+)\-){0,100}(\d+|\w+)\/id\d{0,12})(?="))/g);
        
        if (clickableUrls && clickableUrls.length >= 0) {
            // prevent the link back to this page from being processed again
            clickableUrls = clickableUrls.filter(item => item !== currentUrl)
            
            return Array.from(new Set(clickableUrls));
        }
        
        return [];
    }
    
    getPodcastId(url) {
        var id = url.match(/\/id\d*/g)[0];
        
        if (id.length > 8) {
            id = id.replace("/id", "");
            return id;
        }
        return null;
    }
    
    getMetadata(podcastId) {
        console.log("Looking up", podcastId);
        var lookupUrl = `https://itunes.apple.com/lookup?id=${podcastId}`;
        
        return axios.get(lookupUrl);
    }
    
}