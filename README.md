# StyleAI Pro

High-end AI fashion studio. Professional persona transformation and virtual try-on with physical accuracy.

## Overview

StyleAI Pro is a professional-grade fashion AI suite that allows users to generate high-fidelity studio portraits and virtually fit garments onto models. Powered by the Google Gemini API, it provides hyper-realistic fabric physics, lighting, and texture preservation.

## Key Features

- **Persona Studio**: Convert standard casual photos into professional studio-grade fashion portraits.
- **Fit Studio**: Seamlessly integrate brand garments onto AI models with realistic drape and physics.
- **Dynamic Posing**: Generate multiple pose variations for the same model and outfit.
- **High-Resolution Exports**: Optimized for e-commerce and professional lookbook production.

## Technology Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Engine**: Google Gemini API (`gemini-2.5-flash-image`)

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Set your `API_KEY` in your environment. For local development, you can set this in your shell or use your preferred environment management tool. For production, set this in your deployment platform's dashboard (e.g., Cloudflare Pages, Netlify).

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## Deployment

This project is optimized for **Cloudflare Pages**.

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Ensure the `API_KEY` variable is added in the Cloudflare dashboard under `Settings > Environment variables`.

## License

Apache-2.0