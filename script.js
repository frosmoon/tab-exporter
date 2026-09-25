/*
	Github: https://github.com/frosmoon
	File: script.js
*/
document.getElementById("export").addEventListener("click", () => {
    chrome.tabs.query({
        currentWindow: !0
    }, async function (tabs) {
        if (tabs) {
            let fileContent = "";
            for (const tab of tabs) {
                let url = tab.url;
                fileContent += url + "\n";
            }
            let blob = new Blob([fileContent], { type: "text/plain" });

            let link = document.createElement("a");
            let date = new Date();

            let fileName = "tab_exports_" + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + "-" + date.getTime() + ".txt";
            link.download = fileName;
            link.href = window.URL.createObjectURL(blob);
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
});



let fileInput = document.getElementById("file");
fileInput.addEventListener("change", getFiles);


const json = [
    "chrome://newtab/"
];

// const file = new File([json.join("\n")], "tabexport.json")

// const t = { target: { files: [file] } };
// console.log(t);
// getFiles(t);

function getFiles(e) {
    let files = null;
    if (e.target)
        files = e.target.files;
    else
        files = e.files;
    for (const file of files) {
        const reader = new FileReader();

        //const file = e.target.files[0];
        reader.readAsText(file);

        reader.onload = function (event) {
            const fileContent = event.target.result;
            let inputUrls = fileContent.split('\n');
            showUrlValidationDialog(inputUrls);
        }


        function showUrlValidationDialog(inputUrls) {
            // Process URLs
            const validationResults = inputUrls.map(url => {
                try {
                    const parsed = new URL(url);
                    return { original: url, valid: true, href: parsed.href };
                } catch (error) {
                    return { original: url, valid: false, error: error.message };
                }
            });

            // Separate valid/invalid URLs
            const validUrls = validationResults.filter(r => r.valid);
            const invalidUrls = validationResults.filter(r => !r.valid);

            // Create HTML content for SweetAlert2
            let dialogContent = `
        <div class="url-dialog-container">
            <div class="valid-section">
                <h3 class="section-title">Valid URLs <span class="badge">${validUrls.length}</span></h3>
                <div class="url-list">
    `;

            // Add modern checkboxes for valid URLs
            validUrls.forEach((url, index) => {
                dialogContent += `
            <label class="url-item">
                <div class="checkbox-container">
                    <input type="checkbox" checked data-url="${url.href}" class="modern-checkbox">
                    <span class="checkmark"></span>
                </div>
                <span class="url-text">${url.href}</span>
            </label>
        `;
            });

            dialogContent += `
                </div>
            </div>
    `;

            // Show invalid URLs if any
            if (invalidUrls.length > 0) {
                dialogContent += `
            <div class="invalid-section">
                <h3 class="section-title">Invalid URLs <span class="badge">${invalidUrls.length}</span></h3>
                <ul class="invalid-list">
        `;
                invalidUrls.forEach(url => {
                    dialogContent += `
                <li class="invalid-item">
                    <span class="url-text">${url.original}</span>
                    <span class="error-message">${url.error}</span>
                </li>
            `;
                });
                dialogContent += `
                </ul>
            </div>
        `;
            }

            dialogContent += `</div>`;

            // Show SweetAlert2 dialog
            Swal.fire({
                title: 'URL Validation Results',
                html: dialogContent,
                width: '700px',
                padding: '2rem',
                showCancelButton: true,
                confirmButtonText: 'Open Selected',
                cancelButtonText: 'Cancel',
                focusConfirm: false,
                allowOutsideClick: false,
                backdrop: 'rgba(0,0,0,0.4)',
                customClass: {
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title',
                    actions: 'custom-swal-actions',
                    confirmButton: 'custom-swal-confirm',
                    cancelButton: 'custom-swal-cancel'
                },
                didOpen: () => {
                    // Add custom styling
                    const style = document.createElement('style');
                    style.textContent = `
                .url-dialog-container {
                    max-height: 60vh;
                    overflow-y: auto;
                    padding-right: 8px;
                }
                
                /* Custom scrollbar */
                .url-dialog-container::-webkit-scrollbar {
                    width: 6px;
                }
                .url-dialog-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .url-dialog-container::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                .url-dialog-container::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                
                .section-title {
                    font-size: 1.1rem;
                    color: #333;
                    margin: 0 0 1rem 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .badge {
                    background: #4361ee;
                    color: white;
                    border-radius: 12px;
                    padding: 2px 8px;
                    font-size: 0.8rem;
                    font-weight: normal;
                }
                
                .url-list {
                    max-height: 300px;
                    overflow-y: auto;
                    margin-bottom: 1.5rem;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 8px;
                    background: #f9f9f9;
                }
                
                .url-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    margin: 4px 0;
                    border-radius: 6px;
                    background: white;
                    transition: all 0.2s;
                }
                
                .url-item:hover {
                    background: #f0f4ff;
                    transform: translateX(2px);
                }
                
                .checkbox-container {
                    position: relative;
                    margin-right: 12px;
                    cursor: pointer;
                }
                
                .modern-checkbox {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }
                
                .checkmark {
                    position: relative;
                    height: 20px;
                    width: 20px;
                    background-color: white;
                    border: 2px solid red;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                
                .checkbox-container:hover .modern-checkbox ~ .checkmark {
                    background-color: #f0f4ff;
                }
                
                .modern-checkbox:checked ~ .checkmark {
                    background-color: red;
                    border-color: red;
                }
                
                .checkmark:after {
                    content: "";
                    position: absolute;
                    display: none;
                    left: 6px;
                    top: 2px;
                    width: 5px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }
                
                .modern-checkbox:checked ~ .checkmark:after {
                    display: block;
                }
                
                .url-text {
                    flex: 1;
                    font-family: 'SF Mono', 'Roboto Mono', monospace;
                    font-size: 0.9rem;
                    color: #333;
                    word-break: break-all;
                }
                
                .invalid-section {
                    margin-top: 1.5rem;
                }
                
                .invalid-list {
                    padding: 0;
                    margin: 0;
                    list-style: none;
                    border: 1px solid #ffebee;
                    border-radius: 8px;
                    background: #fff5f5;
                    padding: 8px;
                }
                
                .invalid-item {
                    padding: 12px;
                    margin: 4px 0;
                    border-radius: 6px;
                    background: white;
                    display: flex;
                    flex-direction: column;
                }
                
                .invalid-item .url-text {
                    color: #d32f2f;
                    font-weight: 500;
                }
                
                .error-message {
                    font-size: 0.8rem;
                    color: #666;
                    margin-top: 4px;
                    font-style: italic;
                }
                
                /* SweetAlert custom classes */
                .custom-swal-popup {
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                }
                
                .custom-swal-title {
                    font-size: 1.5rem;
                    color: #333;
                    margin-bottom: 1.5rem;
                }
                
                .custom-swal-actions {
                    margin-top: 1.5rem;
                    gap: 12px;
                }
                
                .custom-swal-confirm {
                    background: #4361ee;
                    border-radius: 6px;
                    padding: 10px 24px;
                }
                
                .custom-swal-cancel {
                    background: #f0f0f0;
                    color: #333;
                    border-radius: 6px;
                    padding: 10px 24px;
                }
            `;
                    Swal.getPopup().appendChild(style);
                }
            }).then(result => {
                if (result.isConfirmed) {
                    const checkboxes = Swal.getPopup().querySelectorAll('.modern-checkbox:checked');
                    const selectedUrls = Array.from(checkboxes).map(checkbox => checkbox.dataset.url);

                    console.log('Selected URLs to open:', selectedUrls);

                    // Uncomment to open URLs in new tabs
                    //selectedUrls.forEach(url => {
                    //    window.open(url, '_blank', 'noopener');
                    //});

			chrome.runtime.sendMessage({urls: selectedUrls}); // Sends a message with the list of URLs
                }
            });
        }
    }
};



const dropContainer = document.getElementById("dropcontainer")
const dropText = document.getElementById("drop-text");
const defaultText = dropText.innerText;
dropContainer.addEventListener("dragover", (e) => {
    dropText.innerText = "Drop these file";
    e.preventDefault()
}, false)

dropContainer.addEventListener("dragenter", () => {
    dropContainer.classList.add("drag-active")
    dropText.innerText = "Drop these file";
})

dropContainer.addEventListener("dragleave", () => {
    dropContainer.classList.remove("drag-active")
    dropText.innerText = defaultText;
})

dropContainer.addEventListener("drop", (e) => {
    e.preventDefault()
    dropText.innerText = "Dropped.";
    dropContainer.classList.remove("drag-active")
    fileInput.files = e.dataTransfer.files
    getFiles(fileInput);
})
