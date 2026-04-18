import DOMPurify from 'isomorphic-dompurify';

interface RichTextProps {
  html: string;
  className?: string;
}

/**
 * Safely render HTML produced by the rich-text editor.
 * Falls back to detecting plain text (no HTML tags) and rendering line breaks.
 */
export const RichText = ({ html, className = '' }: RichTextProps) => {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(html);
  if (!isHtml) {
    return (
      <div className={className}>
        {html.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    );
  }
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  return <div className={`prose prose-sm max-w-none ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />;
};

export default RichText;
