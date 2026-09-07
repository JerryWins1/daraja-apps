# BB Bracelet Builders — Order Form

`BB-Bracelet-Builders-Order-Form.docx` is the printable order form. Open it in
Word (or Google Docs) and edit anything — it's a plain Word document, no macros.

**Page 1 — Custom Order Form**
- Customer & order details (name, contact, theme, wrist size, dates, pickup/delivery)
- Bracelet parts table: type of part, color/description, qty, price each, line total
- Total number of parts + parts subtotal
- Totals: parts subtotal, building fee, discount, total due
- Payment method, order status, notes

**Page 2 — Price List & Order Log**
- Fill in your prices once, then copy them onto each order
- A 14-row log to track orders, parts counts, amounts and payment

## Regenerating the file

```bash
npm install docx
node build-order-form.js BB-Bracelet-Builders-Order-Form.docx
```

Set `FORM_FONT=Arial` to build a copy in Arial (used to check the form still
fits on one Letter page, since Arial is wider than Calibri).
