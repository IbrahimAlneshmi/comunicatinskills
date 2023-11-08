
pasteButton.addEventListener('click', pasteFromClipboard);

searchInput.addEventListener('input', highlightMatches);
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'v') {
		//event.preventDefault();

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
	    alert('نسخ النص غير مسموح به.');        // يمكنك هنا عرض رسالة تنبيه إذا رغبت
    }
});

