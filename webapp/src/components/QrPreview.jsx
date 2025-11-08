import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { normalizeText } from '@qr';

const truncate = (value, maxLength = 120) => {
  const text = normalizeText(value);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}…`;
};

const QrPreview = ({
  result,
  onDownload,
  onCopy,
  isGenerating,
}) => {
  const hasResult = Boolean(result && result.dataUrl);

  const description = useMemo(() => {
    if (!hasResult) {
      return 'Your QR code preview will appear here after you generate it.';
    }

    return truncate(result.text);
  }, [hasResult, result]);

  return (
    <section className="card preview-card" aria-live="polite">
      <header>
        <h2>Preview & Actions</h2>
        <p className="card-subtitle">Download or copy the QR code as soon as it is ready.</p>
      </header>

      <div className={`preview-body ${isGenerating ? 'loading' : ''}`}>
        {hasResult ? (
          <img
            src={result.dataUrl}
            alt="Generated QR code"
            className="qr-preview-image"
            width={256}
            height={256}
          />
        ) : (
          <div className="preview-placeholder">
            <span role="img" aria-hidden>📱</span>
            <p>Generate a QR code to see the preview.</p>
          </div>
        )}
      </div>

      <p className="preview-description">{description}</p>

      <div className="preview-actions">
        <button
          type="button"
          className="secondary"
          onClick={onDownload}
          disabled={!hasResult}
        >
          Download PNG
        </button>
        <button
          type="button"
          className="secondary"
          onClick={onCopy}
          disabled={!hasResult}
        >
          Copy to clipboard
        </button>
      </div>
    </section>
  );
};

QrPreview.propTypes = {
  result: PropTypes.shape({
    text: PropTypes.string.isRequired,
    dataUrl: PropTypes.string.isRequired,
  }),
  onDownload: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool,
};

QrPreview.defaultProps = {
  result: null,
  isGenerating: false,
};

export default QrPreview;

