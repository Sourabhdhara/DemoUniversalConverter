class FileConverter {
    constructor() {
        this.files = [];
        this.initializeEventListeners();
        this.apiKey = 'YOUR_CLOUDCONVERT_API_KEY'; // Replace with your API key
    }

    initializeEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const convertBtn = document.getElementById('convertBtn');

        // File upload events
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        convertBtn.addEventListener('click', this.convertFiles.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    processFiles(files) {
        this.files = files;
        this.updateUI();
        this.detectOptimalFormat(files[0]);
    }

    updateUI() {
        const conversionOptions = document.getElementById('conversionOptions');
        const uploadArea = document.getElementById('uploadArea');
        
        if (this.files.length > 0) {
            conversionOptions.style.display = 'block';
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: #28a745;"></i>
                <h3>${this.files.length} file(s) selected</h3>
                <p>${this.files.map(f => f.name).join(', ')}</p>
            `;
        }
    }

    detectOptimalFormat(file) {
        const fileType = file.type;
        const outputFormat = document.getElementById('outputFormat');
        
        // Auto-suggest optimal conversion based on file type
        if (fileType.startsWith('video/')) {
            outputFormat.value = 'mp4';
        } else if (fileType.startsWith('audio/')) {
            outputFormat.value = 'mp3';
        } else if (fileType.startsWith('image/')) {
            outputFormat.value = 'jpg';
        } else {
            outputFormat.value = 'pdf';
        }
    }

    async convertFiles() {
        if (this.files.length === 0) return;

        const convertBtn = document.getElementById('convertBtn');
        const progressSection = document.getElementById('progressSection');
        const resultsSection = document.getElementById('resultsSection');
        
        convertBtn.disabled = true;
        progressSection.style.display = 'block';
        resultsSection.style.display = 'none';

        try {
            // Simulate conversion process (replace with actual CloudConvert API calls)
            await this.simulateConversion();
            
            // Show results
            this.showResults();
            
        } catch (error) {
            console.error('Conversion failed:', error);
            alert('Conversion failed. Please try again.');
        } finally {
            convertBtn.disabled = false;
        }
    }

    async simulateConversion() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const steps = [
            'Uploading files...',
            'Processing conversion...',
            'Optimizing quality...',
            'Finalizing output...'
        ];
        
        for (let i = 0; i < steps.length; i++) {
            progressText.textContent = steps[i];
            progressFill.style.width = `${((i + 1) / steps.length) * 100}%`;
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    showResults() {
        const resultsSection = document.getElementById('resultsSection');
        const downloadLinks = document.getElementById('downloadLinks');
        const outputFormat = document.getElementById('outputFormat').value;
        
        downloadLinks.innerHTML = '';
        
        this.files.forEach((file, index) => {
            const downloadItem = document.createElement('div');
            downloadItem.className = 'download-item';
            
            const fileName = file.name.split('.')[0] + '.' + outputFormat;
            
            downloadItem.innerHTML = `
                <div>
                    <strong>${fileName}</strong>
                    <br>
                    <small>Converted from ${file.name}</small>
                </div>
                <a href="#" class="download-btn" onclick="alert('This is a demo. Integrate CloudConvert API for actual conversion.')">
                    <i class="fas fa-download"></i> Download
                </a>
            `;
            
            downloadLinks.appendChild(downloadItem);
        });
        
        resultsSection.style.display = 'block';
    }

    // Real CloudConvert API integration (uncomment and configure)
    /*
    async convertWithCloudConvert(file, outputFormat) {
        const response = await fetch('https://api.cloudconvert.com/v2/jobs', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tasks: {
                    'import-file': {
                        operation: 'import/upload'
                    },
                    'convert-file': {
                        operation: 'convert',
                        input: 'import-file',
                        output_format: outputFormat
                    },
                    'export-file': {
                        operation: 'export/url',
                        input: 'convert-file'
                    }
                }
            })
        });
        
        return await response.json();
    }
    */
}

// Initialize the converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FileConverter();
});
