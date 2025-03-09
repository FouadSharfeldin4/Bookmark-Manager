var nameInpt = document.getElementById("name");
var urlInpt = document.getElementById("url");
var addBtn = document.getElementById("addBtn");
var tableBody = document.getElementById("tablebody");
var searchInput = document.getElementById("searchInput");
var bookmarkForm = document.getElementById("bookmarkForm"); 

var bookmarks = []; 
var currentIndex = -1;

function validateForm() {
    var siteName = nameInpt.value.trim();
    var siteUrl = urlInpt.value.trim();
    
    if (siteName === "" || siteName.length < 3) {
        alert("اسم الموقع يجب أن يكون 3 حروف على الأقل");
        return false;
    }
    
    if (siteUrl === "") {
        alert("برجاء إدخال رابط الموقع");
        return false;
    }
    
    if (!siteUrl.includes(".")) {
        alert("برجاء إدخال رابط صحيح");
        return false;
    }
    
    if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
        siteUrl = "https://" + siteUrl;
        urlInpt.value = siteUrl;
    }
    
    return true;
}

function loadBookmarks() {
    if (localStorage.getItem("bookmarks") === null) {
        bookmarks = [];
    } else {
        bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    }
    displayBookmarks(bookmarks);
}

loadBookmarks();

bookmarkForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    var siteName = nameInpt.value.trim();
    var siteUrl = urlInpt.value.trim();

    if (currentIndex === -1) {
        var bookMark = { 
            siteName: siteName,
            siteUrl: siteUrl,
        };
        bookmarks.push(bookMark);
    } else {
        var bookMark = { 
            siteName: siteName,
            siteUrl: siteUrl,
        };
        bookmarks.splice(currentIndex, 0, bookMark);
        currentIndex = -1;
        addBtn.textContent = "Submit";
    }
    
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks(bookmarks);
    nameInpt.value = ""; 
    urlInpt.value = "";
});

function displayBookmarks(bookmarksToShow) {
    var marks = "";
    if (!bookmarksToShow || bookmarksToShow.length === 0) {
        marks = '<tr><td colspan="3" class="text-center">لا توجد مواقع</td></tr>';
    } else {
        for (var i = 0; i < bookmarksToShow.length; i++) {
            var currentIndex = bookmarks.findIndex(b => 
                b.siteName === bookmarksToShow[i].siteName && 
                b.siteUrl === bookmarksToShow[i].siteUrl
            );
            marks += `<tr>
                        <td>${bookmarksToShow[i].siteName}</td>
                        <td><a href="${bookmarksToShow[i].siteUrl}" target="_blank">${bookmarksToShow[i].siteUrl}</a></td>
                        <td>
                            <button onclick="updateBookmark(${currentIndex})" class="rounded btn btn-info btn-sm">Update</button>
                            <button onclick="deleteBookmark(${currentIndex})" class="rounded btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>`;
        }
    }
    tableBody.innerHTML = marks;
}

function deleteBookmark(index) {
    bookmarks.splice(index, 1);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    displayBookmarks(bookmarks);
    if (searchInput.value.trim() !== '') {
        search(searchInput.value);
    }
}

function updateBookmark(index) {
    nameInpt.value = bookmarks[index].siteName;
    urlInpt.value = bookmarks[index].siteUrl;
    bookmarks.splice(index, 1);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    currentIndex = index;
    addBtn.textContent = "Update";
    displayBookmarks(bookmarks);
}

function search(term) {
    if (!term || !term.trim()) {
        displayBookmarks(bookmarks);
        return;
    }

    term = term.toLowerCase();
    var searchResults = bookmarks.filter(bookmark => 
        bookmark.siteName.toLowerCase().includes(term) ||
        bookmark.siteUrl.toLowerCase().includes(term)
    );
    
    displayBookmarks(searchResults);
}
