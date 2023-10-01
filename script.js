const searchInput = document.getElementById('search-input');
const pasteButton = document.getElementById('openBackCameraButton');
const contentElements = document.querySelectorAll('.wordToCopy');
const resultCount = document.getElementById('result-count');
const prevButton = document.getElementById('copyButton');
const nextButton = document.getElementById('extractButton');

let currentSearchTerm = '';
let currentResultIndex = -1;
const highlightedMatches = [];
searchInput.addEventListener('click', function () {
    // قم بتفريغ قيمة مربع البحث عند النقر داخله
    searchInput.value = '';
	pasteFromClipboard();
});

prevButton.addEventListener('click', scrollToPrevResult);
nextButton.addEventListener('click', scrollToNextResult);

function scrollToPrevResult() {
    if (currentResultIndex > 0) {
        currentResultIndex--;
        scrollToCurrentResult();
    }
}

function scrollToNextResult() {
    if (currentResultIndex < highlightedMatches.length - 1) {
        currentResultIndex++;
        scrollToCurrentResult();
    }
}

function scrollToCurrentResult() {
    const currentMatch = highlightedMatches[currentResultIndex];

    if (currentMatch) {
        currentMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

pasteButton.addEventListener('click', pasteFromClipboard);

searchInput.addEventListener('input', highlightMatches);
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'v') {
	    searchInput.value = '';
        pasteFromClipboard();
    }
});


pasteButton.addEventListener('click', pasteFromClipboard);

searchInput.addEventListener('input', highlightMatches);

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'v') {
	    searchInput.value = '';
        pasteFromClipboard();
    }
});

// تعطيل اختصارات لوحة المفاتيح للنسخ
contentElements.forEach(element => {
    element.addEventListener('copy', function (event) {
        event.preventDefault();
        alert('نسخ النص غير مسموح به.');
    });
});

document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && (event.key === 'c' || event.key === 'C')) {
        // إلغاء عملية النسخ
        event.preventDefault();
        // يمكنك هنا عرض رسالة تنبيه إذا رغبت
    }
});


function pasteFromClipboard() {
    navigator.clipboard.readText().then(function (pastedText) {
        searchInput.value = pastedText;
        highlightMatches();
    });
}

function highlightMatches() {
    let searchTerm = searchInput.value.trim().toLowerCase();
	
	searchTerm = searchTerm.replace(/[أإ]/g, 'ا');
searchTerm = searchTerm.replace(/[.]/g, '');
    // حذف المسافات الزائدة بين الكلمات (أكثر من مسافتين)
    searchTerm = searchTerm.replace(/\s{2,}/g, ' ');
    searchTerm = searchTerm.replace(/[,]/g, ' ');
    searchTerm = searchTerm.replace(/\s{2,}/g, ' ');
    searchTerm = searchTerm.replace(/[ةه]/g, '[هة]');
	searchTerm = searchTerm.replace(/[آا]/g, '[اآ]');


    if (!searchTerm) {
        highlightedMatches.forEach(match => {
            match.style.backgroundColor = 'transparent';
        });
        highlightedMatches.length = 0;
        currentResultIndex = -1;
        resultCount.textContent = '0 نتيجة';
        return;
    }

    highlightedMatches.length = 0;
    currentResultIndex = -1;

    contentElements.forEach((element, index) => {
        const contentText = element.textContent.toLowerCase();
        const regex = new RegExp(searchTerm, 'gi');
        const matches = contentText.match(regex);

        if (matches && matches.length > 0) {
            const markedContent = contentText.replace(regex, (match) => `<mark>${match}</mark>`);
            element.innerHTML = markedContent;
            highlightedMatches.push(element);
        } else {
            element.innerHTML = contentText;
        }
    });

    if (highlightedMatches.length > 0) {
        currentResultIndex = 0;
        scrollToCurrentResult();
    }

    resultCount.textContent = `${currentResultIndex + 1} من ${highlightedMatches.length} نتائج`;
}
