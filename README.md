# HenryTomz Foodstuff Hub

A lightweight, single-page storefront for HenryTomz Foodstuff Hub in Gonin Gora, Kaduna. The page presents grains, legumes, spices, and other raw foodstuff, lets customers build a basket, and sends the order request to WhatsApp for confirmation.

## At A Glance

- **Application type:** Static HTML storefront
- **Entry point:** [`index.html`](index.html), with [`styles.css`](styles.css), [`app.js`](app.js) and an `images/` folder
- **Runtime:** A modern web browser with JavaScript enabled
- **Build system:** None
- **Backend:** None
- **Order channel:** WhatsApp
- **Price source:** Embedded fallback prices, with optional live updates from a published Google Sheets CSV
- **Location:** Gonin Gora, Kaduna State, Nigeria

The project intentionally has no framework, package manager, database, authentication system, payment processor, or server-side order service. It can be hosted on any static web host or opened locally in a browser.

## Customer Experience

The page includes:

- Responsive navigation with mobile menu support
- Hero section with direct WhatsApp contact
- Market board with product cards, quantity controls, and estimated prices
- Basket with total calculation and a remove button on every line. It is saved on the customer's phone for 7 days, so a refresh does not empty it
- WhatsApp order message generation
- Delivery coverage for Kaduna and nationwide bulk shipping
- About section with an automatic product and shop photo gallery
- Customer testimonials with a motion marquee
- Contact details, social links, business address, and opening hours
- Reduced-motion support for visitors who request it in their browser settings

### Ordering Flow

1. A customer selects quantities on the market board.
2. The customer adds selected quantities to the basket.
3. The page calculates an estimated total using the prices currently loaded in the browser.
4. The customer selects **Order on WhatsApp**.
5. WhatsApp opens with a pre-filled order containing product names, local names, quantities, units, and the estimated total.
6. HenryTomz confirms availability, final pricing, delivery details, and payment directly with the customer.

Prices shown on the page are estimates. The WhatsApp message explicitly asks the business to confirm price, availability, and delivery before fulfillment.

## Running Locally

Because the project is static, no dependency installation is required.

### Option 1: Open Directly

Open [`index.html`](index.html) in a browser. The page will render locally, although live Google Sheets pricing and some external resources may be restricted by browser security rules when using a `file://` URL.

### Option 2: Use A Local HTTP Server

A local server provides the most reliable development environment:

```bash
cd /path/to/Grains
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Stop the server with `Ctrl+C`.

## Project Structure

```text
Grains/
├── index.html              # Page markup, meta tags and structured data
├── styles.css              # All styles
├── app.js                  # Products, live prices, basket and WhatsApp order link
├── images/
│   ├── products/           # One photo per product on the market board
│   ├── gallery/            # Photos in the About section slideshow
│   ├── og-image.jpg        # 1200x630 preview shown when the link is shared
│   └── favicon-*.png, apple-touch-icon.png
├── .prettierrc.json        # Formatting rules
├── README.md               # Project overview and developer documentation
└── docs/
    └── MAINTENANCE.md      # Business-owner and maintainer runbook
```

Images are separate files so the page can render before they download, and the browser can cache them. Product and gallery photos are WebP, 340-380 px wide.

## Catalog And Fallback Prices

The fallback catalog is defined in the `PRODUCTS` array near the top of [`app.js`](app.js). These values are used immediately on page load and remain available if the live price sheet cannot be reached.

| ID | Product | Local name | Unit | Fallback price |
| --- | --- | --- | --- | ---: |
| `millet` | Millet | Gero | mudu | ₦1,200 |
| `sorghum` | Guinea Corn | Dawa | mudu | ₦1,100 |
| `maize` | Maize | Masara | mudu | ₦1,000 |
| `rice` | Local Rice | Shinkafa | derica | ₦1,500 |
| `beans` | Brown Beans | Wake | mudu | ₦1,800 |
| `groundnut` | Groundnut | Gyada | derica | ₦1,600 |
| `soybean` | Soybean | Waken Soya | mudu | ₦1,300 |
| `pepper` | Dried Pepper | Barkono | kg | ₦3,500 |
| `crayfish` | Crayfish | Kifi | kg | ₦6,500 |
| `egusi` | Melon Seed | Gushi | derica | ₦2,200 |
| `ginger` | Dried Ginger | Citta | kg | ₦4,200 |
| `yam` | Yam Tuber | Doya | each | ₦1,200 |

Prices, stock, delivery fees, and final totals are not guaranteed by the frontend. They must be confirmed manually before an order is accepted.

## Live Pricing

Live pricing is enabled through `LIVE_PRICE_SHEET_URL` in [`app.js`](app.js). The page fetches the published CSV immediately on load and then every five minutes while the page remains open.

The CSV must include these required columns:

```csv
id,price
millet,1200
sorghum,1100
maize,1000
```

The following columns are also supported:

```text
local,name,unit,c1,c2,img
```

The `id` value must be lowercase and match an existing product ID. Additional IDs create new product cards with sensible defaults, but new rows should be reviewed before publication.

For the complete publishing procedure, spreadsheet guidance, contact settings, and operational checks, see [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md).

## Contact Configuration

The current customer-facing contact details are:

- WhatsApp: `0813 132 7023`
- Secondary phone: `0813 431 0263`
- Email: `orders@henrytomz.ng`
- Instagram: `https://instagram.com/HenryTomz`
- Facebook: `https://facebook.com/HenryTomz`
- Address: Gonin Gora, Kaduna, Kaduna State, Nigeria
- Hours: Monday to Saturday, 7:00am to 6:00pm

The primary WhatsApp number is set once, as `WHATSAPP_NUMBER` in [`app.js`](app.js). The basket order button and every `wa.me` link marked `data-wa` in `index.html` use it. The two `tel:` links in the footer and the visible phone text are plain HTML, and so are the number in the structured data (`telephone`) and the `wa.me` fallback `href`s, so search for `2348131327023` and `0813 132 7023` when you change it, then test the hero link and the basket order button.

## Deployment

This project works with static hosting providers such as GitHub Pages, Netlify, Vercel static hosting, Cloudflare Pages, or a conventional web server.

Deployment requirements:

- Publish `index.html`, `styles.css`, `app.js` and the `images/` folder together at the site root.
- Ensure JavaScript is served without modification.
- Use HTTPS in production so external fonts, Google Sheets, and WhatsApp links work consistently.
- Confirm that the published Google Sheet remains publicly accessible as CSV.
- Test the live site on a phone before sharing it with customers.

No server-side environment variables or build commands are required.

## Verification Checklist

Before publishing a change:

- Open the page on desktop and mobile widths.
- Confirm that all product cards render and prices are readable.
- Add several products, verify quantities and the estimated total, refresh the page and confirm the basket is still there, remove one item, then clear the basket.
- Paste the site link into a WhatsApp chat and confirm the preview image and title appear.
- Confirm that the WhatsApp button is disabled when the basket is empty.
- Place a test order and verify the recipient number and generated message.
- Confirm the Google Sheet CSV loads and that a changed price appears after refresh.
- Check navigation, footer links, email, phone links, and social links.
- Test with reduced motion enabled.
- Review browser developer-console warnings, especially failed image, font, and sheet requests.
- Confirm that the final price and availability are manually verified before fulfillment.

## Known Limitations

- The basket is saved only in the customer's own browser (`localStorage`, quantities only, 7 days). It does not follow them to another phone, and it is lost if they clear site data or use a private window.
- There is no customer address form, payment flow, stock validation, delivery-fee calculation, order history, analytics, or order-status tracking.
- The frontend does not create a server-side order record.
- The live-price parser supports simple comma-separated rows and does not support quoted CSV fields containing commas.
- Live pricing depends on network access, a correctly published sheet, and browser CORS behavior.
- Values from the live sheet are cleaned before use (ids, text length, hex colours, and `https:` or local image paths only) and escaped when drawn, but only trusted people should have edit access to the published sheet.
- A sheet row for a product that is not in `PRODUCTS` is ignored unless it has a valid price.

## License And Ownership

No license file is currently included. Treat the page, brand content, images, and customer-facing copy as proprietary project material unless the project owner explicitly states otherwise.

## Formatting

Run Prettier before committing. It needs no project install:

```bash
npx prettier --write index.html styles.css app.js
```
