interface ExternalToolEmbedProps {
  title: string;
  testId: string;
  envVarName: string;
  fallbackExampleUrl: string;
  embedUrl: string | null;
}

export function resolveExternalToolUrl(rawUrl: string | undefined) {
  const trimmedUrl = rawUrl?.trim();

  if (!trimmedUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

export function ExternalToolEmbed({
  title,
  testId,
  envVarName,
  fallbackExampleUrl,
  embedUrl
}: ExternalToolEmbedProps) {
  if (!embedUrl) {
    return (
      <section className="mx-auto w-full max-w-4xl px-6 py-16">
        <h1 className="mb-3 text-2xl font-bold text-white">{title}</h1>
        <p className="text-sm leading-relaxed text-text-muted">
          Set <code>{envVarName}</code> to the external app URL (for example{" "}
          <code>{fallbackExampleUrl}</code>) to render this tool.
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100dvh-4rem)] overflow-hidden bg-bg" aria-label={`${title} embed area`}>
      <h1 className="sr-only">{title}</h1>
      <iframe
        src={embedUrl}
        title={`${title} app`}
        data-testid={testId}
        className="h-[calc(100dvh-4rem)] w-full border-0"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
}
