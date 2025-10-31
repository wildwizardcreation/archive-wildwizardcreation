const githubUsername = 'wildwizardcreation';
const repoName = 'wizard-blog-archive';
const postsPerLoad = 5;

let allPostFiles = [];
let currentPostIndex = 0;
let isLoading = false;
let observer = null;

const pathParts = window.location.pathname.split('/');
const blogsIndex = pathParts.indexOf('blogs');
const blogName = blogsIndex > -1 ? pathParts[blogsIndex + 1] : null;

const apiUrl = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/blogs/${blogName}/posts`;
const postContainer = document.getElementById('post-container');
const loaderElement = document.getElementById('loader');

const createRepoLink = () => {
    const heading = document.querySelector('h2');

    if (!heading) {
        console.warn('could not find title to insert repo link.');
        return;
    }

    const repoFolderUrl = `https://github.com/${githubUsername}/${repoName}/tree/main/blogs/${blogName}`;

    const link = document.createElement('a');
    link.href = repoFolderUrl;
    link.title = `view blog's archive source on github`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'inline';
    link.style.marginLeft = '0.5em';
    link.style.verticalAlign = 'bottom';

    link.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="github logo">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
        </svg>
    `;
    heading.parentNode.insertBefore(link, heading);
};

const loadMorePosts = async () => {
    if (isLoading || currentPostIndex >= allPostFiles.length) {
        if (currentPostIndex >= allPostFiles.length) {
            if (loaderElement) loaderElement.style.display = 'none';
            if (observer) observer.disconnect();
        }
        return;
    }

    isLoading = true;
    if (loaderElement) loaderElement.style.display = 'block';

    const endIndex = Math.min(currentPostIndex + postsPerLoad, allPostFiles.length);
    const batch = allPostFiles.slice(currentPostIndex, endIndex);

    for (const file of batch) {
        try {
            const postURL = file.download_url;
            
            console.log(`fetching post content from: ${postURL}`);
            const postResponse = await fetch(postURL);
            if (!postResponse.ok) {
                console.error(`failed to fetch post content: ${postURL}`);
                continue; 
            }
            const postHTML = await postResponse.text();

            const parser = new DOMParser();
            const postDoc = parser.parseFromString(postHTML, 'text/html');
            const postContent = postDoc.querySelector('.container');
            
            const article = document.createElement('article');
            article.className = 'post';

            if (postContent) {
                article.innerHTML = postContent.innerHTML;
            } else {
                article.innerHTML = postHTML;
                console.warn(`could not find a .container element in ${file.name}.`);
            }
            
            if (postContainer) postContainer.appendChild(article);
        } catch (error) {
            console.error(`error processing post ${file.name}:`, error);
        }
    }

    currentPostIndex = endIndex;
    isLoading = false;
    
    if (currentPostIndex >= allPostFiles.length) {
        if (loaderElement) loaderElement.style.display = 'none';
        console.log('all posts loaded.');
        if (observer) {
            observer.disconnect();
        }
    }
};

const setupObserver = () => {
    if (!loaderElement) {
        console.warn('loader element not found. infinite scroll disabled.');
        return;
    }

    const options = {
        root: null,
        rootMargin: '200px 0px 200px 0px',
        threshold: 0.0
    };

    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
            loadMorePosts();
        }
    }, options);

    observer.observe(loaderElement);
};

const loadPosts = async () => {
    if (!postContainer) {
        console.error('CRITICAL: post-container element not found. stopping.');
        return;
    }
    if (!loaderElement) {
        console.error('CRITICAL: loader element not found. stopping.');
        return;
    }

    if (!blogName) {
        postContainer.innerHTML = "<p>No blog specified in the URL.</p>";
        console.error("Could not determine blog name from the URL path.");
        return;
    }
    
    createRepoLink();

    loaderElement.style.display = 'block';

    try {
        console.log(`fetching file list from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`got a 404 for ${apiUrl}. this blog might not exist or have a posts folder.`);
                postContainer.innerHTML = `<p>could not find a blog archive named "<strong>${blogName}</strong>".</p>`;
            } else {
                throw new Error(`github api error: ${response.statusText}`);
            }
            loaderElement.style.display = 'none';
            return;
        }
        const filesData = await response.json();

        allPostFiles = filesData
            .filter(file => file.name.endsWith('.html'));

        if (allPostFiles.length === 0) {
            postContainer.innerHTML = '<p>No archived posts found for this blog :( </p>';
            loaderElement.style.display = 'none';
            return;
        }

        allPostFiles.sort((a, b) => {
            const idA = parseInt(a.name.split('.')[0], 10);
            const idB = parseInt(b.name.split('.')[0], 10);
            return idB - idA;
        });

        await loadMorePosts();
        if (currentPostIndex < allPostFiles.length) {
            setupObserver();
        } else {
            if (loaderElement) loaderElement.style.display = 'none';
        }

    } catch (error) {
        console.error('Failed to load posts:', error);
        postContainer.innerHTML = `<p>Sorry, there was an error loading posts. Check the console.</p>`;
    } finally {
    }
};

loadPosts();

