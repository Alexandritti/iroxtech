// Mount only when src is a real file. Empty blocks stay off the page.
// Intended later use: one clip per PALLET / WELD / MOVE / VISION,
// sequence before → robotization → after. Not a robot demo by itself.
export function OperationVideo({src, poster, webm, title, autoPlay = false}) {
  if (!src) return null;
  return (
    <video
      className="opVideo"
      poster={poster || undefined}
      controls
      playsInline
      preload="none"
      muted={autoPlay}
      autoPlay={autoPlay}
      aria-label={title || undefined}
    >
      {webm ? <source src={webm} type="video/webm" /> : null}
      <source src={src} type="video/mp4" />
    </video>
  );
}
