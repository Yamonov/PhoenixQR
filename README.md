# PhoenixQR

画像からQRコードの範囲を検出し、読み取り結果とは別に、撮影画像から抽出したセル構成をもとに、セル構成の全く同じQRコードを生成するWebアプリです。

検出結果は遠近補正後の画像に重ねて表示され、セル単位でクリックまたはドラッグして手動修正できます。修正後のmodule matrixは、TIFF、PNG、SVG、PDF、EPSで書き出せます。

## 支援

気に入ったらご支援お願いします。

[<img width="250" height="28" alt="image" src="https://github.com/user-attachments/assets/da9369be-e2f4-4b0c-a381-ee951bc17fe2" />](https://ko-fi.com/iwashiya)

## Features

- PNG/JPEG/WebP/AVIFなど、ブラウザが読み込める画像形式に対応
- OpenCV QRCodeDetector、ブラウザのBarcodeDetector、jsQRを組み合わせてQR範囲を検出
- 遠近補正後の画像に抽出セルを重ねて表示
- オーバーレイの不透明度変更、表示オン/オフ、Spaceキーでの切り替え
- セル単位のクリック修正、ドラッグ修正
- 手動で追加したセル、元々あったセルを消した箇所を色分け表示
- jsQRのエラー訂正後デコード値による確認表示
- 証明用PNGとして、元画像＋検出範囲と検出処理画像を並べて書き出し
- TIFF: DTP向け、1セル1px、1bit
- PNG: Canva/Office等向け、1セル20px、グレースケール
- SVG: 4セル分のアキ付き
- PDF: DeviceGray、ベクター
- EPS: 2値、ベクター、プレビューなし
- TIFF、SVG、PDF、EPSはセルサイズ設定に対応
- QR周辺に4セル分のクワイエットゾーンを追加

## Notes

- QRコードの内容読み取りは、主に検出と確認のために使用します。
- PhoenixQRの目的は、内容から新しくQRコードを生成することではなく、画像から読み取ったセル構成を再現することです。
- jsQRの確認表示はエラー訂正後のデコード値です。セル構成が完全一致していることの証明ではありません。
- Safariでは、Shape Detection APIを機能フラグでオンにすると検出が速くなる場合があります。

## ローカルで実行する

このプロジェクトは、`docs/` 内に実行に必要なJavaScript、CSS、WebAssembly、ライセンス表示を含めています。
外部CDNや外部APIは使っていないため、ダウンロードした一式だけで動作します。

1. GitHubの `Code` → `Download ZIP` からプロジェクトをダウンロードします。
2. ZIPを展開します。
3. ターミナルで展開したフォルダの `docs/` に移動します。

```bash
cd PhoenixQR-main/docs
python3 -m http.server 8000
```

4. ブラウザで `http://127.0.0.1:8000/` を開きます。
5. 画像ファイルをドロップして使用します。

`index.html` を直接ダブルクリックして開くと、ブラウザのセキュリティ制約でWebAssemblyやJavaScriptが正しく動かない場合があります。上記のようにローカルWebサーバ経由で開いてください。

ソースを変更してから実行する場合は、Node.js環境で以下を実行します。

```bash
npm install
npm run build
cd docs
python3 -m http.server 8000
```

## Changelog

### 1.3.6

- 生成PDFのMediaBox、CropBox、BleedBox、TrimBox、ArtBoxを同一サイズで明示

### 1.3.5

- 強い変形画像でQR範囲の表示が欠ける問題を修正
- 低解像度画像でのセルオン・オフ判定を改善
- 表示背景のワープ精度を改善

### 1.3

- 読み取り精度を大幅に向上
- 強制パターンを緑色で表示し、編集不可とした

## License

PhoenixQR is licensed under the Apache License, Version 2.0.

See [LICENSE](LICENSE).

## Third-Party License

Runtime dependencies:

- `jsqr` 1.4.0, Apache-2.0
- OpenCV 4.13.0, Apache-2.0

公開用のライセンス表示は `public/THIRD_PARTY_NOTICES.txt` と `public/licenses/` から `docs/` へコピーされます。

## Trademark

QRコードは株式会社デンソーウェーブの登録商標です。
