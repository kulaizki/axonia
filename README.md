# cs-neuro 

An interactive web-based viewer for NIfTI neuroimaging files (`.nii`, `.nii.gz`, `.mgh`, `.mgz`), built using SvelteKit, NiiVue.js, and Tailwind CSS.

## Features

* **Load Local Files:** Upload NIfTI files (`.nii`, `.nii.gz`, `.mgh`, `.mgz`) using the file input button.
* **Multiple View Modes:** Switch between Axial, Coronal, Sagittal, and Multiplanar views.
    * Defaults to **Multiplanar** view on load.
* **Colormap Selection:** Choose from a variety of standard medical imaging colormaps.
    * Defaults to **Inferno** colormap on load.
* **NiiVue Interaction:** Leverage NiiVue's built-in controls for:
    * Contrast/Brightness adjustment (Left-click + drag)
    * Panning (Right-click + drag)
    * Zooming (Scroll wheel)
    * Slicing (Middle-click + drag or Alt + Left-click + drag)
* **Reset Functionality:** A "Reset View" button to return the view settings to their defaults.
* **Responsive Canvas:** The viewer canvas adapts to available space.
* **Modern UI:** Styled using Tailwind CSS.

## Technologies Used

* [SvelteKit](https://kit.svelte.dev/) / [Svelte](https://svelte.dev/)
* [NiiVue.js](https://niivue.github.io/niivue/)
* [Tailwind CSS](https://tailwindcss.com/)
* [TypeScript](https://www.typescriptlang.org/)

## Prerequisites

* [Node.js](https://nodejs.org/) (Version 18.x or later recommended)
* [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), or [yarn](https://yarnpkg.com/)

## Getting Started

1.  **Clone the repository** (if applicable, otherwise integrate the component into your project):
    ```bash
    # git clone https://github.com/kulaizki/cs-neuro.git
    # cd cs-neuro
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # pnpm install
    # or
    # yarn install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # pnpm dev
    # or
    # yarn dev
    ```

4.  **Open your browser** to the address provided (usually `http://localhost:5173`).

## Usage

1.  Click the "Choose File" button to select a compatible neuroimaging file (`.nii`, `.nii.gz`, `.mgh`, `.mgz`).
2.  The file will load and display in the viewer, defaulting to the Multiplanar view and Inferno colormap.
3.  Use the "View" dropdown to change the slice orientation (Axial, Coronal, Sagittal, Multiplanar).
4.  Use the "Colormap" dropdown to change the color scheme applied to the image.
5.  Interact with the image canvas using your mouse as described in the "Interaction Guide" section below the viewer.
6.  Click the "Reset View" button to reset zoom, pan, contrast, and view settings to defaults (will also re-apply default view and colormap).

## Configuration

The default settings and available options can be adjusted within the component's `<script>` section:

* **Default View:** Change the initial value of the `sliceType` variable (e.g., `0` for Axial, `3` for Multiplanar).
* **Default Colormap:** Change the initial value of the `selectedColormap` variable (e.g., `'grayscale'`).
* **Available Colormaps:** Modify the `availableColormaps` array to add or remove options from the dropdown.