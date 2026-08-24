import * as pdfjsLib from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.2.108/build/pdf.mjs';

// pdf-lib is loaded as its official browser UMD build from index.html.
// Using the UMD build avoids a Chrome/module minification issue seen with the CDN ESM bundle.
const { PDFDocument } = window.PDFLib || {};
if (!PDFDocument) {
  throw new Error('PDF library did not load. Refresh the page and try again.');
}

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.2.108/build/pdf.worker.mjs';

const $ = (id) => document.getElementById(id);
const fileInput = $('fileInput');
const dropZone = $('dropZone');
const chooseButton = $('chooseButton');
const fileMeta = $('fileMeta');
const reviewCard = $('reviewCard');
const stats = $('stats');
const attachmentList = $('attachmentList');
const fileCountLabel = $('fileCountLabel');
const sortMode = $('sortMode');
const qualityMode = $('qualityMode');
const attachOriginals = $('attachOriginals');
const convertButton = $('convertButton');
const progressCard = $('progressCard');
const progressTitle = $('progressTitle');
const percentLabel = $('percentLabel');
const progressBar = $('progressBar');
const progressDetail = $('progressDetail');
const log = $('log');
const successCard = $('successCard');
const successSummary = $('successSummary');
const downloadButton = $('downloadButton');
const errorCard = $('errorCard');
const errorText = $('errorText');

let sourceFile = null;
let sourcePdf = null;
let sourcePdfTask = null;
let detectedAttachments = [];
let outputUrl = null;
let attachmentOrderCounter = 0;

// -----------------------------------------------------------------------------
// RAC MCR-286 MAINTENANCE DISPATCH MAZE
// There are 20 valid console selectors at every level: 0-9 and A-J.
// One exact service-vector path reaches the media gate. A wrong branch permanently
// enters a recursive subsystem for the lifetime of the page.
// -----------------------------------------------------------------------------
const sortDisplay = $('sortDisplay');
const qualityDisplay = $('qualityDisplay');
const attachDisplay = $('attachDisplay');
const commandStatus = $('commandStatus');
const promptPrefix = $('promptPrefix');
const commands = $('commands');
const mazeCard = $('mazeCard');
const mazeHeader = $('mazeHeader');
const mazeNotice = $('mazeNotice');
const mazeOptions = $('mazeOptions');
const trapCard = $('trapCard');
const trapBanner = $('trapBanner');
const trapPath = $('trapPath');
const trapDump = $('trapDump');
const trapOptions = $('trapOptions');
const hexLine = $('hexLine');
const regAX = $('regAX');
const regBX = $('regBX');
const regCX = $('regCX');
const regDX = $('regDX');
const regDS = $('regDS');
const regES = $('regES');
const regIP = $('regIP');
const regFL = $('regFL');

// XOR-obscured service vector. It decodes to the maintenance key path requested
// for this deliberately absurd console.
const ACCESS_VECTOR = [53,51,52,55,52,60,60,49,53,51,50,61,49].map(v => String.fromCharCode(v ^ 5)).join('');
const SELECTORS = '0123456789ABCDEFGHIJ'.split('');
let mazeIndex = 0;
let trapped = false;
let trapDepth = 0;
let trapHistory = [];
let maintenanceUnlocked = false;

const opPool = [
  'REBASE 8259A CASCADE MASK INTO SHADOW PIC',
  'RECONCILE XMS HANDLE TABLE WITH HMA WINDOW',
  'RESEED CRC-16/IBM POLYNOMIAL ACCUMULATOR',
  'REMAP 8237 DMA CHANNEL 3 PAGE REGISTER',
  'RELINK FAT12 LOST-CLUSTER FORWARD CHAIN',
  'INVERT 8087 CONDITION-CODE LATCH',
  'PREFETCH MCB ARENA SENTINEL INTO ES:DI',
  'NORMALIZE A20 GATE WRAPAROUND SEMAPHORE',
  'REPLAY INT 13H RETRY VECTOR THROUGH BIOS',
  'PATCH IVT SLOT 76H WITH FAR-JUMP THUNK',
  'PURGE EMS PAGE-FRAME ALIAS AT E000H',
  'RECALCULATE CHS GEOMETRY SKEW TABLE',
  'REARM NMI PARITY LATCH WITHOUT ACK',
  'DEMOTE V86 IOPL SHADOW TO RING-0 TOKEN',
  'SPLICE TSR PSP PARENT CHAIN AT OFFSET 16H',
  'FLUSH 8042 COMMAND BYTE INTO AUX FIFO',
  'ROTATE SEGMENT DESCRIPTOR CACHE BY 4 BITS',
  'REBUILD BDA EQUIPMENT WORD FROM STRAPS',
  'COALESCE FAR-HEAP FREE LIST ABOVE 640K',
  'ASSERT WAIT-STATE INSERTION ON ISA SLOT 5',
  'REINDEX BPB MEDIA DESCRIPTOR AGAINST FAT0',
  'DISCARD STALE TLB TAG FROM PROTECTED SHIM',
  'DEPHASE PIT CHANNEL 0 SQUARE-WAVE DIVISOR',
  'RETHREAD DOS SFT POINTER THROUGH CDS ARRAY',
  'SCRUB UNREAL-MODE LIMIT CACHE AT FS:0000',
  'RECALIBRATE CGA SNOW-SUPPRESSION WINDOW',
  'REORDER UART 8250 IIR PRIORITY ENCODER',
  'SYNCHRONIZE LDT MIRROR WITH GDT SLOT 0B',
  'REPACK DPMI REAL-MODE CALLBACK STUB',
  'REVALIDATE VESA BANK SWITCH FAR POINTER',
  'RECONSTRUCT DOS COUNTRY TABLE COLLATION MAP',
  'REISSUE ATA RECALIBRATE WITH PRECOMP ZERO',
  'MASK SPURIOUS IRQ7 BEFORE EOI CASCADE',
  'FOLD 32-BIT LBA INTO CHS COMPATIBILITY MAP',
  'RELOCATE COMMAND TAIL TO TRANSIENT PSP',
  'RESOLVE NEAR-HEAP PARAGRAPH WRAP COLLISION',
  'PRIME FPU TAG WORD WITH EMPTY-STACK MASK',
  'RECHAIN INT 2FH MULTIPLEX BROADCAST VECTOR',
  'LOAD CGA CRTC INDEX 0CH FROM SHADOW RAM',
  'VERIFY LOW-MEMORY EBDA BASE AGAINST 40:0E',
  'TRISTATE LPT2 DATA BUS DURING DMA HOLD',
  'REISSUE XON AFTER UART OVERRUN RECOVERY',
  'CANONICALIZE FAR POINTER ACROSS 64K FENCE',
  'REPAIR CONFIG.SYS DEVICE CHAIN SENTINEL',
  'WALK BIOS ROM SIGNATURES ON 2K BOUNDARIES',
  'REWRITE DOS DPB NEXT-DRIVE BACKPOINTER',
  'RECONCILE RTC BCD MODE WITH CMOS STATUS B',
  'PIN XMS MOVE DESCRIPTOR BELOW 1MB BARRIER',
  'DEFER PIC EOI UNTIL DMA TERMINAL COUNT',
  'REHASH FCB WILDCARD TEMPLATE WITH OEM MAP',
  'ZERO PREFETCH QUEUE AFTER SELF-MODIFY PATCH',
  'FORCE WORD-ALIGNMENT ON ISA DMA BOUNCE BUF',
  'RECOUNT FAT ROOT DIRECTORY TOMBSTONES',
  'VALIDATE INT 21H IN-DOS FLAG REENTRANCY',
  'REMAP MONOCHROME B800 SEGMENT TO B000',
  'REGENERATE PARITY OVER 4164 DRAM BANK 2',
  'SHADOW OPTION ROM C800H INTO UMB WINDOW',
  'RELOCK 286 LOADALL DESCRIPTOR SIDE-CACHE',
  'RECALCULATE UART BAUD DIVISOR LATCH',
  'DISCARD ORPHANED EMS CONTEXT SAVE AREA'
];

fileInput.addEventListener('change', () => {
  if (fileInput.files?.[0]) loadPortfolio(fileInput.files[0]);
});

sortMode.addEventListener('change', () => {
  renderAttachmentList();
  refreshTerminalOptions();
});
qualityMode.addEventListener('change', refreshTerminalOptions);
attachOriginals.addEventListener('change', refreshTerminalOptions);

function setCommandStatus(text) {
  if (commandStatus) commandStatus.textContent = text;
}

function refreshTerminalOptions() {
  if (sortDisplay) {
    sortDisplay.textContent = {
      smart: 'OPSPECS SMART ORDER',
      portfolio: 'PORTFOLIO ATTACHMENT ORDER',
      name: 'FILENAME A-Z',
    }[sortMode.value] || sortMode.value;
  }
  if (qualityDisplay) {
    qualityDisplay.textContent = {
      '144': '144 DPI / STANDARD',
      '180': '180 DPI / HIGH',
      '216': '216 DPI / VERY HIGH',
    }[qualityMode.value] || `${qualityMode.value} DPI`;
  }
  if (attachDisplay) attachDisplay.textContent = attachOriginals.checked ? 'YES' : 'NO';
}

function cycleSelect(select, values) {
  const i = Math.max(0, values.indexOf(select.value));
  select.value = values[(i + 1) % values.length];
  select.dispatchEvent(new Event('change'));
}

function hex4(n) { return (n & 0xFFFF).toString(16).toUpperCase().padStart(4, '0'); }
function hash16(seed) {
  let h = 0xA55A;
  for (const ch of String(seed)) h = ((h << 5) ^ (h >>> 3) ^ ch.charCodeAt(0) ^ 0x9E37) & 0xFFFF;
  return h;
}
function labelFor(stage, slot, trap = false) {
  const h = hash16(`${stage}:${slot}:${trap ? 'T' : 'M'}`);
  return opPool[(h + slot * 7 + stage * 11) % opPool.length];
}
function addrFor(stage, slot, trap = false) {
  const h = hash16(`${trap ? 'D' : 'C'}:${stage}:${slot}`);
  return `${hex4(0x0800 + ((h >>> 4) & 0x7F0))}:${hex4((h * 13 + slot * 0x31) & 0xFFFF)}`;
}

function renderTwenty(target, stage, trap = false) {
  target.innerHTML = '';
  SELECTORS.forEach((key, slot) => {
    const row = document.createElement('div');
    row.className = 'maze-option';
    row.innerHTML = `<span class="key">${key}</span><span class="addr">${addrFor(stage, slot, trap)}</span><span class="mnemonic">${labelFor(stage, slot, trap)}</span>`;
    target.appendChild(row);
  });
}

function updateRegisters(seed) {
  const h = hash16(seed);
  regAX.textContent = hex4(h * 3 + 0x101);
  regBX.textContent = hex4(h ^ 0xBEEF);
  regCX.textContent = hex4((h << 1) ^ 0x3A7C);
  regDX.textContent = hex4((h * 17) ^ 0x00E9);
  regDS.textContent = hex4(0x0800 + (h & 0x07F0));
  regES.textContent = hex4(0xA000 ^ (h & 0x0FF0));
  regIP.textContent = hex4(0x0100 + ((h * 5) & 0x7EFF));
  regFL.textContent = hex4(0x0202 | (h & 0x00D5));
  const bytes = Array.from({length:16}, (_,i) => ((h >>> (i % 8)) + i * 29 + mazeIndex * 7) & 0xFF);
  hexLine.textContent = `${regDS.textContent}:${regIP.textContent}  ${bytes.map(v => v.toString(16).toUpperCase().padStart(2,'0')).join(' ')}`;
}

function renderMaze() {
  const stateHash = hash16(`maze:${mazeIndex}:${ACCESS_VECTOR.slice(0, mazeIndex)}`);
  mazeHeader.textContent = `STATE=${hex4(stateHash)}  BANK=${hex4(mazeIndex * 0x111)}  CPL=0  VECTOR MASK=${hex4(0xFFFF ^ (stateHash & 0x0F0F))}`;
  mazeNotice.textContent = [
    'SELECT ONE DISPATCH VECTOR. NO SYMBOL TABLE IS LOADED.',
    'CALL TABLE RELOCATED. IMPORT NAMES WERE STRIPPED AT LINK TIME.',
    'DESCRIPTOR CACHE IS NON-COHERENT. CHOOSE NEXT FAR ENTRY POINT.',
    'SERVICE OVERLAY IS RESIDENT BUT ITS EXPORT ORDINALS ARE UNDOCUMENTED.',
    'BIOS HAND-OFF TABLE IS PARTIALLY CORRUPT. SELECT A CONTINUATION VECTOR.'
  ][mazeIndex % 5];
  promptPrefix.textContent = `MCR7:${hex4(stateHash)}>`;
  setCommandStatus('AWAITING 1 OF 20 DISPATCH SELECTORS');
  updateRegisters(`maze:${mazeIndex}:${stateHash}`);
  renderTwenty(mazeOptions, mazeIndex, false);
}

function enterTrap(key) {
  trapped = true;
  trapDepth = 1;
  trapHistory = [key];
  mazeCard.classList.add('hidden');
  trapCard.classList.remove('hidden');
  renderTrap();
}

function memoryDump(seed) {
  const h = hash16(seed);
  const rows = [];
  for (let r = 0; r < 5; r++) {
    const seg = hex4(0x1000 + ((h + r * 0x123) & 0x6FF0));
    const off = hex4((h * (r + 3) + r * 0x71) & 0xFFF0);
    const bs = Array.from({length:16}, (_,i) => ((h + r * 37 + i * 19 + trapDepth * 13) ^ (i << (r % 3))) & 0xFF);
    const ascii = bs.map(v => (v >= 33 && v <= 126) ? String.fromCharCode(v) : '.').join('');
    rows.push(`${seg}:${off}  ${bs.map(v => v.toString(16).toUpperCase().padStart(2,'0')).join(' ')}  ${ascii}`);
  }
  return rows.join('\n');
}

function renderTrap() {
  const h = hash16(`${trapDepth}:${trapHistory.join('')}`);
  trapBanner.textContent = trapDepth === 1
    ? 'CALL GATE ACCEPTED. PREVIOUS RETURN VECTOR DISCARDED.'
    : `SUBSYSTEM DESCENT ${String(trapDepth).padStart(3,'0')} ACCEPTED. RETURN FRAME OVERWRITTEN.`;
  trapPath.textContent = `PATH=${trapHistory.join('>')}  DEPTH=${trapDepth}  SS:SP=${hex4(h ^ 0x7000)}:${hex4(0xFFF0 - (trapDepth * 0x24))}  RET=NIL`;
  trapDump.textContent = memoryDump(`trap:${h}`);
  promptPrefix.textContent = `NMI${hex4(h)}>`;
  setCommandStatus('NO RETURN VECTOR / SELECT ANOTHER RESIDENT ENTRY POINT');
  renderTwenty(trapOptions, trapDepth + h, true);
}

function descendTrap(key) {
  trapDepth += 1;
  trapHistory.push(key);
  if (trapHistory.length > 24) trapHistory = trapHistory.slice(-24);
  renderTrap();
}

async function unlockMaintenanceGate() {
  maintenanceUnlocked = true;
  mazeCard.classList.add('hidden');
  trapCard.classList.add('hidden');
  $('inputCard').classList.remove('hidden');
  commands.classList.remove('hidden');
  promptPrefix.textContent = 'A:\\RAC>';
  setCommandStatus('MEDIA GATE OPEN / INVOKING DOCUMENT SELECTOR');
  // This call remains inside the key event that completed the service path,
  // so browsers treat it as a user-initiated file-selection request.
  fileInput.click();
}

async function selectNewPortfolio() {
  if (!maintenanceUnlocked) return;
  if (sourcePdf || sourceFile || detectedAttachments.length) await resetAll();
  $('inputCard').classList.remove('hidden');
  setCommandStatus('READING DISK DIRECTORY...');
  fileInput.click();
}

function triggerDownload() {
  if (!outputUrl || successCard.classList.contains('hidden')) {
    setCommandStatus('NO OUTPUT FILE AVAILABLE');
    return;
  }
  setCommandStatus('WRITING OUTPUT FILE TO DISK...');
  downloadButton.click();
  window.setTimeout(() => setCommandStatus('OUTPUT SAVED / WAITING FOR KEYBOARD INPUT'), 400);
}

window.addEventListener('keydown', async (event) => {
  // Preserve browser-level emergency controls such as Ctrl+R / Cmd+R.
  if (event.ctrlKey || event.altKey || event.metaKey) return;
  const key = event.key;
  const upper = key.toUpperCase();

  if (trapped) {
    event.preventDefault();
    if (key === 'Escape') {
      trapDepth += 3;
      trapHistory.push('NMI');
      renderTrap();
      return;
    }
    if (SELECTORS.includes(upper)) descendTrap(upper);
    else setCommandStatus(`SCAN CODE ${key.length === 1 ? key.charCodeAt(0).toString(16).toUpperCase() : '??'} UNMAPPED / RETURN STILL NIL`);
    return;
  }

  if (!maintenanceUnlocked) {
    if (!SELECTORS.includes(upper)) {
      if (key === 'Escape') {
        event.preventDefault();
        mazeNotice.textContent = 'ESCAPE VECTOR IS MASKED AT PRIVILEGE LEVEL 0.';
        setCommandStatus('INT 1BH MASKED / SELECT A DISPATCH VECTOR');
      }
      return;
    }
    event.preventDefault();
    const expected = ACCESS_VECTOR[mazeIndex];
    if (upper === expected) {
      mazeIndex += 1;
      if (mazeIndex >= ACCESS_VECTOR.length) {
        await unlockMaintenanceGate();
      } else {
        renderMaze();
      }
    } else {
      enterTrap(upper);
    }
    return;
  }

  const lower = key.toLowerCase();
  if (key === 'Escape') {
    event.preventDefault();
    await resetAll();
    $('inputCard').classList.remove('hidden');
    setCommandStatus('JOB CLEARED / MEDIA GATE REMAINS OPEN');
    return;
  }
  if (lower === '1') {
    event.preventDefault();
    await selectNewPortfolio();
    return;
  }
  if (lower === '2' || key === 'Enter') {
    if (!reviewCard.classList.contains('hidden') && sourcePdf && detectedAttachments.length) {
      event.preventDefault();
      setCommandStatus('EXECUTING CONCENTRATION BATCH...');
      await convertPortfolio();
    }
    return;
  }
  if (lower === 'o' && !reviewCard.classList.contains('hidden')) {
    event.preventDefault();
    cycleSelect(sortMode, ['smart', 'portfolio', 'name']);
    setCommandStatus(`SORT VECTOR = ${sortDisplay.textContent}`);
    return;
  }
  if (lower === 'q' && !reviewCard.classList.contains('hidden')) {
    event.preventDefault();
    cycleSelect(qualityMode, ['144', '180', '216']);
    setCommandStatus(`RASTER CLOCK = ${qualityDisplay.textContent}`);
    return;
  }
  if (lower === 'a' && !reviewCard.classList.contains('hidden')) {
    event.preventDefault();
    attachOriginals.checked = !attachOriginals.checked;
    attachOriginals.dispatchEvent(new Event('change'));
    setCommandStatus(`SOURCE CHAIN = ${attachDisplay.textContent}`);
    return;
  }
  if (lower === 'd') {
    event.preventDefault();
    triggerDownload();
    return;
  }
  if (lower === 'n' && !successCard.classList.contains('hidden')) {
    event.preventDefault();
    await resetAll();
    $('inputCard').classList.remove('hidden');
    setCommandStatus('NEW JOB / MEDIA GATE OPEN');
  }
});

renderMaze();
refreshTerminalOptions();
// Disable wheel scrolling and pointer-generated interactions inside the application.
window.addEventListener('wheel', (event) => event.preventDefault(), { passive: false });
document.addEventListener('contextmenu', (event) => event.preventDefault());
document.addEventListener('pointerdown', (event) => event.preventDefault(), true);
document.addEventListener('dragstart', (event) => event.preventDefault(), true);

async function loadPortfolio(file) {
  clearError();
  successCard.classList.add('hidden');
  reviewCard.classList.add('hidden');
  progressCard.classList.remove('hidden');
  setProgress(2, 'OPENING PORTFOLIO...', `READING ${file.name}`);
  setCommandStatus('READING PORTFOLIO...');
  clearLog();

  try {
    sourceFile = file;
    const bytes = new Uint8Array(await file.arrayBuffer());
    sourcePdfTask = pdfjsLib.getDocument({ data: bytes, enableScripting: false });
    sourcePdf = await sourcePdfTask.promise;
    addLog(`Opened ${file.name} (${formatBytes(file.size)}).`);

    const raw = await sourcePdf.getAttachments();
    const entries = normalizeAttachmentEntries(raw);
    if (!entries.length) {
      throw new Error('No embedded PDF files were found. Make sure you selected the Adobe PDF Portfolio itself, not a normal single PDF.');
    }

    attachmentOrderCounter = 0;
    const pdfItems = [];
    for (const [key, attachment] of entries) {
      const filename = attachment?.filename || attachment?.name || key || `attachment-${pdfItems.length + 1}.pdf`;
      if (!filename.toLowerCase().endsWith('.pdf')) continue;
      pdfItems.push({
        key,
        filename,
        attachment,
        originalIndex: attachmentOrderCounter++,
      });
    }

    if (!pdfItems.length) throw new Error('Attachments were found, but none of them were PDF files.');
    detectedAttachments = pdfItems;

    fileMeta.textContent = `INPUT FILE: ${file.name}  |  SIZE: ${formatBytes(file.size)}`;
    fileMeta.classList.remove('hidden');
    stats.innerHTML = `
      <div class="stat"><strong>${pdfItems.length}</strong><span>PDF FILES</span></div>
      <div class="stat"><strong>${formatBytes(file.size)}</strong><span>INPUT SIZE</span></div>
      <div class="stat"><strong>LOCAL</strong><span>PROCESSING MODE</span></div>`;
    fileCountLabel.textContent = `(${pdfItems.length})`;
    renderAttachmentList();
    progressCard.classList.add('hidden');
    reviewCard.classList.remove('hidden');
    addLog(`DETECTED ${pdfItems.length} PDF ATTACHMENTS.`);
    refreshTerminalOptions();
    setCommandStatus('PORTFOLIO READY / PRESS 2 TO CONVERT');
  } catch (error) {
    showError(error);
  }
}

function normalizeAttachmentEntries(raw) {
  if (!raw) return [];
  if (raw instanceof Map) return [...raw.entries()];
  return Object.entries(raw);
}

function orderedAttachments() {
  const items = [...detectedAttachments];
  if (sortMode.value === 'portfolio') return items.sort((a, b) => a.originalIndex - b.originalIndex);
  if (sortMode.value === 'name') return items.sort((a, b) => naturalCompare(a.filename, b.filename));
  return items.sort(compareOpsSpecFiles);
}

function renderAttachmentList() {
  const items = orderedAttachments();
  attachmentList.innerHTML = '';
  for (const item of items) {
    const li = document.createElement('li');
    li.textContent = item.filename;
    attachmentList.appendChild(li);
  }
}

function compareOpsSpecFiles(a, b) {
  const ka = opsSpecSortKey(a.filename);
  const kb = opsSpecSortKey(b.filename);
  for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
    const av = ka[i] ?? '';
    const bv = kb[i] ?? '';
    if (typeof av === 'number' && typeof bv === 'number' && av !== bv) return av - bv;
    if (String(av) !== String(bv)) return naturalCompare(String(av), String(bv));
  }
  return naturalCompare(a.filename, b.filename);
}

function opsSpecSortKey(filename) {
  const upper = filename.toUpperCase();
  const toc = upper.match(/(?:^|[_\s-])TOC[_\s-]*([A-E])(?:[_\s.-]|$)/);
  if (toc) return [0, partRank(toc[1]), 0, upper];

  const para = upper.match(/(?:^|[_\s-])([A-E])(\d{3})(?:[_\s.-]|$)/);
  if (para) return [1, partRank(para[1]), Number(para[2]), upper];

  return [2, 99, 9999, upper];
}

function partRank(letter) {
  return { A: 0, B: 1, C: 2, D: 3, E: 4 }[letter] ?? 9;
}

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

async function getAttachmentBytes(item) {
  const attachment = item.attachment || {};
  const direct = attachment.content ?? attachment.data ?? attachment.bytes;
  if (direct instanceof Uint8Array) return direct;
  if (direct instanceof ArrayBuffer) return new Uint8Array(direct);
  if (ArrayBuffer.isView(direct)) return new Uint8Array(direct.buffer, direct.byteOffset, direct.byteLength);

  const id = attachment.id ?? item.key;
  if (sourcePdf?.getAttachmentContent && id != null) {
    const fetched = await sourcePdf.getAttachmentContent(String(id));
    const content = fetched?.content ?? fetched?.data ?? fetched;
    if (content instanceof Uint8Array) return content;
    if (content instanceof ArrayBuffer) return new Uint8Array(content);
    if (ArrayBuffer.isView(content)) return new Uint8Array(content.buffer, content.byteOffset, content.byteLength);
  }

  throw new Error(`Could not read the embedded bytes for ${item.filename}.`);
}

async function convertPortfolio() {
  if (!sourcePdf || !detectedAttachments.length) return;
  convertButton.disabled = true;
  reviewCard.classList.add('hidden');
  successCard.classList.add('hidden');
  progressCard.classList.remove('hidden');
  clearError();
  clearLog();

  try {
    const items = orderedAttachments();
    const dpi = Number(qualityMode.value || 144);
    const renderScale = dpi / 72;
    const output = await PDFDocument.create();
    output.setTitle('Reliant Air Charter Operations Specifications');
    output.setSubject('Flattened single-document export from signed FAA OpsSpecs PDF Portfolio');
    output.setCreator('RAC OpsSpecs Portfolio Converter');
    output.setProducer('pdf-lib / PDF.js');
    output.setCreationDate(new Date());
    output.setModificationDate(new Date());

    let totalPages = 0;
    let processedPages = 0;
    const prepared = [];

    setProgress(2, 'Reading embedded PDFs…', 'Counting pages before conversion.');

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      setProgress(2 + Math.round((i / items.length) * 8), 'Reading embedded PDFs…', `${i + 1} of ${items.length}: ${item.filename}`);
      const bytes = await getAttachmentBytes(item);
      const task = pdfjsLib.getDocument({ data: bytes.slice(), enableScripting: false });
      const doc = await task.promise;
      const numPages = doc.numPages;
      totalPages += numPages;
      prepared.push({ item, bytes, numPages });
      await safeDestroyPdf(task, doc);
      addLog(`${item.filename}: ${numPages} page${numPages === 1 ? '' : 's'}.`);
      await yieldToBrowser();
    }

    addLog(`Total output pages: ${totalPages}.`);

    for (let fileIndex = 0; fileIndex < prepared.length; fileIndex++) {
      const { item, bytes, numPages } = prepared[fileIndex];
      const componentTask = pdfjsLib.getDocument({ data: bytes.slice(), enableScripting: false });
      const component = await componentTask.promise;
      addLog(`Rendering ${item.filename}…`);

      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        const page = await component.getPage(pageNumber);
        const baseViewport = page.getViewport({ scale: 1 });
        const renderViewport = page.getViewport({ scale: renderScale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.ceil(renderViewport.width));
        canvas.height = Math.max(1, Math.ceil(renderViewport.height));
        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        const renderTask = page.render({
          canvasContext: ctx,
          viewport: renderViewport,
          annotationMode: pdfjsLib.AnnotationMode?.ENABLE ?? 1,
          intent: 'display',
        });
        await renderTask.promise;

        const imageBytes = await canvasToBytes(canvas, 'image/jpeg', .94);
        const image = await output.embedJpg(imageBytes);
        const outPage = output.addPage([baseViewport.width, baseViewport.height]);
        outPage.drawImage(image, {
          x: 0,
          y: 0,
          width: baseViewport.width,
          height: baseViewport.height,
        });

        canvas.width = 1;
        canvas.height = 1;
        page.cleanup();

        processedPages += 1;
        const percent = 10 + Math.round((processedPages / Math.max(1, totalPages)) * 76);
        setProgress(percent, 'Flattening signed pages…', `${processedPages} of ${totalPages} pages • ${item.filename} • page ${pageNumber}/${numPages}`);
        if (processedPages % 2 === 0) await yieldToBrowser();
      }
      await safeDestroyPdf(componentTask, component);
    }

    if (attachOriginals.checked) {
      setProgress(88, 'Embedding original signed PDFs…', 'Preserving the exact component files for independent signature verification.');
      for (let i = 0; i < prepared.length; i++) {
        const { item, bytes } = prepared[i];
        await output.attach(bytes, item.filename, {
          mimeType: 'application/pdf',
          description: 'Original signed OpsSpec component preserved from the source PDF Portfolio.',
        });
        setProgress(88 + Math.round(((i + 1) / prepared.length) * 6), 'Embedding original signed PDFs…', `${i + 1} of ${prepared.length}: ${item.filename}`);
        if (i % 5 === 0) await yieldToBrowser();
      }
    }

    setProgress(96, 'Building final PDF…', 'Writing the single-document file.');
    const saved = await output.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 20 });
    const blob = new Blob([saved], { type: 'application/pdf' });

    if (outputUrl) URL.revokeObjectURL(outputUrl);
    outputUrl = URL.createObjectURL(blob);
    downloadButton.href = outputUrl;
    const baseName = sourceFile.name.replace(/\.pdf$/i, '').replace(/\s+/g, '_');
    downloadButton.download = `${baseName}_Single_Document.pdf`;

    setProgress(100, 'COMPLETE', `CREATED ${totalPages} PAGES.`);
    successSummary.textContent = `${totalPages} PAGES FROM ${prepared.length} EMBEDDED PDF FILES  |  ${formatBytes(blob.size)}${attachOriginals.checked ? '  |  ORIGINAL SIGNED PDF FILES EMBEDDED' : ''}`;
    progressCard.classList.add('hidden');
    successCard.classList.remove('hidden');
    addLog(`FINISHED: ${formatBytes(blob.size)}.`);
    setCommandStatus('JOB COMPLETE / PRESS D TO SAVE OUTPUT');
  } catch (error) {
    showError(error);
  } finally {
    convertButton.disabled = false;
  }
}

async function safeDestroyPdf(task, doc) {
  // PDF.js versions differ on where destroy() is exposed.
  // Prefer the loading task, then fall back to the document proxy.
  try {
    if (task && typeof task.destroy === 'function') {
      await task.destroy();
      return;
    }
    if (doc && typeof doc.destroy === 'function') {
      await doc.destroy();
      return;
    }
    if (doc && typeof doc.cleanup === 'function') {
      await doc.cleanup();
    }
  } catch (err) {
    console.warn('PDF cleanup warning:', err);
  }
}

function canvasToBytes(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return reject(new Error('The browser could not encode a rendered page.'));
      resolve(new Uint8Array(await blob.arrayBuffer()));
    }, mimeType, quality);
  });
}

function setProgress(percent, title, detail) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  percentLabel.textContent = `${value}%`;
  progressBar.style.width = `${value}%`;
  progressTitle.textContent = title;
  progressDetail.textContent = detail;
}

function addLog(message) {
  const row = document.createElement('div');
  row.textContent = message;
  log.appendChild(row);
  log.scrollTop = log.scrollHeight;
}

function clearLog() { log.innerHTML = ''; }

function showError(error) {
  console.error(error);
  progressCard.classList.add('hidden');
  reviewCard.classList.add('hidden');
  errorText.textContent = (error?.message || String(error)).toUpperCase();
  setCommandStatus('PROGRAM HALTED / PRESS ESC TO RESET');
  errorCard.classList.remove('hidden');
}

function clearError() { errorCard.classList.add('hidden'); }

async function resetAll() {
  if (outputUrl) {
    URL.revokeObjectURL(outputUrl);
    outputUrl = null;
  }
  if (sourcePdf || sourcePdfTask) {
    await safeDestroyPdf(sourcePdfTask, sourcePdf);
  }
  sourceFile = null;
  sourcePdf = null;
  sourcePdfTask = null;
  detectedAttachments = [];
  fileInput.value = '';
  fileMeta.textContent = '';
  fileMeta.classList.add('hidden');
  reviewCard.classList.add('hidden');
  progressCard.classList.add('hidden');
  successCard.classList.add('hidden');
  errorCard.classList.add('hidden');
  attachmentList.innerHTML = '';
  clearLog();
  setProgress(0, 'Preparing conversion…', 'Reading portfolio attachments.');
  window.scrollTo({ top: 0, behavior: 'auto' });
  setCommandStatus(maintenanceUnlocked ? 'MEDIA GATE OPEN / WAITING FOR KEYBOARD INPUT' : 'WAITING FOR DISPATCH VECTOR');
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = units[0];
  for (let i = 1; i < units.length && value >= 1024; i++) {
    value /= 1024;
    unit = units[i];
  }
  return `${value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2)} ${unit}`;
}

function yieldToBrowser() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
