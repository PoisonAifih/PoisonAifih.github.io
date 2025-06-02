function updateDateTime() {
    const now = new Date();
    const dateEl = document.querySelector('.current-date');
    const timeEl = document.querySelector('.current-time');
    
    const date = now.toISOString().split('T')[0];
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    
    dateEl.textContent = date;
    timeEl.textContent = `${hours}:${minutes}:${seconds}`;
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('../Global/Dashboard.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('dashboard-container').innerHTML = html;
            return fetch('../Global/Side.html');
        })
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
            setTimeout(() => utils.setupSidebarToggle(), 100); 
        })
        .catch(error => {
            console.error('Error loading components:', error);
        });
});
