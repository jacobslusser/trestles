(function (trestles) {
    'use strict';

    var host = document.getElementById('progress-bar');
    var progressBar;

    trestles.progress = function (percent) {
        if (!progressBar) {
            // Create a new progress bar
            progressBar = document.createElement('div');
            host.appendChild(progressBar);
            progressBar.offsetHeight; // Force reflow
        }

        // Move the progress bar
        percent = (percent < 0 ? 0 : (percent > 100 ? 100 : percent));
        progressBar.style.width = percent + '%';

        // Remove the progress bar.
        // A new one will be created next time.
        if (percent === 100) {
            setTimeout(function () {
                progressBar.style.height = '0';
                var el = progressBar;
                progressBar = undefined;
                setTimeout(function () {
                    host.removeChild(el);
                }, 300); // Must match CSS height transition
            }, 200); // Must match CSS width transition
        }
    }

} (window.trestles = window.trestles || {}));
