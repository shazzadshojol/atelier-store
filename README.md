# Atelier

A React storefront for a curated collection of everyday objects. The current release includes category filters, product details, search and sorting, saved items, and a shopping bag with quantity controls saved in the browser and synchronized between open tabs. Product content and imagery are sample material; checkout and order processing are planned for a later release.

## Development

Install dependencies with `npm install`, then start the local server with `npm run dev`. Create a production build with `npm run build`.

## Stack

React, Vite, and CSS.

## Catalog

Product data lives in `src/data/catalog.js`. Categories are derived from that catalog so the filter stays in sync with the available products.
