import jsQR from "jsqr";
import "./styles.css";

const MAX_INPUT_PIXELS = 20_000_000;
const SOURCE_PREVIEW_SIZE = 304;
const WARPED_MODULE_PIXELS = 12;
const MATRIX_MODULE_PIXELS = 12;
const PNG_OFFICE_MODULE_PIXELS = 20;
const PDF_POINTS_PER_MM = 72 / 25.4;
const MIN_EXPORT_SIZE_MM = 12;
const DEFAULT_EXPORT_CELL_SIZE_MM = 0.25;
const EXPORT_CELL_SIZE_OPTIONS = [0.25, 0.3, 0.35];
const QUIET_ZONE_MODULES = 4;
const AMBIGUOUS_MARGIN = 12;
const LOCAL_WINDOW_RADIUS = 2;
const SAMPLING_BOUND_CANDIDATES = [-4, -2, 0, 2, 4, 6];
const REGION_GRID_CELLS = 112;
const REGION_CANDIDATE_LIMIT = 14;
const FALLBACK_CANDIDATE_LIMIT = 24;
const MAX_DETECTION_SIDE = 1200;
const DETECTION_TIME_BUDGET_MS = 7000;
const DETECTION_YIELD_EVERY = 3;

const TRANSLATIONS = {
  ja: {
    brandTagline: "セル構成の全く同じQRコードを生成",
    dropPlaceholder: "PNG/JPEGをドロップ",
    initialMessage: "画像を選択してください。",
    comparisonTitle: "セルをクリックやドラッグで修正できます",
    opacityLabel: "不透明度：",
    overlayHide: "オーバーレイを非表示にする",
    overlayShow: "オーバーレイを表示する",
    overlayToggleTitle: "オーバーレイの表示切替",
    exportTitle: "修正したQRを書き出し",
    proofButton: "プレビュー状態をPNGとして書き出し（証明用）",
    tiffDtpSub: "DTP向け1セル1px/1bit\nai/idで色付け可能",
    pngOfficeSub: "Canva/Office等向け\n1セル20px グレー",
    pdfSub: "DeviceGray/ベクター",
    exportCellSizeLabel: "セルサイズ：",
    exportCellSizeHighQuality: "0.25mm（高品質印刷）",
    exportCellSizePrinter: "0.3mm（プリンタ等）",
    exportCellSizeLowQuality: "0.35mm（低品質印刷）",
    exportCellSizeNote: "※最小12mm（マージン含む）",
    epsSub: "2値/ベクター",
    donateLink: "寄付する",
    trademark: "QRコードは株式会社デンソーウェーブの登録商標です",
    selectPngJpg: "PNG または JPG を選択してください。",
    loadingImage: "画像を読み込んでいます。",
    detectingQr: "QR の範囲を検出しています。",
    detectFailed: "QR を検出または読み取りできませんでした。破損、低解像度、強い反射、または範囲外の可能性があります。",
    versionCellFailed: "QR バージョンからセル数を算出できませんでした。",
    extractingCells: "セル構成を抽出しています。",
    formatFailed: "フォーマット情報を復元できませんでした。破損またはセル判定の失敗として扱います。",
    doneWithNotice: ({ notice }) => `完了しました。${notice}`,
    doneVerified: "完了しました。抽出 matrix は jsQR のエラー訂正後デコードで再確認済みです。",
    doneWithWarning: ({ warningText }) => `完了しました。ただし ${warningText}`,
    imageLoadTimeout: "画像の読み込みが完了しませんでした。別の JPG/PNG に書き出してから再試行してください。",
    imageLoadFailed: "画像を読み込めませんでした。",
    inputScaledWarning: ({ percent }) => `入力画像が大きいため ${percent}% に縮小して解析しました。`,
    barcodeDetectorNotice: "ブラウザの QR 検出を使って範囲を取得しました。",
    detectionTimeout:
      "QR の検出に時間がかかりすぎたため停止しました。もう少し QR が大きく写った画像、または QR 周辺を切り出した画像で再試行してください。",
    detectionNoticeDarkRegion: "QR らしい範囲を切り出し",
    detectionNoticeGrid: "複数の候補範囲から",
    detectionNoticeContrast: "コントラスト補正を使って",
    detectionNoticeBinary: "二値化した画像で",
    detectionNoticeGray: "グレースケール画像で",
    detectionNoticeScaled: "画像サイズを調整して",
    detectionNoticeComplete: ({ parts }) => `${parts.join("、")}検出しました。`,
    extractedMatrixUnreadableReason: "抽出した matrix を jsQR で再読み取りできませんでした。破損またはセル判定の失敗として扱います。",
    extractedQrUnreadable: "抽出後QRは読み取り不可",
    decodedMismatchReason: "元画像と抽出 matrix の jsQR エラー訂正後デコード値が一致しません。",
    verifyMatch: "一致（エラー訂正後）",
    verifyMismatch: "不一致（エラー訂正後）",
    readDifferenceMatch: ({ version }) => `jsQRのエラー訂正後デコード値が一致。Version ${version}`,
    readDifferenceUnreadable: ({ version }) => `抽出QRはjsQRで読み取り不可。検出QR: Version ${version}`,
    unreadable: "（読み取り不可）",
    editAction: ({ count, value }) => `${count}セルを${value ? "置きました" : "外しました"}。`,
    editOk: ({ actionText }) => `${actionText} jsQRのエラー訂正後デコード値は一致しています。`,
    editMismatch: ({ actionText }) => `${actionText} jsQRのエラー訂正後デコード値に差違があります。`,
    proofSourceTitle: "元画像＋検出範囲",
    proofProcessedTitle: "検出処理画像",
    previewPngExportFailed: "プレビューPNGを書き出せませんでした。",
  },
  en: {
    brandTagline: "Generate a QR code with the exact same cell structure",
    dropPlaceholder: "Drop PNG/JPEG",
    initialMessage: "Select an image.",
    comparisonTitle: "Click or drag cells to edit",
    opacityLabel: "Opacity:",
    overlayHide: "Hide overlay",
    overlayShow: "Show overlay",
    overlayToggleTitle: "Toggle overlay",
    exportTitle: "Export the edited QR",
    proofButton: "Export preview state as PNG (proof)",
    tiffDtpSub: "For DTP: 1 cell = 1 px/1-bit\nColor editable in Ai/Id",
    pngOfficeSub: "For Canva/Office\n1 cell = 20 px gray",
    pdfSub: "DeviceGray/vector",
    exportCellSizeLabel: "Cell size:",
    exportCellSizeHighQuality: "0.25 mm (high-quality print)",
    exportCellSizePrinter: "0.3 mm (printers)",
    exportCellSizeLowQuality: "0.35 mm (low-quality print)",
    exportCellSizeNote: "Minimum 12 mm (including margin)",
    epsSub: "1-bit/vector",
    donateLink: "Donate",
    trademark: "QR Code is a registered trademark of DENSO WAVE INCORPORATED.",
    selectPngJpg: "Select a PNG or JPG file.",
    loadingImage: "Loading image.",
    detectingQr: "Detecting QR area.",
    detectFailed: "Could not detect or read the QR code. It may be damaged, too low-resolution, strongly reflective, or outside the frame.",
    versionCellFailed: "Could not calculate the cell count from the QR version.",
    extractingCells: "Extracting cell structure.",
    formatFailed: "Could not restore format information. Treating this as damage or cell-detection failure.",
    doneWithNotice: ({ notice }) => `Done. ${notice}`,
    doneVerified: "Done. The extracted matrix was rechecked with jsQR's error-corrected decode result.",
    doneWithWarning: ({ warningText }) => `Done, but ${warningText}`,
    imageLoadTimeout: "Image loading did not finish. Export it again as another JPG/PNG and retry.",
    imageLoadFailed: "Could not load the image.",
    inputScaledWarning: ({ percent }) => `The input image was large, so it was scaled to ${percent}% for analysis.`,
    barcodeDetectorNotice: "Detected the area using the browser QR detector.",
    detectionTimeout:
      "QR detection took too long and was stopped. Try again with a larger QR in the image, or crop around the QR.",
    detectionNoticeDarkRegion: "a cropped candidate area",
    detectionNoticeGrid: "multiple candidate areas",
    detectionNoticeContrast: "contrast correction",
    detectionNoticeBinary: "binarization",
    detectionNoticeGray: "grayscale conversion",
    detectionNoticeScaled: "image resizing",
    detectionNoticeComplete: ({ parts }) => `Detected using ${parts.join(", ")}.`,
    extractedMatrixUnreadableReason: "The extracted matrix could not be reread by jsQR. Treating this as damage or cell-detection failure.",
    extractedQrUnreadable: "Extracted QR is unreadable",
    decodedMismatchReason: "The original image and extracted matrix do not match by jsQR's error-corrected decode result.",
    verifyMatch: "Match (after error correction)",
    verifyMismatch: "Mismatch (after error correction)",
    readDifferenceMatch: ({ version }) => `jsQR's error-corrected decode result matches. Version ${version}`,
    readDifferenceUnreadable: ({ version }) => `Extracted QR is unreadable. Detected QR: Version ${version}`,
    unreadable: "(unreadable)",
    editAction: ({ count, value }) => `${count} cell${count === 1 ? "" : "s"} ${value ? "set" : "cleared"}.`,
    editOk: ({ actionText }) => `${actionText} jsQR's error-corrected decode result matches.`,
    editMismatch: ({ actionText }) => `${actionText} jsQR's error-corrected decode result differs.`,
    proofSourceTitle: "Original + detected area",
    proofProcessedTitle: "Processed detection image",
    previewPngExportFailed: "Could not export the preview PNG.",
  },
};

const appLocale = resolveLocale();

function resolveLocale() {
  const primaryLanguage = (navigator.languages?.[0] || navigator.language || "en").toLowerCase();
  return primaryLanguage.startsWith("ja") ? "ja" : "en";
}

function t(key, params = {}) {
  const entry = TRANSLATIONS[appLocale][key] ?? TRANSLATIONS.en[key] ?? key;
  if (typeof entry === "function") return entry(params);
  return entry;
}

const els = {
  dropZone: document.querySelector("#dropZone"),
  fileInput: document.querySelector("#fileInput"),
  message: document.querySelector("#message"),
  sourceCanvas: document.querySelector("#sourceCanvas"),
  warpedCanvas: document.querySelector("#warpedCanvas"),
  matrixCanvas: document.querySelector("#matrixCanvas"),
  overlayOpacity: document.querySelector("#overlayOpacity"),
  overlayOpacityValue: document.querySelector("#overlayOpacityValue"),
  overlayToggle: document.querySelector("#overlayToggle"),
  matrixSize: document.querySelector("#matrixSize"),
  downloadPreviewProof: document.querySelector("#downloadPreviewProof"),
  downloadTiffDtp: document.querySelector("#downloadTiffDtp"),
  downloadPngOffice: document.querySelector("#downloadPngOffice"),
  downloadSvg: document.querySelector("#downloadSvg"),
  downloadPdf: document.querySelector("#downloadPdf"),
  exportCellSize: document.querySelector("#exportCellSize"),
  downloadEps: document.querySelector("#downloadEps"),
  metaContent: document.querySelector("#metaContent"),
  metaVersion: document.querySelector("#metaVersion"),
  metaCells: document.querySelector("#metaCells"),
  metaEcl: document.querySelector("#metaEcl"),
  metaMask: document.querySelector("#metaMask"),
  metaContrast: document.querySelector("#metaContrast"),
  metaAmbiguous: document.querySelector("#metaAmbiguous"),
  metaReadCheck: document.querySelector("#metaReadCheck"),
  metaReadDifference: document.querySelector("#metaReadDifference"),
};

let latestResult = null;
let overlayEnabled = true;
const dragEdit = {
  active: false,
  pointerId: null,
  value: false,
  changedCells: 0,
  lastCell: null,
};

els.dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  els.dropZone.classList.add("is-over");
});

els.dropZone.addEventListener("dragleave", () => {
  els.dropZone.classList.remove("is-over");
});

els.dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  els.dropZone.classList.remove("is-over");
  const file = event.dataTransfer.files?.[0];
  if (file) void analyzeFile(file);
});

els.fileInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) void analyzeFile(file);
});

els.downloadTiffDtp.addEventListener("click", () => {
  if (!latestResult) return;
  void saveBlobAs(
    generateMatrixTiffBlob(latestResult.modules, getExportSizing(latestResult.modules)),
    buildExportFilename(latestResult, "dtp", "tif"),
    [{ description: "1-bit TIFF image", accept: { "image/tiff": [".tif", ".tiff"] } }],
  );
});

els.downloadPngOffice.addEventListener("click", () => {
  if (!latestResult) return;
  void saveBlobAs(
    generateMatrixPngBlob(latestResult.modules, PNG_OFFICE_MODULE_PIXELS),
    buildExportFilename(latestResult, "office", "png"),
    [{ description: "PNG image", accept: { "image/png": [".png"] } }],
  );
});

els.downloadSvg.addEventListener("click", () => {
  if (!latestResult) return;
  void saveTextAs(
    generateMatrixSvg(latestResult.modules, getExportSizing(latestResult.modules)),
    buildExportFilename(latestResult, "", "svg"),
    "image/svg+xml",
    [{ description: "SVG image", accept: { "image/svg+xml": [".svg"] } }],
  );
});

els.downloadPdf.addEventListener("click", () => {
  if (!latestResult) return;
  void saveBlobAs(
    generateMatrixPdfBlob(latestResult.modules, getExportSizing(latestResult.modules)),
    buildExportFilename(latestResult, "", "pdf"),
    [{ description: "PDF document", accept: { "application/pdf": [".pdf"] } }],
  );
});

els.downloadEps.addEventListener("click", () => {
  if (!latestResult) return;
  void saveTextAs(
    generateMatrixEpsPostScript(latestResult.modules, getExportSizing(latestResult.modules)),
    buildExportFilename(latestResult, "", "eps"),
    "application/postscript",
    [{ description: "EPS file", accept: { "application/postscript": [".eps"] } }],
  );
});

els.downloadPreviewProof.addEventListener("click", () => {
  if (!latestResult) return;
  void savePreviewProof();
});

els.warpedCanvas.addEventListener("pointerdown", (event) => {
  beginComparisonDrag(event);
});

els.warpedCanvas.addEventListener("pointermove", (event) => {
  continueComparisonDrag(event);
});

els.warpedCanvas.addEventListener("pointerup", (event) => {
  finishComparisonDrag(event);
});

els.warpedCanvas.addEventListener("pointercancel", (event) => {
  finishComparisonDrag(event);
});

els.overlayOpacity.addEventListener("input", () => {
  updateOverlayOpacityLabel();
  if (latestResult?.warpedImageData && latestResult?.modules) {
    renderComparisonCanvas(latestResult.warpedImageData, latestResult.modules);
  }
});

els.overlayToggle.addEventListener("click", () => {
  overlayEnabled = !overlayEnabled;
  if (!overlayEnabled) {
    if (dragEdit.active && dragEdit.pointerId !== null) {
      els.warpedCanvas.releasePointerCapture?.(dragEdit.pointerId);
    }
    resetComparisonDrag();
  }
  updateOverlayToggle();
  if (latestResult?.warpedImageData && latestResult?.modules) {
    renderComparisonCanvas(latestResult.warpedImageData, latestResult.modules);
  }
});

applyLocale();
updateOverlayOpacityLabel();
updateOverlayToggle();

function applyLocale() {
  document.documentElement.lang = appLocale;

  const staticText = [
    ["#brandTagline", "brandTagline"],
    ["#sourcePlaceholder", "dropPlaceholder"],
    ["#message", "initialMessage"],
    ["#comparisonTitle", "comparisonTitle"],
    ["#overlayOpacityLabel", "opacityLabel"],
    ["#exportTitle", "exportTitle"],
    ["#downloadPreviewProof", "proofButton"],
    ["#downloadTiffDtp .button-sub", "tiffDtpSub"],
    ["#downloadPngOffice .button-sub", "pngOfficeSub"],
    ["#downloadPdf .button-sub", "pdfSub"],
    ["#exportCellSizeLabel", "exportCellSizeLabel"],
    ["#exportCellSizeNote", "exportCellSizeNote"],
    ["#downloadEps .button-sub", "epsSub"],
    ["#donateLink", "donateLink"],
    ["#trademarkNotice", "trademark"],
  ];

  staticText.forEach(([selector, key]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = t(key);
  });
  setSelectOptionText(els.exportCellSize, "0.25", t("exportCellSizeHighQuality"));
  setSelectOptionText(els.exportCellSize, "0.3", t("exportCellSizePrinter"));
  setSelectOptionText(els.exportCellSize, "0.35", t("exportCellSizeLowQuality"));
}

function setSelectOptionText(select, value, text) {
  const option = select?.querySelector(`option[value="${value}"]`);
  if (option) option.textContent = text;
}

async function analyzeFile(file) {
  resetUi();

  if (!/^image\/(png|jpeg)$/.test(file.type)) {
    setMessage(t("selectPngJpg"), "error");
    return;
  }

  try {
    setMessage(t("loadingImage"), "busy");
    await nextFrame();
    const bitmap = await loadBitmap(file);
    const source = drawInputImage(bitmap);
    const sourceImage = source.ctx.getImageData(0, 0, source.canvas.width, source.canvas.height);

    setMessage(t("detectingQr"), "busy");
    await nextFrame();
    const detection = await findQrInImage(source.canvas, sourceImage);
    const detected = detection?.code ?? null;

    if (!detected) {
      throw new Error(t("detectFailed"));
    }

    const size = 17 + detected.version * 4;
    const expectedSize = 21 + 4 * (detected.version - 1);
    if (size !== expectedSize) {
      throw new Error(t("versionCellFailed"));
    }

    const corners = detection.location;
    drawSourceOverlay(source.preview.ctx, source.preview.canvas, mapCornersToPreview(corners, source.preview));

    setMessage(t("extractingCells"), "busy");
    await nextFrame();
    const transform = squareToQuadrilateralTransform(
      corners.topLeftCorner,
      corners.topRightCorner,
      corners.bottomRightCorner,
      corners.bottomLeftCorner,
    );

    const warpedImageData = renderWarpedQr(sourceImage, source.canvas.width, source.canvas.height, transform, size);

    const sample = sampleWarpedModules(warpedImageData, size);
    const format = decodeFormatInformation(sample.modules);
    if (!format) {
      throw new Error(t("formatFailed"));
    }

    renderComparisonCanvas(warpedImageData, sample.modules);
    renderMatrix(sample.modules, els.matrixCanvas);
    const verification = verifyExtractedMatrix(els.matrixCanvas, detected);

    latestResult = {
      detected,
      sourceFileName: file.name,
      sourceCanvas: source.canvas,
      sourceCorners: corners,
      warpedImageData,
      content: detected.data,
      version: detected.version,
      size,
      modules: sample.modules,
      format,
      contrast: sample.contrast,
      ambiguousCells: sample.ambiguousCells,
      localAdjustedCells: sample.localAdjustedCells,
      samplingAdjustment: sample.samplingBounds.adjustment,
      verification,
    };

    renderMetadata(file, detected, sample, format, source.warning, verification);
    if (!verification.ok) {
      setMessage(verification.reason, "error");
      setExportButtonsEnabled(true);
      return;
    }

    const completeMessage = detection.notice ? t("doneWithNotice", { notice: detection.notice }) : t("doneVerified");
    const warningText = [source.warning, detection.notice].filter(Boolean).join(" ");
    setMessage(source.warning ? t("doneWithWarning", { warningText }) : completeMessage, source.warning ? "warn" : "ok");
    setExportButtonsEnabled(true);
  } catch (error) {
    latestResult = null;
    setMessage(error instanceof Error ? error.message : String(error), "error");
  }
}

function resetUi() {
  latestResult = null;
  resetComparisonDrag();
  setExportButtonsEnabled(false);
  resetSourcePreview();
  [els.warpedCanvas, els.matrixCanvas].forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;
  });
  els.matrixSize.textContent = "-";
  els.metaContent.textContent = "-";
  els.metaVersion.textContent = "-";
  els.metaCells.textContent = "-";
  els.metaEcl.textContent = "-";
  els.metaMask.textContent = "-";
  els.metaContrast.textContent = "-";
  els.metaAmbiguous.textContent = "-";
  els.metaReadCheck.textContent = "-";
  els.metaReadDifference.textContent = "-";
  els.metaReadCheck.removeAttribute("data-state");
  els.metaReadDifference.removeAttribute("title");
}

async function loadBitmap(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    const timeout = window.setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error(t("imageLoadTimeout")));
    }, 10000);

    image.decoding = "async";
    image.onload = () => {
      window.clearTimeout(timeout);
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      window.clearTimeout(timeout);
      URL.revokeObjectURL(url);
      reject(new Error(t("imageLoadFailed")));
    };
    image.src = url;
  });
}

function drawInputImage(bitmap) {
  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;
  const scale = Math.min(1, Math.sqrt(MAX_INPUT_PIXELS / (originalWidth * originalHeight)));
  const width = Math.max(1, Math.round(originalWidth * scale));
  const height = Math.max(1, Math.round(originalHeight * scale));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = width;
  canvas.height = height;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(bitmap, 0, 0, width, height);
  const preview = drawSourcePreview(canvas);
  return {
    canvas,
    ctx,
    preview,
    warning: scale < 1 ? t("inputScaledWarning", { percent: Math.round(scale * 100) }) : "",
  };
}

function resetSourcePreview() {
  const canvas = els.sourceCanvas;
  const ctx = canvas.getContext("2d");
  canvas.width = SOURCE_PREVIEW_SIZE;
  canvas.height = SOURCE_PREVIEW_SIZE;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SOURCE_PREVIEW_SIZE, SOURCE_PREVIEW_SIZE);
  els.dropZone.classList.add("is-empty");
}

function drawSourcePreview(sourceCanvas) {
  const canvas = els.sourceCanvas;
  const ctx = canvas.getContext("2d");
  canvas.width = SOURCE_PREVIEW_SIZE;
  canvas.height = SOURCE_PREVIEW_SIZE;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SOURCE_PREVIEW_SIZE, SOURCE_PREVIEW_SIZE);

  const scale = Math.min(1, SOURCE_PREVIEW_SIZE / sourceCanvas.width, SOURCE_PREVIEW_SIZE / sourceCanvas.height);
  const width = Math.max(1, Math.round(sourceCanvas.width * scale));
  const height = Math.max(1, Math.round(sourceCanvas.height * scale));
  const offsetX = Math.round((SOURCE_PREVIEW_SIZE - width) / 2);
  const offsetY = Math.round((SOURCE_PREVIEW_SIZE - height) / 2);

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, offsetX, offsetY, width, height);
  els.dropZone.classList.remove("is-empty");

  return {
    canvas,
    ctx,
    offsetX,
    offsetY,
    scaleX: width / sourceCanvas.width,
    scaleY: height / sourceCanvas.height,
  };
}

async function findQrInImage(sourceCanvas, sourceImage) {
  const context = {
    attempts: 0,
    deadline: performance.now() + DETECTION_TIME_BUDGET_MS,
  };
  const fullCandidate = {
    x: 0,
    y: 0,
    width: sourceCanvas.width,
    height: sourceCanvas.height,
    source: "full",
    score: sourceCanvas.width * sourceCanvas.height,
  };
  const direct = await tryDecodeCandidate(sourceCanvas, fullCandidate, context);
  if (direct) return direct;

  const nativeDetection = await findQrWithBarcodeDetector(sourceCanvas, sourceImage, context);
  if (nativeDetection) return nativeDetection;

  const regionCandidates = findDarkRegionCandidates(sourceImage, sourceCanvas.width, sourceCanvas.height);
  for (const candidate of regionCandidates.slice(0, REGION_CANDIDATE_LIMIT)) {
    const decoded = await tryDecodeCandidate(sourceCanvas, candidate, context);
    if (decoded) return decoded;
  }

  const fallbackCandidates = buildFallbackCandidates(sourceCanvas.width, sourceCanvas.height);
  for (const candidate of fallbackCandidates) {
    const decoded = await tryDecodeCandidate(sourceCanvas, candidate, context);
    if (decoded) return decoded;
  }

  return null;
}

async function findQrWithBarcodeDetector(sourceCanvas, sourceImage, context) {
  if (!("BarcodeDetector" in window)) return null;

  try {
    await stepDetection(context);
    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    const barcodes = await detector.detect(sourceCanvas);

    for (const barcode of barcodes) {
      if (!barcode.cornerPoints || barcode.cornerPoints.length < 4) continue;
      const decoded = await decodeBarcodeDetectorCorners(
        sourceImage,
        sourceCanvas.width,
        sourceCanvas.height,
        barcode.cornerPoints,
        barcode.rawValue,
        context,
      );
      if (decoded) return decoded;
    }
  } catch {
    return null;
  }

  return null;
}

async function decodeBarcodeDetectorCorners(sourceImage, sourceWidth, sourceHeight, cornerPoints, rawValue, context) {
  const cornerCandidates = buildCornerOrderCandidates(cornerPoints);
  const outputSize = 760;

  for (const corners of cornerCandidates) {
    const transform = squareToQuadrilateralTransform(corners[0], corners[1], corners[2], corners[3]);
    const warped = renderWarpedImageData(sourceImage, sourceWidth, sourceHeight, transform, outputSize);

    for (const mode of ["raw", "contrast", "binary", "gray"]) {
      await stepDetection(context);
      const imageData = mode === "raw" ? warped : cloneImageData(warped);
      if (mode !== "raw") preprocessForDetection(imageData, mode);

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      });

      if (!code || (rawValue && code.data !== rawValue)) continue;

      return {
        code,
        location: mapNormalizedLocation(code.location, transform, outputSize),
        notice: t("barcodeDetectorNotice"),
      };
    }
  }

  return null;
}

function buildCornerOrderCandidates(cornerPoints) {
  const points = cornerPoints.slice(0, 4).map((point) => ({ x: point.x, y: point.y }));
  const candidates = [];
  const add = (candidate) => {
    const key = candidate.map((point) => `${Math.round(point.x)},${Math.round(point.y)}`).join("|");
    if (!candidates.some((existing) => existing.key === key)) {
      candidates.push({ key, points: candidate });
    }
  };

  for (let offset = 0; offset < 4; offset += 1) {
    const rotated = points.slice(offset).concat(points.slice(0, offset));
    add(rotated);
    add([rotated[0], rotated[3], rotated[2], rotated[1]]);
  }
  add(orderCornersByRows(points));

  return candidates.map((candidate) => candidate.points);
}

function orderCornersByRows(points) {
  const sorted = [...points].sort((a, b) => a.y - b.y);
  const top = sorted.slice(0, 2).sort((a, b) => a.x - b.x);
  const bottom = sorted.slice(2, 4).sort((a, b) => a.x - b.x);
  return [top[0], top[1], bottom[1], bottom[0]];
}

function mapNormalizedLocation(location, transform, outputSize) {
  const map = (point) => mapPoint(transform, point.x / outputSize, point.y / outputSize);

  return {
    topRightCorner: map(location.topRightCorner),
    topLeftCorner: map(location.topLeftCorner),
    bottomRightCorner: map(location.bottomRightCorner),
    bottomLeftCorner: map(location.bottomLeftCorner),
    topRightFinderPattern: map(location.topRightFinderPattern),
    topLeftFinderPattern: map(location.topLeftFinderPattern),
    bottomLeftFinderPattern: map(location.bottomLeftFinderPattern),
    bottomRightAlignmentPattern: location.bottomRightAlignmentPattern ? map(location.bottomRightAlignmentPattern) : undefined,
  };
}

async function tryDecodeCandidate(sourceCanvas, candidate, context) {
  const modes = candidate.source === "full" ? ["raw", "contrast", "binary"] : ["raw", "contrast", "binary", "gray"];
  const scales = detectionScales(candidate);

  for (const scale of scales) {
    for (const mode of modes) {
      await stepDetection(context);
      const prepared = prepareCandidateImage(sourceCanvas, candidate, scale, mode);
      const code = jsQR(prepared.imageData.data, prepared.width, prepared.height, {
        inversionAttempts: "attemptBoth",
      });

      if (code) {
        return {
          code,
          location: mapDetectedLocation(code.location, candidate, prepared.scaleX, prepared.scaleY),
          notice: buildDetectionNotice(candidate.source, mode, scale),
        };
      }
    }
  }

  return null;
}

async function stepDetection(context) {
  context.attempts += 1;
  if (context.attempts % DETECTION_YIELD_EVERY === 0) {
    await yieldToBrowser();
  }

  if (performance.now() > context.deadline) {
    throw new Error(t("detectionTimeout"));
  }
}

function buildDetectionNotice(source, mode, scale) {
  if (source === "full" && mode === "raw" && scale === 1) return "";

  const parts = [];
  if (source === "dark-region") {
    parts.push(t("detectionNoticeDarkRegion"));
  } else if (source === "grid") {
    parts.push(t("detectionNoticeGrid"));
  }

  if (mode === "contrast") {
    parts.push(t("detectionNoticeContrast"));
  } else if (mode === "binary") {
    parts.push(t("detectionNoticeBinary"));
  } else if (mode === "gray") {
    parts.push(t("detectionNoticeGray"));
  } else if (scale !== 1) {
    parts.push(t("detectionNoticeScaled"));
  }

  return parts.length > 0 ? t("detectionNoticeComplete", { parts }) : "";
}

function detectionScales(candidate) {
  const minSide = Math.min(candidate.width, candidate.height);
  const targetScale = clamp(720 / Math.max(1, minSide), 1, 3.2);
  const scales = [1, targetScale, 1.5, 2.2, 3.0]
    .map((scale) => Math.min(scale, MAX_DETECTION_SIDE / Math.max(candidate.width, candidate.height)))
    .filter((scale) => scale >= 0.85);

  return [...new Set(scales.map((scale) => Number(scale.toFixed(2))))];
}

function prepareCandidateImage(sourceCanvas, candidate, scale, mode) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(candidate.width * scale));
  canvas.height = Math.max(1, Math.round(candidate.height * scale));

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = scale < 1.25;
  ctx.drawImage(
    sourceCanvas,
    candidate.x,
    candidate.y,
    candidate.width,
    candidate.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  if (mode !== "raw") {
    preprocessForDetection(imageData, mode);
  }

  return {
    imageData,
    width: canvas.width,
    height: canvas.height,
    scaleX: canvas.width / candidate.width,
    scaleY: canvas.height / candidate.height,
  };
}

function preprocessForDetection(imageData, mode) {
  const grays = new Array(imageData.width * imageData.height);
  for (let i = 0, p = 0; i < imageData.data.length; i += 4, p += 1) {
    grays[p] = imageData.data[i] * 0.299 + imageData.data[i + 1] * 0.587 + imageData.data[i + 2] * 0.114;
  }

  if (mode === "binary") {
    const threshold = otsuThreshold(grays);
    for (let i = 0, p = 0; i < imageData.data.length; i += 4, p += 1) {
      const value = grays[p] <= threshold ? 0 : 255;
      imageData.data[i] = value;
      imageData.data[i + 1] = value;
      imageData.data[i + 2] = value;
      imageData.data[i + 3] = 255;
    }
    return;
  }

  if (mode === "contrast") {
    const sorted = [...grays].sort((a, b) => a - b);
    const low = sorted[Math.floor(sorted.length * 0.03)] ?? 0;
    const high = sorted[Math.floor(sorted.length * 0.97)] ?? 255;
    const range = Math.max(1, high - low);
    for (let i = 0, p = 0; i < imageData.data.length; i += 4, p += 1) {
      const value = clamp(Math.round(((grays[p] - low) / range) * 255), 0, 255);
      imageData.data[i] = value;
      imageData.data[i + 1] = value;
      imageData.data[i + 2] = value;
      imageData.data[i + 3] = 255;
    }
    return;
  }

  for (let i = 0, p = 0; i < imageData.data.length; i += 4, p += 1) {
    const value = Math.round(grays[p]);
    imageData.data[i] = value;
    imageData.data[i + 1] = value;
    imageData.data[i + 2] = value;
    imageData.data[i + 3] = 255;
  }
}

function mapDetectedLocation(location, candidate, scaleX, scaleY) {
  const map = (point) => ({
    x: candidate.x + point.x / scaleX,
    y: candidate.y + point.y / scaleY,
  });

  return {
    topRightCorner: map(location.topRightCorner),
    topLeftCorner: map(location.topLeftCorner),
    bottomRightCorner: map(location.bottomRightCorner),
    bottomLeftCorner: map(location.bottomLeftCorner),
    topRightFinderPattern: map(location.topRightFinderPattern),
    topLeftFinderPattern: map(location.topLeftFinderPattern),
    bottomLeftFinderPattern: map(location.bottomLeftFinderPattern),
    bottomRightAlignmentPattern: location.bottomRightAlignmentPattern ? map(location.bottomRightAlignmentPattern) : undefined,
  };
}

function findDarkRegionCandidates(imageData, width, height) {
  const cellSize = Math.max(5, Math.round(Math.min(width, height) / REGION_GRID_CELLS));
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  const darkCounts = new Uint16Array(gridWidth * gridHeight);
  const sampleCounts = new Uint16Array(gridWidth * gridHeight);
  const graySamples = [];
  const pixelStep = Math.max(1, Math.round(cellSize / 3));

  for (let y = 0; y < height; y += pixelStep) {
    for (let x = 0; x < width; x += pixelStep) {
      const gray = sampleGray(imageData, width, height, x, y);
      graySamples.push(gray);
    }
  }

  const threshold = Math.min(otsuThreshold(graySamples), 170);
  for (let y = 0; y < height; y += pixelStep) {
    const gy = Math.floor(y / cellSize);
    for (let x = 0; x < width; x += pixelStep) {
      const gx = Math.floor(x / cellSize);
      const index = gy * gridWidth + gx;
      sampleCounts[index] += 1;
      if (sampleGray(imageData, width, height, x, y) <= threshold) {
        darkCounts[index] += 1;
      }
    }
  }

  const occupied = new Uint8Array(gridWidth * gridHeight);
  for (let index = 0; index < occupied.length; index += 1) {
    occupied[index] = sampleCounts[index] > 0 && darkCounts[index] / sampleCounts[index] > 0.08 ? 1 : 0;
  }

  const dilated = dilateGrid(occupied, gridWidth, gridHeight, 2);
  const visited = new Uint8Array(gridWidth * gridHeight);
  const candidates = [];

  for (let gy = 0; gy < gridHeight; gy += 1) {
    for (let gx = 0; gx < gridWidth; gx += 1) {
      const start = gy * gridWidth + gx;
      if (!dilated[start] || visited[start]) continue;

      const component = collectComponent(dilated, visited, gridWidth, gridHeight, gx, gy);
      const box = componentToCandidate(component, cellSize, width, height);
      if (!box) continue;
      candidates.push(box);
    }
  }

  return mergeCandidateBoxes(candidates)
    .sort((a, b) => b.score - a.score)
    .slice(0, REGION_CANDIDATE_LIMIT);
}

function dilateGrid(grid, width, height, radius) {
  const output = new Uint8Array(grid.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!grid[y * width + x]) continue;
      for (let yy = Math.max(0, y - radius); yy <= Math.min(height - 1, y + radius); yy += 1) {
        for (let xx = Math.max(0, x - radius); xx <= Math.min(width - 1, x + radius); xx += 1) {
          output[yy * width + xx] = 1;
        }
      }
    }
  }
  return output;
}

function collectComponent(grid, visited, width, height, startX, startY) {
  const stack = [{ x: startX, y: startY }];
  const component = {
    minX: startX,
    minY: startY,
    maxX: startX,
    maxY: startY,
    count: 0,
  };

  visited[startY * width + startX] = 1;
  while (stack.length > 0) {
    const point = stack.pop();
    component.count += 1;
    component.minX = Math.min(component.minX, point.x);
    component.minY = Math.min(component.minY, point.y);
    component.maxX = Math.max(component.maxX, point.x);
    component.maxY = Math.max(component.maxY, point.y);

    for (let yy = point.y - 1; yy <= point.y + 1; yy += 1) {
      for (let xx = point.x - 1; xx <= point.x + 1; xx += 1) {
        if (xx < 0 || yy < 0 || xx >= width || yy >= height) continue;
        const index = yy * width + xx;
        if (!grid[index] || visited[index]) continue;
        visited[index] = 1;
        stack.push({ x: xx, y: yy });
      }
    }
  }

  return component;
}

function componentToCandidate(component, cellSize, width, height) {
  const rawX = component.minX * cellSize;
  const rawY = component.minY * cellSize;
  const rawWidth = (component.maxX - component.minX + 1) * cellSize;
  const rawHeight = (component.maxY - component.minY + 1) * cellSize;
  const minSide = Math.min(rawWidth, rawHeight);
  const maxSide = Math.max(rawWidth, rawHeight);
  const aspect = rawWidth / Math.max(1, rawHeight);

  if (minSide < 80 || maxSide < 120 || aspect < 0.45 || aspect > 2.1) {
    return null;
  }

  const padding = Math.max(22, Math.round(maxSide * 0.18));
  const x = clamp(rawX - padding, 0, width - 1);
  const y = clamp(rawY - padding, 0, height - 1);
  const right = clamp(rawX + rawWidth + padding, 1, width);
  const bottom = clamp(rawY + rawHeight + padding, 1, height);
  const candidateWidth = right - x;
  const candidateHeight = bottom - y;
  const candidateAspect = candidateWidth / Math.max(1, candidateHeight);
  const squareScore = 1 - Math.min(0.8, Math.abs(1 - candidateAspect));
  const area = candidateWidth * candidateHeight;

  return {
    x,
    y,
    width: candidateWidth,
    height: candidateHeight,
    score: area * squareScore + component.count * cellSize * cellSize,
    source: "dark-region",
  };
}

function mergeCandidateBoxes(candidates) {
  const result = [];
  for (const candidate of candidates) {
    const duplicate = result.some((existing) => intersectionOverUnion(candidate, existing) > 0.62);
    if (!duplicate) result.push(candidate);
  }
  return result;
}

function buildFallbackCandidates(width, height) {
  const minImageSide = Math.min(width, height);
  const maxImageSide = Math.max(width, height);
  const sideLengths = [0.38, 0.5, 0.62, 0.78, 0.92]
    .map((ratio) => Math.round(minImageSide * ratio))
    .filter((side) => side >= 120 && side <= maxImageSide);
  const candidates = [];

  for (const side of sideLengths) {
    const step = Math.max(48, Math.round(side * 0.32));
    for (let y = 0; y <= height - side; y += step) {
      for (let x = 0; x <= width - side; x += step) {
        candidates.push({
          x,
          y,
          width: side,
          height: side,
          score: side * side,
          source: "grid",
        });
      }
    }
  }

  return mergeCandidateBoxes(candidates)
    .sort((a, b) => {
      const ay = a.y / height;
      const by = b.y / height;
      const ax = a.x / width;
      const bx = b.x / width;
      return ay + ax * 0.35 - (by + bx * 0.35);
    })
    .slice(0, FALLBACK_CANDIDATE_LIMIT);
}

function intersectionOverUnion(a, b) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = a.width * a.height + b.width * b.height - intersection;
  return union > 0 ? intersection / union : 0;
}

function mapCornersToPreview(corners, preview) {
  const mapPoint = (point) => ({
    x: preview.offsetX + point.x * preview.scaleX,
    y: preview.offsetY + point.y * preview.scaleY,
  });

  return {
    topLeftCorner: mapPoint(corners.topLeftCorner),
    topRightCorner: mapPoint(corners.topRightCorner),
    bottomRightCorner: mapPoint(corners.bottomRightCorner),
    bottomLeftCorner: mapPoint(corners.bottomLeftCorner),
  };
}

function drawSourceOverlay(ctx, canvas, corners) {
  const path = [
    corners.topLeftCorner,
    corners.topRightCorner,
    corners.bottomRightCorner,
    corners.bottomLeftCorner,
  ];

  ctx.save();
  ctx.lineWidth = Math.max(3, Math.round(Math.min(canvas.width, canvas.height) * 0.004));
  ctx.strokeStyle = "#d13b43";
  ctx.fillStyle = "rgba(209, 59, 67, 0.14)";
  ctx.beginPath();
  path.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#111827";
  path.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, ctx.lineWidth * 1.4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function squareToQuadrilateralTransform(topLeft, topRight, bottomRight, bottomLeft) {
  const x0 = topLeft.x;
  const y0 = topLeft.y;
  const x1 = topRight.x;
  const y1 = topRight.y;
  const x2 = bottomRight.x;
  const y2 = bottomRight.y;
  const x3 = bottomLeft.x;
  const y3 = bottomLeft.y;

  const dx1 = x1 - x2;
  const dy1 = y1 - y2;
  const dx2 = x3 - x2;
  const dy2 = y3 - y2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy3 = y0 - y1 + y2 - y3;

  if (Math.abs(dx3) < 1e-9 && Math.abs(dy3) < 1e-9) {
    return {
      a: x1 - x0,
      b: x3 - x0,
      c: x0,
      d: y1 - y0,
      e: y3 - y0,
      f: y0,
      g: 0,
      h: 0,
    };
  }

  const denominator = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / denominator;
  const h = (dx1 * dy3 - dx3 * dy1) / denominator;

  return {
    a: x1 - x0 + g * x1,
    b: x3 - x0 + h * x3,
    c: x0,
    d: y1 - y0 + g * y1,
    e: y3 - y0 + h * y3,
    f: y0,
    g,
    h,
  };
}

function mapPoint(transform, u, v) {
  const denominator = transform.g * u + transform.h * v + 1;
  return {
    x: (transform.a * u + transform.b * v + transform.c) / denominator,
    y: (transform.d * u + transform.e * v + transform.f) / denominator,
  };
}

function renderWarpedQr(sourceImage, sourceWidth, sourceHeight, transform, modules) {
  const outputSize = modules * WARPED_MODULE_PIXELS;
  return renderWarpedImageData(sourceImage, sourceWidth, sourceHeight, transform, outputSize);
}

function renderWarpedImageData(sourceImage, sourceWidth, sourceHeight, transform, outputSize) {
  const output = new ImageData(outputSize, outputSize);

  for (let y = 0; y < outputSize; y += 1) {
    for (let x = 0; x < outputSize; x += 1) {
      const point = mapPoint(transform, x / outputSize, y / outputSize);
      const color = sampleRgb(sourceImage, sourceWidth, sourceHeight, point.x, point.y);
      const offset = (y * outputSize + x) * 4;
      output.data[offset] = color.r;
      output.data[offset + 1] = color.g;
      output.data[offset + 2] = color.b;
      output.data[offset + 3] = 255;
    }
  }

  return output;
}

function sampleWarpedModules(warpedImage, size) {
  const grays = [];
  const grayMatrix = [];
  const statsMatrix = [];
  const bounds = findBestSamplingBounds(warpedImage, size);

  for (let y = 0; y < size; y += 1) {
    const grayRow = [];
    const statsRow = [];
    for (let x = 0; x < size; x += 1) {
      const stats = sampleWarpedModuleStats(warpedImage, bounds, x, y);
      grayRow.push(stats.mean);
      statsRow.push(stats);
      grays.push(stats.mean);
    }
    grayMatrix.push(grayRow);
    statsMatrix.push(statsRow);
  }

  const otsu = otsuThreshold(grays);
  const initialDarkValues = grays.filter((gray) => gray <= otsu);
  const initialLightValues = grays.filter((gray) => gray > otsu);
  const threshold =
    initialDarkValues.length > 0 && initialLightValues.length > 0
      ? (mean(initialDarkValues) + mean(initialLightValues)) / 2
      : otsu;
  const initialModules = grayMatrix.map((row) => row.map((gray) => gray < threshold));
  const refined = refineModulesWithLocalContrast(grayMatrix, statsMatrix, initialModules, threshold);
  const modules = refined.modules;
  const values = grayMatrix.flat();
  const distances = values.map((gray, index) => Math.abs(gray - refined.thresholds[Math.floor(index / size)][index % size]));
  const ambiguousCells = distances.filter((distance) => distance < AMBIGUOUS_MARGIN).length;
  const darkValues = [];
  const lightValues = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (modules[y][x]) darkValues.push(grayMatrix[y][x]);
      else lightValues.push(grayMatrix[y][x]);
    }
  }
  const contrast = Math.round(mean(lightValues) - mean(darkValues));

  return {
    modules,
    threshold,
    localAdjustedCells: refined.adjustedCells,
    samplingBounds: bounds,
    contrast,
    ambiguousCells,
  };
}

function findBestSamplingBounds(warpedImage, size) {
  const base = {
    left: 0,
    top: 0,
    right: warpedImage.width,
    bottom: warpedImage.height,
    cellWidth: warpedImage.width / size,
    cellHeight: warpedImage.height / size,
    adjustment: { left: 0, top: 0, right: 0, bottom: 0 },
  };
  const expectations = buildFunctionPatternExpectations(size);
  let best = {
    bounds: base,
    score: scoreSamplingBounds(warpedImage, base, expectations),
  };

  for (const left of SAMPLING_BOUND_CANDIDATES) {
    for (const top of SAMPLING_BOUND_CANDIDATES) {
      for (const right of SAMPLING_BOUND_CANDIDATES) {
        for (const bottom of SAMPLING_BOUND_CANDIDATES) {
          const candidate = buildSamplingBounds(warpedImage, size, left, top, right, bottom);
          const score = scoreSamplingBounds(warpedImage, candidate, expectations);
          if (score > best.score) {
            best = { bounds: candidate, score };
          }
        }
      }
    }
  }

  return best.bounds;
}

function buildSamplingBounds(warpedImage, size, left, top, right, bottom) {
  const bounds = {
    left,
    top,
    right: warpedImage.width - right,
    bottom: warpedImage.height - bottom,
    adjustment: { left, top, right, bottom },
  };
  bounds.cellWidth = (bounds.right - bounds.left) / size;
  bounds.cellHeight = (bounds.bottom - bounds.top) / size;
  return bounds;
}

function scoreSamplingBounds(warpedImage, bounds, expectations) {
  if (bounds.cellWidth < 1 || bounds.cellHeight < 1) return -Infinity;

  const samples = expectations.map((expectation) => ({
    expectedDark: expectation.dark,
    gray: sampleWarpedModuleStats(warpedImage, bounds, expectation.x, expectation.y).mean,
  }));
  const darkValues = samples.filter((sample) => sample.expectedDark).map((sample) => sample.gray);
  const lightValues = samples.filter((sample) => !sample.expectedDark).map((sample) => sample.gray);
  if (!darkValues.length || !lightValues.length) return -Infinity;

  const threshold = (mean(darkValues) + mean(lightValues)) / 2;
  let score = mean(lightValues) - mean(darkValues);
  for (const sample of samples) {
    const margin = sample.expectedDark ? threshold - sample.gray : sample.gray - threshold;
    score += clamp(margin, -45, 45);
    score += margin > 0 ? 12 : -20;
  }

  const { left, top, right, bottom } = bounds.adjustment;
  score -= (Math.abs(left) + Math.abs(top) + Math.abs(right) + Math.abs(bottom)) * 0.5;
  return score;
}

function buildFunctionPatternExpectations(size) {
  const modules = new Map();
  const set = (x, y, dark) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    modules.set(`${x},${y}`, { x, y, dark });
  };
  const addFinder = (originX, originY) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const outer = x === 0 || x === 6 || y === 0 || y === 6;
        const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        set(originX + x, originY + y, outer || inner);
      }
    }
  };

  addFinder(0, 0);
  addFinder(size - 7, 0);
  addFinder(0, size - 7);

  for (let i = 0; i < 8; i += 1) {
    set(7, i, false);
    set(i, 7, false);
    set(size - 8, i, false);
    set(size - 1 - i, 7, false);
    set(7, size - 1 - i, false);
    set(i, size - 8, false);
  }

  for (let i = 8; i <= size - 9; i += 1) {
    set(i, 6, i % 2 === 0);
    set(6, i, i % 2 === 0);
  }

  set(8, size - 8, true);

  return [...modules.values()];
}

function refineModulesWithLocalContrast(grayMatrix, statsMatrix, initialModules, globalThreshold) {
  const size = grayMatrix.length;
  const modules = [];
  const thresholds = [];
  let adjustedCells = 0;

  for (let y = 0; y < size; y += 1) {
    const row = [];
    const thresholdRow = [];
    for (let x = 0; x < size; x += 1) {
      const localThreshold = localModuleThreshold(grayMatrix, initialModules, x, y, globalThreshold);
      const stats = statsMatrix[y][x];
      const threshold = Number.isFinite(localThreshold)
        ? globalThreshold * 0.35 + localThreshold * 0.65
        : globalThreshold;
      const isDark = stats.mean < threshold;

      if (isDark !== initialModules[y][x]) adjustedCells += 1;
      row.push(isDark);
      thresholdRow.push(threshold);
    }
    modules.push(row);
    thresholds.push(thresholdRow);
  }

  return {
    modules,
    thresholds,
    adjustedCells,
  };
}

function localModuleThreshold(grayMatrix, modules, moduleX, moduleY, fallback) {
  const darkValues = [];
  const lightValues = [];
  const size = grayMatrix.length;

  for (let y = Math.max(0, moduleY - LOCAL_WINDOW_RADIUS); y <= Math.min(size - 1, moduleY + LOCAL_WINDOW_RADIUS); y += 1) {
    for (let x = Math.max(0, moduleX - LOCAL_WINDOW_RADIUS); x <= Math.min(size - 1, moduleX + LOCAL_WINDOW_RADIUS); x += 1) {
      if (x === moduleX && y === moduleY) continue;
      if (modules[y][x]) darkValues.push(grayMatrix[y][x]);
      else lightValues.push(grayMatrix[y][x]);
    }
  }

  if (darkValues.length < 2 || lightValues.length < 2) return fallback;

  return (mean(darkValues) + mean(lightValues)) / 2;
}

function sampleWarpedModuleStats(warpedImage, bounds, moduleX, moduleY) {
  const left = bounds.left + moduleX * bounds.cellWidth;
  const top = bounds.top + moduleY * bounds.cellHeight;
  const right = bounds.left + (moduleX + 1) * bounds.cellWidth;
  const bottom = bounds.top + (moduleY + 1) * bounds.cellHeight;
  const startX = clamp(Math.floor(left), 0, warpedImage.width - 1);
  const startY = clamp(Math.floor(top), 0, warpedImage.height - 1);
  const endX = clamp(Math.ceil(right), startX + 1, warpedImage.width);
  const endY = clamp(Math.ceil(bottom), startY + 1, warpedImage.height);
  let total = 0;
  let count = 0;

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      total += pixelGray(warpedImage, x, y);
      count += 1;
    }
  }

  return {
    mean: count > 0 ? total / count : 0,
  };
}

function sampleRgb(imageData, width, height, x, y) {
  const ix = clamp(Math.round(x), 0, width - 1);
  const iy = clamp(Math.round(y), 0, height - 1);
  const offset = (iy * width + ix) * 4;
  return {
    r: imageData.data[offset],
    g: imageData.data[offset + 1],
    b: imageData.data[offset + 2],
  };
}

function pixelGray(imageData, x, y) {
  const offset = (y * imageData.width + x) * 4;
  return imageData.data[offset] * 0.299 + imageData.data[offset + 1] * 0.587 + imageData.data[offset + 2] * 0.114;
}

function sampleGray(imageData, width, height, x, y) {
  const color = sampleRgb(imageData, width, height, x, y);
  return color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
}

function otsuThreshold(values) {
  const histogram = new Array(256).fill(0);
  values.forEach((value) => {
    histogram[clamp(Math.round(value), 0, 255)] += 1;
  });

  const total = values.length;
  let sum = 0;
  for (let i = 0; i < 256; i += 1) {
    sum += i * histogram[i];
  }

  let sumBackground = 0;
  let weightBackground = 0;
  let maxVariance = -1;
  let threshold = 128;

  for (let i = 0; i < 256; i += 1) {
    weightBackground += histogram[i];
    if (weightBackground === 0) continue;

    const weightForeground = total - weightBackground;
    if (weightForeground === 0) break;

    sumBackground += i * histogram[i];
    const meanBackground = sumBackground / weightBackground;
    const meanForeground = (sum - sumBackground) / weightForeground;
    const variance = weightBackground * weightForeground * (meanBackground - meanForeground) ** 2;

    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = i;
    }
  }

  return threshold;
}

function renderMatrix(modules, canvas) {
  const size = modules.length;
  const pixelSize = (size + QUIET_ZONE_MODULES * 2) * MATRIX_MODULE_PIXELS;
  const ctx = canvas.getContext("2d");
  canvas.width = pixelSize;
  canvas.height = pixelSize;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, pixelSize, pixelSize);
  ctx.fillStyle = "#111111";

  modules.forEach((row, y) => {
    row.forEach((isDark, x) => {
      if (!isDark) return;
      ctx.fillRect(
        (x + QUIET_ZONE_MODULES) * MATRIX_MODULE_PIXELS,
        (y + QUIET_ZONE_MODULES) * MATRIX_MODULE_PIXELS,
        MATRIX_MODULE_PIXELS,
        MATRIX_MODULE_PIXELS,
      );
    });
  });

  if (els.matrixSize) {
    els.matrixSize.textContent = `${size} x ${size} cells`;
  }
}

function verifyExtractedMatrix(canvas, original) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const decoded = jsQR(imageData.data, canvas.width, canvas.height, {
    inversionAttempts: "attemptBoth",
  });

  if (!decoded) {
    return {
      ok: false,
      reason: t("extractedMatrixUnreadableReason"),
      originalData: original.data,
      originalVersion: original.version,
      extractedData: null,
      extractedVersion: null,
      decodedMatches: false,
      differences: [t("extractedQrUnreadable")],
    };
  }

  const differences = [];
  if (decoded.data !== original.data) {
    differences.push("Content");
  }

  if (decoded.version !== original.version) {
    differences.push("Version");
  }

  if (differences.length > 0) {
    return {
      ok: false,
      reason: t("decodedMismatchReason"),
      originalData: original.data,
      originalVersion: original.version,
      extractedData: decoded.data,
      extractedVersion: decoded.version,
      decodedMatches: false,
      differences,
    };
  }

  return {
    ok: true,
    originalData: original.data,
    originalVersion: original.version,
    extractedData: decoded.data,
    extractedVersion: decoded.version,
    decodedMatches: true,
    differences: [],
  };
}

function decodeFormatInformation(modules) {
  const size = modules.length;
  const candidates = [readFormatBitsPrimary(modules), readFormatBitsSecondary(modules)];
  let best = null;

  for (let data = 0; data < 32; data += 1) {
    const code = buildFormatCode(data);
    for (const read of candidates) {
      const distance = hammingDistance15(read, code);
      if (!best || distance < best.distance) {
        best = {
          data,
          distance,
          read,
          code,
        };
      }
    }
  }

  if (!best || best.distance > 3) return null;

  const eclBits = best.data >> 3;
  const maskPattern = best.data & 0b111;
  return {
    errorCorrectionLevel: errorCorrectionLevelName(eclBits),
    maskPattern,
    bitErrors: best.distance,
  };
}

function readFormatBitsPrimary(modules) {
  let bits = 0;
  const set = (index, value) => {
    if (value) bits |= 1 << index;
  };

  for (let i = 0; i <= 5; i += 1) set(i, modules[i][8]);
  set(6, modules[7][8]);
  set(7, modules[8][8]);
  set(8, modules[8][7]);
  for (let i = 9; i <= 14; i += 1) set(i, modules[8][14 - i]);
  return bits;
}

function readFormatBitsSecondary(modules) {
  let bits = 0;
  const size = modules.length;
  const set = (index, value) => {
    if (value) bits |= 1 << index;
  };

  for (let i = 0; i <= 7; i += 1) set(i, modules[8][size - 1 - i]);
  for (let i = 8; i <= 14; i += 1) set(i, modules[size - 15 + i][8]);
  return bits;
}

function buildFormatCode(data) {
  let remainder = data;
  for (let i = 0; i < 10; i += 1) {
    remainder = (remainder << 1) ^ (((remainder >> 9) & 1) ? 0x537 : 0);
  }
  return ((data << 10) | (remainder & 0x3ff)) ^ 0x5412;
}

function hammingDistance15(a, b) {
  let value = (a ^ b) & 0x7fff;
  let count = 0;
  while (value) {
    value &= value - 1;
    count += 1;
  }
  return count;
}

function errorCorrectionLevelName(bits) {
  switch (bits) {
    case 0:
      return "M";
    case 1:
      return "L";
    case 2:
      return "H";
    case 3:
      return "Q";
    default:
      return "unknown";
  }
}

function renderMetadata(file, detected, sample, format, warning, verification) {
  els.metaContent.textContent = detected.data || "(empty)";
  els.metaVersion.textContent = String(detected.version);
  els.metaCells.textContent = `${17 + detected.version * 4} x ${17 + detected.version * 4}`;
  els.metaEcl.textContent = `${format.errorCorrectionLevel} (${format.bitErrors} format bit error${format.bitErrors === 1 ? "" : "s"})`;
  els.metaMask.textContent = String(format.maskPattern);
  els.metaContrast.textContent = `${sample.contrast}`;
  els.metaAmbiguous.textContent = `${sample.ambiguousCells} / local adjusted ${sample.localAdjustedCells}`;
  renderVerification(verification);

  els.metaContent.title = `file: ${file.name}${warning ? ` / ${warning}` : ""}`;
}

function renderVerification(verification) {
  els.metaReadCheck.textContent = verification.ok ? t("verifyMatch") : t("verifyMismatch");
  els.metaReadCheck.dataset.state = verification.ok ? "ok" : "error";
  els.metaReadDifference.textContent = buildReadDifferenceText(verification);
  els.metaReadDifference.title = buildReadDifferenceTitle(verification);
}

function buildReadDifferenceText(verification) {
  if (verification.ok) {
    return t("readDifferenceMatch", { version: verification.originalVersion });
  }

  if (!verification.extractedData) {
    return t("readDifferenceUnreadable", { version: verification.originalVersion });
  }

  const parts = verification.differences.map((key) => {
    if (key === "Content") return "Content";
    if (key === "Version") return `Version ${verification.originalVersion} / ${verification.extractedVersion}`;
    return key;
  });

  return parts.join(", ");
}

function buildReadDifferenceTitle(verification) {
  const extracted = verification.extractedData ?? t("unreadable");
  return [
    "decode: jsQR error-corrected result",
    `detected version: ${verification.originalVersion}`,
    `extracted version: ${verification.extractedVersion ?? "-"}`,
    `detected content: ${verification.originalData || "(empty)"}`,
    `extracted content: ${extracted || "(empty)"}`,
  ].join("\n");
}

function setExportButtonsEnabled(enabled) {
  [els.downloadPreviewProof, els.downloadTiffDtp, els.downloadPngOffice, els.downloadSvg, els.downloadPdf, els.downloadEps].forEach((button) => {
    if (button) button.disabled = !enabled;
  });
}

async function savePreviewProof() {
  const blob = await generatePreviewProofPngBlob(latestResult);
  await saveBlobAs(
    blob,
    buildExportFilename(latestResult, "proof", "png"),
    [{ description: "PNG image", accept: { "image/png": [".png"] } }],
  );
}

function generateMatrixSvg(modules, sizing) {
  const totalModules = sizing.totalModules;
  const outputSizeMm = formatMm(sizing.outputSizeMm);
  const rects = [];

  modules.forEach((row, y) => {
    row.forEach((isDark, x) => {
      if (!isDark) return;
      rects.push(`<rect x="${x + QUIET_ZONE_MODULES}" y="${y + QUIET_ZONE_MODULES}" width="1" height="1"/>`);
    });
  });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${outputSizeMm}mm" height="${outputSizeMm}mm" viewBox="0 0 ${totalModules} ${totalModules}" shape-rendering="crispEdges">`,
    `<rect width="${totalModules}" height="${totalModules}" fill="#fff"/>`,
    `<g fill="#000">`,
    rects.join("\n"),
    `</g>`,
    `</svg>`,
    "",
  ].join("\n");
}

function generateMatrixEpsPostScript(modules, sizing) {
  const totalModules = sizing.totalModules;
  const modulePoints = sizing.moduleSizeMm * PDF_POINTS_PER_MM;
  const totalPoints = sizing.outputSizeMm * PDF_POINTS_PER_MM;
  const boundingBoxSize = Math.ceil(totalPoints);
  const paths = traceMatrixContours(modules).map((contour) => {
    const [first, ...rest] = contour;
    const commands = [
      `${formatPdfNumber(first.x * modulePoints)} ${formatPdfNumber((totalModules - first.y) * modulePoints)} moveto`,
      ...rest.map((point) => `${formatPdfNumber(point.x * modulePoints)} ${formatPdfNumber((totalModules - point.y) * modulePoints)} lineto`),
      `closepath`,
    ];
    return commands.join("\n");
  });

  return [
    `%!PS-Adobe-3.0 EPSF-3.0`,
    `%%Creator: PhoenixQR`,
    `%%BoundingBox: 0 0 ${boundingBoxSize} ${boundingBoxSize}`,
    `%%HiResBoundingBox: 0 0 ${formatPdfNumber(totalPoints)} ${formatPdfNumber(totalPoints)}`,
    `%%DocumentData: Clean7Bit`,
    `%%LanguageLevel: 2`,
    `%%Pages: 1`,
    `%%EndComments`,
    `newpath`,
    `0 0 ${formatPdfNumber(totalPoints)} ${formatPdfNumber(totalPoints)} rectclip`,
    `newpath`,
    `0 setgray`,
    ...paths,
    `eofill`,
    `showpage`,
    `%%EOF`,
    "",
  ].join("\n");
}

function generateMatrixPdfBlob(modules, sizing) {
  const modulePoints = sizing.moduleSizeMm * PDF_POINTS_PER_MM;
  const totalPoints = sizing.outputSizeMm * PDF_POINTS_PER_MM;
  const content = generateMatrixPdfContent(modules, sizing.totalModules, modulePoints);
  return new Blob([buildPdfDocument(totalPoints, totalPoints, content)], { type: "application/pdf" });
}

function generateMatrixPdfContent(modules, totalModules, modulePoints) {
  const pathCommands = traceMatrixContours(modules).flatMap((contour) => {
    const [first, ...rest] = contour;
    return [
      `${formatPdfNumber(first.x * modulePoints)} ${formatPdfNumber((totalModules - first.y) * modulePoints)} m`,
      ...rest.map((point) => `${formatPdfNumber(point.x * modulePoints)} ${formatPdfNumber((totalModules - point.y) * modulePoints)} l`),
      "h",
    ];
  });

  return [
    "q",
    "0 g",
    ...pathCommands,
    "f*",
    "Q",
  ].join("\n");
}

function buildPdfDocument(width, height, content) {
  const encoder = new TextEncoder();
  const streamContent = `${content}\n`;
  const streamLength = encoder.encode(streamContent).length;
  const pdfDate = formatPdfDate(new Date());
  const pageBox = `[0 0 ${formatPdfNumber(width)} ${formatPdfNumber(height)}]`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox ${pageBox} /TrimBox ${pageBox} /Resources << >> /Contents 4 0 R >>`,
    `<< /Length ${streamLength} >>\nstream\n${streamContent}endstream`,
    `<< /Title (PhoenixQR) /Creator (PhoenixQR) /Producer (PhoenixQR) /CreationDate (${pdfDate}) >>`,
  ];
  const chunks = [];
  const offsets = [];
  let offset = 0;

  const push = (chunk) => {
    chunks.push(chunk);
    offset += encoder.encode(chunk).length;
  };

  push("%PDF-1.4\n% PhoenixQR\n");
  objects.forEach((body, index) => {
    offsets[index + 1] = offset;
    push(`${index + 1} 0 obj\n${body}\nendobj\n`);
  });

  const xrefOffset = offset;
  push(`xref\n0 ${objects.length + 1}\n`);
  push("0000000000 65535 f \n");
  for (let i = 1; i <= objects.length; i += 1) {
    push(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  }
  push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  return encoder.encode(chunks.join(""));
}

function getExportSizing(modules) {
  const totalModules = modules.length + QUIET_ZONE_MODULES * 2;
  const selectedCellSizeMm = getExportCellSizeMm();
  const outputSizeMm = Math.max(MIN_EXPORT_SIZE_MM, totalModules * selectedCellSizeMm);
  return {
    totalModules,
    selectedCellSizeMm,
    moduleSizeMm: outputSizeMm / totalModules,
    outputSizeMm,
  };
}

function getExportCellSizeMm() {
  const value = Number(els.exportCellSize?.value);
  return EXPORT_CELL_SIZE_OPTIONS.includes(value) ? value : DEFAULT_EXPORT_CELL_SIZE_MM;
}

function formatPdfDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    "D:",
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function formatPdfNumber(value) {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(3)));
}

function formatMm(value) {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(3)));
}

function traceMatrixContours(modules) {
  const size = modules.length;
  const totalModules = size + QUIET_ZONE_MODULES * 2;
  const edges = [];
  const outgoing = new Map();

  const addEdge = (sx, sy, ex, ey) => {
    const edge = { sx, sy, ex, ey, dx: ex - sx, dy: ey - sy, used: false };
    edges.push(edge);
    const key = pointKey(sx, sy);
    if (!outgoing.has(key)) outgoing.set(key, []);
    outgoing.get(key).push(edge);
  };

  for (let y = 0; y < totalModules; y += 1) {
    for (let x = 0; x < totalModules; x += 1) {
      if (!isDarkModuleAt(modules, x, y)) continue;
      if (!isDarkModuleAt(modules, x, y - 1)) addEdge(x, y, x + 1, y);
      if (!isDarkModuleAt(modules, x + 1, y)) addEdge(x + 1, y, x + 1, y + 1);
      if (!isDarkModuleAt(modules, x, y + 1)) addEdge(x + 1, y + 1, x, y + 1);
      if (!isDarkModuleAt(modules, x - 1, y)) addEdge(x, y + 1, x, y);
    }
  }

  const contours = [];
  edges.forEach((startEdge) => {
    if (startEdge.used) return;

    const startKey = pointKey(startEdge.sx, startEdge.sy);
    const contour = [{ x: startEdge.sx, y: startEdge.sy }];
    let current = startEdge;

    for (let guard = 0; guard < edges.length + 1; guard += 1) {
      current.used = true;
      contour.push({ x: current.ex, y: current.ey });
      const endKey = pointKey(current.ex, current.ey);
      if (endKey === startKey) break;

      const candidates = (outgoing.get(endKey) ?? []).filter((edge) => !edge.used);
      if (candidates.length === 0) break;
      current = chooseContourEdge(current, candidates);
    }

    if (contour.length > 3 && pointKey(contour[0].x, contour[0].y) === pointKey(contour.at(-1).x, contour.at(-1).y)) {
      contours.push(simplifyContour(contour));
    }
  });

  return contours;
}

function chooseContourEdge(current, candidates) {
  const currentDirection = directionIndex(current.dx, current.dy);
  const priorities = [1, 0, 3, 2];
  return [...candidates].sort((a, b) => {
    const turnA = (directionIndex(a.dx, a.dy) - currentDirection + 4) % 4;
    const turnB = (directionIndex(b.dx, b.dy) - currentDirection + 4) % 4;
    return priorities.indexOf(turnA) - priorities.indexOf(turnB);
  })[0];
}

function directionIndex(dx, dy) {
  if (dx > 0) return 0;
  if (dy > 0) return 1;
  if (dx < 0) return 2;
  return 3;
}

function simplifyContour(contour) {
  const points = contour.slice(0, -1);
  return points.filter((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const dx1 = point.x - previous.x;
    const dy1 = point.y - previous.y;
    const dx2 = next.x - point.x;
    const dy2 = next.y - point.y;
    return dx1 * dy2 - dy1 * dx2 !== 0;
  });
}

function pointKey(x, y) {
  return `${x},${y}`;
}

function isDarkModuleAt(modules, x, y) {
  const moduleX = x - QUIET_ZONE_MODULES;
  const moduleY = y - QUIET_ZONE_MODULES;
  return (
    moduleX >= 0 &&
    moduleY >= 0 &&
    moduleY < modules.length &&
    moduleX < modules.length &&
    modules[moduleY][moduleX]
  );
}

function generateMatrixTiffBlob(modules, sizing) {
  const size = modules.length;
  const totalModules = sizing.totalModules;
  const width = totalModules;
  const height = totalModules;
  const rowBytes = Math.ceil(width / 8);
  const imageByteCount = rowBytes * height;
  const imageData = new Uint8Array(imageByteCount);

  for (let y = 0; y < height; y += 1) {
    const moduleY = y - QUIET_ZONE_MODULES;
    for (let x = 0; x < width; x += 1) {
      const moduleX = x - QUIET_ZONE_MODULES;
      const isDark =
        moduleX >= 0 &&
        moduleY >= 0 &&
        moduleX < size &&
        moduleY < size &&
        modules[moduleY][moduleX];
      if (isDark) {
        imageData[y * rowBytes + Math.floor(x / 8)] |= 0x80 >> (x % 8);
      }
    }
  }

  return new Blob([encodeOneBitTiff(width, height, imageData, sizing.outputSizeMm)], { type: "image/tiff" });
}

function encodeOneBitTiff(width, height, imageData, outputSizeMm) {
  const softwareBytes = asciiBytes("PhoenixQR\0");
  const dateTimeBytes = asciiBytes(`${formatTiffDate(new Date())}\0`);
  const entryCount = 16;
  const ifdOffset = 8;
  const ifdSize = 2 + entryCount * 12 + 4;
  const xResolutionOffset = ifdOffset + ifdSize;
  const yResolutionOffset = xResolutionOffset + 8;
  const softwareOffset = yResolutionOffset + 8;
  const dateTimeOffset = softwareOffset + softwareBytes.length;
  const imageOffset = dateTimeOffset + dateTimeBytes.length;
  const output = new Uint8Array(imageOffset + imageData.length);
  const view = new DataView(output.buffer);
  const entries = [];

  output[0] = 0x49;
  output[1] = 0x49;
  view.setUint16(2, 42, true);
  view.setUint32(4, ifdOffset, true);
  view.setUint16(ifdOffset, entryCount, true);

  const addShortTag = (tag, value) => entries.push({ tag, type: 3, count: 1, value });
  const addLongTag = (tag, value) => entries.push({ tag, type: 4, count: 1, value });
  const addRationalTag = (tag, value) => entries.push({ tag, type: 5, count: 1, value });
  const addAsciiTag = (tag, value, count) => entries.push({ tag, type: 2, count, value });

  addLongTag(254, 0);
  addShortTag(256, width);
  addShortTag(257, height);
  addShortTag(258, 1);
  addShortTag(259, 1);
  addShortTag(262, 0);
  addLongTag(273, imageOffset);
  addShortTag(274, 1);
  addShortTag(277, 1);
  addRationalTag(282, xResolutionOffset);
  addRationalTag(283, yResolutionOffset);
  addShortTag(278, height);
  addLongTag(279, imageData.length);
  addShortTag(296, 2);
  addAsciiTag(305, softwareOffset, softwareBytes.length);
  addAsciiTag(306, dateTimeOffset, dateTimeBytes.length);

  entries.sort((a, b) => a.tag - b.tag).forEach((entry, index) => {
    const offset = ifdOffset + 2 + index * 12;
    view.setUint16(offset, entry.tag, true);
    view.setUint16(offset + 2, entry.type, true);
    view.setUint32(offset + 4, entry.count, true);
    if (entry.type === 3) {
      view.setUint16(offset + 8, entry.value, true);
      view.setUint16(offset + 10, 0, true);
    } else {
      view.setUint32(offset + 8, entry.value, true);
    }
  });
  view.setUint32(ifdOffset + 2 + entryCount * 12, 0, true);
  const resolutionDenominator = 10000;
  const resolutionNumerator = Math.round((width * 25.4 * resolutionDenominator) / outputSizeMm);
  view.setUint32(xResolutionOffset, resolutionNumerator, true);
  view.setUint32(xResolutionOffset + 4, resolutionDenominator, true);
  view.setUint32(yResolutionOffset, resolutionNumerator, true);
  view.setUint32(yResolutionOffset + 4, resolutionDenominator, true);
  output.set(softwareBytes, softwareOffset);
  output.set(dateTimeBytes, dateTimeOffset);
  output.set(imageData, imageOffset);

  return output;
}

function formatTiffDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}:${pad(date.getMonth() + 1)}:${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function generateMatrixPngBlob(modules, modulePixels) {
  const size = modules.length;
  const totalModules = size + QUIET_ZONE_MODULES * 2;
  const width = totalModules * modulePixels;
  const height = totalModules * modulePixels;
  const rowBytes = width + 1;
  const raw = new Uint8Array(rowBytes * height);

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * rowBytes;
    raw[rowOffset] = 0;
    const moduleY = Math.floor(y / modulePixels) - QUIET_ZONE_MODULES;
    for (let x = 0; x < width; x += 1) {
      const moduleX = Math.floor(x / modulePixels) - QUIET_ZONE_MODULES;
      const isDark =
        moduleX >= 0 &&
        moduleY >= 0 &&
        moduleX < size &&
        moduleY < size &&
        modules[moduleY][moduleX];
      raw[rowOffset + 1 + x] = isDark ? 0 : 255;
    }
  }

  return new Blob([encodeGrayscalePng(width, height, raw)], { type: "image/png" });
}

function encodeGrayscalePng(width, height, rawData) {
  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = new Uint8Array(13);
  const ihdrView = new DataView(ihdr.buffer);
  ihdrView.setUint32(0, width);
  ihdrView.setUint32(4, height);
  ihdr[8] = 8;
  ihdr[9] = 0;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const idat = zlibStore(rawData);
  const chunks = [
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", new Uint8Array()),
  ];
  return concatUint8Arrays([signature, ...chunks]);
}

function zlibStore(data) {
  const blockCount = Math.ceil(data.length / 65535);
  const output = new Uint8Array(2 + data.length + blockCount * 5 + 4);
  let offset = 0;
  output[offset] = 0x78;
  output[offset + 1] = 0x01;
  offset += 2;

  for (let start = 0; start < data.length; start += 65535) {
    const block = data.subarray(start, Math.min(start + 65535, data.length));
    const finalBlock = start + 65535 >= data.length;
    output[offset] = finalBlock ? 1 : 0;
    output[offset + 1] = block.length & 0xff;
    output[offset + 2] = (block.length >> 8) & 0xff;
    const nlen = (~block.length) & 0xffff;
    output[offset + 3] = nlen & 0xff;
    output[offset + 4] = (nlen >> 8) & 0xff;
    offset += 5;
    output.set(block, offset);
    offset += block.length;
  }

  const adler = adler32(data);
  output[offset] = (adler >>> 24) & 0xff;
  output[offset + 1] = (adler >>> 16) & 0xff;
  output[offset + 2] = (adler >>> 8) & 0xff;
  output[offset + 3] = adler & 0xff;
  return output;
}

function pngChunk(type, data) {
  const typeBytes = asciiBytes(type);
  const output = new Uint8Array(12 + data.length);
  const view = new DataView(output.buffer);
  view.setUint32(0, data.length);
  output.set(typeBytes, 4);
  output.set(data, 8);
  view.setUint32(8 + data.length, crc32(concatUint8Arrays([typeBytes, data])));
  return output;
}

function beginComparisonDrag(event) {
  if (!overlayEnabled || event.button !== 0 || !latestResult?.modules || !latestResult?.warpedImageData) return;
  const cell = cellFromComparisonPointer(event);
  if (!cell) return;

  event.preventDefault();
  els.warpedCanvas.setPointerCapture?.(event.pointerId);
  dragEdit.active = true;
  dragEdit.pointerId = event.pointerId;
  dragEdit.value = !latestResult.modules[cell.y][cell.x];
  dragEdit.changedCells = 0;
  dragEdit.lastCell = null;
  paintComparisonDragTo(cell);
}

function continueComparisonDrag(event) {
  if (!dragEdit.active || event.pointerId !== dragEdit.pointerId) return;
  if (!overlayEnabled) {
    resetComparisonDrag();
    return;
  }
  const cell = cellFromComparisonPointer(event);
  if (!cell) return;

  event.preventDefault();
  paintComparisonDragTo(cell);
}

function finishComparisonDrag(event) {
  if (!dragEdit.active || event.pointerId !== dragEdit.pointerId) return;
  event.preventDefault();
  els.warpedCanvas.releasePointerCapture?.(event.pointerId);

  const changedCells = dragEdit.changedCells;
  const value = dragEdit.value;
  resetComparisonDrag();
  if (changedCells <= 0) return;

  refreshEditedMatrix(t("editAction", { count: changedCells, value }));
}

function resetComparisonDrag() {
  dragEdit.active = false;
  dragEdit.pointerId = null;
  dragEdit.value = false;
  dragEdit.changedCells = 0;
  dragEdit.lastCell = null;
}

function cellFromComparisonPointer(event) {
  const rect = els.warpedCanvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const size = latestResult.modules.length;
  const x = Math.floor(((event.clientX - rect.left) / rect.width) * size);
  const y = Math.floor(((event.clientY - rect.top) / rect.height) * size);
  if (x < 0 || y < 0 || x >= size || y >= size) return null;

  return { x, y };
}

function paintComparisonDragTo(cell) {
  if (!latestResult?.modules || !latestResult?.warpedImageData) return;

  const from = dragEdit.lastCell ?? cell;
  for (const target of cellsBetween(from, cell)) {
    paintComparisonCell(target.x, target.y, dragEdit.value);
  }
  dragEdit.lastCell = cell;
  renderComparisonCanvas(latestResult.warpedImageData, latestResult.modules);
}

function cellsBetween(from, to) {
  const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y));
  const cells = [];
  for (let step = 0; step <= steps; step += 1) {
    const ratio = steps === 0 ? 0 : step / steps;
    const x = Math.round(from.x + (to.x - from.x) * ratio);
    const y = Math.round(from.y + (to.y - from.y) * ratio);
    const previous = cells.at(-1);
    if (!previous || previous.x !== x || previous.y !== y) {
      cells.push({ x, y });
    }
  }
  return cells;
}

function paintComparisonCell(x, y, value) {
  if (latestResult.modules[y][x] === value) return;
  latestResult.modules[y][x] = value;
  dragEdit.changedCells += 1;
}

function refreshEditedMatrix(actionText) {
  renderComparisonCanvas(latestResult.warpedImageData, latestResult.modules);
  renderMatrix(latestResult.modules, els.matrixCanvas);

  const editedFormat = decodeFormatInformation(latestResult.modules);
  if (editedFormat) {
    latestResult.format = editedFormat;
    els.metaEcl.textContent = `${editedFormat.errorCorrectionLevel} (${editedFormat.bitErrors} format bit error${editedFormat.bitErrors === 1 ? "" : "s"})`;
    els.metaMask.textContent = String(editedFormat.maskPattern);
  }

  const verification = verifyExtractedMatrix(els.matrixCanvas, latestResult.detected);
  latestResult.verification = verification;
  renderVerification(verification);
  setMessage(
    verification.ok ? t("editOk", { actionText }) : t("editMismatch", { actionText }),
    verification.ok ? "ok" : "warn",
  );
}

function renderComparisonCanvas(warpedImageData, modules) {
  drawImageData(els.warpedCanvas, warpedImageData);
  drawModuleOverlay(els.warpedCanvas, modules);
  drawModuleGrid(els.warpedCanvas, modules.length);
}

function drawImageData(canvas, imageData) {
  const ctx = canvas.getContext("2d");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
}

function drawModuleOverlay(canvas, modules, options = {}) {
  if (!overlayEnabled && !options.forceVisible) return;

  const ctx = canvas.getContext("2d");
  const moduleWidth = canvas.width / modules.length;
  const moduleHeight = canvas.height / modules.length;
  const opacity = options.opacity ?? getOverlayOpacity();

  ctx.save();
  ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
  modules.forEach((row, y) => {
    row.forEach((isDark, x) => {
      if (!isDark) return;
      ctx.fillRect(x * moduleWidth, y * moduleHeight, moduleWidth, moduleHeight);
    });
  });
  ctx.restore();
}

async function generatePreviewProofPngBlob(result) {
  const size = getPreviewProofSize();
  const gap = Math.max(16, Math.round(size * 0.028));
  const labelHeight = Math.max(36, Math.round(size * 0.052));
  const sourceProof = renderSourceProofImage(result, size);
  const canvasWidth = sourceProof.width + gap + size;
  const canvasHeight = size + labelHeight;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  drawProofLabel(ctx, t("proofSourceTitle"), 0, 0, sourceProof.width, labelHeight);
  drawProofLabel(ctx, t("proofProcessedTitle"), sourceProof.width + gap, 0, size, labelHeight);

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(sourceProof, 0, labelHeight);
  ctx.drawImage(renderPreviewProofImage(result, size), sourceProof.width + gap, labelHeight);

  return canvasToPngBlob(canvas);
}

function renderSourceProofImage(result, height) {
  const scale = height / result.sourceCanvas.height;
  const width = Math.max(1, Math.round(result.sourceCanvas.width * scale));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(result.sourceCanvas, 0, 0, width, height);
  drawSourceOverlay(ctx, canvas, scaleCorners(result.sourceCorners, scale, scale));
  return canvas;
}

function scaleCorners(corners, scaleX, scaleY) {
  const scalePoint = (point) => ({
    x: point.x * scaleX,
    y: point.y * scaleY,
  });

  return {
    topLeftCorner: scalePoint(corners.topLeftCorner),
    topRightCorner: scalePoint(corners.topRightCorner),
    bottomRightCorner: scalePoint(corners.bottomRightCorner),
    bottomLeftCorner: scalePoint(corners.bottomLeftCorner),
  };
}

function renderPreviewProofImage(result, size) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;

  const sourceCanvas = document.createElement("canvas");
  const sourceCtx = sourceCanvas.getContext("2d");
  sourceCanvas.width = result.warpedImageData.width;
  sourceCanvas.height = result.warpedImageData.height;
  sourceCtx.putImageData(result.warpedImageData, 0, 0);

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(sourceCanvas, 0, 0, size, size);
  drawModuleOverlay(canvas, result.modules, { forceVisible: true, opacity: 0.5 });
  drawModuleGrid(canvas, result.modules.length);
  return canvas;
}

function drawProofLabel(ctx, text, x, y, width, height) {
  const fontSize = Math.max(14, Math.min(22, Math.round(height * 0.48)));
  ctx.save();
  ctx.fillStyle = "#171717";
  ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + width / 2, y + height / 2);
  ctx.restore();
}

function getPreviewProofSize() {
  const rect = els.warpedCanvas.getBoundingClientRect();
  const displaySize = Math.round(Math.min(rect.width, rect.height));
  if (Number.isFinite(displaySize) && displaySize > 0) return displaySize;
  return Math.max(1, els.warpedCanvas.width || els.warpedCanvas.height || 1);
}

function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error(t("previewPngExportFailed")));
    }, "image/png");
  });
}

function getOverlayOpacity() {
  const value = Number(els.overlayOpacity.value);
  if (!Number.isFinite(value)) return 0.5;
  return Math.min(1, Math.max(0.1, value / 100));
}

function updateOverlayOpacityLabel() {
  els.overlayOpacityValue.textContent = `${Math.round(getOverlayOpacity() * 100)}%`;
}

function updateOverlayToggle() {
  els.overlayToggle.textContent = overlayEnabled ? "●" : "○";
  els.overlayToggle.setAttribute("aria-pressed", String(overlayEnabled));
  els.overlayToggle.setAttribute("aria-label", overlayEnabled ? t("overlayHide") : t("overlayShow"));
  els.overlayToggle.setAttribute("title", t("overlayToggleTitle"));
  els.warpedCanvas.classList.toggle("is-edit-disabled", !overlayEnabled);
  els.warpedCanvas.setAttribute("aria-disabled", String(!overlayEnabled));
}

function drawModuleGrid(canvas, size) {
  const ctx = canvas.getContext("2d");
  const moduleWidth = canvas.width / size;
  const moduleHeight = canvas.height / size;

  ctx.save();
  ctx.strokeStyle = "rgba(209, 59, 67, 0.18)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= size; i += 1) {
    const x = Math.round(i * moduleWidth) + 0.5;
    const y = Math.round(i * moduleHeight) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function cloneImageData(imageData) {
  return new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
}

function buildExportFilename(result, variant, extension) {
  const baseName = sanitizeFileBaseName(result?.sourceFileName);
  const variantPart = variant ? `_${variant}` : "";
  return `${baseName}_PhoenixQR${variantPart}.${extension}`;
}

function sanitizeFileBaseName(filename) {
  const fallback = "qr-image";
  const rawName = typeof filename === "string" ? filename.trim() : "";
  const withoutExtension = rawName.replace(/\.[^./\\]+$/, "");
  const normalized = (withoutExtension || fallback).normalize("NFKC");
  const sanitized = normalized
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[<>:"/\\|?*]+/g, "_")
    .replace(/\s+/g, " ")
    .replace(/_+/g, "_")
    .replace(/^[ ._]+|[ ._]+$/g, "")
    .slice(0, 120);
  return sanitized && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(sanitized) ? sanitized : fallback;
}

function saveTextAs(text, filename, type, pickerTypes) {
  const blob = new Blob([text], { type });
  return saveBlobAs(blob, filename, pickerTypes);
}

async function saveBlobAs(blob, filename, pickerTypes) {
  if ("showSaveFilePicker" in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: pickerTypes,
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
      console.warn("File System Access API failed. Falling back to download.", error);
    }
  }

  downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

function concatUint8Arrays(parts) {
  const length = parts.reduce((total, part) => total + part.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  parts.forEach((part) => {
    output.set(part, offset);
    offset += part.length;
  });
  return output;
}

function asciiBytes(text) {
  const output = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i += 1) {
    output[i] = text.charCodeAt(i);
  }
  return output;
}

function adler32(data) {
  let a = 1;
  let b = 0;
  for (const byte of data) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function setMessage(text, type) {
  els.message.textContent = text;
  els.message.dataset.type = type;
}

function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

function yieldToBrowser() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
