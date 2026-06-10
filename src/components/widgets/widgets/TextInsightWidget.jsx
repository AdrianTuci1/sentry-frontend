export function TextInsightWidget({ data, config }) {
  const { text, highlights } = data;

  const renderText = () => {
    if (!text) return null;
    if (!highlights?.length) return <span className="text-sm text-text-secondary">{text}</span>;

    let result = text;
    highlights.forEach((h) => {
      result = result.replace(
        h.text,
        `__HIGHLIGHT_${h.text}__`
      );
    });

    const parts = result.split(/(__HIGHLIGHT_[^__]+__)/g);
    return parts.map((part, i) => {
      const match = part.match(/__HIGHLIGHT_(.+)__/);
      if (match) {
        return (
          <span key={i} className="font-semibold text-text-primary">
            {match[1]}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="h-full p-4 flex items-center">
      <p className="text-sm text-text-secondary leading-relaxed">
        {renderText()}
      </p>
    </div>
  );
}
