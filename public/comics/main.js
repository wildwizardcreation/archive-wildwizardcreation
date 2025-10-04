document.addEventListener('DOMContentLoaded', function() {
    const config = {
        imageBasePath: "https://comics.wildwizardcreation.com/",
        pageToSkip: 2,
        preloadAheadCount: 3,
        defaultExtension: "jpg",
        zoomLevels: ['Fit Height', 'Fit Width', '75%', '50%'],
    };
    let state = {
        comicLibrary: [],
        currentIssueIndex: 0,
        currentPageIndex: 0,
        currentCoverIndex: 0,
        currentZoomIndex: 0,
        imageCache: {},
    };
    const dom = {
        page: document.querySelector('.page'),
        sidebarToggleBtn: document.getElementById('sidebar-btn'),
        issueList: document.getElementById('issue-list'),
        issueTitle: document.getElementById('issue-title'),
        issueArtists: document.getElementById('issue-artists'),
        viewer: document.getElementById('viewer'),
        comicPage: document.getElementById('comic-page'),
        pageJumper: document.getElementById('page-jumper'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        loadingIndicator: document.getElementById('loading-indicator'),
        zoomInBtn: document.getElementById('zoom-in-btn'),
        zoomOutBtn: document.getElementById('zoom-out-btn'),
        zoomIndicator: document.getElementById('zoom-indicator'),
        variantBtn: document.getElementById('variant-btn'),
        controlsSpacer: document.getElementById('controls-spacer'),
        controls: document.getElementById('controls'),
        mobileHeader: document.getElementById('mobile-header'),
        mobileIssueTitle: document.getElementById('mobile-issue-title'),
        mobileIssueArtists: document.getElementById('mobile-issue-artists'),
        issueSelector: document.getElementById('issue-selector'),
        mobileVariantBtn: document.getElementById('mobile-variant-btn'),
    };
    function setViewerState(isLoading, message) {
        if (isLoading) {
            dom.loadingIndicator.style.display = 'block';
            dom.loadingIndicator.innerText = message || 'Loading...';
            dom.comicPage.style.display = 'none';
        } else {
            dom.loadingIndicator.style.display = 'none';
            dom.comicPage.style.display = 'block';
        }
    }
    function handleIssueClick(event) {
        if (event.target && event.target.classList.contains('issue-item')) {
            loadIssue(parseInt(event.target.dataset.index, 10));
        }
    }
    function handleIssueSelect(event) {
        loadIssue(parseInt(event.target.value, 10));
    }
    function handleKeyboardNav(event) {
        if (event.key === 'ArrowRight') {
            nextPage();
        } else if (event.key === 'ArrowLeft') {
            prevPage();
        }
    }
    function init() {
        if (typeof comicSeriesData === 'undefined' || comicSeriesData.length === 0) {
            const errorMsg = "no comics found in library.";
            dom.issueTitle.textContent = errorMsg;
            dom.mobileIssueTitle.textContent = errorMsg;
            dom.comicPage.style.display = 'none';
            dom.controls.style.display = 'none';
            return;
        }
        state.comicLibrary = generateComicLibrary(comicSeriesData);
        createGroupedIssueList();
        createIssueSelector(); 
        setupEventListeners();
        loadIssue(0); 
    }
    function generateComicLibrary(seriesData) {
        const flatLibrary = [];
        seriesData.forEach(function(series) {
            series.issues.forEach(function(issue) {
                const pages = [];
                const extension = series.extension || config.defaultExtension;
                for (let i = 1; i <= issue.pageCount; i++) {
                    if (i === config.pageToSkip) continue;
                    const pageNumber = String(i).padStart(3, '0');
                    const imagePath = series.comicName + '/Issue-' + issue.issueNumber + '/Page-' + pageNumber + '.' + extension;
                    pages.push(config.imageBasePath + imagePath);
                }
                flatLibrary.push({
                    comicName: series.comicName,
                    title: issue.title || 'Issue #' + issue.issueNumber,
                    pages: pages,
                    seriesArtists: series.artists || null,
                    variantCovers: issue.variantCovers || [],
                });
            });
        });
        return flatLibrary;
    }
    function createGroupedIssueList() {
        dom.issueList.innerHTML = '';
        let currentSeries = '';
        state.comicLibrary.forEach(function(issue, index) {
            if (issue.comicName !== currentSeries) {
                currentSeries = issue.comicName;
                const titleLi = document.createElement('li');
                titleLi.className = 'comic-title';
                titleLi.textContent = currentSeries.replace(/-/g, ' ');
                dom.issueList.appendChild(titleLi);
            }
            const li = document.createElement('li');
            li.className = 'issue-item';
            li.textContent = issue.title;
            li.dataset.index = index;
            dom.issueList.appendChild(li);
        });
    }
    function createIssueSelector() {
        dom.issueSelector.innerHTML = '';
        let currentSeries = '';
        let optgroup;
        state.comicLibrary.forEach(function(issue, index) {
            if (issue.comicName !== currentSeries) {
                currentSeries = issue.comicName;
                optgroup = document.createElement('optgroup');
                optgroup.label = currentSeries.replace(/-/g, ' ');
                dom.issueSelector.appendChild(optgroup);
            }
            const option = document.createElement('option');
            option.value = index;
            option.textContent = issue.title;
            if (optgroup) {
                optgroup.appendChild(option);
            } else { 
                dom.issueSelector.appendChild(option);
            }
        });
    }
    function setupEventListeners() {
        dom.sidebarToggleBtn.addEventListener('click', toggleSidebar);
        dom.pageJumper.addEventListener('change', jumpToPage);
        dom.prevBtn.addEventListener('click', prevPage);
        dom.nextBtn.addEventListener('click', nextPage);
        dom.zoomInBtn.addEventListener('click', zoomIn);
        dom.zoomOutBtn.addEventListener('click', zoomOut);
        dom.variantBtn.addEventListener('click', cycleCover);
        dom.mobileVariantBtn.addEventListener('click', cycleCover);
        dom.issueList.addEventListener('click', handleIssueClick);
        dom.issueSelector.addEventListener('change', handleIssueSelect);
        document.addEventListener('keydown', handleKeyboardNav);
    }
    function jumpToPage(event) {
        const pageIndex = parseInt(event.target.value, 10);
        displayPage(pageIndex);
    }
    function toggleSidebar() {
        dom.page.classList.toggle('sidebar-collapsed');
    }
    function loadIssue(issueIdx) {
        state.currentIssueIndex = issueIdx;
        state.currentCoverIndex = 0;
        updatePageJumper();
        displayPage(0); 
        dom.issueList.querySelectorAll('.issue-item').forEach(function(li) {
            li.classList.toggle('active', li.dataset.index == issueIdx);
        });
    }
    function displayPage(pageIdx) {
        const issue = state.comicLibrary[state.currentIssueIndex];
        if (!issue || !issue.pages) return;
        let imageUrl = issue.pages[pageIdx];
        if (!imageUrl) return;
        const hasVariants = issue.variantCovers.length > 0;
        let coverArtist = null;
        if (pageIdx === 0 && hasVariants) {
            dom.variantBtn.style.display = 'inline-block';
            dom.mobileVariantBtn.style.display = 'block';
            dom.controlsSpacer.style.display = 'none';
            const mainCoverInfo = {
                url: issue.pages[0],
                artist: issue.seriesArtists ? issue.seriesArtists.cover : null
            };
            const allCovers = [mainCoverInfo].concat(issue.variantCovers);
            const currentCoverInfo = allCovers[state.currentCoverIndex];
            imageUrl = currentCoverInfo.url;
            coverArtist = currentCoverInfo.artist;
        } else {
            dom.variantBtn.style.display = 'none';
            dom.mobileVariantBtn.style.display = 'none';
            dom.controlsSpacer.style.display = 'inline-block';
        }
        setViewerState(true);
        const cachedImage = state.imageCache[imageUrl];
        if (cachedImage && cachedImage instanceof Image) {
            dom.comicPage.src = cachedImage.src;
            setViewerState(false);
            dom.viewer.scrollTop = 0;
        } else {
            const img = new Image();
            img.src = imageUrl;
            if ('decode' in img) {
                img.decode().then(function() {
                    if (state.currentPageIndex === pageIdx) {
                        state.imageCache[imageUrl] = img;
                        dom.comicPage.src = img.src;
                        setViewerState(false);
                        dom.viewer.scrollTop = 0;
                    }
                }).catch(function(error) {
                    img.onload = function() {
                        if (state.currentPageIndex === pageIdx) {
                            state.imageCache[imageUrl] = img;
                            dom.comicPage.src = img.src;
                            setViewerState(false);
                            dom.viewer.scrollTop = 0;
                        }
                    };
                });
            } else {
                img.onload = function() {
                    if (state.currentPageIndex === pageIdx) {
                        state.imageCache[imageUrl] = img;
                        dom.comicPage.src = img.src;
                        setViewerState(false);
                        dom.viewer.scrollTop = 0;
                    }
                };
            }
            img.onerror = function() {
                if (state.currentPageIndex === pageIdx) {
                    setViewerState(true, 'error loading page.');
                }
            };
        }
        state.currentPageIndex = pageIdx;
        updateArtistInfo(issue, pageIdx, coverArtist);
        updateUI();
        preloadImages();
    }
    function updateUI() {
        const issue = state.comicLibrary[state.currentIssueIndex];
        const issueDisplayName = issue.comicName.replace(/-/g, ' ') + ': ' + issue.title;
        dom.issueTitle.textContent = issueDisplayName;
        dom.mobileIssueTitle.textContent = issueDisplayName;
        dom.pageJumper.value = state.currentPageIndex;
        dom.issueSelector.value = state.currentIssueIndex;
        dom.prevBtn.disabled = state.currentPageIndex === 0;
        const isLastPage = state.currentPageIndex >= issue.pages.length - 1;
        const hasNextIssue = state.currentIssueIndex < state.comicLibrary.length - 1;
        if (isLastPage && hasNextIssue) {
            dom.nextBtn.innerHTML = 'Next<br>Issue';
        } else {
            dom.nextBtn.innerHTML = '>';
            dom.nextBtn.disabled = isLastPage;
        }
        dom.zoomOutBtn.disabled = state.currentZoomIndex === 0;
        dom.zoomInBtn.disabled = state.currentZoomIndex >= config.zoomLevels.length - 1;
        applyZoom();
    }
    function updatePageJumper() {
        dom.pageJumper.innerHTML = '';
        const issue = state.comicLibrary[state.currentIssueIndex];
        for (let i = 0; i < issue.pages.length; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = 'Page ' + (i + 1);
            dom.pageJumper.appendChild(option);
        }
    }
    function updateArtistInfo(issue, pageIdx, coverArtist) {
        let artistString = '';
        if (pageIdx === 0) {
            const artistToShow = coverArtist || (issue.seriesArtists ? issue.seriesArtists.illustrator : null);
            if (artistToShow) {
                artistString = 'Artist: ' + artistToShow;
            }
        } else if (issue.seriesArtists) {
            const interiorArtists = Object.entries(issue.seriesArtists).filter(function(entry) {
                return entry[0] !== 'cover'; 
            });
            if (interiorArtists.length > 0) {
                artistString = interiorArtists.map(function(entry) {
                        const role = entry[0];
                        const name = entry[1];
                        return role.charAt(0).toUpperCase() + role.slice(1) + ': ' + name;
                    })
                    .join(' | ');
            }
        }
        dom.issueArtists.textContent = artistString;
        dom.mobileIssueArtists.textContent = artistString; 
    }
    function nextPage() {
        const issue = state.comicLibrary[state.currentIssueIndex];
        const isLastPage = state.currentPageIndex >= issue.pages.length - 1;
        const hasNextIssue = state.currentIssueIndex < state.comicLibrary.length - 1;
        if (!isLastPage) {
            displayPage(state.currentPageIndex + 1);
        } else if (hasNextIssue) {
            loadIssue(state.currentIssueIndex + 1);
        }
    }
    function prevPage() {
        if (state.currentPageIndex > 0) {
            displayPage(state.currentPageIndex - 1);
        }
    }
    function cycleCover() {
        const issue = state.comicLibrary[state.currentIssueIndex];
        const variantUrls = issue.variantCovers.map(function(variant) {
            return variant.url;
        });
        const allCovers = [issue.pages[0]].concat(variantUrls);
        state.currentCoverIndex = (state.currentCoverIndex + 1) % allCovers.length;
        displayPage(0);
    }
    function preloadImages() {
        const issue = state.comicLibrary[state.currentIssueIndex];
        const pageIdx = state.currentPageIndex;
        if (!issue) return;
        if (pageIdx === 0) {
            issue.variantCovers.forEach(function(cover) {
                cacheImage(cover.url)
            });
        }
        for (let i = 1; i <= config.preloadAheadCount; i++) {
            const nextUrl = issue.pages[pageIdx + i];
            if (nextUrl) {
                cacheImage(nextUrl);
            }
        }
    }
    function cacheImage(url) {
        if (!state.imageCache[url]) {
            const img = new Image();
            img.src = url;
            state.imageCache[url] = 'loading'; 
            if ('decode' in img) {
                img.decode().then(function() {
                    state.imageCache[url] = img; 
                }).catch(function() {
                    img.onload = function() { state.imageCache[url] = img; };
                });
            } else {
                img.onload = function() { state.imageCache[url] = img; };
            }
        }
    }
    function applyZoom() {
        const level = config.zoomLevels[state.currentZoomIndex];
        const pageStyle = dom.comicPage.style;
        dom.zoomIndicator.textContent = level;
        pageStyle.width = 'auto';
        pageStyle.maxWidth = '100%';
        pageStyle.maxHeight = '100%';
        pageStyle.objectFit = 'contain';
        if (level === 'Fit Width') {
            pageStyle.width = '100%';
            pageStyle.maxHeight = 'none';
            pageStyle.objectFit = 'auto';
        } else if (level.includes('%')) {
            pageStyle.width = level;
            pageStyle.maxWidth = level;
            pageStyle.maxHeight = 'none';
            pageStyle.objectFit = 'auto';
        }
    }
    function zoomIn() {
        if (state.currentZoomIndex < config.zoomLevels.length - 1) {
            state.currentZoomIndex++;
            updateUI();
        }
    }
    function zoomOut() {
        if (state.currentZoomIndex > 0) {
            state.currentZoomIndex--;
            updateUI();
        }
    }
    init();
});