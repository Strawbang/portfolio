# Djamel Bougouffa's Portfolio | Full-Stack Software Engineer

A professional bilingual portfolio (English/French) built with Astro, optimized for SEO and interpretation by AI like ChatGPT.

## ✨ Features

- **Responsive design** adapted to all devices
- **Bilingual site** with English and French versions
- **SEO optimization** with metadata and Schema.org structured data
- **High performance** with optimized images and fonts
- **Project showcase** with detailed descriptions
- **About page** with professional background and skills
- **Articles page** for sharing technical knowledge

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npx ts-node optimize-images.ts` | Optimize images to WebP and AVIF formats  |

## 🛠️ Technologies Used

- [Astro](https://astro.build/) - High-performance web framework
- [astro-seo-schema](https://www.npmjs.com/package/astro-seo-schema) - Schema.org structured data integration
- HTML/CSS - Structure and styling
- TypeScript - Logic and typing
- Markdown - Project and article content
- Sharp - Image optimization library

## 🔍 SEO and AI Optimization

This portfolio is optimized for search engines and AI like ChatGPT through:

- Complete metadata (title, description) on all pages
- Schema.org structured data for better interpretation
- Semantic content structure
- Consistency between English and French versions
- Alternative text for images
- Optimized image loading with WebP and AVIF formats
- Non-blocking font loading

## ⚡ Performance Optimizations

The portfolio includes several performance optimizations:

- **Image optimization**: Conversion of large PNG images to WebP and AVIF formats, reducing file sizes by up to 98%
- **Responsive images**: Using the `<picture>` element to serve the most appropriate image format based on browser support
- **Font loading optimization**: Non-blocking font loading with `media="print"` and `onload="this.media='all'"`
- **Custom components**: Reusable `OptimizedImage` component for consistent image optimization across the site
- **Appropriate image sizing**: Automatic resizing of images to appropriate dimensions for web display

## 🌐 Deployment

The site is deployed on [Netlify](https://www.netlify.com/) and accessible at [https://djamel-bougouffa.com/](https://djamel-bougouffa.com/).

## 📝 License

This project is based on Astro's portfolio template, modified and customized for my needs.

---

*This README was last updated on March 23, 2025.*
