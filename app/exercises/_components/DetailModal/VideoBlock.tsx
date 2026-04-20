import { Video } from "lucide-react";

const getEmbedUrl = (rawUrl: string): string | null => {
  try {
    const u = new URL(rawUrl);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace("/", "");
      return `https://player.vimeo.com/video/${id}`;
    }
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(u.pathname)) {
      return rawUrl;
    }
    return null;
  } catch {
    return null;
  }
};

const VideoBlock = ({ label, url }: { label: string; url: string }) => {
  const embedUrl = getEmbedUrl(url);
  const isDirect = embedUrl === url;

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-gray-600">
        <Video size={13} />
        {label}
      </div>

      {/* Player */}
      {embedUrl ? (
        isDirect ? (
          <video src={embedUrl} controls className="w-full max-h-56 bg-black" />
        ) : (
          <iframe
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video"
          />
        )
      ) : (
        <div className="px-3 pb-3">
          <p className="text-xs text-gray-400 truncate">{url}</p>
          <p className="text-xs text-red-400 mt-1">Không thể nhúng URL này</p>
        </div>
      )}
    </div>
  );
};

export default VideoBlock;
