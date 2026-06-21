# Guinness Nitrogen Surge — WebGL Animation Guide

I have recreated the iconic Guinness nitrogen surge animation as a lightweight, embeddable WebGL shader. This approach gives you a perfectly smooth, infinitely generating animation without the heavy bandwidth, loading times, or copyright issues associated with video files.

The animation runs entirely on the GPU, producing the turbulent, organic cascade of nitrogen bubbles over the dark stout body, matching the aesthetic of the Guinness Cinema Surge Experience.

## The Code File

The attached `guinness-surge.html` file contains everything you need: HTML structure, CSS, and the WebGL JavaScript. You can open this file directly in any browser to preview the animation.

## How to Embed in Your Web Builder

Because this is a pure HTML/Canvas/JS solution, it can be embedded into almost any modern web builder (Webflow, Squarespace, Wix, WordPress, or custom code).

### Method 1: Full-Page Background (Simplest)

If you want this to sit behind your entire page:

1. Copy the entire contents of the `<script>` tag from the file.
2. In your web builder, add a **Custom Code** or **Embed** block just before the closing `</body>` tag.
3. Paste the `<script>` block there.
4. Add the `<canvas id="surge"></canvas>` element as the very first item inside your `<body>`.
5. Add this CSS to your site's global stylesheet or head:
   ```css
   canvas#surge {
     display: block;
     width: 100vw;
     height: 100vh;
     position: fixed;
     top: 0;
     left: 0;
     z-index: -1; /* Pushes it behind all other content */
     pointer-events: none; /* Allows clicks to pass through to your content */
   }
   ```

### Method 2: Section / Hero Background

If you only want the animation in a specific section (e.g., the top hero section):

1. Create a section/container in your builder and give it a class like `.hero-section`.
2. Set the CSS for `.hero-section` to `position: relative; overflow: hidden;`.
3. Add a Custom Code/HTML embed block *inside* that section, and paste:
   ```html
   <canvas id="surge" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;"></canvas>
   ```
4. Ensure the content *inside* that section (text, buttons) has `position: relative; z-index: 1;` so it sits on top of the canvas.
5. Paste the `<script>` block from the file anywhere on the page (usually best placed at the bottom before `</body>`).

## Customising the Animation

The animation is highly customisable via the JavaScript code. If you open the `<script>` block, you can adjust the following parameters:

### 1. Speed
Find this line inside the `main()` function of the fragment shader:
```glsl
float t = u_time * 0.09;
```
* **To slow down:** Change `0.09` to `0.05`
* **To speed up:** Change `0.09` to `0.15`

### 2. Foam Position / Size
Find this line:
```glsl
float foamFloor = 0.32 + (bNoise - 0.5) * 0.40;
```
* **More foam (lower floor):** Change `0.32` to `0.50`
* **Less foam (higher floor):** Change `0.32` to `0.20`

### 3. Colour Palette
The colours are defined in the `guinnessPalette` function. You can tweak the RGB values (which are normalised from 0.0 to 1.0) to adjust the tones:
```glsl
vec3 c0 = vec3(0.000, 0.000, 0.000);   // void black
vec3 c1 = vec3(0.035, 0.008, 0.002);   // near-black
// ...
vec3 c8 = vec3(0.950, 0.870, 0.640);   // ivory cream peak
```

## Performance Notes

* **GPU Accelerated:** The complex noise calculations run on the user's graphics card, ensuring a smooth 60fps on modern devices.
* **Graceful Fallback:** If a user's browser does not support WebGL, the script automatically applies a CSS linear gradient that mimics the Guinness colour palette, ensuring the site never breaks.
* **Responsive:** The canvas automatically resizes to fit its container and handles device pixel ratios (Retina/High-DPI screens) cleanly.
