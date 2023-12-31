async function fetchFiles() {
    const fullUrl = document.getElementById('repoUrl').value;

    const match = fullUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
    if (!match || match.length < 3) {
        alert('Invalid GitHub repo URL.');
        return;
    }

    const owner = match[1];
    const repo = match[2];
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (Array.isArray(data)) {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = ''; // Clear previous files

            data.forEach(file => {
                if (file.type === 'file') {
                    const downloadButton = `<button onclick="downloadFile('${file.download_url}', '${file.name}')">${file.name}</button><br>`;
                    fileList.innerHTML += downloadButton;
                }
            });
        } else {
            alert('No files found in the given GitHub repo.');
        }
    } catch (error) {
        alert('Error fetching data:', error);
    }
}

function downloadFile(url, name) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = name;
            link.click();
        })
        .catch(error => {
            alert('Error downloading file:', error);
        });
}
