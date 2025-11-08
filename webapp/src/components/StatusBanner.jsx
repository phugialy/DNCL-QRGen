import PropTypes from 'prop-types';

const friendlyLabel = {
  success: 'Success',
  error: 'Error',
  info: 'Heads up',
};

const StatusBanner = ({ type, message, onDismiss }) => {
  if (!type || !message) {
    return null;
  }

  const label = friendlyLabel[type] || 'Notice';

  return (
    <div className={`status-banner global ${type}`} role="status">
      <div>
        <strong className="status-title">{label}</strong>
        <p>{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          className="ghost"
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

StatusBanner.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func,
};

StatusBanner.defaultProps = {
  onDismiss: undefined,
};

export default StatusBanner;

