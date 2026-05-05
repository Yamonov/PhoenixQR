# PhoenixQR

画像からQRコードの範囲を検出し、読み取り結果とは別に、撮影画像から抽出したセル構成をそのまま描画するWebアプリです。

セルをクリックして手動修正し、同じmodule matrixのQRをPNG、SVG、EPSで書き出せます。

## Features

- PNG/JPG画像からQR範囲を検出
- 遠近補正後の画像に抽出セルを50%赤で重ねて表示
- セル単位のクリック修正
- jsQRのエラー訂正後デコード値による確認表示
- PNG DTP向け: 1セル1px、8bitグレースケール
- PNG Photoshop/Office等向け: 1セル20px、8bitグレースケール
- SVG: 4セル分のアキ付き
- EPS: 外周パス化、2値、プレビューなし

## Local Development

```bash
npm install
npm run dev
```

ブラウザで `http://127.0.0.1:5173/` を開き、PNGまたはJPGをドロップしてください。

## GitHub Pages

公開用ファイルは `docs/` に生成します。

```bash
npm run build
```

GitHub Pagesでは、公開元を `main` branch の `/docs` に設定してください。

`docs/` には実行に必要なJavaScript、CSS、サードパーティライセンス表示が含まれます。外部CDNや外部APIは使っていません。

## Third-Party License

Runtime dependency:

- `jsqr` 1.4.0, Apache-2.0

公開用のライセンス表示は `public/THIRD_PARTY_NOTICES.txt` と `public/licenses/jsqr-LICENSE.txt` から `docs/` へコピーされます。
