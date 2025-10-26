// template.js — page hides until our  includes are ready

function includeTemplates(callback) {
    const includes = document.querySelectorAll('[data-include]');
    const total = includes.length;
    let loaded = 0;

    if (total === 0) {
        showPage();
        if (callback) callback();
        return;
    }

    includes.forEach(el => {
        const path = el.getAttribute('data-include');
        if (!path) return;

        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    el.innerHTML = xhr.responseText;
                } else {
                    el.innerHTML = `<div class="include-error"> Failed to load ${path}, CodeCrafter check your path</div>`;
                    console.error('CodeCrafter, we are unable to load', path, xhr.status);
                }

                loaded++;
                if (loaded === total) {
                    // All includes are ready
                    showPage();
                    if (callback) callback();
                }
            }
        };
        xhr.send();
    });
}

// Hide the body and show loader initially
document.addEventListener('DOMContentLoaded', function () {
    document.body.style.visibility = 'hidden';

    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
    <div class="loader-wrapper">
      <div class="spinner"></div>
      <p style="text-align: center; margin-top: 10px;">Loading Trendify...</p>
    </div>
  `;
    document.body.parentElement.appendChild(loader);

    includeTemplates();
});

function showPage() {
    const loader = document.getElementById('page-loader');
    if (loader) loader.remove();

    document.body.style.visibility = 'visible';
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
}
