import puppeteer from 'puppeteer';
import { logger } from '../config/winston-config.js';

let browserInstance = null;

/**
 * Gets or initializes a singleton Puppeteer browser instance
 */
const getBrowser = async () => {
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }

  try {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
    });

    browserInstance.on('disconnected', () => {
      logger.warn('Puppeteer browser disconnected. Will recreate on next request.');
      browserInstance = null;
    });

    return browserInstance;
  } catch (err) {
    logger.error(`Failed to launch Puppeteer: ${err.message}`);
    throw err;
  }
};

/**
 * Generates an A4 PDF Buffer from HTML content
 * @param {string} html 
 * @returns {Promise<Buffer>}
 */
export const generatePdfFromHtml = async (html) => {
  const browser = await getBrowser();
  let page = null;

  try {
    page = await browser.newPage();

    // Set A4 viewport
    await page.setViewport({
      width: 794, // 96 DPI A4 width in px
      height: 1123, // 96 DPI A4 height in px
      deviceScaleFactor: 2, // High resolution rendering
    });

    // Set page content and wait for web fonts and styles to load
    await page.setContent(html, {
      waitUntil: ['domcontentloaded', 'networkidle2'],
      timeout: 30000,
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '12mm',
        right: '14mm',
        bottom: '12mm',
        left: '14mm',
      },
    });

    return Buffer.from(pdfBuffer);
  } catch (err) {
    logger.error(`PDF generation failed: ${err.message}`);
    throw err;
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (closeErr) {
        logger.warn(`Error closing page: ${closeErr.message}`);
      }
    }
  }
};
