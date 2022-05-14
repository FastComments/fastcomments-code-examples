(async function clientRoot() {
    const root = document.getElementById('client-target');
    const URL_ID = 'custom-client-demo'; // could be a URL, article id, blog post id, etc.
    const DIRECTION = 'NF'; // valid values are NF (newest first), OF, (oldest first), MR (most relevant)

    /**
     * We maintain pointers to comments in three places:
     * 1. In a list, to keep an ordered list for various operations.
     * 2. By id, for fast lookups.
     * 3. As a tree, for rendering.
     */
    const State = {
        comments: [],
        commentsById: {},
        commentsTree: []
    };

    /**
     *
     * Comments are fetched by page. Pages are pre-calculated on change (optimized for reads).
     * A page includes all child comments.
     */
    const comments = await (await fetch(`/comments?direction=${DIRECTION}&page=0&urlId=${encodeURIComponent(URL_ID)}`)).json();

    function updateState(comments) {
        // not efficient to reset every time, but simple
        State.comments = [];
        State.commentsById = {};
        State.commentsTree = [];

        State.comments = JSON.parse(JSON.stringify(comments));
        State.comments.forEach(function (comment) {
            State.commentsById[comment.id] = comment;
        });

        State.comments.forEach(function (comment) {
            comment.nestedChildrenCount = 0;
            const parentId = comment.parentId;
            if (parentId && State.commentsById[parentId]) {
                if (!State.commentsById[parentId].children) {
                    State.commentsById[parentId].children = [comment];
                } else {
                    State.commentsById[parentId].children.push(comment);
                }
            } else {
                State.commentsTree.push(comment);
            }
        });

        State.comments.forEach(function (comment) {
            let parentId = comment.parentId;
            while (parentId) {
                comment = State.commentsById[parentId];
                if (comment) {
                    comment.nestedChildrenCount++;
                    parentId = comment.parentId;
                } else {
                    break;
                }
            }
        });
    }

    updateState(comments);

    root.addEventListener('click', async function (e) {
        const action = e.target.attributes['data-action'] && e.target.attributes['data-action'].value;
        if (action) {
            e.preventDefault();
        }
        if (action === 'submit-comment') {
            let parentId = e.target.attributes['data-parent-id'].value;
            root.classList.add('loading');
            const textarea = root.querySelector(`textarea[data-parent-id="${parentId}"]`);
            if (parentId === 'null') {
                parentId = null;
            }
            const responseJSON = await (await fetch('/comment', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    commentText: textarea.value,
                    urlId: URL_ID,
                    parentId: parentId
                })
            })).json();
            root.classList.remove('loading');
            // could check responseJSON.status === 'success' here
            if (responseJSON.status === 'success' && responseJSON.comment) {
                comments.unshift(responseJSON.comment);
                if (parentId !== null) {
                    delete State.commentsById[parentId].replyOpen;
                }
                updateState(comments);
                render(State);
            }
        } else if (action === 'start-reply') {
            const parentId = e.target.attributes['data-parent-id'].value;
            State.commentsById[parentId].replyOpen = !State.commentsById[parentId].replyOpen;
            render(State);
        } else if (action === 'comment-like') {
            const commentId = e.target.attributes['data-comment-id'].value;
            root.classList.add('loading');
            const responseJSON = await (await fetch(`/like?commentId=${commentId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json();
            root.classList.remove('loading');
            const comment = State.commentsById[commentId];
            comment.voteId = responseJSON.voteId;
            comment.votes++;
            comment.votesUp++;
            render(State);
        } else if (action === 'comment-unlike') {
            const commentId = e.target.attributes['data-comment-id'].value;
            const comment = State.commentsById[commentId];
            root.classList.add('loading');
            await (await fetch(`/like/?voteId=${comment.voteId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json();
            root.classList.remove('loading');
            delete comment.voteId;
            comment.votes--;
            comment.votesUp--;
            render(State);
        }
    });

    render(State);

    function getCommentHTML(State, comment) {
        // Note - commentHTML is already escaped, normalized, etc. So, you can just render this.
        // If your client does not support HTML, you can use and parse "comment" with a simple stack machine (subset of markdown + [img]src[/img] for images).
        // See parse-comment.js for a way to parse comments if your client does not support HTML.
        return `
            <div class="comment">
                <div class="comment-content"><b>${comment.commenterName}</b> said "<span class="text">${comment.commentHTML}</span>" <span class="date">at ${new Date(comment.date).toLocaleString()}</span></div>
                <div class="comment-actions">
                    <span class="like-count">${Number(comment.votes || 0).toLocaleString()} Karma</span>                
                    <button class="comment-like" data-action="${comment.voteId ? 'comment-unlike' : 'comment-like'}" data-comment-id="${comment.id}">${comment.voteId ? 'Un-Like' : 'Like'}</button>
                    <button class="comment-reply" data-action="start-reply" data-parent-id="${comment.id}">Reply</button>                
                    <span class="children-count">${Number(comment.nestedChildrenCount).toLocaleString()} Replies</span>                
                </div>
                ${comment.replyOpen ? `<div class="comment-reply">
                    <form class="comment-area">
                        <textarea placeholder="Write a reply..." data-parent-id="${comment.id}"></textarea>
                        <button type="submit" data-action="submit-comment" data-parent-id="${comment.id}">Submit</button>
                    </form>
                </div>` : ''}
                <div class="children">
                    ${comment.children ? comment.children.map((comment) => getCommentHTML(State, comment)).join('') : ''}
                </div>
            </div>
        `
    }

    function render(State) {
        root.innerHTML = `
            <form class="comment-area">
                <textarea placeholder="Write a comment..." data-parent-id="null"></textarea>
                <button type="submit" data-action="submit-comment" data-parent-id="null">Submit</button>
            </form>
            <div class="comments">
                ${State.commentsTree.map((comment) => getCommentHTML(State, comment)).join('')}
            </div>
        `;
    }
})();
