# Maintenance Runbook

This guide is for the HenryTomz Foodstuff Hub business owner, content editor, and developer responsible for keeping the storefront accurate.

## Daily Operating Principle

The website is a product catalogue and order-request tool, not an inventory or payment system. Every displayed price is an estimate. Confirm the product, quantity, availability, delivery cost, and final price in WhatsApp before accepting an order.

## Updating Prices From A Phone

The recommended workflow is to maintain prices in the published Google Sheet rather than editing the HTML for every market change.

1. Open the Google Sheet used by the page.
2. Keep one header row with at least `id` and `price`.
3. Use the existing product IDs exactly as written below.
4. Enter prices as numbers without the naira symbol or thousands separators.
5. Save the sheet.
6. Confirm that the sheet is still published to the web as **Comma-separated values (.csv)**.
7. Open the website in a fresh browser tab and verify the updated prices.

The page checks the sheet immediately on load and repeats the check every five minutes for visitors who leave the page open.

### Product IDs

```text
millet
sorghum
maize
rice
beans
groundnut
soybean
pepper
crayfish
egusi
ginger
yam
```

### Optional Sheet Columns

The sheet may also contain:

```text
local,name,unit,c1,c2,img
```

- `local`: local or Hausa product name shown above the English name
- `name`: customer-facing English name
- `unit`: selling unit, such as `mudu`, `derica`, `kg`, or `each`
- `c1` and `c2`: fallback gradient colors in CSS hex format
- `img`: image URL; Google Drive file URLs are normalized automatically

Keep the sheet simple. The built-in parser is intentionally small and does not handle commas inside quoted CSV values.

## When To Edit The HTML

Edit [`index.html`](../index.html) when changing:

- Brand name, story, testimonials, delivery locations, or page copy
- Fallback catalog entries
- Phone numbers, WhatsApp links, email, address, or opening hours
- The live pricing sheet URL or refresh interval
- Embedded product or gallery images
- Layout, accessibility, responsive behavior, or animations

The customization instructions are also included beside the JavaScript configuration in the file.

### Changing The Primary WhatsApp Number

The primary number is currently `2348131327023` in international format and `0813 132 7023` in display format.

Search the entire file for both forms before publishing. Update:

- The hero WhatsApp link
- The CTA banner WhatsApp link
- The footer WhatsApp link
- The `buildWhatsAppLink()` function
- The visible phone text, if the display number changes

Afterward, place a test order from the basket and confirm that WhatsApp opens the correct recipient.

### Changing Fallback Prices

Find the `PRODUCTS` array near the bottom of the file and update the relevant `price` and `unit` fields. Keep each `id` stable when possible, because the live sheet and basket use that ID to identify the product.

A product entry follows this shape:

```js
{
  id: 'millet',
  local: 'Gero',
  name: 'Millet',
  unit: 'mudu',
  price: 1200,
  c1: '#E9C468',
  c2: '#B9821E',
  img: '...'
}
```

Fallback prices should remain sensible even when live pricing is enabled. They are used when the sheet is blank, unavailable, malformed, or blocked by the browser.

## Publishing A New Version

1. Review the content and configuration changes.
2. Open the page through a local HTTP server:

   ```bash
   python3 -m http.server 8000
   ```

3. Test the customer flow described in the README checklist.
4. Check the browser console for failed resource requests or JavaScript errors.
5. Publish the updated static file through the project’s hosting provider.
6. Test the public URL from a phone using mobile data or another network.
7. Confirm that the live price sheet and WhatsApp order link still work.

There is no build step and no dependency installation step.

## Troubleshooting

### Prices Did Not Update

Check that:

- `LIVE_PRICE_SHEET_URL` is not empty.
- The Google Sheet is published, not merely shared with a private link.
- The published format is CSV.
- The CSV has `id` and `price` headers.
- IDs are lowercase and match the product IDs.
- Prices are positive numeric values.
- The browser can access the sheet over the network.

Refresh the page after checking the sheet. Failed live updates are intentionally quiet and leave the fallback or last successful prices in place.

### The Basket Is Empty After Refresh

This is expected. Basket state is held in browser memory only and is not saved to local storage or a server.

### WhatsApp Does Not Open

Confirm that:

- The visitor has WhatsApp or WhatsApp Web available.
- The primary number is in international format in the generated URL.
- The browser allows a new tab from the button click.
- The basket contains at least one item.

### Images Or Fonts Are Missing

Product and gallery images are embedded in the HTML. If an image supplied by the live sheet is external, confirm that its URL is publicly reachable and can be used in an `<img>` element. Google Fonts require network access; the page falls back to generic families when they are unavailable.

## Security And Content Hygiene

- Only trusted people should edit the published Google Sheet.
- Do not place passwords, API keys, private customer information, or payment credentials in the HTML or spreadsheet.
- Review external image URLs before adding them to the sheet.
- Keep customer testimonials accurate and obtain permission where required.
- Review contact details periodically so customers are not sent to an outdated number or address.

## Future Improvements

The next meaningful product improvements would be a small backend or managed form for order capture, a validated inventory source, persistent basket state, delivery-fee rules, payment integration, and proper CSV parsing. These are intentionally outside the current static-site scope.
