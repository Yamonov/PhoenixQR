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

## ローカルで実行する

このプロジェクトは、`docs/` 内に実行に必要なJavaScript、CSS、ライセンス表示を含めています。
外部CDNや外部APIは使っていないため、ダウンロードした一式だけで動作します。

1. GitHubの `Code` → `Download ZIP` からプロジェクトをダウンロードします。
2. ZIPを展開します。
3. ターミナルで展開したフォルダの `docs/` に移動します。

```bash
cd PhoenixQR-main/docs
python3 -m http.server 8000
```

4. ブラウザで `http://127.0.0.1:8000/` を開きます。
5. PNGまたはJPG画像をドロップして使用します。

`index.html` を直接ダブルクリックして開くと、ブラウザのセキュリティ制約でJavaScriptが正しく動かない場合があります。上記のようにローカルWebサーバ経由で開いてください。

ソースを変更してから実行する場合は、Node.js環境で以下を実行します。

```bash
npm install
npm run build
cd docs
python3 -m http.server 8000
```

## Third-Party License

Runtime dependency:

- `jsqr` 1.4.0, Apache-2.0

公開用のライセンス表示は `public/THIRD_PARTY_NOTICES.txt` と `public/licenses/jsqr-LICENSE.txt` から `docs/` へコピーされます。
