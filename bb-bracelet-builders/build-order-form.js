const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType, VerticalAlign,
  HeadingLevel, PageOrientation, PageBreak, Footer,
} = require('docx');
const fs = require('fs');

// ---- palette -------------------------------------------------------------
const PINK_DARK = 'A61E5A';   // headings / rules
const PINK_MID  = 'D46A9F';   // table borders
const PINK_LT   = 'FCE7F0';   // header row fill
const PINK_XLT  = 'FDF4F8';   // zebra fill
const GRAY_TXT  = '4A4A4A';

const USABLE = 10512;         // 12240 - (2 * 864) margins
const FONT = process.env.FORM_FONT || 'Calibri';

// ---- helpers -------------------------------------------------------------
const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const cellBorders = (color = PINK_MID, size = 4) => ({
  top:    { style: BorderStyle.SINGLE, size, color },
  bottom: { style: BorderStyle.SINGLE, size, color },
  left:   { style: BorderStyle.SINGLE, size, color },
  right:  { style: BorderStyle.SINGLE, size, color },
});

function p(text, opts = {}) {
  const {
    bold = false, size = 20, color = '000000', align = AlignmentType.LEFT,
    caps = false, italics = false, before = 0, after = 0, font = FONT,
  } = opts;
  return new Paragraph({
    alignment: align,
    spacing: { before, after },
    children: [new TextRun({ text, bold, size, color, allCaps: caps, italics, font })],
  });
}

function cell(children, opts = {}) {
  const {
    width, shading, span = 1, borders = cellBorders(),
    valign = VerticalAlign.CENTER, margins = { top: 46, bottom: 46, left: 110, right: 110 },
  } = opts;
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    columnSpan: span,
    verticalAlign: valign,
    margins,
    borders,
    shading: shading ? { type: ShadingType.CLEAR, fill: shading, color: 'auto' } : undefined,
    children: Array.isArray(children) ? children : [children],
  });
}

function table(columnWidths, rows) {
  return new Table({
    width: { size: columnWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths,
    rows,
  });
}

function spacer(h = 120) {
  return new Paragraph({
    spacing: { before: 0, after: h, line: 120, lineRule: 'exact' },
    children: [new TextRun({ text: '', size: 10, font: FONT })],
  });
}

// Section banner: white caps text on a pink bar
function banner(text) {
  return table([USABLE], [
    new TableRow({
      children: [cell(
        p(text, { bold: true, size: 21, color: 'FFFFFF', caps: true }),
        { width: USABLE, shading: PINK_DARK, borders: cellBorders(PINK_DARK),
          margins: { top: 48, bottom: 48, left: 140, right: 140 } },
      )],
    }),
  ]);
}

// ---- header --------------------------------------------------------------
const titleBlock = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 0 },
    children: [new TextRun({ text: 'BB Bracelet Builders', bold: true, size: 50, color: PINK_DARK, font: FONT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 30, after: 40 },
    children: [new TextRun({ text: 'Handmade bracelets — built just for you!', italics: true, size: 22, color: GRAY_TXT, font: FONT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: PINK_MID, space: 6 } },
    children: [new TextRun({ text: 'C U S T O M   O R D E R   F O R M', bold: true, size: 24, color: GRAY_TXT, font: FONT })],
  }),
];

// ---- customer info -------------------------------------------------------
const LBL = 1800, VAL = 3456;
const labelCell = (t) => cell(p(t, { bold: true, size: 19, color: PINK_DARK, caps: true }), { width: LBL, shading: PINK_LT });
const valueCell = (t = '') => cell(p(t, { size: 21 }), { width: VAL });

const customerTable = table([LBL, VAL, LBL, VAL], [
  new TableRow({ children: [labelCell('Customer Name'), valueCell(), labelCell('Order #'), valueCell()] }),
  new TableRow({ children: [labelCell('Phone / Email'), valueCell(), labelCell('Order Date'), valueCell()] }),
  new TableRow({ children: [labelCell('Bracelet Theme'), valueCell(), labelCell('Needed By'), valueCell()] }),
  new TableRow({ children: [labelCell('Wrist Size'), valueCell(), labelCell('Pickup / Delivery'), valueCell()] }),
]);

// ---- parts table ---------------------------------------------------------
const C = [2500, 3812, 900, 1500, 1800]; // = 10512
const partsHeader = new TableRow({
  tableHeader: true,
  children: [
    cell(p('Type of Part', { bold: true, size: 19, color: 'FFFFFF', caps: true }), { width: C[0], shading: PINK_DARK, borders: cellBorders(PINK_DARK) }),
    cell(p('Color / Description', { bold: true, size: 19, color: 'FFFFFF', caps: true }), { width: C[1], shading: PINK_DARK, borders: cellBorders(PINK_DARK) }),
    cell(p('Qty', { bold: true, size: 19, color: 'FFFFFF', caps: true, align: AlignmentType.CENTER }), { width: C[2], shading: PINK_DARK, borders: cellBorders(PINK_DARK) }),
    cell(p('Price Each', { bold: true, size: 19, color: 'FFFFFF', caps: true, align: AlignmentType.CENTER }), { width: C[3], shading: PINK_DARK, borders: cellBorders(PINK_DARK) }),
    cell(p('Line Total', { bold: true, size: 19, color: 'FFFFFF', caps: true, align: AlignmentType.RIGHT }), { width: C[4], shading: PINK_DARK, borders: cellBorders(PINK_DARK) }),
  ],
});

const PART_TYPES = [
  'Beads', 'Letter Beads', 'Charms', 'Spacers / Rings',
  'Cord / Elastic', 'Clasp', 'Pendant', 'Other',
];

const partsRows = PART_TYPES.map((name, i) => {
  const fill = i % 2 === 1 ? PINK_XLT : undefined;
  return new TableRow({
    height: { value: 300, rule: 'atLeast' },
    children: [
      cell(p(name, { size: 21, bold: !!name }), { width: C[0], shading: fill }),
      cell(p(''), { width: C[1], shading: fill }),
      cell(p('', { align: AlignmentType.CENTER }), { width: C[2], shading: fill }),
      cell(p('', { align: AlignmentType.CENTER }), { width: C[3], shading: fill }),
      cell(p('', { align: AlignmentType.RIGHT }), { width: C[4], shading: fill }),
    ],
  });
});

const partsCountRow = new TableRow({
  height: { value: 340, rule: 'atLeast' },
  children: [
    cell(p('TOTAL NUMBER OF PARTS', { bold: true, size: 20, color: PINK_DARK }), { width: C[0] + C[1], span: 2, shading: PINK_LT }),
    cell(p('', { align: AlignmentType.CENTER, bold: true }), { width: C[2], shading: PINK_LT }),
    cell(p('Parts Subtotal', { bold: true, size: 20, color: PINK_DARK, align: AlignmentType.RIGHT }), { width: C[3], shading: PINK_LT }),
    cell(p('$', { bold: true, size: 21, align: AlignmentType.RIGHT }), { width: C[4], shading: PINK_LT }),
  ],
});

const partsTable = table(C, [partsHeader, ...partsRows, partsCountRow]);

// ---- totals --------------------------------------------------------------
const TL = 7212, TV = 3300;
const totalRow = (label, value = '$', opts = {}) => new TableRow({
  height: { value: 290, rule: 'atLeast' },
  children: [
    cell(p(label, { bold: !!opts.bold, size: opts.big ? 24 : 21, align: AlignmentType.RIGHT, color: opts.big ? PINK_DARK : '000000' }),
      { width: TL, shading: opts.fill, borders: opts.big ? cellBorders(PINK_DARK, 8) : cellBorders() }),
    cell(p(value, { bold: !!opts.bold, size: opts.big ? 24 : 21, align: AlignmentType.RIGHT, color: opts.big ? PINK_DARK : '000000' }),
      { width: TV, shading: opts.fill, borders: opts.big ? cellBorders(PINK_DARK, 8) : cellBorders() }),
  ],
});

const totalsTable = table([TL, TV], [
  totalRow('Parts Subtotal (from table above)'),
  totalRow('Building Fee (labor)'),
  totalRow('Discount  –'),
  totalRow('TOTAL DUE', '$', { bold: true, big: true, fill: PINK_LT }),
]);

// ---- payment -------------------------------------------------------------
const PW = [USABLE];
const PY_ = [1500, 5012, 2000, 2000]; // = 10512
const paymentTable = table(PY_, [
  new TableRow({
    children: [
      cell(p('Payment', { bold: true, size: 19, color: PINK_DARK, caps: true }), { width: PY_[0], shading: PINK_LT }),
      cell(p('☐ Cash   ☐ Venmo   ☐ CashApp   ☐ Other', { size: 20 }), { width: PY_[1] }),
      cell(p('Paid:  $', { size: 20 }), { width: PY_[2] }),
      cell(p('Balance:  $', { size: 20 }), { width: PY_[3] }),
    ],
  }),
  new TableRow({
    children: [
      cell(p('Status', { bold: true, size: 19, color: PINK_DARK, caps: true }), { width: PY_[0], shading: PINK_LT }),
      cell(p('☐ Taken   ☐ Building   ☐ Finished   ☐ Delivered', { size: 20 }), { width: PY_[1] }),
      cell(p('Built by:', { size: 20 }), { width: PY_[2] }),
      cell(p('Date done:', { size: 20 }), { width: PY_[3] }),
    ],
  }),
]);

// ---- notes ---------------------------------------------------------------
const notesTable = table([USABLE], [
  new TableRow({
    height: { value: 520, rule: 'atLeast' },
    children: [cell([p(''), p(''), p('')], { width: USABLE, valign: VerticalAlign.TOP })],
  }),
]);

// ---- page 2: price list --------------------------------------------------
const PL = [3400, 4212, 2900];
const priceHeader = new TableRow({
  tableHeader: true,
  children: [
    cell(p('Type of Part', { bold: true, size: 19, color: 'FFFFFF', caps: true }), { width: PL[0], shading: PINK_DARK, borders: cellBorders(PINK_DARK) }),
    cell(p('What It Is', { bold: true, size: 19, color: 'FFFFFF', caps: true }), { width: PL[1], shading: PINK_DARK, borders: cellBorders(PINK_DARK) }),
    cell(p('Price Each', { bold: true, size: 19, color: 'FFFFFF', caps: true, align: AlignmentType.RIGHT }), { width: PL[2], shading: PINK_DARK, borders: cellBorders(PINK_DARK) }),
  ],
});

const PRICE_ITEMS = [
  ['Beads', 'Plain, glass, or pearl beads', '$'],
  ['Letter Beads', 'Spell out a name or word', '$'],
  ['Charms', 'Hearts, stars, crosses, animals', '$'],
  ['Spacers / Rings', 'Small pieces between beads', '$'],
  ['Cord / Elastic', 'The stretchy string it is built on', '$'],
  ['Clasp', 'Lobster clasp or toggle', '$'],
  ['Pendant', 'One big center piece', '$'],
  ['Building Fee', 'Charge for putting it together', '$'],
  ['Gift Box / Wrapping', 'Optional pretty packaging', '$'],
  ['', '', '$'],
  ['', '', '$'],
];

const priceRows = PRICE_ITEMS.map(([a, b, c], i) => {
  const fill = i % 2 === 1 ? PINK_XLT : undefined;
  return new TableRow({
    height: { value: 360, rule: 'atLeast' },
    children: [
      cell(p(a, { size: 21, bold: !!a }), { width: PL[0], shading: fill }),
      cell(p(b, { size: 21, color: GRAY_TXT }), { width: PL[1], shading: fill }),
      cell(p(c, { size: 21, align: AlignmentType.RIGHT }), { width: PL[2], shading: fill }),
    ],
  });
});

const priceTable = table(PL, [priceHeader, ...priceRows]);

// Simple order log for tracking
const LG = [1600, 3000, 1900, 2012, 2000];
const logHeader = new TableRow({
  tableHeader: true,
  children: ['Date', 'Customer', 'Total Parts', 'Total Charged', 'Paid?'].map((t, i) =>
    cell(p(t, { bold: true, size: 19, color: 'FFFFFF', caps: true, align: i >= 2 ? AlignmentType.CENTER : AlignmentType.LEFT }),
      { width: LG[i], shading: PINK_DARK, borders: cellBorders(PINK_DARK) })),
});
const logRows = Array.from({ length: 14 }, (_, i) => new TableRow({
  height: { value: 360, rule: 'atLeast' },
  children: LG.map((w) => cell(p(''), { width: w, shading: i % 2 === 1 ? PINK_XLT : undefined })),
}));
const logTable = table(LG, [logHeader, ...logRows]);

// ---- document ------------------------------------------------------------
const doc = new Document({
  creator: 'BB Bracelet Builders',
  title: 'BB Bracelet Builders — Custom Order Form',
  description: 'Order form for a handmade bracelet business',
  styles: { default: { document: { run: { font: FONT, size: 21 } } } },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840, orientation: PageOrientation.PORTRAIT },
        margin: { top: 720, right: 864, bottom: 576, left: 864 },
      },
    },
    footers: {
      default: new Footer({
        children: [p('Thank you for your order! — BB Bracelet Builders',
          { align: AlignmentType.CENTER, size: 18, italics: true, color: PINK_DARK })],
      }),
    },
    children: [
      ...titleBlock,
      banner('Customer & Order Details'),
      spacer(60),
      customerTable,
      spacer(100),
      partsTable,
      spacer(100),
      banner('Totals'),
      spacer(60),
      totalsTable,
      spacer(100),
      banner('Payment & Status'),
      spacer(60),
      paymentTable,
      spacer(100),
      banner('Notes / Special Requests'),
      spacer(60),
      notesTable,

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: 'BB Bracelet Builders', bold: true, size: 40, color: PINK_DARK, font: FONT })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 240 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: PINK_MID, space: 6 } },
        children: [new TextRun({ text: 'P R I C E   L I S T   &   O R D E R   L O G', bold: true, size: 24, color: GRAY_TXT, font: FONT })],
      }),
      banner('My Prices'),
      spacer(60),
      priceTable,
      spacer(80),
      p('Fill in your own prices once, then copy them onto every order form.',
        { size: 19, italics: true, color: GRAY_TXT }),
      spacer(240),
      banner('Order Log'),
      spacer(60),
      logTable,
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log('wrote', process.argv[2], buf.length, 'bytes');
});
