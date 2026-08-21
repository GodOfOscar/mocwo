/**
 * YouTube API utilities for auto-detecting live streams
 */

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

interface LiveStreamData {
  videoId: string;
  title: string;
  isLive: boolean;
}

/**
 * Fetch the current live video ID from a YouTube channel
 * @param channelId - The YouTube channel ID (e.g., "UCxxxxxx")
 * @param apiKey - The YouTube Data API v3 key
 * @returns The video ID of the current live stream, or null if not live
 */
export async function getCurrentLiveVideoId(
  channelId: string,
  apiKey: string
): Promise<LiveStreamData | null> {
  try {
    // Search for live videos on the channel
    const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("channelId", channelId);
    searchUrl.searchParams.set("eventType", "live");
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("key", apiKey);
    searchUrl.searchParams.set("maxResults", "1");
    searchUrl.searchParams.set("order", "date");

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const videoId = data.items[0].id.videoId;
    const title = data.items[0].snippet.title;

    return {
      videoId,
      title,
      isLive: true,
    };
  } catch (error) {
    console.error("Failed to fetch live video from YouTube:", error);
    return null;
  }
}

/**
 * Fetch detailed information about a specific video
 * @param videoId - The YouTube video ID
 * @param apiKey - The YouTube Data API v3 key
 * @returns The video details including live status
 */
export async function getVideoDetails(
  videoId: string,
  apiKey: string
): Promise<LiveStreamData | null> {
  try {
    const url = new URL(`${YOUTUBE_API_BASE}/videos`);
    url.searchParams.set("part", "snippet,liveStreamingDetails");
    url.searchParams.set("id", videoId);
    url.searchParams.set("key", apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    const isLive =
      !!video.liveStreamingDetails &&
      (!video.liveStreamingDetails.actualEndTime ||
        new Date(video.liveStreamingDetails.actualEndTime) > new Date());

    return {
      videoId,
      title: video.snippet.title,
      isLive,
    };
  } catch (error) {
    console.error("Failed to fetch video details from YouTube:", error);
    return null;
  }
}
