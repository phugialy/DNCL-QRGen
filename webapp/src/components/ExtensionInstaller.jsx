import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

const defaultBundleName = 'dncl-qr-extension.zip';

const steps = [
  'Download the extension package.',
  'Unzip the file to a safe folder on your computer.',
  'Open chrome://extensions/ in Google Chrome.',
  'Enable Developer mode in the top-right toggle.',
  'Click “Load unpacked” and choose the unzipped folder.',
];

const ExtensionInstaller = ({ bundleUrl, bundleName }) => {
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const updateStatus = (type, message) => {
    setStatus({ type, message });
  };

  const handleDownload = useCallback(async () => {
    updateStatus('loading', 'Preparing your download…');

    try {
      const response = await fetch(bundleUrl);

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = bundleName || defaultBundleName;

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      updateStatus('success', 'Download started! Follow the steps below to finish setup.');
    } catch (error) {
      console.error('Extension package download failed:', error);
      updateStatus('error', 'We could not download the extension package. Please try again.');
    }
  }, [bundleName, bundleUrl]);

  return (
    <section className="card installer-card" aria-label="Install browser extension">
      <header>
        <h2>Add the Chrome extension</h2>
        <p className="card-subtitle">
          Package deploys straight from GitHub. We keep it updated on every push.
        </p>
      </header>

      <button
        type="button"
        className="primary"
        onClick={handleDownload}
      >
        Download extension package
      </button>

      {status.type !== 'idle' && (
        <div className={`status-banner ${status.type}`}>
          <strong className="status-title">
            {status.type === 'loading' && 'Working…'}
            {status.type === 'success' && 'Ready!'}
            {status.type === 'error' && 'Something went wrong'}
          </strong>
          <p>{status.message}</p>
        </div>
      )}

      <ol className="installer-steps">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <p className="card-helper">
        Tip: Pin the extension in Chrome to launch QR codes even faster.
      </p>
    </section>
  );
};

ExtensionInstaller.propTypes = {
  bundleUrl: PropTypes.string.isRequired,
  bundleName: PropTypes.string,
};

ExtensionInstaller.defaultProps = {
  bundleName: defaultBundleName,
};

export default ExtensionInstaller;

