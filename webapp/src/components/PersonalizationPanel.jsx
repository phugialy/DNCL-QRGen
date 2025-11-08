import PropTypes from 'prop-types';

const fieldNames = {
  displayName: 'displayName',
  defaultMessage: 'defaultMessage',
};

const labels = {
  displayName: 'Customer label',
  defaultMessage: 'Default QR message',
};

const placeholders = {
  displayName: 'e.g. DNCL Logistics',
  defaultMessage: 'Paste your default message once and we will remember it for next time.',
};

const helperText = {
  displayName: 'Shown in the UI to remind you who this QR code is for.',
  defaultMessage: 'We sync this to your browser storage so you can jump back in.',
};

const PersonalizationPanel = ({ profile, onChange }) => {
  const handleChange = (field) => (event) => {
    const nextValue = event.target.value;

    onChange({
      ...profile,
      [field]: nextValue,
    });
  };

  return (
    <section className="card personalization-card" aria-label="Personalize workspace">
      <header>
        <h2>Make it yours</h2>
        <p className="card-subtitle">
          We remember these details locally so you can hop back in with your saved defaults.
        </p>
      </header>

      <div className="input-grid">
        <label className="input-field">
          <span className="input-label">{labels.displayName}</span>
          <input
            type="text"
            value={profile.displayName}
            onChange={handleChange(fieldNames.displayName)}
            placeholder={placeholders.displayName}
            autoComplete="organization"
          />
          <span className="input-helper">{helperText.displayName}</span>
        </label>

        <label className="input-field input-field--wide">
          <span className="input-label">{labels.defaultMessage}</span>
          <textarea
            value={profile.defaultMessage}
            onChange={handleChange(fieldNames.defaultMessage)}
            placeholder={placeholders.defaultMessage}
            rows={3}
          />
          <span className="input-helper">
            {profile.defaultMessage
              ? `We will use this when your input field is empty.`
              : helperText.defaultMessage}
          </span>
        </label>
      </div>
    </section>
  );
};

PersonalizationPanel.propTypes = {
  profile: PropTypes.shape({
    displayName: PropTypes.string,
    defaultMessage: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
export default PersonalizationPanel;

