# RAC Simple PDF Combiner

A single-file website to merge batches of PDFs, JPGs, and PNGs into one PDF.

## Put it on GitHub Pages
1. In your GitHub repository, choose **Add file → Upload files**.
2. Upload **index.html** (only this one file is required).
3. Commit directly to **main**.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**, branch **main**, folder **/(root)**, and click **Save**.
6. Open the published GitHub Pages URL.

## What it does
- Add many files at once using the file chooser or drag-and-drop.
- Move files up or down to change order.
- Press **Combine & Download PDF** to merge them.
- Processing happens entirely in the browser, using pdf-lib loaded from a CDN.

## Limits and records warning
- PDFs, JPGs, and PNGs only, not Word documents or ZIP archives.
- Merging may invalidate digital signatures on signed PDFs. Keep originals in your approved records system.
- This is a convenience tool, **not** a replacement for JetInsight, ReliantNAS, or the company's EMRS retention, backup, audit, and review obligations.
- No server upload or storage. Large batches may exceed browser memory.
