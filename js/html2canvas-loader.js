(function () {
  let html2canvasPromise = null;
  const SRC = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';

  window.loadHtml2canvas = function () {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (html2canvasPromise) return html2canvasPromise;

    html2canvasPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-html2canvas-loader="1"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.html2canvas), { once: true });
        existing.addEventListener('error', () => reject(new Error('html2canvas failed to load')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = SRC;
      script.async = true;
      script.dataset.html2canvasLoader = '1';
      script.onload = () => resolve(window.html2canvas);
      script.onerror = () => {
        html2canvasPromise = null;
        reject(new Error('html2canvas failed to load'));
      };
      document.head.appendChild(script);
    });

    return html2canvasPromise;
  };
})();
