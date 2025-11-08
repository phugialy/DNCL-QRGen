const DEFAULT_MAX_LENGTH = 2953;
const DEFAULT_MARGIN = 12;
const DEFAULT_SIZE = 320;

export class QrGenerationError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'QrGenerationError';
    if (options.code) {
      this.code = options.code;
    }
    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

export function normalizeText(input) {
  if (input === null || input === undefined) {
    return '';
  }
  return String(input).trim();
}

export function validateText(text, options = {}) {
  const normalized = normalizeText(text);
  const {
    maxLength = DEFAULT_MAX_LENGTH,
    requireValue = true,
  } = options;

  if (requireValue && normalized.length === 0) {
    return {
      ok: false,
      normalized,
      message: 'Please provide text to convert into a QR code.',
      code: 'EMPTY_TEXT',
    };
  }

  if (normalized.length > maxLength) {
    return {
      ok: false,
      normalized,
      message: `Text is too long. Please keep it under ${maxLength} characters.`,
      code: 'TEXT_TOO_LONG',
    };
  }

  return {
    ok: true,
    normalized,
  };
}

export function createQrGenerator(qrFactory, generatorOptions = {}) {
  if (typeof qrFactory !== 'function') {
    throw new Error('A QR factory function (e.g., qrcode from qrcode-generator) is required.');
  }

  const {
    maxLength = DEFAULT_MAX_LENGTH,
  } = generatorOptions;

  function buildQr(text, options = {}) {
    const validation = validateText(text, { maxLength });

    if (!validation.ok) {
      throw new QrGenerationError(validation.message, { code: validation.code });
    }

    const normalized = validation.normalized;

    try {
      const errorCorrectionLevel = options.errorCorrectionLevel || 'M';
      const qr = qrFactory(0, errorCorrectionLevel);
      qr.addData(normalized);
      qr.make();

      return { qr, normalized };
    } catch (error) {
      throw new QrGenerationError('Failed to generate QR code.', {
        cause: error,
        code: 'QR_GENERATION_FAILED',
      });
    }
  }

  function renderToCanvas(text, options = {}) {
    const {
      canvas,
      size = DEFAULT_SIZE,
      margin = DEFAULT_MARGIN,
      colors = {
        dark: '#111827',
        light: '#ffffff',
      },
      errorCorrectionLevel,
    } = options;

    if (!canvas || typeof canvas.getContext !== 'function') {
      throw new QrGenerationError('A 2D canvas context is required to render the QR code.', {
        code: 'CANVAS_REQUIRED',
      });
    }

    const { qr, normalized } = buildQr(text, { errorCorrectionLevel });
    const moduleCount = qr.getModuleCount();
    const safeMargin = Number.isFinite(margin) ? Math.max(0, margin) : DEFAULT_MARGIN;
    const safeSize = Number.isFinite(size) ? Math.max(size, moduleCount + safeMargin * 2) : DEFAULT_SIZE;
    const availableSize = safeSize - safeMargin * 2;
    const cellSize = Math.max(1, Math.floor(availableSize / moduleCount));
    const renderSize = cellSize * moduleCount;
    const finalSize = renderSize + safeMargin * 2;

    canvas.width = finalSize;
    canvas.height = finalSize;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = colors.light;
    ctx.fillRect(0, 0, finalSize, finalSize);

    ctx.fillStyle = colors.dark;

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            safeMargin + col * cellSize,
            safeMargin + row * cellSize,
            cellSize,
            cellSize,
          );
        }
      }
    }

    return {
      text: normalized,
      moduleCount,
      cellSize,
      size: finalSize,
      margin: safeMargin,
      dataUrl: canvas.toDataURL('image/png'),
    };
  }

  function generateDataUrl(text, options = {}) {
    const {
      useExistingCanvas = false,
      canvas: providedCanvas,
      ...rest
    } = options;

    let canvas = providedCanvas;

    if (!canvas) {
      if (typeof document === 'undefined') {
        throw new QrGenerationError(
          'No canvas provided and document is unavailable to create one.',
          { code: 'CANVAS_UNAVAILABLE' },
        );
      }
      canvas = document.createElement('canvas');
    }

    const result = renderToCanvas(text, { canvas, ...rest });

    if (!useExistingCanvas && !providedCanvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }

    return result;
  }

  return {
    renderToCanvas,
    generateDataUrl,
    validate: (text, options) => validateText(text, { maxLength, ...options }),
    normalizeText,
  };
}

export default {
  DEFAULT_MAX_LENGTH,
  QrGenerationError,
  createQrGenerator,
  normalizeText,
  validateText,
};

