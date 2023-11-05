import axios from 'axios';

export class UsersJira{
    constructor(

    ) {}

    private username = process.env.JIRA_USERNAME;
    private api_key = process.env.JIRA_KEY;
    private domain = process.env.JIRA_DOMAIN;

    async getUserOnJira() {

        const auth = {
            username: this.username,
            password: this.api_key,
        }

        try {
            const baseUrl = `https://${this.domain}.atlassian.net`;
            const config = {
                method: 'get',
                url: `${baseUrl}/rest/api/3/users`,
                headers: { 'Content-Type': 'application/json' },
                params: { maxResults: 100 },
                auth: auth,
            };

            return await axios.request(config);
        } catch(error) {
            console.log('error: ', error.response.data.errors)
        }
    };
}