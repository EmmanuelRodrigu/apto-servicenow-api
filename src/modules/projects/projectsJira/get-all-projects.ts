import axios from 'axios';

export class GetAllProjects{
    constructor() {}

    async getProjects () {
        const username = process.env.JIRA_USERNAME;
        const api_key = process.env.JIRA_KEY;
        const domain = process.env.JIRA_DOMAIN;
        const results = process.env.results;

        const auth = {
            username: username,
            password: api_key,
        }

        try {
            const baseUrl = `https://${domain}.atlassian.net`;

            const config = {
                method: 'get',
                url: `${baseUrl}/rest/api/3/project/search`,
                headers: { 'Content-Type': 'application/json' },
                params: { maxResults: results },
                auth: auth,
            };

            const response = await axios.request(config);

            return response.data;

        } catch(error) {
            console.log('error: ', error)
        }
    }
}