const TENANT_ID = 'demo'; // Replace this with your own in production!
const API_SECRET = 'DEMO_API_SECRET'; // Replace this with your own in production! This will only work with the "demo" tenant id.

const axios = require('axios');

const AXIOS_CONFIG_NO_THROW = {
    validateStatus: function () {
        return true;
    }
}

function getLoggedInUser() {
    // you'd probably get this from a database or other storage mechanism.
    return {
        username: 'Demo User',
        fastCommentsSSOUserId: 'demo'
    }
}

function createAPIURL(route, obj) {
    let result = [];
    for (const key in obj) {
        const value = obj[key];
        if (value) {
            result.push(key + '=' + encodeURIComponent(obj[key]));
        }
    }
    return 'https://fastcomments.com' + route + '?' + result.join('&');
}

function setupRoutes(app, logger) {
    // Get information like comment count etc on the page.
    app.get('/page', async function getPage(req, res) {
        res.send([
            {
                commentHTML: 'test'
            }
        ]);
    });
    // Get the comments for a given sort direction and page.
    // Takes req.query.direction (NF, OF, MR)
    // Takes req.query.page (0, 1, ...)
    // Takes req.query.urlId (string identifier for page/thread)
    app.get('/comments', async function getComments(req, res) {
        const loggedInUser = getLoggedInUser();
        const [
            getCommentsResponse,
            getVotesResponse
        ] = await Promise.all([
            axios.get(createAPIURL('/api/v1/comments', {
                API_KEY: API_SECRET,
                tenantId: TENANT_ID,
                direction: req.query.direction,
                page: req.query.page,
                urlId: req.query.urlId,
            }), AXIOS_CONFIG_NO_THROW),
            axios.get(createAPIURL('/api/v1/votes/for-user', {
                API_KEY: API_SECRET,
                tenantId: TENANT_ID,
                urlId: req.query.urlId,
                userId: loggedInUser.fastCommentsSSOUserId
            }), AXIOS_CONFIG_NO_THROW),
        ]);

        const comments = getCommentsResponse.data.comments;
        const userVotesOnPage = getVotesResponse.data.appliedAuthorizedVotes.concat(getVotesResponse.data.pendingVotes);

        if (userVotesOnPage.length > 0) {
            // userVotesOnPage will usually be very small, so just two loops is a pretty fast solution (faster than pre-creating hashmaps etc).
            // you could check the length of userVotesOnPage and then maybe create a hashmap/set/etc if it is longer than a certain size.
            for (const comment of comments) {
                for (const vote of userVotesOnPage) {
                    if (vote.commentId === comment.id) {
                        comment.voteId = vote.id;
                    }
                }
            }
        }

        if (getCommentsResponse.status !== 200) {
            res.status(getCommentsResponse.status);
        } else if (getVotesResponse.status !== 200) {
            res.status(getVotesResponse.status);
        }

        res.send(comments);
    });
    // Save a comment.
    app.post('/comment', async function saveComment(req, res) {
        const loggedInUser = getLoggedInUser();
        const commentToCreate = {
            comment: req.body.commentText.trim(),
            urlId: req.body.urlId,
            parentId: req.body.parentId,
            date: Date.now(),
            commenterName: loggedInUser.username,
            userId: loggedInUser.fastCommentsSSOUserId, // if you are using SSO you would set this.
            verified: true,
            approved: true
        };
        const response = await axios.post(createAPIURL('/api/v1/comments', {
            API_KEY: API_SECRET,
            tenantId: TENANT_ID,
            urlId: req.body.urlId,
        }), commentToCreate, AXIOS_CONFIG_NO_THROW);
        res.status(response.status);
        res.send(response.data);
    });
    // Like a comment.
    app.post('/like', async function likeComment(req, res) {
        const loggedInUser = getLoggedInUser();
        const response = await axios.post(createAPIURL('/api/v1/votes', {
            API_KEY: API_SECRET,
            tenantId: TENANT_ID,
            userId: loggedInUser.fastCommentsSSOUserId,
            commentId: req.query.commentId,
            direction: 'up'
        }), AXIOS_CONFIG_NO_THROW);
        res.status(response.status);
        res.send(response.data);
    });
    // Un-Like a comment.
    app.delete('/like', async function unlikeComment(req, res) {
        const response = await axios.delete(createAPIURL(`/api/v1/votes/${req.query.voteId}`, {
            API_KEY: API_SECRET,
            tenantId: TENANT_ID
        }), AXIOS_CONFIG_NO_THROW);
        res.status(response.status);
        res.send(response.data);
    });
}

module.exports = {setupRoutes};
