import PropTypes from 'prop-types';
import { normalizeText } from '@qr';

const MAX_LENGTH = 2953;

const QrForm = ({
  text,
  onTextChange,
  onSubmit,
  isGenerating,
  disabled,
  profileName,
  fallbackText,
}) => {
  const charactersUsed = normalizeText(text).length;
  const remaining = MAX_LENGTH - charactersUsed;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="card form-card" aria-label="QR Code generator">
      <header>
        <h2>Create a QR code</h2>
        <p className="card-subtitle">
          {profileName
            ? `Generating for ${profileName}.`
            : 'Drop your message below — we keep it local to your browser.'}
        </p>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        <label className="input-field input-field--wide">
          <span className="input-label">QR content</span>
          <textarea
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            placeholder={
              fallbackText
                ? `Leave blank to reuse your default message:\n"${fallbackText}"`
                : 'Paste a URL, instructions, delivery note… anything up to ~3k characters.'
            }
            rows={6}
            spellCheck={false}
          />
          <span className="input-helper">
            {remaining >= 0
              ? `${charactersUsed.toLocaleString()} / ${MAX_LENGTH.toLocaleString()} characters`
              : `Too long by ${Math.abs(remaining).toLocaleString()} characters`}
          </span>
        </label>

        <div className="form-actions">
          <button
            type="submit"
            className="primary"
            disabled={disabled || isGenerating}
          >
            {isGenerating ? 'Building QR…' : 'Generate QR code'}
          </button>
          <span className="keyboard-hint">Press Ctrl + Enter to generate faster</span>
        </div>
      </form>
    </section>
  );
};

QrForm.propTypes = {
  text: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool,
  disabled: PropTypes.bool,
  profileName: PropTypes.string,
  fallbackText: PropTypes.string,
};

QrForm.defaultProps = {
  isGenerating: false,
  disabled: false,
  profileName: '',
  fallbackText: '',
};

export default QrForm;

