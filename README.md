# RAC OpsSpecs Portfolio Converter — MCR-286 Rabbit-Hole Edition

This is the intentionally absurd, keyboard-only 1980s service-console skin for the RAC OpsSpecs Portfolio Converter.

## What changed

- Black screen / monochrome green CRT presentation.
- Mouse/pointer interaction is disabled inside the application.
- The file-selection gate is hidden behind a 13-level maintenance dispatch path.
- Every level presents 20 low-level service vectors (`0-9` and `A-J`).
- The valid path is: `0 6 1 2 1 9 9 4 0 6 7 8 4`.
- Selecting any wrong service vector enters a recursive non-returning subsystem. Every further choice descends another level; there is deliberately no in-app back/escape path. Reload the browser page to start over.
- After the correct final key, the browser file picker opens. If it is cancelled, press `1` to reopen it.
- Once a portfolio is loaded, normal converter controls are keyboard-only: `2` convert, `O` order, `Q` quality, `A` embed originals, `D` download, `N` new job.

## GitHub Pages

Replace `index.html`, `styles.css`, and `app.js` in the repository root, commit, wait for Pages to redeploy, then force-refresh with `Ctrl+F5`.

The PDF conversion logic is unchanged from the prior keyboard-only build.
