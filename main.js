// Import necessary modules
const express = require('express');
const axios = require('axios');
const _ = require('lodash');

// Create Express app
const app = express();
const port = 3000; // Choose an appropriate port

// Middleware for data retrieval and analysis
app.get('/api/blog-stats', async (req, res) => {
    try {
        // Make a request to the third-party API
        const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
            headers: {
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
            },
        });

        // Extract blog data from the response
        const blogs = response.data;

        // Data analysis using Lodash
        const totalBlogs = blogs.length;
        const longestTitleBlog = _.maxBy(blogs, 'title.length');
        const privacyBlogs = _.filter(blogs, blog => _.includes(_.toLower(blog.title), 'privacy'));
        const uniqueTitles = _.uniqBy(blogs, 'title');

        // Respond with the analytics results
        res.json({
            totalBlogs,
            longestTitle: longestTitleBlog.title,
            privacyBlogs: privacyBlogs.length,
            uniqueTitles,
        });
    } catch (error) {
        // Handle errors during data retrieval or analysis
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Search endpoint
app.get('/api/blog-search', (req, res) => {
    const query = req.query.query;

    // Check if the query parameter is present
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Perform search functionality
    const searchResults = _.filter(blogs, blog => _.includes(_.toLower(blog.title), _.toLower(query)));

    // Respond with the search results
    res.json({ searchResults });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
