import jsQR from "jsqr";
import "./styles.css";

const MAX_INPUT_PIXELS = 20_000_000;
const SOURCE_PREVIEW_SIZE = 304;
const WARPED_MODULE_PIXELS = 12;
const MATRIX_MODULE_PIXELS = 12;
const VERIFY_MODULE_PIXELS = 6;
const PNG_OFFICE_MODULE_PIXELS = 20;
const PDF_POINTS_PER_MM = 72 / 25.4;
const MIN_EXPORT_SIZE_MM = 12;
const DEFAULT_EXPORT_CELL_SIZE_MM = 0.25;
const EXPORT_CELL_SIZE_OPTIONS = [0.25, 0.3, 0.35];
const QUIET_ZONE_MODULES = 4;
const AMBIGUOUS_MARGIN = 12;
const LOCAL_WINDOW_RADIUS = 2;
const SAMPLING_BOUND_CANDIDATES = [-4, -2, 0, 2, 4, 6];
const SAMPLING_BOUND_RESULT_LIMIT = 4;
const MODULE_CANDIDATE_VERIFY_LIMIT = 12;
const REGION_GRID_CELLS = 112;
const REGION_CANDIDATE_LIMIT = 14;
const QR_ROI_GRID_CELLS = 132;
const QR_ROI_CANDIDATE_LIMIT = 8;
const PANEL_WARP_SIZE = 820;
const BROWSER_CROP_MARGIN_RATIO = 0.24;
const BROWSER_CROP_MIN_MARGIN = 18;
const BROWSER_CROP_TARGET_MIN_SIDE = 960;
const BROWSER_CROP_MAX_SIDE = 2400;
const BROWSER_DETECTOR_RETRY_ROTATION_RADIANS = Math.PI / 4;
const FALLBACK_CANDIDATE_LIMIT = 24;
const MAX_DETECTION_SIDE = 1200;
const FULL_IMAGE_UPSCALE_MAX_SIDE = 3200;
const DETECTION_TIME_BUDGET_MS = 7000;
const DETECTION_YIELD_EVERY = 3;
const FINDER_CENTER_REFINE_MAX_MODULES = 0.75;
const CORNER_MICRO_ADJUST_MAX_MODULES = 0.45;
const CORNER_MICRO_ADJUST_WEIGHT = 0.36;
const ALIGNMENT_MICRO_ADJUST_WEIGHT = 0.24;
const FINDER_RUN_RATIO_SCORE_WEIGHT = 0.78;
const USE_DETECTED_RECTANGLE_ONLY = true;
const USE_FIXED_FUNCTION_PATTERN_CORRECTION = true;
const USE_JSQR_LOCATION_GRID_FIT = true;
const USE_JSQR_ONLY_GRID_FIT = false;
const USE_BROWSER_PRE_CROP = true;
const USE_JSQR_FALLBACK_AFTER_BROWSER_PRE_CROP = true;
const USE_BROWSER_BARCODE_DETECTOR_ONLY = false;
const USE_PRE_CROP_CANDIDATES = false;
const USE_FINDER_TRIANGLE_WARP = false;
const USE_PATTERN_HOMOGRAPHY_REFINEMENT = false;
const HOMOGRAPHY_REFINEMENT_MAX_CORNER_SHIFT_MODULES = 5.5;
const HOMOGRAPHY_PATTERN_SEARCH_MAX_MODULES = 4.8;
const FINDER_TRIANGLE_SEARCH_MAX_MODULES = 1.6;
const FINDER_TRIANGLE_ITERATION_SEARCH_MAX_MODULES = 0.9;
const FINDER_TRIANGLE_MAX_CORNER_SHIFT_MODULES = 8.0;
const FINDER_FOURTH_POINT_SEARCH_MODULES = 0.32;
const ALIGNMENT_PATTERN_CENTERS = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
  [6, 34, 62],
  [6, 26, 46, 66],
  [6, 26, 48, 70],
  [6, 26, 50, 74],
  [6, 30, 54, 78],
  [6, 30, 56, 82],
  [6, 30, 58, 86],
  [6, 34, 62, 90],
  [6, 28, 50, 72, 94],
  [6, 26, 50, 74, 98],
  [6, 30, 54, 78, 102],
  [6, 28, 54, 80, 106],
  [6, 32, 58, 84, 110],
  [6, 30, 58, 86, 114],
  [6, 34, 62, 90, 118],
  [6, 26, 50, 74, 98, 122],
  [6, 30, 54, 78, 102, 126],
  [6, 26, 52, 78, 104, 130],
  [6, 30, 56, 82, 108, 134],
  [6, 34, 60, 86, 112, 138],
  [6, 30, 58, 86, 114, 142],
  [6, 34, 62, 90, 118, 146],
  [6, 30, 54, 78, 102, 126, 150],
  [6, 24, 50, 76, 102, 128, 154],
  [6, 28, 54, 80, 106, 132, 158],
  [6, 32, 58, 84, 110, 136, 162],
  [6, 26, 54, 82, 110, 138, 166],
  [6, 30, 58, 86, 114, 142, 170],
];

const TRANSLATIONS = {
  ja: {
    brandTagline: "セル構成の全く同じQRコードを生成",
    dropPlaceholder: "画像ファイルをドロップ",
    initialMessage: "画像を選択してください。",
    comparisonTitle: "セルをクリックやドラッグで修正できます",
    opacityLabel: "不透明度：",
    overlayHide: "オーバーレイを非表示にする",
    overlayShow: "オーバーレイを表示する",
    overlayToggleTitle: "オーバーレイの表示切替",
    overlayShortcutHint: "SPACEでオンオフ",
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
    selectImageFile: "画像ファイルを選択してください。",
    loadingImage: "画像を読み込んでいます。",
    detectingQr: "QR の範囲を検出しています。",
    detectFailed: "QR を検出または読み取りできませんでした。破損、低解像度、強い反射、または範囲外の可能性があります。",
    versionCellFailed: "QR バージョンからセル数を算出できませんでした。",
    extractingCells: "セル構成を抽出しています。",
    formatFailed: "フォーマット情報を復元できませんでした。破損またはセル判定の失敗として扱います。",
    doneWithNotice: ({ notice }) => `完了しました。${notice}`,
    doneVerified: "完了しました。抽出 matrix は jsQR のエラー訂正後デコードで再確認済みです。",
    doneWithWarning: ({ warningText }) => `完了しました。ただし ${warningText}`,
    imageLoadTimeout: "画像の読み込みが完了しませんでした。別の画像形式に書き出してから再試行してください。",
    imageLoadFailed: "画像を読み込めませんでした。",
    inputScaledWarning: ({ percent }) => `入力画像が大きいため ${percent}% に縮小して解析しました。`,
    libraryStatusReady: "jsQR ready",
    barcodeDetectorNotice: "ブラウザの BarcodeDetector で切り出し",
    barcodeDetectorRotatedNotice: "45度回転後の BarcodeDetector で切り出し",
    barcodeDetectorUnavailable: "このブラウザでは BarcodeDetector の qr_code が使用できません。",
    barcodeDetectorVersionFailed: "BarcodeDetector はQRを検出しましたが、セル数を推定できませんでした。",
    detectionTimeout:
      "QR の検出に時間がかかりすぎたため停止しました。もう少し QR が大きく写った画像、または QR 周辺を切り出した画像で再試行してください。",
    detectionNoticeDarkRegion: "QR らしい範囲を切り出し",
    detectionNoticeQrTexture: "白黒が密集した範囲を切り出し",
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
    dropPlaceholder: "Drop an image file",
    initialMessage: "Select an image.",
    comparisonTitle: "Click or drag cells to edit",
    opacityLabel: "Opacity:",
    overlayHide: "Hide overlay",
    overlayShow: "Show overlay",
    overlayToggleTitle: "Toggle overlay",
    overlayShortcutHint: "SPACE to toggle",
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
    selectImageFile: "Select an image file.",
    loadingImage: "Loading image.",
    detectingQr: "Detecting QR area.",
    detectFailed: "Could not detect or read the QR code. It may be damaged, too low-resolution, strongly reflective, or outside the frame.",
    versionCellFailed: "Could not calculate the cell count from the QR version.",
    extractingCells: "Extracting cell structure.",
    formatFailed: "Could not restore format information. Treating this as damage or cell-detection failure.",
    doneWithNotice: ({ notice }) => `Done. ${notice}`,
    doneVerified: "Done. The extracted matrix was rechecked with jsQR's error-corrected decode result.",
    doneWithWarning: ({ warningText }) => `Done, but ${warningText}`,
    imageLoadTimeout: "Image loading did not finish. Export it again as another image format and retry.",
    imageLoadFailed: "Could not load the image.",
    inputScaledWarning: ({ percent }) => `The input image was large, so it was scaled to ${percent}% for analysis.`,
    libraryStatusReady: "jsQR ready",
    barcodeDetectorNotice: "browser BarcodeDetector pre-crop",
    barcodeDetectorRotatedNotice: "45-degree rotated BarcodeDetector pre-crop",
    barcodeDetectorUnavailable: "This browser does not provide BarcodeDetector qr_code support.",
    barcodeDetectorVersionFailed: "BarcodeDetector detected a QR, but the cell count could not be estimated.",
    detectionTimeout:
      "QR detection took too long and was stopped. Try again with a larger QR in the image, or crop around the QR.",
    detectionNoticeDarkRegion: "a cropped candidate area",
    detectionNoticeQrTexture: "a high-contrast QR-like area",
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
  libraryStatus: document.querySelector("#libraryStatus"),
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
  toggleOverlay();
});

document.addEventListener("keydown", handleOverlayShortcut);

applyLocale();
updateLibraryStatus();
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
    ["#overlayShortcutHint", "overlayShortcutHint"],
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
  updateLibraryStatus();
}

function updateLibraryStatus() {
  if (!els.libraryStatus) return;
  els.libraryStatus.textContent = t("libraryStatusReady");
  els.libraryStatus.dataset.state = "ok";
}

function setSelectOptionText(select, value, text) {
  const option = select?.querySelector(`option[value="${value}"]`);
  if (option) option.textContent = text;
}

async function analyzeFile(file) {
  resetUi();

  if (!file.type.startsWith("image/")) {
    setMessage(t("selectImageFile"), "error");
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
    const sampleReference = USE_BROWSER_BARCODE_DETECTOR_ONLY ? null : detected;

    setMessage(t("extractingCells"), "busy");
    await nextFrame();
    let corners = USE_JSQR_LOCATION_GRID_FIT
      ? gridAlignedLocationFromJsQrLocation(detection.location, detected.version)
      : detection.location;
    let transform = squareToQuadrilateralTransform(
      corners.topLeftCorner,
      corners.topRightCorner,
      corners.bottomRightCorner,
      corners.bottomLeftCorner,
    );
    let warpedImageData = renderWarpedQr(sourceImage, source.canvas.width, source.canvas.height, transform, size);
    let sample = USE_JSQR_ONLY_GRID_FIT
      ? sampleWarpedModulesLockedToFullGrid(warpedImageData, size, sampleReference)
      : sampleWarpedModules(warpedImageData, size, sampleReference);
    let lockComparisonToFullGrid = false;

    if (!USE_JSQR_ONLY_GRID_FIT) {
      const triangleTransform = refineTransformFromFinderTriangle(
        sourceImage,
        source.canvas.width,
        source.canvas.height,
        transform,
        detection.location,
        size,
        sampleReference,
      );
      if (triangleTransform) {
        const triangleWarpedImageData = renderWarpedQr(sourceImage, source.canvas.width, source.canvas.height, triangleTransform, size);
        const triangleSample = sampleWarpedModulesLockedToFullGrid(triangleWarpedImageData, size, sampleReference);
        if (shouldUseFinderTriangleWarp(sample, triangleSample)) {
          transform = triangleTransform;
          warpedImageData = triangleWarpedImageData;
          sample = triangleSample;
          lockComparisonToFullGrid = true;
        }
      }

      const refinedTransform = refineHomographyFromFunctionPatterns(warpedImageData, transform, size);
      if (refinedTransform) {
        const refinedWarpedImageData = renderWarpedQr(sourceImage, source.canvas.width, source.canvas.height, refinedTransform, size);
        const refinedSample = sampleWarpedModules(refinedWarpedImageData, size, sampleReference);
        if (shouldUseRefinedHomography(sample, refinedSample)) {
          transform = refinedTransform;
          warpedImageData = refinedWarpedImageData;
          sample = refinedSample;
        }
      }
    }

    const comparisonBounds = USE_JSQR_ONLY_GRID_FIT || lockComparisonToFullGrid ? null : sample.samplingBounds;
    corners = comparisonBounds ? cornersFromTransformAndSamplingBounds(transform, comparisonBounds, warpedImageData) : cornersFromTransform(transform);
    const comparisonImageData = comparisonBounds ? alignWarpedImageToSamplingBounds(warpedImageData, comparisonBounds) : warpedImageData;
    drawSourceOverlay(source.preview.ctx, source.preview.canvas, mapCornersToPreview(corners, source.preview));

    const format = decodeFormatInformation(sample.modules);
    if (!format) {
      throw new Error(t("formatFailed"));
    }

    renderComparisonCanvas(comparisonImageData, sample.modules);
    renderMatrix(sample.modules, els.matrixCanvas);
    const verification = await verifyExtractedMatrix(els.matrixCanvas, detected);

    latestResult = {
      detected,
      sourceFileName: file.name,
      sourceCanvas: source.canvas,
      sourceCorners: corners,
      warpedImageData: comparisonImageData,
      rawWarpedImageData: warpedImageData,
      content: detected.data,
      version: detected.version,
      size,
      modules: sample.modules,
      format,
      contrast: sample.contrast,
      ambiguousCells: sample.ambiguousCells,
      localAdjustedCells: sample.localAdjustedCells,
      samplingBounds: sample.samplingBounds,
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
  overlayEnabled = true;
  updateOverlayToggle();
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

  if (USE_BROWSER_PRE_CROP) {
    const browserCrop = await tryDecodeBrowserDetectedCrop(sourceCanvas, sourceImage, context);
    if (browserCrop) return browserCrop;
    if (!USE_JSQR_FALLBACK_AFTER_BROWSER_PRE_CROP) return null;
  }

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
  if (!USE_PRE_CROP_CANDIDATES) return null;

  const qrLikeCandidates = findQrLikeRegionCandidates(sourceImage, sourceCanvas.width, sourceCanvas.height);
  for (const candidate of qrLikeCandidates.slice(0, QR_ROI_CANDIDATE_LIMIT)) {
    const decoded = await tryDecodeCandidate(sourceCanvas, candidate, context);
    if (decoded) return decoded;
  }

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

let browserQrDetector = null;

async function getBrowserQrDetector() {
  if (!("BarcodeDetector" in window)) {
    throw new Error(t("barcodeDetectorUnavailable"));
  }

  const supportedFormats =
    typeof BarcodeDetector.getSupportedFormats === "function" ? await BarcodeDetector.getSupportedFormats() : ["qr_code"];
  if (!supportedFormats.includes("qr_code")) {
    throw new Error(t("barcodeDetectorUnavailable"));
  }

  browserQrDetector ??= new BarcodeDetector({ formats: ["qr_code"] });
  return browserQrDetector;
}

async function tryDecodeBrowserDetectedCrop(sourceCanvas, sourceImage, context) {
  const detector = await getBrowserQrDetector();
  await stepDetection(context);
  let results = await detector.detect(sourceCanvas);
  if (!results.length) {
    const rotated = renderBilinearRotatedImageCanvas(
      sourceImage,
      sourceCanvas.width,
      sourceCanvas.height,
      BROWSER_DETECTOR_RETRY_ROTATION_RADIANS,
    );
    await stepDetection(context);
    const rotatedResults = await detector.detect(rotated.canvas);
    results = rotatedResults
      .map((result) => mapBrowserBarcodeResult(result, rotated.mapRotatedToSource, "browser-crop-rotated"))
      .filter(Boolean);
  }

  if (!results.length) return null;

  const sorted = [...results].sort((a, b) => browserBarcodeArea(b) - browserBarcodeArea(a));
  for (const result of sorted) {
    const candidate = browserBarcodeCropCandidate(result, sourceCanvas.width, sourceCanvas.height);
    if (!candidate) continue;

    const decoded = await tryDecodeBrowserCropCandidate(sourceImage, sourceCanvas.width, sourceCanvas.height, candidate, context);
    if (decoded) return decoded;
  }

  return null;
}

async function tryDecodeBrowserCropCandidate(sourceImage, sourceWidth, sourceHeight, candidate, context) {
  const modes = ["contrast", "binary"];
  const scales = browserCropScales(candidate);

  for (const scale of scales) {
    for (const mode of modes) {
      await stepDetection(context);
      const prepared = prepareBilinearCandidateImage(sourceImage, sourceWidth, sourceHeight, candidate, scale, mode);
      const code = jsQR(prepared.imageData.data, prepared.width, prepared.height, {
        inversionAttempts: "attemptBoth",
      });

      if (code) {
        const refinedCodeLocation = refineWarpedFinderPatternCenters(prepared.imageData, code.location, code.version);
        const mappedLocation = mapPreparedDetectedLocation(refinedCodeLocation, candidate, prepared);
        return {
          code,
          location: refineLocationFromFinderPatterns(mappedLocation, code.version),
          notice: buildDetectionNotice(candidate.source, mode, scale),
        };
      }
    }
  }

  return null;
}

function browserBarcodeCropCandidate(result, sourceWidth, sourceHeight) {
  const points = browserBarcodeCornerPoints(result);
  const source = result.phoenixSource ?? "browser-crop";
  if (points.length >= 4) {
    const ordered = orderQuadrilateralPoints(points);
    if (isUsableQuadrilateral(ordered)) {
      const transform = squareToQuadrilateralTransform(ordered[0], ordered[1], ordered[2], ordered[3]);
      const side = averageQuadrilateralSideLength(ordered);
      if (transform && isFiniteTransform(transform) && Number.isFinite(side) && side > 0) {
        const paddedSide = side * (1 + BROWSER_CROP_MARGIN_RATIO * 2);
        return {
          x: 0,
          y: 0,
          width: paddedSide,
          height: paddedSide,
          source,
          score: browserBarcodeArea(result),
          transform,
          paddingRatio: BROWSER_CROP_MARGIN_RATIO,
        };
      }
    }
  }

  const bounds = result.boundingBox;
  if (!bounds) return null;

  const maxSide = Math.max(bounds.width, bounds.height);
  if (!Number.isFinite(maxSide) || maxSide <= 0) return null;

  const padding = Math.max(BROWSER_CROP_MIN_MARGIN, Math.round(maxSide * BROWSER_CROP_MARGIN_RATIO));
  const x = clamp(bounds.x - padding, 0, sourceWidth - 1);
  const y = clamp(bounds.y - padding, 0, sourceHeight - 1);
  const right = clamp(bounds.x + bounds.width + padding, 1, sourceWidth);
  const bottom = clamp(bounds.y + bounds.height + padding, 1, sourceHeight);

  return {
    x,
    y,
    width: right - x,
    height: bottom - y,
    source,
    score: browserBarcodeArea(result),
  };
}

function browserBarcodeArea(result) {
  const points = browserBarcodeCornerPoints(result);
  const box = points.length >= 4 ? boundsFromPoints(points) : result.boundingBox;
  if (!box) return 0;
  return Math.max(0, box.width) * Math.max(0, box.height);
}

function averageQuadrilateralSideLength(points) {
  const lengths = [
    distanceBetween(points[0], points[1]),
    distanceBetween(points[1], points[2]),
    distanceBetween(points[2], points[3]),
    distanceBetween(points[3], points[0]),
  ].filter((value) => Number.isFinite(value) && value > 0);
  return lengths.length ? mean(lengths) : NaN;
}

function renderBilinearRotatedImageCanvas(sourceImage, sourceWidth, sourceHeight, angleRadians) {
  const sin = Math.sin(angleRadians);
  const cos = Math.cos(angleRadians);
  const outputWidth = Math.max(1, Math.ceil(Math.abs(sourceWidth * cos) + Math.abs(sourceHeight * sin)));
  const outputHeight = Math.max(1, Math.ceil(Math.abs(sourceWidth * sin) + Math.abs(sourceHeight * cos)));
  const sourceCenterX = sourceWidth / 2;
  const sourceCenterY = sourceHeight / 2;
  const outputCenterX = outputWidth / 2;
  const outputCenterY = outputHeight / 2;
  const output = new ImageData(outputWidth, outputHeight);

  for (let y = 0; y < outputHeight; y += 1) {
    for (let x = 0; x < outputWidth; x += 1) {
      const sourcePoint = rotatedPointToSourcePoint(
        x + 0.5,
        y + 0.5,
        cos,
        sin,
        sourceCenterX,
        sourceCenterY,
        outputCenterX,
        outputCenterY,
      );
      const offset = (y * outputWidth + x) * 4;

      if (
        sourcePoint.x < 0 ||
        sourcePoint.y < 0 ||
        sourcePoint.x > sourceWidth - 1 ||
        sourcePoint.y > sourceHeight - 1
      ) {
        output.data[offset] = 255;
        output.data[offset + 1] = 255;
        output.data[offset + 2] = 255;
        output.data[offset + 3] = 255;
        continue;
      }

      const color = sampleRgb(sourceImage, sourceWidth, sourceHeight, sourcePoint.x, sourcePoint.y);
      output.data[offset] = color.r;
      output.data[offset + 1] = color.g;
      output.data[offset + 2] = color.b;
      output.data[offset + 3] = 255;
    }
  }

  return {
    canvas: imageDataToCanvas(output),
    width: outputWidth,
    height: outputHeight,
    mapRotatedToSource: (point) =>
      rotatedPointToSourcePoint(
        point.x,
        point.y,
        cos,
        sin,
        sourceCenterX,
        sourceCenterY,
        outputCenterX,
        outputCenterY,
      ),
  };
}

function rotatedPointToSourcePoint(x, y, cos, sin, sourceCenterX, sourceCenterY, outputCenterX, outputCenterY) {
  const dx = x - outputCenterX;
  const dy = y - outputCenterY;
  return {
    x: cos * dx + sin * dy + sourceCenterX,
    y: -sin * dx + cos * dy + sourceCenterY,
  };
}

function mapBrowserBarcodeResult(result, mapPoint, source) {
  const points = browserBarcodeCornerPoints(result);
  if (!points.length) return null;

  const cornerPoints = points.map(mapPoint).filter(isFinitePoint);
  if (cornerPoints.length < 4) return null;

  return {
    rawValue: result.rawValue,
    format: result.format,
    cornerPoints,
    boundingBox: boundsFromPoints(cornerPoints),
    phoenixSource: source,
  };
}

function mapBrowserBarcodeLocation(result, candidate, scaleX, scaleY) {
  const points = browserBarcodeCornerPoints(result);
  if (points.length < 4) return null;
  const ordered = orderQuadrilateralPoints(points);
  const map = (point) => ({
    x: candidate.x + point.x / scaleX,
    y: candidate.y + point.y / scaleY,
  });
  const topLeftCorner = map(ordered[0]);
  const topRightCorner = map(ordered[1]);
  const bottomRightCorner = map(ordered[2]);
  const bottomLeftCorner = map(ordered[3]);

  return {
    topLeftCorner,
    topRightCorner,
    bottomRightCorner,
    bottomLeftCorner,
    topLeftFinderPattern: interpolatePoint(topLeftCorner, bottomRightCorner, 3.5 / 21),
    topRightFinderPattern: interpolatePoint(topRightCorner, bottomLeftCorner, 3.5 / 21),
    bottomLeftFinderPattern: interpolatePoint(bottomLeftCorner, topRightCorner, 3.5 / 21),
  };
}

function browserBarcodeCornerPoints(result) {
  if (Array.isArray(result.cornerPoints) && result.cornerPoints.length >= 4) {
    return result.cornerPoints.map((point) => ({ x: point.x, y: point.y }));
  }

  const box = result.boundingBox;
  if (!box) return [];
  return [
    { x: box.x, y: box.y },
    { x: box.x + box.width, y: box.y },
    { x: box.x + box.width, y: box.y + box.height },
    { x: box.x, y: box.y + box.height },
  ];
}

function orderQuadrilateralPoints(points) {
  const unique = points.filter(isFinitePoint).slice(0, 4);
  if (unique.length < 4) return unique;

  const centroid = {
    x: mean(unique.map((point) => point.x)),
    y: mean(unique.map((point) => point.y)),
  };
  const sorted = [...unique].sort(
    (a, b) => Math.atan2(a.y - centroid.y, a.x - centroid.x) - Math.atan2(b.y - centroid.y, b.x - centroid.x),
  );
  if (signedPolygonArea(sorted) < 0) sorted.reverse();

  const startIndex = sorted.reduce((bestIndex, point, index) => {
    const best = sorted[bestIndex];
    if (point.y < best.y - 1e-6) return index;
    if (Math.abs(point.y - best.y) <= 1e-6 && point.x < best.x) return index;
    return bestIndex;
  }, 0);

  return rotatePointList(sorted, startIndex);
}

function rotatePointList(points, startIndex) {
  return points.slice(startIndex).concat(points.slice(0, startIndex));
}

function signedPolygonArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    area += current.x * next.y - current.y * next.x;
  }
  return area / 2;
}

function isUsableQuadrilateral(points) {
  if (points.length !== 4 || !points.every(isFinitePoint)) return false;
  const minSide = Math.min(
    distanceBetween(points[0], points[1]),
    distanceBetween(points[1], points[2]),
    distanceBetween(points[2], points[3]),
    distanceBetween(points[3], points[0]),
  );
  return Number.isFinite(minSide) && minSide > 1 && Math.abs(signedPolygonArea(points)) > 1;
}

function isFiniteTransform(transform) {
  return ["a", "b", "c", "d", "e", "f", "g", "h"].every((key) => Number.isFinite(transform[key]));
}

function boundsFromPoints(points) {
  const xs = points.map((point) => point.x).filter(Number.isFinite);
  const ys = points.map((point) => point.y).filter(Number.isFinite);
  if (!xs.length || !ys.length) return null;
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const right = Math.max(...xs);
  const bottom = Math.max(...ys);
  return {
    x,
    y,
    width: right - x,
    height: bottom - y,
  };
}

function browserCropScales(candidate) {
  const minSide = Math.max(1, Math.min(candidate.width, candidate.height));
  const maxSide = Math.max(1, Math.max(candidate.width, candidate.height));
  const targetScale = clamp(BROWSER_CROP_TARGET_MIN_SIDE / minSide, 1.25, 6);
  const capScale = BROWSER_CROP_MAX_SIDE / maxSide;
  const scales = [targetScale, targetScale * 1.25, targetScale * 0.75, 1]
    .map((scale) => Math.min(scale, capScale))
    .filter((scale) => scale >= 0.85);

  return [...new Set(scales.map((scale) => Number(scale.toFixed(2))))];
}

function prepareBilinearCandidateImage(sourceImage, sourceWidth, sourceHeight, candidate, scale, mode) {
  if (candidate.transform) {
    return prepareBilinearWarpedCandidateImage(sourceImage, sourceWidth, sourceHeight, candidate, scale, mode);
  }

  const width = Math.max(1, Math.round(candidate.width * scale));
  const height = Math.max(1, Math.round(candidate.height * scale));
  const imageData = renderBilinearCropImageData(sourceImage, sourceWidth, sourceHeight, candidate, width, height);
  const processedImageData = cloneImageData(imageData);
  preprocessForJsQr(processedImageData, mode);

  return {
    canvas: imageDataToCanvas(processedImageData),
    imageData: processedImageData,
    width,
    height,
    scaleX: width / candidate.width,
    scaleY: height / candidate.height,
  };
}

function prepareBilinearWarpedCandidateImage(sourceImage, sourceWidth, sourceHeight, candidate, scale, mode) {
  const size = Math.max(1, Math.round(Math.max(candidate.width, candidate.height) * scale));
  const paddingRatio = candidate.paddingRatio ?? 0;
  const imageData = renderPaddedWarpedImageData(
    sourceImage,
    sourceWidth,
    sourceHeight,
    candidate.transform,
    paddingRatio,
    size,
  );
  const processedImageData = cloneImageData(imageData);
  preprocessForJsQr(processedImageData, mode);

  return {
    canvas: imageDataToCanvas(processedImageData),
    imageData: processedImageData,
    width: size,
    height: size,
    scaleX: size / candidate.width,
    scaleY: size / candidate.height,
    mapPoint: (point) => mapPaddedWarpedPoint(candidate.transform, paddingRatio, point.x / size, point.y / size),
  };
}

function mapPreparedDetectedLocation(location, candidate, prepared) {
  if (typeof prepared.mapPoint === "function") {
    return mapLocationPoints(location, prepared.mapPoint);
  }
  return mapDetectedLocation(location, candidate, prepared.scaleX, prepared.scaleY);
}

function mapLocationPoints(location, map) {
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

function renderBilinearCropImageData(sourceImage, sourceWidth, sourceHeight, candidate, outputWidth, outputHeight) {
  const output = new ImageData(outputWidth, outputHeight);
  for (let y = 0; y < outputHeight; y += 1) {
    for (let x = 0; x < outputWidth; x += 1) {
      const sourceX = candidate.x + ((x + 0.5) / outputWidth) * candidate.width;
      const sourceY = candidate.y + ((y + 0.5) / outputHeight) * candidate.height;
      const color = sampleRgb(sourceImage, sourceWidth, sourceHeight, sourceX, sourceY);
      const offset = (y * outputWidth + x) * 4;
      output.data[offset] = color.r;
      output.data[offset + 1] = color.g;
      output.data[offset + 2] = color.b;
      output.data[offset + 3] = 255;
    }
  }
  return output;
}

function renderPaddedWarpedImageData(sourceImage, sourceWidth, sourceHeight, transform, paddingRatio, outputSize) {
  const output = new ImageData(outputSize, outputSize);
  for (let y = 0; y < outputSize; y += 1) {
    for (let x = 0; x < outputSize; x += 1) {
      const point = mapPaddedWarpedPoint(transform, paddingRatio, (x + 0.5) / outputSize, (y + 0.5) / outputSize);
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

function mapPaddedWarpedPoint(transform, paddingRatio, x, y) {
  const span = 1 + paddingRatio * 2;
  return mapPoint(transform, x * span - paddingRatio, y * span - paddingRatio);
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

function refineWarpedFinderPatternCenters(imageData, location, version) {
  const size = 17 + version * 4;
  const modulePixels = estimateFinderModulePixels(location, size) ?? imageData.width / size;
  if (!Number.isFinite(modulePixels) || modulePixels < 2) return location;

  return {
    ...location,
    topLeftFinderPattern: refineWarpedFinderPatternCenter(imageData, location.topLeftFinderPattern, modulePixels),
    topRightFinderPattern: refineWarpedFinderPatternCenter(imageData, location.topRightFinderPattern, modulePixels),
    bottomLeftFinderPattern: refineWarpedFinderPatternCenter(imageData, location.bottomLeftFinderPattern, modulePixels),
  };
}

function estimateFinderModulePixels(location, size) {
  const expectedDistance = size - 7;
  const distances = [
    isFinitePoint(location.topLeftFinderPattern) && isFinitePoint(location.topRightFinderPattern)
      ? distanceBetween(location.topLeftFinderPattern, location.topRightFinderPattern)
      : NaN,
    isFinitePoint(location.topLeftFinderPattern) && isFinitePoint(location.bottomLeftFinderPattern)
      ? distanceBetween(location.topLeftFinderPattern, location.bottomLeftFinderPattern)
      : NaN,
  ].filter((value) => Number.isFinite(value) && value > 0);
  return distances.length ? mean(distances) / expectedDistance : null;
}

function refineWarpedFinderPatternCenter(imageData, point, modulePixels) {
  return refineWarpedFinderPatternMatch(imageData, point, modulePixels).point;
}

function refineWarpedFinderPatternMatch(imageData, point, modulePixels, searchMaxModules = FINDER_CENTER_REFINE_MAX_MODULES) {
  if (!isFinitePoint(point)) {
    return { point, modulePixels, score: -Infinity, baseScore: -Infinity, accepted: false };
  }

  const baseScore = scoreWarpedFinderPatternCenter(imageData, point, modulePixels);
  let best = { point, modulePixels, score: baseScore };
  const coarseStep = modulePixels * 0.16;
  const searchRadius = modulePixels * searchMaxModules;

  for (const scale of [0.88, 0.94, 1, 1.06, 1.12]) {
    const candidateModulePixels = modulePixels * scale;
    for (let y = -searchRadius; y <= searchRadius + 0.001; y += coarseStep) {
      for (let x = -searchRadius; x <= searchRadius + 0.001; x += coarseStep) {
        const candidate = { x: point.x + x, y: point.y + y };
        const score = scoreWarpedFinderPatternCenter(imageData, candidate, candidateModulePixels);
        if (score > best.score) {
          best = { point: candidate, modulePixels: candidateModulePixels, score };
        }
      }
    }
  }

  const fineStep = modulePixels * 0.06;
  for (const scale of [0.96, 1, 1.04]) {
    const candidateModulePixels = best.modulePixels * scale;
    for (const y of [-fineStep, 0, fineStep]) {
      for (const x of [-fineStep, 0, fineStep]) {
        const candidate = { x: best.point.x + x, y: best.point.y + y };
        const score = scoreWarpedFinderPatternCenter(imageData, candidate, candidateModulePixels);
        if (score > best.score) {
          best = { point: candidate, modulePixels: candidateModulePixels, score };
        }
      }
    }
  }

  const ultraFineStep = modulePixels * 0.025;
  for (const scale of [0.99, 1, 1.01]) {
    const candidateModulePixels = best.modulePixels * scale;
    for (const y of [-2, -1, 0, 1, 2]) {
      for (const x of [-2, -1, 0, 1, 2]) {
        const candidate = { x: best.point.x + x * ultraFineStep, y: best.point.y + y * ultraFineStep };
        const score = scoreWarpedFinderPatternCenter(imageData, candidate, candidateModulePixels);
        if (score > best.score) {
          best = { point: candidate, modulePixels: candidateModulePixels, score };
        }
      }
    }
  }

  const movement = distanceBetween(point, best.point);
  return movement <= modulePixels * searchMaxModules && best.score > baseScore + 8
    ? { ...best, baseScore, accepted: true }
    : { point, modulePixels, score: baseScore, baseScore, accepted: false };
}

function scoreWarpedFinderPatternCenter(imageData, center, modulePixels) {
  const templateScore = scoreWarpedFinderPatternTemplate(imageData, center, modulePixels);
  const runRatioScore = scoreWarpedFinderPatternRunRatios(imageData, center, modulePixels);

  if (!Number.isFinite(templateScore)) return runRatioScore;
  if (!Number.isFinite(runRatioScore)) return templateScore;
  return templateScore + runRatioScore * FINDER_RUN_RATIO_SCORE_WEIGHT;
}

function scoreWarpedFinderPatternTemplate(imageData, center, modulePixels) {
  const samples = [];
  for (let y = -3; y <= 3; y += 1) {
    for (let x = -3; x <= 3; x += 1) {
      const gray = sampleWarpedTemplateCell(imageData, center, modulePixels, x, y, finderPatternValue(x + 3, y + 3));
      samples.push({ gray, dark: finderPatternValue(x + 3, y + 3), weight: Math.abs(x) === 3 || Math.abs(y) === 3 ? 1.4 : 1 });
    }
  }

  const dark = weightedMean(samples.filter((sample) => sample.dark).map((sample) => ({ value: sample.gray, weight: sample.weight })));
  const light = weightedMean(samples.filter((sample) => !sample.dark).map((sample) => ({ value: sample.gray, weight: sample.weight })));
  if (!Number.isFinite(dark) || !Number.isFinite(light) || light <= dark) return -Infinity;

  const threshold = (dark + light) / 2;
  let score = (light - dark) * 12;
  for (const sample of samples) {
    const margin = sample.dark ? threshold - sample.gray : sample.gray - threshold;
    score += sample.weight * clamp(margin, -48, 48);
    score += sample.weight * (margin > 0 ? 12 : -22);
  }
  return score;
}

function scoreWarpedFinderPatternRunRatios(imageData, center, modulePixels) {
  const horizontal = scoreFinderPatternRunAxis(imageData, center, modulePixels, 1, 0);
  const vertical = scoreFinderPatternRunAxis(imageData, center, modulePixels, 0, 1);
  if (!Number.isFinite(horizontal) && !Number.isFinite(vertical)) return -Infinity;
  if (!Number.isFinite(horizontal)) return vertical - 120;
  if (!Number.isFinite(vertical)) return horizontal - 120;
  return horizontal + vertical;
}

function scoreFinderPatternRunAxis(imageData, center, modulePixels, axisX, axisY) {
  const bands = [
    { start: -3.5, end: -2.5, dark: true, weight: 1.2 },
    { start: -2.5, end: -1.5, dark: false, weight: 1 },
    { start: -1.5, end: 1.5, dark: true, weight: 2.4 },
    { start: 1.5, end: 2.5, dark: false, weight: 1 },
    { start: 2.5, end: 3.5, dark: true, weight: 1.2 },
  ].map((band) => ({
    ...band,
    gray: sampleFinderPatternRunBand(imageData, center, modulePixels, axisX, axisY, band),
  }));

  const dark = weightedMean(bands.filter((band) => band.dark).map((band) => ({ value: band.gray, weight: band.weight })));
  const light = weightedMean(bands.filter((band) => !band.dark).map((band) => ({ value: band.gray, weight: band.weight })));
  if (!Number.isFinite(dark) || !Number.isFinite(light) || light <= dark) return -Infinity;

  const threshold = (dark + light) / 2;
  let score = (light - dark) * 18;
  for (const band of bands) {
    const margin = band.dark ? threshold - band.gray : band.gray - threshold;
    score += band.weight * clamp(margin, -50, 50) * 3.2;
    score += band.weight * (margin > 0 ? 36 : -72);
  }

  const edgePairs = [
    [bands[0], bands[1]],
    [bands[1], bands[2]],
    [bands[2], bands[3]],
    [bands[3], bands[4]],
  ];
  for (const [left, right] of edgePairs) {
    const edgeContrast = left.dark ? right.gray - left.gray : left.gray - right.gray;
    score += clamp(edgeContrast, -60, 60) * 1.5;
  }

  const lightBalance = Math.abs(bands[1].gray - bands[3].gray);
  const outerDarkBalance = Math.abs(bands[0].gray - bands[4].gray);
  score -= Math.min(60, lightBalance * 0.7 + outerDarkBalance * 0.45);
  return score;
}

function sampleFinderPatternRunBand(imageData, center, modulePixels, axisX, axisY, band) {
  const values = [];
  const width = band.end - band.start;
  const steps = Math.max(3, Math.round(width * 5));
  const perpendicularX = -axisY;
  const perpendicularY = axisX;

  for (let i = 0; i < steps; i += 1) {
    const along = band.start + ((i + 0.5) / steps) * width;
    for (const across of [-0.22, -0.07, 0.07, 0.22]) {
      const x = center.x + (axisX * along + perpendicularX * across) * modulePixels;
      const y = center.y + (axisY * along + perpendicularY * across) * modulePixels;
      values.push(sampleGray(imageData, imageData.width, imageData.height, x, y));
    }
  }

  const meanValue = mean(values);
  return band.dark ? meanLowestValues(values, 0.58, meanValue) : meanHighestValues(values, 0.58, meanValue);
}

function sampleWarpedTemplateCell(imageData, center, modulePixels, moduleX, moduleY, expectedDark) {
  const values = [];
  for (const yOffset of [-0.22, 0, 0.22]) {
    for (const xOffset of [-0.22, 0, 0.22]) {
      const x = center.x + (moduleX + xOffset) * modulePixels;
      const y = center.y + (moduleY + yOffset) * modulePixels;
      values.push(sampleGray(imageData, imageData.width, imageData.height, x, y));
    }
  }

  const meanValue = mean(values);
  return expectedDark ? meanLowestValues(values, 0.55, meanValue) : meanHighestValues(values, 0.55, meanValue);
}

function refineLocationFromFinderPatterns(location, version) {
  if (USE_DETECTED_RECTANGLE_ONLY) return location;

  const size = 17 + version * 4;
  if (!Number.isFinite(size) || size < 21) return location;

  const baseCorners = [
    location.topLeftCorner,
    location.topRightCorner,
    location.bottomRightCorner,
    location.bottomLeftCorner,
  ];
  if (!baseCorners.every(isFinitePoint)) return location;

  const moduleSize = estimateModuleSizeFromLocation(location, size);
  if (!Number.isFinite(moduleSize) || moduleSize < 1) return location;

  const baseTransform = squareToQuadrilateralTransform(
    location.topLeftCorner,
    location.topRightCorner,
    location.bottomRightCorner,
    location.bottomLeftCorner,
  );
  if (!baseTransform) return location;

  const maxCornerMove = moduleSize * CORNER_MICRO_ADJUST_MAX_MODULES;
  const adjustments = [];
  const finderOffset = 3.5 / size;
  const oppositeFinderOffset = 1 - finderOffset;

  addCornerMicroAdjustment(adjustments, {
    cornerKey: "topLeftCorner",
    actualPoint: location.topLeftFinderPattern,
    expectedPoint: mapPoint(baseTransform, finderOffset, finderOffset),
    moduleSize,
    maxCornerMove,
    weight: CORNER_MICRO_ADJUST_WEIGHT,
    sourceLimitModules: 2.4,
  });
  addCornerMicroAdjustment(adjustments, {
    cornerKey: "topRightCorner",
    actualPoint: location.topRightFinderPattern,
    expectedPoint: mapPoint(baseTransform, oppositeFinderOffset, finderOffset),
    moduleSize,
    maxCornerMove,
    weight: CORNER_MICRO_ADJUST_WEIGHT,
    sourceLimitModules: 2.4,
  });
  addCornerMicroAdjustment(adjustments, {
    cornerKey: "bottomLeftCorner",
    actualPoint: location.bottomLeftFinderPattern,
    expectedPoint: mapPoint(baseTransform, finderOffset, oppositeFinderOffset),
    moduleSize,
    maxCornerMove,
    weight: CORNER_MICRO_ADJUST_WEIGHT,
    sourceLimitModules: 2.4,
  });

  if (version >= 2 && isFinitePoint(location.bottomRightAlignmentPattern)) {
    const alignmentOffset = bottomRightAlignmentOffset(version, size);
    addCornerMicroAdjustment(adjustments, {
      cornerKey: "bottomRightCorner",
      actualPoint: location.bottomRightAlignmentPattern,
      expectedPoint: mapPoint(baseTransform, alignmentOffset, alignmentOffset),
      moduleSize,
      maxCornerMove,
      weight: ALIGNMENT_MICRO_ADJUST_WEIGHT,
      sourceLimitModules: 1.8,
    });
  }

  if (!adjustments.length) {
    return location;
  }

  return applyCornerMicroAdjustments(location, adjustments);
}

function gridAlignedLocationFromJsQrLocation(location, version) {
  const size = 17 + version * 4;
  if (!Number.isFinite(size) || size < 21 || !location) return location;

  const finderOffset = 3.5 / size;
  const oppositeFinderOffset = 1 - finderOffset;
  const pairs = [
    {
      u: finderOffset,
      v: finderOffset,
      point: location.topLeftFinderPattern,
    },
    {
      u: oppositeFinderOffset,
      v: finderOffset,
      point: location.topRightFinderPattern,
    },
    {
      u: finderOffset,
      v: oppositeFinderOffset,
      point: location.bottomLeftFinderPattern,
    },
  ];

  if (version >= 2 && isFinitePoint(location.bottomRightAlignmentPattern)) {
    const alignmentOffset = bottomRightAlignmentOffset(version, size);
    pairs.push({
      u: alignmentOffset,
      v: alignmentOffset,
      point: location.bottomRightAlignmentPattern,
    });
  } else {
    pairs.push({
      u: 1,
      v: 1,
      point: location.bottomRightCorner,
    });
  }

  if (pairs.some((pair) => !isFinitePoint(pair.point))) return location;

  const transform = projectiveTransformFromWeightedPointPairs(
    pairs.map((pair) => ({
      u: pair.u,
      v: pair.v,
      x: pair.point.x,
      y: pair.point.y,
      weight: 1,
    })),
  );
  if (!transform) return location;

  return {
    ...location,
    topLeftCorner: mapPoint(transform, 0, 0),
    topRightCorner: mapPoint(transform, 1, 0),
    bottomRightCorner: mapPoint(transform, 1, 1),
    bottomLeftCorner: mapPoint(transform, 0, 1),
  };
}

function bottomRightAlignmentOffset(version, size) {
  const centers = ALIGNMENT_PATTERN_CENTERS[version] ?? [];
  const lastCenter = centers.at(-1);
  return Number.isFinite(lastCenter) ? (lastCenter + 0.5) / size : (size - 6.5) / size;
}

function addCornerMicroAdjustment(adjustments, options) {
  const { cornerKey, actualPoint, expectedPoint, moduleSize, maxCornerMove, weight, sourceLimitModules } = options;
  if (!isFinitePoint(actualPoint) || !isFinitePoint(expectedPoint)) return;

  const residual = {
    x: actualPoint.x - expectedPoint.x,
    y: actualPoint.y - expectedPoint.y,
  };
  if (Math.hypot(residual.x, residual.y) > moduleSize * sourceLimitModules) return;

  const delta = capVector(
    {
      x: residual.x * weight,
      y: residual.y * weight,
    },
    maxCornerMove,
  );
  if (Math.hypot(delta.x, delta.y) < 0.05) return;
  adjustments.push({ cornerKey, delta });
}

function applyCornerMicroAdjustments(location, adjustments) {
  const refined = { ...location };
  for (const { cornerKey, delta } of adjustments) {
    const corner = refined[cornerKey];
    if (!isFinitePoint(corner)) continue;
    refined[cornerKey] = {
      x: corner.x + delta.x,
      y: corner.y + delta.y,
    };
  }
  return refined;
}

function estimateModuleSizeFromLocation(location, size) {
  const sides = [
    distanceBetween(location.topLeftCorner, location.topRightCorner),
    distanceBetween(location.topRightCorner, location.bottomRightCorner),
    distanceBetween(location.bottomRightCorner, location.bottomLeftCorner),
    distanceBetween(location.bottomLeftCorner, location.topLeftCorner),
  ].filter((value) => Number.isFinite(value) && value > 0);
  return sides.length ? mean(sides) / size : NaN;
}

function capVector(vector, maxLength) {
  const length = Math.hypot(vector.x, vector.y);
  if (!Number.isFinite(length) || length <= maxLength) return vector;
  const scale = maxLength / length;
  return {
    x: vector.x * scale,
    y: vector.y * scale,
  };
}

function isFinitePoint(point) {
  return point && Number.isFinite(point.x) && Number.isFinite(point.y);
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

async function tryDecodeCandidate(sourceCanvas, candidate, context) {
  const modes = ["contrast", "binary"];
  const scales = detectionScales(candidate);

  for (const scale of scales) {
    for (const mode of modes) {
      await stepDetection(context);
      const prepared = prepareCandidateImage(sourceCanvas, candidate, scale, mode);
      const code = jsQR(prepared.imageData.data, prepared.width, prepared.height, {
        inversionAttempts: "attemptBoth",
      });

      if (code) {
        const refinedCodeLocation = refineWarpedFinderPatternCenters(prepared.imageData, code.location, code.version);
        const mappedLocation = mapDetectedLocation(refinedCodeLocation, candidate, prepared.scaleX, prepared.scaleY);
        return {
          code,
          location: refineLocationFromFinderPatterns(mappedLocation, code.version),
          notice: buildDetectionNotice(candidate.source, mode, scale),
        };
      }
    }
  }

  if (candidate.source === "qr-texture") {
    const panelDecoded = await tryDecodeLightPanelCandidate(sourceCanvas, candidate, context);
    if (panelDecoded) return panelDecoded;
  }

  return null;
}

async function tryDecodeLightPanelCandidate(sourceCanvas, candidate, context) {
  await stepDetection(context);
  const prepared = prepareCandidateImage(sourceCanvas, candidate, 1, "raw");
  const panelQuad = findLightPanelQuad(prepared.imageData, candidate);
  if (!panelQuad) return null;

  const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const sourceImage = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const transform = squareToQuadrilateralTransform(panelQuad[0], panelQuad[1], panelQuad[2], panelQuad[3]);
  const warped = renderWarpedImageData(sourceImage, sourceCanvas.width, sourceCanvas.height, transform, PANEL_WARP_SIZE);

  for (const mode of ["contrast", "binary"]) {
    await stepDetection(context);
    const imageData = cloneImageData(warped);
    preprocessForJsQr(imageData, mode);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "attemptBoth",
    });
    if (!code) continue;
    const refinedCodeLocation = refineWarpedFinderPatternCenters(imageData, code.location, code.version);
    const mappedLocation = mapNormalizedLocation(refinedCodeLocation, transform, PANEL_WARP_SIZE);

    return {
      code,
      location: refineLocationFromFinderPatterns(mappedLocation, code.version),
      notice: buildDetectionNotice(candidate.source, mode, 1),
    };
  }

  return null;
}

function findLightPanelQuad(imageData, candidate) {
  const width = imageData.width;
  const height = imageData.height;
  const grays = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    grays.push(rgbToPerceptualGray(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]));
  }

  const sorted = [...grays].sort((a, b) => a - b);
  const high = sorted[Math.floor(sorted.length * 0.78)] ?? 180;
  const threshold = clamp(high - 8, 138, 232);
  const rows = [];

  for (let y = 0; y < height; y += 1) {
    let minX = Infinity;
    let maxX = -Infinity;
    let count = 0;
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const gray = rgbToPerceptualGray(imageData.data[offset], imageData.data[offset + 1], imageData.data[offset + 2]);
      if (gray < threshold) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      count += 1;
    }

    if (count >= width * 0.18 && maxX - minX >= width * 0.28) {
      rows.push({ y, minX, maxX, count });
    }
  }

  if (rows.length < Math.max(16, height * 0.18)) return null;

  const topRows = rows.slice(0, Math.max(3, Math.round(rows.length * 0.18)));
  const bottomRows = rows.slice(-Math.max(3, Math.round(rows.length * 0.18)));
  const leftRows = rows.filter((row) => row.maxX - row.minX >= width * 0.34);
  if (leftRows.length < 4) return null;

  const topY = mean(topRows.map((row) => row.y));
  const bottomY = mean(bottomRows.map((row) => row.y));
  const topLeftX = percentile(topRows.map((row) => row.minX), 0.18);
  const topRightX = percentile(topRows.map((row) => row.maxX), 0.82);
  const bottomLeftX = percentile(bottomRows.map((row) => row.minX), 0.18);
  const bottomRightX = percentile(bottomRows.map((row) => row.maxX), 0.82);
  const panelWidth = Math.max(topRightX - topLeftX, bottomRightX - bottomLeftX);
  const panelHeight = bottomY - topY;
  if (panelWidth < 38 || panelHeight < 38) return null;

  const pad = Math.max(2, Math.min(panelWidth, panelHeight) * 0.04);
  return [
    { x: candidate.x + topLeftX - pad, y: candidate.y + topY - pad },
    { x: candidate.x + topRightX + pad, y: candidate.y + topY - pad },
    { x: candidate.x + bottomRightX + pad, y: candidate.y + bottomY + pad },
    { x: candidate.x + bottomLeftX - pad, y: candidate.y + bottomY + pad },
  ];
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
  const parts = [];
  if (source === "dark-region") {
    parts.push(t("detectionNoticeDarkRegion"));
  } else if (source === "qr-texture") {
    parts.push(t("detectionNoticeQrTexture"));
  } else if (source === "grid") {
    parts.push(t("detectionNoticeGrid"));
  } else if (source === "browser-crop") {
    parts.push(t("barcodeDetectorNotice"));
  } else if (source === "browser-crop-rotated") {
    parts.push(t("barcodeDetectorRotatedNotice"));
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
  if (!USE_PRE_CROP_CANDIDATES && candidate.source === "full") {
    return fullImageUpscaleScales(candidate);
  }

  const minSide = Math.min(candidate.width, candidate.height);
  const smallCandidateScales = minSide <= 180 ? [4.0] : [];
  if (candidate.source === "qr-texture") {
    const targetScale = clamp(560 / Math.max(1, minSide), 1, 3.4);
    const scales = [targetScale, ...smallCandidateScales, 1, 2.2]
      .map((scale) => Math.min(scale, MAX_DETECTION_SIDE / Math.max(candidate.width, candidate.height)))
      .filter((scale) => scale >= 0.85);

    return [...new Set(scales.map((scale) => Number(scale.toFixed(2))))];
  }

  const targetScale = clamp(720 / Math.max(1, minSide), 1, 3.2);
  const scales = [1, targetScale, ...smallCandidateScales, 1.5, 2.2, 3.0]
    .map((scale) => Math.min(scale, MAX_DETECTION_SIDE / Math.max(candidate.width, candidate.height)))
    .filter((scale) => scale >= 0.85);

  return [...new Set(scales.map((scale) => Number(scale.toFixed(2))))];
}

function fullImageUpscaleScales(candidate) {
  const maxSide = Math.max(candidate.width, candidate.height);
  const capScale = FULL_IMAGE_UPSCALE_MAX_SIDE / Math.max(1, maxSide);
  const scales = [2, 3, 4, 1.5, 1]
    .map((scale) => Math.min(scale, capScale))
    .filter((scale) => scale >= 0.5);

  if (scales.length === 0) {
    scales.push(Math.min(1, capScale));
  }

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
    preprocessForJsQr(imageData, mode);
    ctx.putImageData(imageData, 0, 0);
  }

  return {
    canvas,
    imageData,
    width: canvas.width,
    height: canvas.height,
    scaleX: canvas.width / candidate.width,
    scaleY: canvas.height / candidate.height,
  };
}

function preprocessForJsQr(imageData, mode) {
  preprocessForDetection(imageData, "contrast");
  if (mode === "binary") {
    preprocessForDetection(imageData, "binary");
  }
}

function preprocessForDetection(imageData, mode) {
  const grays = new Array(imageData.width * imageData.height);
  for (let i = 0, p = 0; i < imageData.data.length; i += 4, p += 1) {
    grays[p] = rgbToPerceptualGray(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]);
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

function findQrLikeRegionCandidates(imageData, width, height) {
  const cellSize = Math.max(3, Math.round(Math.min(width, height) / QR_ROI_GRID_CELLS));
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  const sums = new Float32Array(gridWidth * gridHeight);
  const counts = new Uint16Array(gridWidth * gridHeight);
  const mins = new Uint16Array(gridWidth * gridHeight);
  const maxes = new Uint16Array(gridWidth * gridHeight);
  const graySamples = [];
  const pixelStep = Math.max(1, Math.round(cellSize / 2));

  mins.fill(255);
  for (let y = 0; y < height; y += pixelStep) {
    const gy = Math.floor(y / cellSize);
    for (let x = 0; x < width; x += pixelStep) {
      const gx = Math.floor(x / cellSize);
      const index = gy * gridWidth + gx;
      const gray = sampleGray(imageData, width, height, x, y);
      const rounded = Math.round(gray);

      sums[index] += gray;
      counts[index] += 1;
      mins[index] = Math.min(mins[index], rounded);
      maxes[index] = Math.max(maxes[index], rounded);
      graySamples.push(gray);
    }
  }

  const globalThreshold = otsuThreshold(graySamples);
  const darkThreshold = Math.min(145, globalThreshold);
  const lightThreshold = Math.max(160, globalThreshold + 24);
  const means = new Float32Array(gridWidth * gridHeight);
  const darkRatios = new Float32Array(gridWidth * gridHeight);
  const lightRatios = new Float32Array(gridWidth * gridHeight);

  for (let index = 0; index < means.length; index += 1) {
    means[index] = counts[index] > 0 ? sums[index] / counts[index] : 255;
  }

  for (let y = 0; y < height; y += pixelStep) {
    const gy = Math.floor(y / cellSize);
    for (let x = 0; x < width; x += pixelStep) {
      const gx = Math.floor(x / cellSize);
      const index = gy * gridWidth + gx;
      const gray = sampleGray(imageData, width, height, x, y);
      if (gray <= darkThreshold) darkRatios[index] += 1;
      if (gray >= lightThreshold) lightRatios[index] += 1;
    }
  }

  const active = new Uint8Array(gridWidth * gridHeight);
  for (let gy = 0; gy < gridHeight; gy += 1) {
    for (let gx = 0; gx < gridWidth; gx += 1) {
      const index = gy * gridWidth + gx;
      if (!counts[index]) continue;

      const darkRatio = darkRatios[index] / counts[index];
      const lightRatio = lightRatios[index] / counts[index];
      const range = maxes[index] - mins[index];
      let neighborContrast = 0;

      for (let yy = Math.max(0, gy - 1); yy <= Math.min(gridHeight - 1, gy + 1); yy += 1) {
        for (let xx = Math.max(0, gx - 1); xx <= Math.min(gridWidth - 1, gx + 1); xx += 1) {
          if (xx === gx && yy === gy) continue;
          neighborContrast = Math.max(neighborContrast, Math.abs(means[index] - means[yy * gridWidth + xx]));
        }
      }

      const mixedCell = range >= 52 && darkRatio >= 0.06 && lightRatio >= 0.06;
      const edgeCell = neighborContrast >= 48 && (means[index] <= 205 || darkRatio >= 0.08);
      if (mixedCell || edgeCell) active[index] = 1;
    }
  }

  const dilated = dilateGrid(active, gridWidth, gridHeight, 2);
  const visited = new Uint8Array(gridWidth * gridHeight);
  const candidates = buildTextureWindowCandidates(active, gridWidth, gridHeight, cellSize, imageData, width, height);

  for (let gy = 0; gy < gridHeight; gy += 1) {
    for (let gx = 0; gx < gridWidth; gx += 1) {
      const start = gy * gridWidth + gx;
      if (!dilated[start] || visited[start]) continue;

      const component = collectComponent(dilated, visited, gridWidth, gridHeight, gx, gy);
      const candidate = componentToQrLikeCandidate(component, cellSize, width, height, imageData);
      if (candidate) candidates.push(candidate);
    }
  }

  return mergeCandidateBoxes(candidates)
    .sort((a, b) => b.score - a.score)
    .slice(0, QR_ROI_CANDIDATE_LIMIT);
}

function buildTextureWindowCandidates(active, gridWidth, gridHeight, cellSize, imageData, width, height) {
  const integral = new Uint32Array((gridWidth + 1) * (gridHeight + 1));
  const at = (x, y) => integral[y * (gridWidth + 1) + x];
  const candidates = [];
  const minImageSide = Math.min(width, height);
  const sideLengths = [...new Set([0.13, 0.18, 0.24, 0.32, 0.42, 0.56].map((ratio) => Math.round(minImageSide * ratio)))]
    .filter((side) => side >= 46 && side <= Math.max(width, height));
  const aspectRatios = [1, 1.22, 0.82];

  for (let y = 1; y <= gridHeight; y += 1) {
    let rowSum = 0;
    for (let x = 1; x <= gridWidth; x += 1) {
      rowSum += active[(y - 1) * gridWidth + (x - 1)];
      integral[y * (gridWidth + 1) + x] = at(x, y - 1) + rowSum;
    }
  }

  for (const side of sideLengths) {
    for (const aspect of aspectRatios) {
      const windowWidth = Math.max(4, Math.round((side * aspect) / cellSize));
      const windowHeight = Math.max(4, Math.round(side / cellSize));
      if (windowWidth >= gridWidth || windowHeight >= gridHeight) continue;

      const stepX = Math.max(3, Math.round(windowWidth / 4));
      const stepY = Math.max(3, Math.round(windowHeight / 4));
      for (let gy = 0; gy <= gridHeight - windowHeight; gy += stepY) {
        for (let gx = 0; gx <= gridWidth - windowWidth; gx += stepX) {
          const activeCount =
            at(gx + windowWidth, gy + windowHeight) -
            at(gx, gy + windowHeight) -
            at(gx + windowWidth, gy) +
            at(gx, gy);
          const density = activeCount / (windowWidth * windowHeight);
          if (density < 0.08) continue;

          const padding = Math.max(10, Math.round(Math.max(windowWidth, windowHeight) * cellSize * 0.18));
          const x = clamp(gx * cellSize - padding, 0, width - 1);
          const y = clamp(gy * cellSize - padding, 0, height - 1);
          const right = clamp((gx + windowWidth) * cellSize + padding, 1, width);
          const bottom = clamp((gy + windowHeight) * cellSize + padding, 1, height);
          const candidate = {
            x,
            y,
            width: right - x,
            height: bottom - y,
            source: "qr-texture",
          };
          const textureScore = scoreQrLikeCandidate(imageData, width, height, candidate);
          if (textureScore < 250) continue;

          const sideRatio = Math.max(candidate.width, candidate.height) / Math.max(1, Math.min(width, height));
          const sizePreference = 1 - Math.min(0.9, Math.abs(sideRatio - 0.46) * 1.6);
          const largePenalty = Math.max(0, sideRatio - 0.72) * 1100;
          candidate.score = textureScore + density * 700 + activeCount * cellSize * cellSize * 0.08 + sizePreference * 520 - largePenalty;
          candidates.push(candidate);
        }
      }
    }
  }

  return candidates;
}

function componentToQrLikeCandidate(component, cellSize, width, height, imageData) {
  const rawX = component.minX * cellSize;
  const rawY = component.minY * cellSize;
  const rawWidth = (component.maxX - component.minX + 1) * cellSize;
  const rawHeight = (component.maxY - component.minY + 1) * cellSize;
  const minSide = Math.min(rawWidth, rawHeight);
  const maxSide = Math.max(rawWidth, rawHeight);
  const aspect = rawWidth / Math.max(1, rawHeight);

  if (minSide < 34 || maxSide < 54 || aspect < 0.35 || aspect > 2.8) return null;

  const padding = Math.max(14, Math.round(maxSide * 0.22));
  const x = clamp(rawX - padding, 0, width - 1);
  const y = clamp(rawY - padding, 0, height - 1);
  const right = clamp(rawX + rawWidth + padding, 1, width);
  const bottom = clamp(rawY + rawHeight + padding, 1, height);
  const candidate = {
    x,
    y,
    width: right - x,
    height: bottom - y,
    source: "qr-texture",
  };
  const score = scoreQrLikeCandidate(imageData, width, height, candidate);
  if (score < 250) return null;

  const sideRatio = Math.max(candidate.width, candidate.height) / Math.max(1, Math.min(width, height));
  const largePenalty = Math.max(0, sideRatio - 0.72) * 1100;
  candidate.score = score + component.count * cellSize * cellSize * 0.4 - largePenalty;
  return candidate;
}

function scoreQrLikeCandidate(imageData, width, height, candidate) {
  const sampleCount = 20;
  const values = [];

  for (let y = 0; y < sampleCount; y += 1) {
    for (let x = 0; x < sampleCount; x += 1) {
      const px = candidate.x + ((x + 0.5) / sampleCount) * candidate.width;
      const py = candidate.y + ((y + 0.5) / sampleCount) * candidate.height;
      values.push(sampleGray(imageData, width, height, px, py));
    }
  }

  const sorted = [...values].sort((a, b) => a - b);
  const low = sorted[Math.floor(sorted.length * 0.12)] ?? 0;
  const high = sorted[Math.floor(sorted.length * 0.88)] ?? 255;
  const range = high - low;
  if (range < 34) return 0;

  const darkCutoff = low + range * 0.38;
  const lightCutoff = low + range * 0.66;
  const darkRatio = values.filter((value) => value <= darkCutoff).length / values.length;
  const lightRatio = values.filter((value) => value >= lightCutoff).length / values.length;
  if (darkRatio < 0.05 || lightRatio < 0.12) return 0;

  let edgeCount = 0;
  for (let y = 0; y < sampleCount; y += 1) {
    for (let x = 0; x < sampleCount; x += 1) {
      const index = y * sampleCount + x;
      const current = values[index];
      if (x + 1 < sampleCount && Math.abs(current - values[index + 1]) > range * 0.28) edgeCount += 1;
      if (y + 1 < sampleCount && Math.abs(current - values[index + sampleCount]) > range * 0.28) edgeCount += 1;
    }
  }

  const edgeDensity = edgeCount / (sampleCount * (sampleCount - 1) * 2);
  const aspect = candidate.width / Math.max(1, candidate.height);
  const squareScore = 1 - Math.min(0.75, Math.abs(1 - aspect));
  const balance = 1 - Math.min(0.8, Math.abs(darkRatio - 0.34));

  return range * 4 + edgeDensity * 900 + squareScore * 280 + balance * 180;
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

function weightedMean(items) {
  let total = 0;
  let weightTotal = 0;
  for (const item of items) {
    if (!Number.isFinite(item.value) || !Number.isFinite(item.weight) || item.weight <= 0) continue;
    total += item.value * item.weight;
    weightTotal += item.weight;
  }
  return weightTotal > 0 ? total / weightTotal : NaN;
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

function renderWarpedQr(sourceImage, sourceWidth, sourceHeight, transform, modules, options = {}) {
  const outputSize = modules * WARPED_MODULE_PIXELS;
  return renderWarpedImageData(sourceImage, sourceWidth, sourceHeight, transform, outputSize, {
    interpolation: "bilinear",
    ...options,
  });
}

function renderWarpedImageData(sourceImage, sourceWidth, sourceHeight, transform, outputSize, options = {}) {
  const output = new ImageData(outputSize, outputSize);
  const sampleColor = sampleRgb;

  for (let y = 0; y < outputSize; y += 1) {
    for (let x = 0; x < outputSize; x += 1) {
      const point = mapPoint(transform, x / outputSize, y / outputSize);
      const color = sampleColor(sourceImage, sourceWidth, sourceHeight, point.x, point.y);
      const offset = (y * outputSize + x) * 4;
      output.data[offset] = color.r;
      output.data[offset + 1] = color.g;
      output.data[offset + 2] = color.b;
      output.data[offset + 3] = 255;
    }
  }

  return output;
}

function alignWarpedImageToSamplingBounds(warpedImage, bounds) {
  if (!bounds || samplingBoundsCoversFullImage(warpedImage, bounds)) return warpedImage;

  const output = new ImageData(warpedImage.width, warpedImage.height);
  const sourceWidth = bounds.right - bounds.left;
  const sourceHeight = bounds.bottom - bounds.top;
  if (sourceWidth <= 1 || sourceHeight <= 1) return warpedImage;

  for (let y = 0; y < output.height; y += 1) {
    for (let x = 0; x < output.width; x += 1) {
      const sourceX = bounds.left + ((x + 0.5) / output.width) * sourceWidth;
      const sourceY = bounds.top + ((y + 0.5) / output.height) * sourceHeight;
      const color = sampleRgb(warpedImage, warpedImage.width, warpedImage.height, sourceX, sourceY);
      const offset = (y * output.width + x) * 4;
      output.data[offset] = color.r;
      output.data[offset + 1] = color.g;
      output.data[offset + 2] = color.b;
      output.data[offset + 3] = 255;
    }
  }

  return output;
}

function samplingBoundsCoversFullImage(warpedImage, bounds) {
  return (
    Math.abs(bounds.left) < 0.001 &&
    Math.abs(bounds.top) < 0.001 &&
    Math.abs(bounds.right - warpedImage.width) < 0.001 &&
    Math.abs(bounds.bottom - warpedImage.height) < 0.001
  );
}

function cornersFromTransformAndSamplingBounds(transform, bounds, warpedImage) {
  if (!bounds || !warpedImage) return cornersFromTransform(transform);

  return {
    topLeftCorner: mapPoint(transform, bounds.left / warpedImage.width, bounds.top / warpedImage.height),
    topRightCorner: mapPoint(transform, bounds.right / warpedImage.width, bounds.top / warpedImage.height),
    bottomRightCorner: mapPoint(transform, bounds.right / warpedImage.width, bounds.bottom / warpedImage.height),
    bottomLeftCorner: mapPoint(transform, bounds.left / warpedImage.width, bounds.bottom / warpedImage.height),
  };
}

function warpedPointFromSourcePoint(transform, sourcePoint, outputSize, fallbackU, fallbackV) {
  const normalized = isFinitePoint(sourcePoint) ? mapSourcePointToNormalized(transform, sourcePoint) : null;
  const usable =
    normalized &&
    normalized.u >= -0.16 &&
    normalized.u <= 1.16 &&
    normalized.v >= -0.16 &&
    normalized.v <= 1.16;
  const u = usable ? normalized.u : fallbackU;
  const v = usable ? normalized.v : fallbackV;
  return {
    x: clamp(u * outputSize, 0, outputSize - 1),
    y: clamp(v * outputSize, 0, outputSize - 1),
  };
}

function sourcePointFromWarpedPoint(transform, warpedImage, warpedPoint) {
  if (!isFinitePoint(warpedPoint) || !warpedImage?.width || !warpedImage?.height) return null;
  return mapPoint(transform, warpedPoint.x / warpedImage.width, warpedPoint.y / warpedImage.height);
}

function mapSourcePointToNormalized(transform, point) {
  const inverse = invertProjectiveTransform(transform);
  if (!inverse) return null;

  const denominator = inverse.g * point.x + inverse.h * point.y + inverse.i;
  if (Math.abs(denominator) < 1e-9) return null;

  return {
    u: (inverse.a * point.x + inverse.b * point.y + inverse.c) / denominator,
    v: (inverse.d * point.x + inverse.e * point.y + inverse.f) / denominator,
  };
}

function invertProjectiveTransform(transform) {
  const m00 = transform.a;
  const m01 = transform.b;
  const m02 = transform.c;
  const m10 = transform.d;
  const m11 = transform.e;
  const m12 = transform.f;
  const m20 = transform.g;
  const m21 = transform.h;
  const m22 = 1;

  const c00 = m11 * m22 - m12 * m21;
  const c01 = -(m10 * m22 - m12 * m20);
  const c02 = m10 * m21 - m11 * m20;
  const c10 = -(m01 * m22 - m02 * m21);
  const c11 = m00 * m22 - m02 * m20;
  const c12 = -(m00 * m21 - m01 * m20);
  const c20 = m01 * m12 - m02 * m11;
  const c21 = -(m00 * m12 - m02 * m10);
  const c22 = m00 * m11 - m01 * m10;
  const determinant = m00 * c00 + m01 * c01 + m02 * c02;
  if (Math.abs(determinant) < 1e-9) return null;

  const scale = 1 / determinant;
  return {
    a: c00 * scale,
    b: c10 * scale,
    c: c20 * scale,
    d: c01 * scale,
    e: c11 * scale,
    f: c21 * scale,
    g: c02 * scale,
    h: c12 * scale,
    i: c22 * scale,
  };
}

function refineTransformFromFinderTriangle(sourceImage, sourceWidth, sourceHeight, initialTransform, location, size, detected = null) {
  if (!USE_FINDER_TRIANGLE_WARP || !initialTransform || !location) return null;

  const analysisWarp = renderWarpedQr(sourceImage, sourceWidth, sourceHeight, initialTransform, size, {
    interpolation: "bilinear",
  });
  const outputSize = analysisWarp.width;
  const finderOffset = 3.5;
  const oppositeFinderOffset = size - 3.5;
  const finderReferences = [
    {
      key: "topLeft",
      point: location.topLeftFinderPattern,
      moduleX: finderOffset,
      moduleY: finderOffset,
      originX: 0,
      originY: 0,
    },
    {
      key: "topRight",
      point: location.topRightFinderPattern,
      moduleX: oppositeFinderOffset,
      moduleY: finderOffset,
      originX: size - 7,
      originY: 0,
    },
    {
      key: "bottomLeft",
      point: location.bottomLeftFinderPattern,
      moduleX: finderOffset,
      moduleY: oppositeFinderOffset,
      originX: 0,
      originY: size - 7,
    },
  ];

  const approximateCenters = finderReferences.map((reference) =>
    warpedPointFromSourcePoint(initialTransform, reference.point, outputSize, reference.moduleX / size, reference.moduleY / size),
  );
  const modulePixels = estimateFinderTriangleModulePixels(approximateCenters, outputSize, size);
  if (!Number.isFinite(modulePixels) || modulePixels < 2) return null;

  const finderMatches = finderReferences.map((reference, index) => ({
    ...reference,
    match: refineWarpedFinderPatternMatch(
      analysisWarp,
      approximateCenters[index],
      modulePixels,
      FINDER_TRIANGLE_SEARCH_MAX_MODULES,
    ),
  }));
  if (finderMatches.some((reference) => !isFinitePoint(reference.match.point))) return null;

  const centers = Object.fromEntries(
    finderMatches.map((reference) => [
      reference.key,
      sourcePointFromWarpedPoint(initialTransform, analysisWarp, reference.match.point),
    ]),
  );
  if (![centers.topLeft, centers.topRight, centers.bottomLeft].every(isFinitePoint)) return null;

  const triangleTransform = affineTransformFromFinderCenters(centers.topLeft, centers.topRight, centers.bottomLeft, size);
  if (!triangleTransform || !isReasonableFinderTriangleTransform(initialTransform, triangleTransform, size)) return null;

  const alignmentReference = findBottomRightAlignmentReference(initialTransform, analysisWarp, location, size, modulePixels);
  const exactTransform =
    projectiveTransformFromFinderGrid(initialTransform, centers, alignmentReference, size) ?? triangleTransform;
  if (!isReasonableFinderTriangleTransform(initialTransform, exactTransform, size)) return triangleTransform;

  const iteratedTransform = refineFinderGridTransformIteration(sourceImage, sourceWidth, sourceHeight, exactTransform, size);
  return selectBestFinderGridTransform({
    sourceImage,
    sourceWidth,
    sourceHeight,
    initialTransform,
    triangleTransform,
    exactTransform,
    iteratedTransform,
    centers,
    alignmentReference,
    size,
    detected,
  });
}

function estimateFinderTriangleModulePixels(centers, outputSize, size) {
  const expectedDistance = size - 7;
  const distances = [
    centers[0] && centers[1] ? distanceBetween(centers[0], centers[1]) : NaN,
    centers[0] && centers[2] ? distanceBetween(centers[0], centers[2]) : NaN,
  ].filter((value) => Number.isFinite(value) && value > 0);
  const estimated = distances.length ? mean(distances) / expectedDistance : outputSize / size;
  return Number.isFinite(estimated) ? estimated : outputSize / size;
}

function affineTransformFromFinderCenters(topLeft, topRight, bottomLeft, size) {
  const finderOffset = 3.5 / size;
  const finderSpan = (size - 7) / size;
  if (![topLeft, topRight, bottomLeft].every(isFinitePoint) || finderSpan <= 0) return null;

  const horizontal = {
    x: (topRight.x - topLeft.x) / finderSpan,
    y: (topRight.y - topLeft.y) / finderSpan,
  };
  const vertical = {
    x: (bottomLeft.x - topLeft.x) / finderSpan,
    y: (bottomLeft.y - topLeft.y) / finderSpan,
  };

  return {
    a: horizontal.x,
    b: vertical.x,
    c: topLeft.x - horizontal.x * finderOffset - vertical.x * finderOffset,
    d: horizontal.y,
    e: vertical.y,
    f: topLeft.y - horizontal.y * finderOffset - vertical.y * finderOffset,
    g: 0,
    h: 0,
  };
}

function refineFinderGridTransformIteration(sourceImage, sourceWidth, sourceHeight, baseTransform, size) {
  const analysisWarp = renderWarpedQr(sourceImage, sourceWidth, sourceHeight, baseTransform, size, {
    interpolation: "bilinear",
  });
  const modulePixels = analysisWarp.width / size;
  if (!Number.isFinite(modulePixels) || modulePixels < 2) return null;

  const finderReferences = [
    { key: "topLeft", moduleX: 3.5, moduleY: 3.5 },
    { key: "topRight", moduleX: size - 3.5, moduleY: 3.5 },
    { key: "bottomLeft", moduleX: 3.5, moduleY: size - 3.5 },
  ];
  const centers = {};

  for (const reference of finderReferences) {
    const expected = {
      x: (reference.moduleX / size) * analysisWarp.width,
      y: (reference.moduleY / size) * analysisWarp.height,
    };
    const match = refineWarpedFinderPatternMatch(
      analysisWarp,
      expected,
      modulePixels,
      FINDER_TRIANGLE_ITERATION_SEARCH_MAX_MODULES,
    );
    if (!isFinitePoint(match.point)) return null;
    centers[reference.key] = sourcePointFromWarpedPoint(baseTransform, analysisWarp, match.point);
  }

  if (![centers.topLeft, centers.topRight, centers.bottomLeft].every(isFinitePoint)) return null;
  const alignmentReference = findBottomRightAlignmentReference(baseTransform, analysisWarp, null, size, modulePixels);
  return projectiveTransformFromFinderGrid(baseTransform, centers, alignmentReference, size);
}

function selectBestFinderGridTransform(options) {
  const {
    sourceImage,
    sourceWidth,
    sourceHeight,
    initialTransform,
    triangleTransform,
    exactTransform,
    iteratedTransform,
    centers,
    alignmentReference,
    size,
    detected,
  } = options;
  const candidates = [];
  const addCandidate = (transform) => {
    if (!transform || !isReasonableFinderTriangleTransform(initialTransform, transform, size)) return;
    if (candidates.some((candidate) => transformsAreNearlyEqual(candidate, transform))) return;
    candidates.push(transform);
  };

  addCandidate(exactTransform);
  addCandidate(iteratedTransform);
  addCandidate(triangleTransform);

  let best = bestScoredFinderGridTransform(candidates, sourceImage, sourceWidth, sourceHeight, size, detected);

  if (!alignmentReference?.sourcePoint && shouldSearchFourthPoint(best?.evaluation)) {
    for (const fourthPoint of buildFourthPointCandidates(initialTransform, triangleTransform, size)) {
      addCandidate(projectiveTransformFromFinderGrid(initialTransform, centers, null, size, fourthPoint));
    }
    best = bestScoredFinderGridTransform(candidates, sourceImage, sourceWidth, sourceHeight, size, detected) ?? best;
  }

  return best?.transform ?? iteratedTransform ?? exactTransform ?? triangleTransform;
}

function bestScoredFinderGridTransform(candidates, sourceImage, sourceWidth, sourceHeight, size, detected) {
  let best = null;
  for (const transform of candidates) {
    const evaluation = scoreFinderGridTransformCandidate(sourceImage, sourceWidth, sourceHeight, transform, size, detected);
    if (!evaluation) continue;
    if (!best || evaluation.score > best.evaluation.score) {
      best = { transform, evaluation };
    }
  }

  return best;
}

function shouldSearchFourthPoint(evaluation) {
  if (!evaluation?.sample) return true;
  if (!evaluation.sample.verified) return true;
  if (evaluation.sample.ambiguousCells > 0) return true;
  return evaluation.sample.localAdjustedCells > 2;
}

function buildFourthPointCandidates(initialTransform, triangleTransform, size) {
  const oppositeFinderOffset = (size - 3.5) / size;
  const basePoint = mapPoint(initialTransform, oppositeFinderOffset, oppositeFinderOffset);
  const trianglePoint = mapPoint(triangleTransform, oppositeFinderOffset, oppositeFinderOffset);
  if (!isFinitePoint(basePoint) || !isFinitePoint(trianglePoint)) return [];

  const basis = moduleBasisFromTransform(triangleTransform, size);
  const offsets = [
    { x: 0, y: 0 },
    { x: FINDER_FOURTH_POINT_SEARCH_MODULES, y: 0 },
    { x: -FINDER_FOURTH_POINT_SEARCH_MODULES, y: 0 },
    { x: 0, y: FINDER_FOURTH_POINT_SEARCH_MODULES },
    { x: 0, y: -FINDER_FOURTH_POINT_SEARCH_MODULES },
    { x: FINDER_FOURTH_POINT_SEARCH_MODULES, y: FINDER_FOURTH_POINT_SEARCH_MODULES },
    { x: -FINDER_FOURTH_POINT_SEARCH_MODULES, y: FINDER_FOURTH_POINT_SEARCH_MODULES },
    { x: FINDER_FOURTH_POINT_SEARCH_MODULES, y: -FINDER_FOURTH_POINT_SEARCH_MODULES },
    { x: -FINDER_FOURTH_POINT_SEARCH_MODULES, y: -FINDER_FOURTH_POINT_SEARCH_MODULES },
  ];
  const candidates = [];

  for (const ratio of [0, 0.25, 0.5, 0.75, 1]) {
    const center = interpolatePoint(basePoint, trianglePoint, ratio);
    for (const offset of offsets) {
      candidates.push({
        x: center.x + basis.u.x * offset.x + basis.v.x * offset.y,
        y: center.y + basis.u.y * offset.x + basis.v.y * offset.y,
      });
    }
  }

  return candidates;
}

function moduleBasisFromTransform(transform, size) {
  const origin = mapPoint(transform, 0.5, 0.5);
  const right = mapPoint(transform, 0.5 + 1 / size, 0.5);
  const down = mapPoint(transform, 0.5, 0.5 + 1 / size);
  return {
    u: { x: right.x - origin.x, y: right.y - origin.y },
    v: { x: down.x - origin.x, y: down.y - origin.y },
  };
}

function interpolatePoint(a, b, ratio) {
  return {
    x: a.x * (1 - ratio) + b.x * ratio,
    y: a.y * (1 - ratio) + b.y * ratio,
  };
}

function transformsAreNearlyEqual(a, b) {
  const keys = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return keys.every((key) => Math.abs((a?.[key] ?? NaN) - (b?.[key] ?? NaN)) < 1e-6);
}

function scoreFinderGridTransformCandidate(sourceImage, sourceWidth, sourceHeight, transform, size, detected) {
  const warpedImage = renderWarpedQr(sourceImage, sourceWidth, sourceHeight, transform, size);
  const sample = sampleWarpedModulesLockedToFullGrid(warpedImage, size, detected);
  if (!sample) return null;

  const bounds = buildSamplingBounds(warpedImage, size, 0, 0, 0, 0);
  const functionScore = scoreSamplingBounds(warpedImage, bounds, buildFunctionPatternExpectations(size));
  const verificationBonus = sample.verified ? 5000 : 0;
  const score =
    verificationBonus +
    sample.contrast * 8 +
    functionScore * 0.8 -
    sample.ambiguousCells * 36 -
    sample.localAdjustedCells * 3;

  return { score, sample };
}

function projectiveTransformFromFinderGrid(baseTransform, centers, alignmentReference, size, fallbackFourthPoint = null) {
  const finderOffset = 3.5 / size;
  const oppositeFinderOffset = (size - 3.5) / size;
  const pairs = [
    { u: finderOffset, v: finderOffset, x: centers.topLeft.x, y: centers.topLeft.y, weight: 1 },
    { u: oppositeFinderOffset, v: finderOffset, x: centers.topRight.x, y: centers.topRight.y, weight: 1 },
    { u: finderOffset, v: oppositeFinderOffset, x: centers.bottomLeft.x, y: centers.bottomLeft.y, weight: 1 },
  ];

  if (alignmentReference?.sourcePoint) {
    pairs.push({
      u: alignmentReference.moduleX / size,
      v: alignmentReference.moduleY / size,
      x: alignmentReference.sourcePoint.x,
      y: alignmentReference.sourcePoint.y,
      weight: 1,
    });
  } else {
    const inferred = fallbackFourthPoint ?? mapPoint(baseTransform, oppositeFinderOffset, oppositeFinderOffset);
    pairs.push({
      u: oppositeFinderOffset,
      v: oppositeFinderOffset,
      x: inferred.x,
      y: inferred.y,
      weight: 1,
    });
  }

  return projectiveTransformFromWeightedPointPairs(pairs);
}

function findBottomRightAlignmentReference(initialTransform, analysisWarp, location, size, modulePixels) {
  const version = Math.round((size - 17) / 4);
  const centers = ALIGNMENT_PATTERN_CENTERS[version] ?? [];
  const center = centers.at(-1);
  if (!Number.isFinite(center) || alignmentOverlapsFinder(center, center, size)) return;

  const moduleCenter = center + 0.5;
  const expectedOffset = moduleCenter / size;
  const approximate = warpedPointFromSourcePoint(
    initialTransform,
    location?.bottomRightAlignmentPattern,
    analysisWarp.width,
    expectedOffset,
    expectedOffset,
  );
  const match = refineWarpedAlignmentPatternMatch(
    analysisWarp,
    approximate,
    modulePixels,
    Math.min(FINDER_TRIANGLE_SEARCH_MAX_MODULES, 1.35),
  );
  if (!match.accepted || !Number.isFinite(match.score) || match.score <= 0) return null;

  const sourcePoint = sourcePointFromWarpedPoint(initialTransform, analysisWarp, match.point);
  return isFinitePoint(sourcePoint) ? { moduleX: moduleCenter, moduleY: moduleCenter, sourcePoint, match } : null;
}

function addTransformCornerPairs(pairs, transform, weight) {
  addSourcePair(pairs, 0, 0, mapPoint(transform, 0, 0), weight, true);
  addSourcePair(pairs, 1, 0, mapPoint(transform, 1, 0), weight, true);
  addSourcePair(pairs, 1, 1, mapPoint(transform, 1, 1), weight, true);
  addSourcePair(pairs, 0, 1, mapPoint(transform, 0, 1), weight, true);
}

function addWarpedPair(pairs, initialTransform, warpedImage, moduleX, moduleY, warpedPoint, weight) {
  addSourcePair(
    pairs,
    moduleX,
    moduleY,
    sourcePointFromWarpedPoint(initialTransform, warpedImage, warpedPoint),
    weight,
  );
}

function addSourcePair(pairs, moduleX, moduleY, sourcePoint, weight, normalized = false) {
  if (!isFinitePoint(sourcePoint)) return;
  const size = pairs.qrSize;
  if (!normalized && (!Number.isFinite(size) || size <= 0)) return;
  pairs.push({
    u: normalized ? moduleX : moduleX / size,
    v: normalized ? moduleY : moduleY / size,
    x: sourcePoint.x,
    y: sourcePoint.y,
    weight,
  });
}

function shouldUseFinderTriangleWarp(initialSample, triangleSample) {
  if (!triangleSample) return false;
  if (triangleSample.verified && !initialSample?.verified) return true;
  if (!triangleSample.verified && initialSample?.verified) return false;

  const initialScore = Number.isFinite(initialSample?.candidateScore) ? initialSample.candidateScore : -Infinity;
  const triangleScore = Number.isFinite(triangleSample.candidateScore) ? triangleSample.candidateScore : -Infinity;
  const initialContrast = Number.isFinite(initialSample?.contrast) ? initialSample.contrast : 0;
  const triangleContrast = Number.isFinite(triangleSample.contrast) ? triangleSample.contrast : 0;
  const initialAmbiguous = Number.isFinite(initialSample?.ambiguousCells) ? initialSample.ambiguousCells : Infinity;
  const triangleAmbiguous = Number.isFinite(triangleSample?.ambiguousCells) ? triangleSample.ambiguousCells : Infinity;

  if (triangleContrast < initialContrast - 14) return false;
  if (triangleAmbiguous > initialAmbiguous + 6) return false;
  return triangleSample.verified || triangleScore >= initialScore - 18;
}

function refineHomographyFromFunctionPatterns(warpedImage, initialTransform, size) {
  if (!USE_PATTERN_HOMOGRAPHY_REFINEMENT) return null;

  const modulePixels = warpedImage.width / size;
  if (!Number.isFinite(modulePixels) || modulePixels < 2) return null;

  const pairs = [];
  let patternPointCount = 0;
  const addPairFromWarpedPoint = (moduleX, moduleY, warpedPoint, weight) => {
    if (!isFinitePoint(warpedPoint)) return;
    const sourcePoint = mapPoint(initialTransform, warpedPoint.x / warpedImage.width, warpedPoint.y / warpedImage.height);
    if (!isFinitePoint(sourcePoint)) return;
    pairs.push({
      u: moduleX / size,
      v: moduleY / size,
      x: sourcePoint.x,
      y: sourcePoint.y,
      weight,
    });
  };
  const addInitialPair = (moduleX, moduleY, weight) => {
    const sourcePoint = mapPoint(initialTransform, moduleX / size, moduleY / size);
    pairs.push({
      u: moduleX / size,
      v: moduleY / size,
      x: sourcePoint.x,
      y: sourcePoint.y,
      weight,
    });
  };

  addInitialPair(0, 0, 0.8);
  addInitialPair(size, 0, 0.8);
  addInitialPair(size, size, 0.8);
  addInitialPair(0, size, 0.8);

  const finderOrigins = [
    { x: 0, y: 0 },
    { x: size - 7, y: 0 },
    { x: 0, y: size - 7 },
  ];

  for (const origin of finderOrigins) {
    const expectedCenter = {
      x: (origin.x + 3.5) * modulePixels,
      y: (origin.y + 3.5) * modulePixels,
    };
    const match = refineWarpedFinderPatternMatch(
      warpedImage,
      expectedCenter,
      modulePixels,
      HOMOGRAPHY_PATTERN_SEARCH_MAX_MODULES,
    );

    addPairFromWarpedPoint(origin.x + 3.5, origin.y + 3.5, match.point, 7.5);
    for (const point of finderPatternBoundaryPoints(origin, match)) {
      addPairFromWarpedPoint(point.moduleX, point.moduleY, point.warpedPoint, 3.4);
    }
    patternPointCount += 1;
  }

  const version = Math.round((size - 17) / 4);
  const centers = ALIGNMENT_PATTERN_CENTERS[version] ?? [];
  for (const cy of centers) {
    for (const cx of centers) {
      if (alignmentOverlapsFinder(cx, cy, size)) continue;
      const expectedCenter = {
        x: (cx + 0.5) * modulePixels,
        y: (cy + 0.5) * modulePixels,
      };
      const match = refineWarpedAlignmentPatternMatch(
        warpedImage,
        expectedCenter,
        modulePixels,
        HOMOGRAPHY_PATTERN_SEARCH_MAX_MODULES,
      );
      addPairFromWarpedPoint(cx + 0.5, cy + 0.5, match.point, 4.5);
      for (const point of alignmentPatternBoundaryPoints(cx, cy, match)) {
        addPairFromWarpedPoint(point.moduleX, point.moduleY, point.warpedPoint, 1.4);
      }
      patternPointCount += 1;
    }
  }

  if (patternPointCount < 3 || pairs.length < 8) return null;

  const refinedTransform = projectiveTransformFromWeightedPointPairs(pairs);
  if (!refinedTransform || !isReasonableHomographyRefinement(initialTransform, refinedTransform, size)) {
    return null;
  }

  return refinedTransform;
}

function shouldUseRefinedHomography(initialSample, refinedSample) {
  if (!refinedSample) return false;
  if (refinedSample.verified && !initialSample?.verified) return true;
  if (!refinedSample.verified && initialSample?.verified) return false;

  const initialScore = Number.isFinite(initialSample?.candidateScore) ? initialSample.candidateScore : -Infinity;
  const refinedScore = Number.isFinite(refinedSample.candidateScore) ? refinedSample.candidateScore : -Infinity;
  const initialContrast = Number.isFinite(initialSample?.contrast) ? initialSample.contrast : 0;
  const refinedContrast = Number.isFinite(refinedSample.contrast) ? refinedSample.contrast : 0;
  const initialAmbiguous = Number.isFinite(initialSample?.ambiguousCells) ? initialSample.ambiguousCells : Infinity;
  const refinedAmbiguous = Number.isFinite(refinedSample.ambiguousCells) ? refinedSample.ambiguousCells : Infinity;

  if (refinedContrast < initialContrast - 8) return false;
  if (refinedAmbiguous > initialAmbiguous + 2) return false;
  return refinedScore > initialScore + 12;
}

function finderPatternBoundaryPoints(origin, match) {
  const center = match.point;
  const pixels = match.modulePixels;
  return [
    { moduleX: origin.x, moduleY: origin.y, warpedPoint: { x: center.x - pixels * 3.5, y: center.y - pixels * 3.5 } },
    { moduleX: origin.x + 7, moduleY: origin.y, warpedPoint: { x: center.x + pixels * 3.5, y: center.y - pixels * 3.5 } },
    { moduleX: origin.x + 7, moduleY: origin.y + 7, warpedPoint: { x: center.x + pixels * 3.5, y: center.y + pixels * 3.5 } },
    { moduleX: origin.x, moduleY: origin.y + 7, warpedPoint: { x: center.x - pixels * 3.5, y: center.y + pixels * 3.5 } },
  ];
}

function alignmentPatternBoundaryPoints(centerX, centerY, match) {
  const center = match.point;
  const pixels = match.modulePixels;
  return [
    { moduleX: centerX - 2, moduleY: centerY - 2, warpedPoint: { x: center.x - pixels * 2.5, y: center.y - pixels * 2.5 } },
    { moduleX: centerX + 3, moduleY: centerY - 2, warpedPoint: { x: center.x + pixels * 2.5, y: center.y - pixels * 2.5 } },
    { moduleX: centerX + 3, moduleY: centerY + 3, warpedPoint: { x: center.x + pixels * 2.5, y: center.y + pixels * 2.5 } },
    { moduleX: centerX - 2, moduleY: centerY + 3, warpedPoint: { x: center.x - pixels * 2.5, y: center.y + pixels * 2.5 } },
  ];
}

function refineWarpedAlignmentPatternCenter(imageData, point, modulePixels) {
  return refineWarpedAlignmentPatternMatch(imageData, point, modulePixels).point;
}

function refineWarpedAlignmentPatternMatch(imageData, point, modulePixels, searchMaxModules = FINDER_CENTER_REFINE_MAX_MODULES) {
  if (!isFinitePoint(point)) {
    return { point, modulePixels, score: -Infinity, baseScore: -Infinity, accepted: false };
  }

  const baseScore = scoreWarpedAlignmentPatternCenter(imageData, point, modulePixels);
  let best = { point, modulePixels, score: baseScore };
  const coarseStep = modulePixels * 0.16;
  const searchRadius = modulePixels * searchMaxModules;

  for (const scale of [0.9, 0.96, 1, 1.04, 1.1]) {
    const candidateModulePixels = modulePixels * scale;
    for (let y = -searchRadius; y <= searchRadius + 0.001; y += coarseStep) {
      for (let x = -searchRadius; x <= searchRadius + 0.001; x += coarseStep) {
        const candidate = { x: point.x + x, y: point.y + y };
        const score = scoreWarpedAlignmentPatternCenter(imageData, candidate, candidateModulePixels);
        if (score > best.score) {
          best = { point: candidate, modulePixels: candidateModulePixels, score };
        }
      }
    }
  }

  const fineStep = modulePixels * 0.06;
  for (const scale of [0.96, 1, 1.04]) {
    const candidateModulePixels = best.modulePixels * scale;
    for (const y of [-fineStep, 0, fineStep]) {
      for (const x of [-fineStep, 0, fineStep]) {
        const candidate = { x: best.point.x + x, y: best.point.y + y };
        const score = scoreWarpedAlignmentPatternCenter(imageData, candidate, candidateModulePixels);
        if (score > best.score) {
          best = { point: candidate, modulePixels: candidateModulePixels, score };
        }
      }
    }
  }

  const movement = distanceBetween(point, best.point);
  return movement <= modulePixels * searchMaxModules && best.score > baseScore + 6
    ? { ...best, baseScore, accepted: true }
    : { point, modulePixels, score: baseScore, baseScore, accepted: false };
}

function scoreWarpedAlignmentPatternCenter(imageData, center, modulePixels) {
  const samples = [];
  for (let y = -2; y <= 2; y += 1) {
    for (let x = -2; x <= 2; x += 1) {
      const expectedDark = alignmentPatternValue(x, y);
      const gray = sampleWarpedTemplateCell(imageData, center, modulePixels, x, y, expectedDark);
      const weight = x === 0 && y === 0 ? 1.8 : Math.abs(x) === 2 || Math.abs(y) === 2 ? 1.4 : 1;
      samples.push({ gray, dark: expectedDark, weight });
    }
  }

  const dark = weightedMean(samples.filter((sample) => sample.dark).map((sample) => ({ value: sample.gray, weight: sample.weight })));
  const light = weightedMean(samples.filter((sample) => !sample.dark).map((sample) => ({ value: sample.gray, weight: sample.weight })));
  if (!Number.isFinite(dark) || !Number.isFinite(light) || light <= dark) return -Infinity;

  const threshold = (dark + light) / 2;
  let score = (light - dark) * 10;
  for (const sample of samples) {
    const margin = sample.dark ? threshold - sample.gray : sample.gray - threshold;
    score += sample.weight * clamp(margin, -42, 42);
    score += sample.weight * (margin > 0 ? 10 : -20);
  }
  return score;
}

function alignmentPatternValue(x, y) {
  const distance = Math.max(Math.abs(x), Math.abs(y));
  return distance === 2 || distance === 0;
}

function projectiveTransformFromWeightedPointPairs(pairs) {
  if (pairs.length < 4) return null;

  const normal = Array.from({ length: 8 }, () => new Array(8).fill(0));
  const values = new Array(8).fill(0);
  const addEquation = (row, value, weight) => {
    const rowWeight = Math.sqrt(Math.max(0.01, weight));
    const weightedRow = row.map((entry) => entry * rowWeight);
    const weightedValue = value * rowWeight;
    for (let y = 0; y < 8; y += 1) {
      values[y] += weightedRow[y] * weightedValue;
      for (let x = 0; x < 8; x += 1) {
        normal[y][x] += weightedRow[y] * weightedRow[x];
      }
    }
  };

  for (const pair of pairs) {
    if (![pair.u, pair.v, pair.x, pair.y].every(Number.isFinite)) continue;
    const weight = Number.isFinite(pair.weight) ? pair.weight : 1;
    addEquation([pair.u, pair.v, 1, 0, 0, 0, -pair.x * pair.u, -pair.x * pair.v], pair.x, weight);
    addEquation([0, 0, 0, pair.u, pair.v, 1, -pair.y * pair.u, -pair.y * pair.v], pair.y, weight);
  }

  const solved = solveLinearSystem(normal, values);
  if (!solved) return null;

  const [a, b, c, d, e, f, g, h] = solved;
  return { a, b, c, d, e, f, g, h };
}

function solveLinearSystem(matrix, values) {
  const size = values.length;
  const augmented = matrix.map((row, index) => [...row, values[index]]);

  for (let column = 0; column < size; column += 1) {
    let pivotRow = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivotRow][column])) {
        pivotRow = row;
      }
    }

    if (Math.abs(augmented[pivotRow][column]) < 1e-9) return null;
    if (pivotRow !== column) {
      [augmented[column], augmented[pivotRow]] = [augmented[pivotRow], augmented[column]];
    }

    const pivot = augmented[column][column];
    for (let col = column; col <= size; col += 1) {
      augmented[column][col] /= pivot;
    }

    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let col = column; col <= size; col += 1) {
        augmented[row][col] -= factor * augmented[column][col];
      }
    }
  }

  const solution = augmented.map((row) => row[size]);
  return solution.every(Number.isFinite) ? solution : null;
}

function isReasonableHomographyRefinement(initialTransform, refinedTransform, size) {
  const initialCorners = cornersFromTransform(initialTransform);
  const refinedCorners = cornersFromTransform(refinedTransform);
  const initialPoints = [
    initialCorners.topLeftCorner,
    initialCorners.topRightCorner,
    initialCorners.bottomRightCorner,
    initialCorners.bottomLeftCorner,
  ];
  const refinedPoints = [
    refinedCorners.topLeftCorner,
    refinedCorners.topRightCorner,
    refinedCorners.bottomRightCorner,
    refinedCorners.bottomLeftCorner,
  ];
  if (!initialPoints.every(isFinitePoint) || !refinedPoints.every(isFinitePoint)) return false;

  const initialSides = polygonSideLengths(initialPoints);
  const refinedSides = polygonSideLengths(refinedPoints);
  const initialMeanSide = mean(initialSides);
  const refinedMeanSide = mean(refinedSides);
  if (!Number.isFinite(initialMeanSide) || !Number.isFinite(refinedMeanSide) || initialMeanSide <= 0) return false;
  if (refinedMeanSide < initialMeanSide * 0.78 || refinedMeanSide > initialMeanSide * 1.22) return false;

  const moduleSize = initialMeanSide / size;
  const maxShift = moduleSize * HOMOGRAPHY_REFINEMENT_MAX_CORNER_SHIFT_MODULES;
  for (let index = 0; index < 4; index += 1) {
    if (distanceBetween(initialPoints[index], refinedPoints[index]) > maxShift) return false;
  }

  const initialArea = Math.abs(polygonSignedArea(initialPoints));
  const refinedArea = Math.abs(polygonSignedArea(refinedPoints));
  if (initialArea <= 0 || refinedArea < initialArea * 0.6 || refinedArea > initialArea * 1.5) return false;

  return Math.sign(polygonSignedArea(initialPoints)) === Math.sign(polygonSignedArea(refinedPoints));
}

function isReasonableFinderTriangleTransform(initialTransform, refinedTransform, size) {
  const initialCorners = cornersFromTransform(initialTransform);
  const refinedCorners = cornersFromTransform(refinedTransform);
  const initialPoints = [
    initialCorners.topLeftCorner,
    initialCorners.topRightCorner,
    initialCorners.bottomRightCorner,
    initialCorners.bottomLeftCorner,
  ];
  const refinedPoints = [
    refinedCorners.topLeftCorner,
    refinedCorners.topRightCorner,
    refinedCorners.bottomRightCorner,
    refinedCorners.bottomLeftCorner,
  ];
  if (!initialPoints.every(isFinitePoint) || !refinedPoints.every(isFinitePoint)) return false;

  const initialSides = polygonSideLengths(initialPoints);
  const refinedSides = polygonSideLengths(refinedPoints);
  const initialMeanSide = mean(initialSides);
  const refinedMeanSide = mean(refinedSides);
  if (!Number.isFinite(initialMeanSide) || !Number.isFinite(refinedMeanSide) || initialMeanSide <= 0) return false;
  if (refinedMeanSide < initialMeanSide * 0.68 || refinedMeanSide > initialMeanSide * 1.36) return false;

  const moduleSize = initialMeanSide / size;
  const maxShift = moduleSize * FINDER_TRIANGLE_MAX_CORNER_SHIFT_MODULES;
  for (let index = 0; index < 4; index += 1) {
    if (distanceBetween(initialPoints[index], refinedPoints[index]) > maxShift) return false;
  }

  const initialArea = Math.abs(polygonSignedArea(initialPoints));
  const refinedArea = Math.abs(polygonSignedArea(refinedPoints));
  if (initialArea <= 0 || refinedArea < initialArea * 0.48 || refinedArea > initialArea * 1.85) return false;

  return Math.sign(polygonSignedArea(initialPoints)) === Math.sign(polygonSignedArea(refinedPoints));
}

function cornersFromTransform(transform) {
  return {
    topLeftCorner: mapPoint(transform, 0, 0),
    topRightCorner: mapPoint(transform, 1, 0),
    bottomRightCorner: mapPoint(transform, 1, 1),
    bottomLeftCorner: mapPoint(transform, 0, 1),
  };
}

function polygonSideLengths(points) {
  return points.map((point, index) => distanceBetween(point, points[(index + 1) % points.length]));
}

function polygonSignedArea(points) {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += current.x * next.y - current.y * next.x;
  }
  return area / 2;
}

function sampleWarpedModules(warpedImage, size, detected = null) {
  const boundsCandidates = findSamplingBoundsCandidates(
    warpedImage,
    size,
    detected ? SAMPLING_BOUND_RESULT_LIMIT : 1,
  );
  let best = null;

  for (const boundsCandidate of boundsCandidates) {
    const sample = sampleWarpedModulesWithBounds(warpedImage, size, boundsCandidate.bounds, detected);
    const score = sample.candidateScore + boundsCandidate.score * 0.05;
    if (sample.verified) return sample;
    if (!best || score > best.score) {
      best = { sample, score };
    }
  }

  return best?.sample ?? sampleWarpedModulesWithBounds(warpedImage, size, boundsCandidates[0].bounds, detected);
}

function sampleWarpedModulesLockedToFullGrid(warpedImage, size, detected = null) {
  return sampleWarpedModulesWithBounds(warpedImage, size, buildSamplingBounds(warpedImage, size, 0, 0, 0, 0), detected);
}

function sampleWarpedModulesWithBounds(warpedImage, size, bounds, detected = null) {
  const toneMatrix = [];
  const coreMatrix = [];

  for (let y = 0; y < size; y += 1) {
    const toneRow = [];
    const coreRow = [];
    for (let x = 0; x < size; x += 1) {
      const stats = sampleWarpedModuleStats(warpedImage, bounds, x, y);
      toneRow.push(stats.tone);
      coreRow.push(stats.coreMean);
    }
    toneMatrix.push(toneRow);
    coreMatrix.push(coreRow);
  }

  const toneSample = buildSampleFromGrayMatrix(toneMatrix, bounds, detected, 0);
  const coreSample = buildSampleFromGrayMatrix(coreMatrix, bounds, detected, -4);
  return coreSample.candidateScore > toneSample.candidateScore ? coreSample : toneSample;
}

function buildSampleFromGrayMatrix(grayMatrix, bounds, detected, sourcePenalty) {
  const size = grayMatrix.length;
  const grays = grayMatrix.flat();
  const otsu = otsuThreshold(grays);
  const initialDarkValues = grays.filter((gray) => gray <= otsu);
  const initialLightValues = grays.filter((gray) => gray > otsu);
  const threshold =
    initialDarkValues.length > 0 && initialLightValues.length > 0
      ? (mean(initialDarkValues) + mean(initialLightValues)) / 2
      : otsu;
  const candidate = selectBestModuleCandidate(grayMatrix, threshold, detected);
  const modules = candidate.modules;
  const values = grayMatrix.flat();
  const distances = values.map((gray, index) => Math.abs(gray - candidate.thresholds[Math.floor(index / size)][index % size]));
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
    threshold: candidate.threshold,
    localAdjustedCells: candidate.adjustedCells,
    samplingBounds: bounds,
    contrast,
    ambiguousCells,
    candidateScore: candidate.score + sourcePenalty,
    verified: candidate.verified,
  };
}

function selectBestModuleCandidate(grayMatrix, baseThreshold, detected) {
  const thresholdOffsets = [-18, -12, -8, -4, 0, 4, 8, 12, 18];
  const localWeights = [0, 0.45, 0.65, 0.82];
  const candidates = [];

  for (const thresholdOffset of thresholdOffsets) {
    for (const localWeight of localWeights) {
      const threshold = clamp(baseThreshold + thresholdOffset, 0, 255);
      const candidate = buildModuleCandidate(grayMatrix, threshold, localWeight);
      const rawScore =
        candidate.contrast * 3 -
        candidate.ambiguousCells * 8 -
        candidate.adjustedCells * 0.5 -
        Math.abs(thresholdOffset) * 2 -
        Math.abs(localWeight - 0.65) * 8;
      candidates.push({
        ...candidate,
        rawScore,
        score: rawScore,
        threshold,
        verified: false,
      });
    }
  }

  candidates.sort((a, b) => b.rawScore - a.rawScore);

  if (detected) {
    for (const candidate of candidates.slice(0, MODULE_CANDIDATE_VERIFY_LIMIT)) {
      const verification = verifyModulesAgainstDetected(candidate.modules, detected);
      candidate.verified = Boolean(verification?.ok);
      if (candidate.verified) {
        candidate.score = candidate.rawScore + 1_000_000;
        return candidate;
      }
    }
  }

  return candidates[0] ?? buildModuleCandidate(grayMatrix, baseThreshold, 0.65);
}

function buildModuleCandidate(grayMatrix, threshold, localWeight) {
  const initialModules = applyFixedFunctionPatterns(grayMatrix.map((row) => row.map((gray) => gray < threshold)));
  const refined = refineModulesWithLocalContrast(grayMatrix, initialModules, threshold, localWeight);
  const modules = applyFixedFunctionPatterns(refined.modules);
  const values = grayMatrix.flat();
  const distances = values.map((gray, index) => Math.abs(gray - refined.thresholds[Math.floor(index / grayMatrix.length)][index % grayMatrix.length]));
  const ambiguousCells = distances.filter((distance) => distance < AMBIGUOUS_MARGIN).length;
  const darkValues = [];
  const lightValues = [];

  for (let y = 0; y < grayMatrix.length; y += 1) {
    for (let x = 0; x < grayMatrix.length; x += 1) {
      if (modules[y][x]) darkValues.push(grayMatrix[y][x]);
      else lightValues.push(grayMatrix[y][x]);
    }
  }

  return {
    modules,
    thresholds: refined.thresholds,
    adjustedCells: refined.adjustedCells,
    ambiguousCells,
    contrast: Math.round(mean(lightValues) - mean(darkValues)),
  };
}

function findBestSamplingBounds(warpedImage, size) {
  return findSamplingBoundsCandidates(warpedImage, size, 1)[0].bounds;
}

function findSamplingBoundsCandidates(warpedImage, size, limit) {
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
  const candidates = [{ bounds: base, score: scoreSamplingBounds(warpedImage, base, expectations) }];

  for (const left of SAMPLING_BOUND_CANDIDATES) {
    for (const top of SAMPLING_BOUND_CANDIDATES) {
      for (const right of SAMPLING_BOUND_CANDIDATES) {
        for (const bottom of SAMPLING_BOUND_CANDIDATES) {
          const candidate = buildSamplingBounds(warpedImage, size, left, top, right, bottom);
          const score = scoreSamplingBounds(warpedImage, candidate, expectations);
          candidates.push({ bounds: candidate, score });
        }
      }
    }
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, limit);
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
    gray: sampleWarpedModuleCenterGray(warpedImage, bounds, expectation.x, expectation.y),
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

function refineModulesWithLocalContrast(grayMatrix, initialModules, globalThreshold, localWeight) {
  const size = grayMatrix.length;
  const modules = [];
  const thresholds = [];
  let adjustedCells = 0;

  for (let y = 0; y < size; y += 1) {
    const row = [];
    const thresholdRow = [];
    for (let x = 0; x < size; x += 1) {
      const localThreshold = localModuleThreshold(grayMatrix, initialModules, x, y, globalThreshold);
      const threshold = Number.isFinite(localThreshold)
        ? globalThreshold * (1 - localWeight) + localThreshold * localWeight
        : globalThreshold;
      const isDark = grayMatrix[y][x] < threshold;

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

function applyFixedFunctionPatterns(modules) {
  if (!USE_FIXED_FUNCTION_PATTERN_CORRECTION) {
    return modules.map((row) => row.slice());
  }

  const size = modules.length;
  const fixed = modules.map((row) => row.slice());

  applyFinderPatternWithSeparator(fixed, 0, 0, 0, 0);
  applyFinderPatternWithSeparator(fixed, size - 7, 0, size - 8, 0);
  applyFinderPatternWithSeparator(fixed, 0, size - 7, 0, size - 8);
  applyAlignmentPatterns(fixed);

  return fixed;
}

function applyFinderPatternWithSeparator(modules, finderX, finderY, regionX, regionY) {
  for (let y = regionY; y < regionY + 8; y += 1) {
    for (let x = regionX; x < regionX + 8; x += 1) {
      const inFinder = x >= finderX && x < finderX + 7 && y >= finderY && y < finderY + 7;
      setFixedModule(modules, x, y, inFinder ? finderPatternValue(x - finderX, y - finderY) : false);
    }
  }
}

function finderPatternValue(x, y) {
  const outer = x === 0 || x === 6 || y === 0 || y === 6;
  const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
  return outer || inner;
}

function applyAlignmentPatterns(modules) {
  const size = modules.length;
  const version = Math.round((size - 17) / 4);
  const centers = ALIGNMENT_PATTERN_CENTERS[version] ?? [];
  if (!centers.length) return;

  for (const cy of centers) {
    for (const cx of centers) {
      if (alignmentOverlapsFinder(cx, cy, size)) continue;
      applyAlignmentPattern(modules, cx, cy);
    }
  }
}

function alignmentOverlapsFinder(cx, cy, size) {
  return (cx <= 8 && cy <= 8) || (cx >= size - 9 && cy <= 8) || (cx <= 8 && cy >= size - 9);
}

function applyAlignmentPattern(modules, centerX, centerY) {
  for (let y = centerY - 2; y <= centerY + 2; y += 1) {
    for (let x = centerX - 2; x <= centerX + 2; x += 1) {
      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);
      const dark = dx === 2 || dy === 2 || (dx === 0 && dy === 0);
      setFixedModule(modules, x, y, dark);
    }
  }
}

function setFixedModule(modules, x, y, value) {
  if (y < 0 || y >= modules.length || x < 0 || x >= modules.length) return;
  modules[y][x] = value;
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
  const cellWidth = Math.max(1, right - left);
  const cellHeight = Math.max(1, bottom - top);
  const values = [];
  const centerValues = [];
  const coreValues = [];
  let total = 0;
  let centerTotal = 0;
  let coreTotal = 0;
  let count = 0;
  let centerCount = 0;
  let coreCount = 0;

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const gray = pixelGray(warpedImage, x, y);
      const localX = (x + 0.5 - left) / cellWidth;
      const localY = (y + 0.5 - top) / cellHeight;
      const inCenter = localX >= 0.18 && localX <= 0.82 && localY >= 0.18 && localY <= 0.82;
      const inCore = localX >= 0.34 && localX <= 0.66 && localY >= 0.34 && localY <= 0.66;

      values.push(gray);
      total += gray;
      count += 1;
      if (inCenter) {
        centerValues.push(gray);
        centerTotal += gray;
        centerCount += 1;
      }
      if (inCore) {
        coreValues.push(gray);
        coreTotal += gray;
        coreCount += 1;
      }
    }
  }

  const meanValue = count > 0 ? total / count : 0;
  const centerMean = centerCount > 0 ? centerTotal / centerCount : meanValue;
  const coreMean = coreCount > 0 ? coreTotal / coreCount : centerMean;
  const darkTail = meanLowestValues(values, 0.18, meanValue);
  const centerDarkTail = meanLowestValues(centerValues, 0.22, centerMean);
  const coreDarkTail = meanLowestValues(coreValues, 0.35, coreMean);
  const tone = Math.min(
    meanValue,
    centerMean * 0.74 + meanValue * 0.26,
    coreMean * 0.82 + centerMean * 0.18,
    darkTail * 0.42 + meanValue * 0.58,
    centerDarkTail * 0.58 + centerMean * 0.42,
    coreDarkTail * 0.72 + coreMean * 0.28,
  );

  return {
    mean: meanValue,
    centerMean,
    coreMean,
    tone,
  };
}

function sampleWarpedModuleCenterGray(warpedImage, bounds, moduleX, moduleY) {
  const x = bounds.left + (moduleX + 0.5) * bounds.cellWidth;
  const y = bounds.top + (moduleY + 0.5) * bounds.cellHeight;
  return sampleGray(warpedImage, warpedImage.width, warpedImage.height, x, y);
}

function meanLowestValues(values, ratio, fallback) {
  if (!values.length) return fallback;

  const sorted = values.slice().sort((a, b) => a - b);
  const count = Math.max(1, Math.round(sorted.length * ratio));
  return mean(sorted.slice(0, count));
}

function meanHighestValues(values, ratio, fallback) {
  if (!values.length) return fallback;

  const sorted = values.slice().sort((a, b) => b - a);
  const count = Math.max(1, Math.round(sorted.length * ratio));
  return mean(sorted.slice(0, count));
}

function sampleRgb(imageData, width, height, x, y) {
  const clampedX = clamp(x, 0, width - 1);
  const clampedY = clamp(y, 0, height - 1);
  const x0 = Math.floor(clampedX);
  const y0 = Math.floor(clampedY);
  const x1 = Math.min(width - 1, x0 + 1);
  const y1 = Math.min(height - 1, y0 + 1);
  const tx = clampedX - x0;
  const ty = clampedY - y0;
  const topLeftOffset = (y0 * width + x0) * 4;
  const topRightOffset = (y0 * width + x1) * 4;
  const bottomLeftOffset = (y1 * width + x0) * 4;
  const bottomRightOffset = (y1 * width + x1) * 4;
  const sampleChannel = (channel) => {
    const top = imageData.data[topLeftOffset + channel] * (1 - tx) + imageData.data[topRightOffset + channel] * tx;
    const bottom = imageData.data[bottomLeftOffset + channel] * (1 - tx) + imageData.data[bottomRightOffset + channel] * tx;
    return top * (1 - ty) + bottom * ty;
  };

  return {
    r: sampleChannel(0),
    g: sampleChannel(1),
    b: sampleChannel(2),
  };
}

function pixelGray(imageData, x, y) {
  const offset = (y * imageData.width + x) * 4;
  return rgbToPerceptualGray(imageData.data[offset], imageData.data[offset + 1], imageData.data[offset + 2]);
}

function sampleGray(imageData, width, height, x, y) {
  const color = sampleRgb(imageData, width, height, x, y);
  return rgbToPerceptualGray(color.r, color.g, color.b);
}

function rgbToPerceptualGray(r, g, b) {
  const luminance =
    0.2126 * srgbChannelToLinear(r) +
    0.7152 * srgbChannelToLinear(g) +
    0.0722 * srgbChannelToLinear(b);
  return linearLuminanceToPerceptualGray(luminance);
}

function srgbChannelToLinear(channel) {
  const value = clamp(channel, 0, 255) / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function linearLuminanceToPerceptualGray(luminance) {
  const value = clamp(luminance, 0, 1);
  const lightness = value <= 216 / 24389 ? value * (24389 / 27) : 116 * Math.cbrt(value) - 16;
  return clamp((lightness / 100) * 255, 0, 255);
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

async function verifyExtractedMatrix(canvas, original) {
  if (USE_BROWSER_BARCODE_DETECTOR_ONLY) {
    return verifyExtractedMatrixWithBrowserDetector(canvas, original);
  }

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  preprocessForJsQr(imageData, "contrast");
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

async function verifyExtractedMatrixWithBrowserDetector(canvas, original) {
  const results = await detectQrBarcodesFromCanvas(canvas);
  const decoded = results.find((result) => (result.rawValue ?? "") === original.data) ?? results[0] ?? null;

  if (!decoded) {
    return {
      ok: false,
      engine: "BarcodeDetector",
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
  if ((decoded.rawValue ?? "") !== original.data) {
    differences.push("Content");
  }

  if (differences.length > 0) {
    return {
      ok: false,
      engine: "BarcodeDetector",
      reason: t("decodedMismatchReason"),
      originalData: original.data,
      originalVersion: original.version,
      extractedData: decoded.rawValue ?? "",
      extractedVersion: null,
      decodedMatches: false,
      differences,
    };
  }

  return {
    ok: true,
    engine: "BarcodeDetector",
    originalData: original.data,
    originalVersion: original.version,
    extractedData: decoded.rawValue ?? "",
    extractedVersion: null,
    decodedMatches: true,
    differences: [],
  };
}

function verifyModulesAgainstDetected(modules, detected) {
  if (USE_BROWSER_BARCODE_DETECTOR_ONLY) {
    return { ok: false, decoded: null };
  }

  const imageData = renderModulesToImageData(modules, VERIFY_MODULE_PIXELS);
  preprocessForJsQr(imageData, "contrast");
  const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "attemptBoth",
  });

  return {
    ok: Boolean(decoded && decoded.data === detected.data && decoded.version === detected.version),
    decoded,
  };
}

async function verifyModulesWithBrowserDetector(modules, detected) {
  const imageData = renderModulesToImageData(modules, VERIFY_MODULE_PIXELS);
  const canvas = imageDataToCanvas(imageData);
  const results = await detectQrBarcodesFromCanvas(canvas);
  const decoded = results.find((result) => (result.rawValue ?? "") === detected.data) ?? results[0] ?? null;

  return {
    ok: Boolean(decoded && (decoded.rawValue ?? "") === detected.data),
    decoded,
  };
}

async function detectQrBarcodesFromCanvas(canvas) {
  const detector = await getBrowserQrDetector();
  return detector.detect(canvas);
}

function imageDataToCanvas(imageData) {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  canvas.getContext("2d").putImageData(imageData, 0, 0);
  return canvas;
}

function renderModulesToImageData(modules, modulePixels) {
  const size = modules.length;
  const totalModules = size + QUIET_ZONE_MODULES * 2;
  const pixelSize = totalModules * modulePixels;
  const imageData = new ImageData(pixelSize, pixelSize);

  imageData.data.fill(255);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!modules[y][x]) continue;
      const startX = (x + QUIET_ZONE_MODULES) * modulePixels;
      const startY = (y + QUIET_ZONE_MODULES) * modulePixels;
      for (let py = startY; py < startY + modulePixels; py += 1) {
        for (let px = startX; px < startX + modulePixels; px += 1) {
          const offset = (py * pixelSize + px) * 4;
          imageData.data[offset] = 17;
          imageData.data[offset + 1] = 17;
          imageData.data[offset + 2] = 17;
          imageData.data[offset + 3] = 255;
        }
      }
    }
  }

  return imageData;
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
  const engine = verification.engine ? `${verification.engine} decode result` : "jsQR error-corrected result";
  return [
    `decode: ${engine}`,
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

  void refreshEditedMatrix(t("editAction", { count: changedCells, value }));
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

async function refreshEditedMatrix(actionText) {
  renderComparisonCanvas(latestResult.warpedImageData, latestResult.modules);
  renderMatrix(latestResult.modules, els.matrixCanvas);

  const editedFormat = decodeFormatInformation(latestResult.modules);
  if (editedFormat) {
    latestResult.format = editedFormat;
    els.metaEcl.textContent = `${editedFormat.errorCorrectionLevel} (${editedFormat.bitErrors} format bit error${editedFormat.bitErrors === 1 ? "" : "s"})`;
    els.metaMask.textContent = String(editedFormat.maskPattern);
  }

  const verification = await verifyExtractedMatrix(els.matrixCanvas, latestResult.detected);
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

function toggleOverlay() {
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
}

function handleOverlayShortcut(event) {
  if (event.repeat || (event.code !== "Space" && event.key !== " ")) return;
  if (isOverlayShortcutIgnoredTarget(event.target)) return;

  event.preventDefault();
  toggleOverlay();
}

function isOverlayShortcutIgnoredTarget(target) {
  if (!(target instanceof Element)) return false;
  if (target.isContentEditable) return true;

  return Boolean(target.closest("input, textarea, select, button"));
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

function percentile(values, ratio) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[clamp(Math.round((sorted.length - 1) * ratio), 0, sorted.length - 1)];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
