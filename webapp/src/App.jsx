import { useCallback, useMemo, useState } from 'react';
import QRCode from 'qrcode-generator';
import { createQrGenerator, normalizeText, QrGenerationError } from '@qr';
import usePersistentState from './hooks/usePersistentState';
import PersonalizationPanel from './components/PersonalizationPanel';
import QrForm from './components/QrForm';
import QrPreview from './components/QrPreview';
import ExtensionInstaller from './components/ExtensionInstaller';
import StatusBanner from './components/StatusBanner';
import { resolveDefaultText } from './utils/profile';
import './App.css';

const defaultProfile = {
  displayName: '',
  defaultMessage: '',
};

const extensionBundlePath = '/downloads/dncl-qr-extension.zip';

function App() {
  const qrGenerator = useMemo(() => createQrGenerator(QRCode), []);
  const [profile, setProfile] = usePersistentState('dncl.qr.profile', defaultProfile);
  const [text, setText] = usePersistentState('dncl.qr.text', '');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ type: 'info', message: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const fallbackText = resolveDefaultText(profile);
  const activeText = normalizeText(text) || fallbackText;

  const canGenerate = Boolean(normalizeText(text) || fallbackText);

  const showStatus = useCallback((type, message) => {
    setStatus({ type, message });
  }, []);

  const handleGenerate = useCallback(() => {
    if (!canGenerate) {
      showStatus('error', 'Please enter content or configure a default message.');
      return;
    }

    try {
      setIsGenerating(true);
      showStatus('info', 'Generating your QR code…');

      const generation = qrGenerator.generateDataUrl(activeText, {
        size: 512,
        margin: 24,
      });

      setResult({
        text: generation.text,
        dataUrl: generation.dataUrl,
      });

      setText(generation.text);
      showStatus('success', 'All set — download or copy your QR code below.');
    } catch (error) {
      console.error('Failed to generate QR code:', error);

      if (error instanceof QrGenerationError) {
        showStatus('error', error.message);
      } else {
        showStatus('error', 'Unexpected error while creating the QR code.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, [activeText, canGenerate, qrGenerator, setText, showStatus]);

  const handleDownload = useCallback(() => {
    if (!result) {
      showStatus('error', 'Generate a QR code first.');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = result.dataUrl;
      link.download = `dncl-qr-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showStatus('success', 'Download started!');
    } catch (error) {
      console.error('Download failed:', error);
      showStatus('error', 'Unable to download the QR code. Please try again.');
    }
  }, [result, showStatus]);

  const handleCopy = useCallback(async () => {
    if (!result) {
      showStatus('error', 'Generate a QR code first.');
      return;
    }

    try {
      const response = await fetch(result.dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      showStatus('success', 'QR code copied to your clipboard!');
    } catch (error) {
      console.warn('Image copy failed. Falling back to text copy.', error);

      try {
        await navigator.clipboard.writeText(result.text);
        showStatus('success', 'QR text copied to clipboard.');
      } catch (copyError) {
        console.error('Failed to copy QR code:', copyError);
        showStatus('error', 'We could not copy the QR code.');
      }
    }
  }, [result, showStatus]);

  const handleProfileChange = useCallback((nextProfile) => {
    setProfile(nextProfile);
  }, [setProfile]);

  const clearStatus = useCallback(() => {
    setStatus({ type: 'info', message: '' });
  }, []);

  return (
    <div className="page">
      <header className="hero">
        <p className="hero-eyebrow">DNCL QR Suite</p>
        <h1>Create & deploy QR codes in seconds</h1>
        <p className="hero-subtitle">
          Generate high fidelity QR codes, personalise defaults for each customer, and ship the
          Chrome extension straight from this micro SaaS dashboard.
        </p>
      </header>

      {status.message && (
        <StatusBanner
          type={status.type}
          message={status.message}
          onDismiss={clearStatus}
        />
      )}

      <main className="layout">
        <div className="column column--primary">
          <PersonalizationPanel
            profile={profile}
            onChange={handleProfileChange}
          />

          <QrForm
            text={text}
            onTextChange={setText}
            onSubmit={handleGenerate}
            isGenerating={isGenerating}
            disabled={!canGenerate || isGenerating}
            profileName={normalizeText(profile.displayName)}
            fallbackText={fallbackText}
          />
        </div>

        <div className="column column--secondary">
          <QrPreview
            result={result}
            onDownload={handleDownload}
            onCopy={handleCopy}
            isGenerating={isGenerating}
          />

          <ExtensionInstaller bundleUrl={extensionBundlePath} />
        </div>
      </main>

      <footer className="footer">
        <p>
          Need full automation? Triggered deployments run on every GitHub push —
          the extension package and this web app stay in sync.
        </p>
      </footer>
    </div>
  );
}

export default App;
