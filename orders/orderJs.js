document.addEventListener('DOMContentLoaded', function() {
    fetch('../Global/DashboardBb.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('dashboard-container').innerHTML = html;
            return fetch('../Global/SideBb.html');
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