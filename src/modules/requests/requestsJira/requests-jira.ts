import axios from 'axios';
import { AcceptRequest } from '../dtos/accept-request.dto';

export class RequestJira{
    constructor(
    ) {}
    private username = process.env.JIRA_USERNAME;
    private api_key = process.env.JIRA_KEY;
    private domain = process.env.JIRA_DOMAIN;

    async getUser (accountId: string) {

        const auth = {
            username: this.username,
            password: this.api_key,
        }

        try {
            const baseUrl = `https://${this.domain}.atlassian.net`;

            const config = {
                method: 'get',
                url: `${baseUrl}/rest/api/3/user`,
                headers: { 'Content-Type': 'application/json' },
                params: { accountId: accountId },
                auth: auth,
            };

            const response = await axios.request(config);

            return response.data;

        } catch(error) {
            console.log('error: ', error)
        }
    }

    async getUsersJira () {
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

            const response = await axios.request(config);
            let data = [];
            response.data.map((user) => {
                if(user.locale && user.displayName) {
                    data.push(
                        {value: user.accountId, label: user.displayName, avatarUrl: user.avatarUrls['48x48']},
                    )
                }
            })

            return data;

        } catch(error) {
            console.log('error: ', error.data)
        }
    }

    async assignIssue(issueId: number, bodyData: { "accountId": string}) {

        const auth = {
            username: this.username,
            password: this.api_key,
        };

        try {

            const baseUrl = `https://${this.domain}.atlassian.net`;
            const config = {
                headers: { 'Content-Type': 'application/json' },
                auth: auth,
            };

            await axios.put(`${baseUrl}/rest/api/3/issue/${issueId}/assignee`, bodyData, config);
            return true;

        } catch(error) {
            console.log('error: ', error.response.data.errors)
        }
    };


    async getIssue(keyIssue?: string) {
        const auth = {
            username: this.username,
            password: this.api_key,
        };

        try {

            const baseUrl = `https://${this.domain}.atlassian.net`;
            const config = {
                headers: { 'Content-Type': 'application/json' },
                auth: auth,
            };

            const transitions = await axios.get(`${baseUrl}/rest/api/3/issue/${keyIssue}`, config);
            return transitions.data;

        } catch(error) {
            console.log('error: ', error.response.data.errors)
        }
    }

    async updateTransition(keyIssue: string, transitionId: string) {

        const auth = {
            username: this.username,
            password: this.api_key,
        };

        const bodyData = {
            "transition": {
                "id": transitionId,
            }
        };

        try {

            const baseUrl = `https://${this.domain}.atlassian.net`;
            const config = {
                headers: { 'Content-Type': 'application/json' },
                auth: auth,
            };

            await axios.post(`${baseUrl}/rest/api/3/issue/${keyIssue}/transition`, bodyData, config);
            return true;

        } catch(error) {
            console.log('error: ', error.response.data.errors)
        }
    }

    async updateTask(issueId: number, accountId: string) {
        const bodyData = {
            "accountId": accountId,
        }
        const assigneeIssue = this.assignIssue(issueId, bodyData);
        if(assigneeIssue) {
            return true;
        }
        return false;
    }

    async createTask (data: AcceptRequest, projectId: number) {

        const auth = {
            username: this.username,
            password: this.api_key,
        }
        
        const body = {
            "fields": {
                "assignee": {
                    "id": data.assigneeId
                },
                "summary": data.summary,
                "description": {
                    "content": [
                        {
                            "content": [
                                {
                                    "text": data.description,
                                    "type": "text"
                                }
                            ],
                            "type": "paragraph"
                        }
                    ],
                    "type": "doc",
                    "version": 1
                },
                "issuetype": {
                    "id": "10000"
                },
                "project": {
                    "id": projectId
                }
            }
        }
        
        try {
            const baseUrl = `https://${this.domain}.atlassian.net`;
            const config = {
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                },
                auth: auth,
            };

            const response = await axios.post(`${baseUrl}/rest/api/3/issue`, body, config);

            return response.data;

        } catch(error) {
            console.log('error: ', error.response.data.errors)
        }
    };

    async deleteIssue(key: string) {
        const auth = {
            username: this.username,
            password: this.api_key,
        }

        try {

            const baseUrl = `https://${this.domain}.atlassian.net`;
            const config = {
                headers: { 'Content-Type': 'application/json' },
                auth: auth,
            };

            await axios.delete(`${baseUrl}/rest/api/3/issue/${key}`, config);
            return true;

        } catch(error) {
            console.log('error: ', error.response.data.errors)
        }

    };

    async addComment(key: string, comment: string) {
        const auth = {
            username: this.username,
            password: this.api_key,
        };

        const body = {
            "body": {
                "content": [
                    {
                        "content": [
                            {
                                "text": comment,
                                "type": "text",
                            }
                        ],
                        "type": "paragraph"
                    }
                ],
                "type": "doc",
                "version": 1
            }
        };

        try {

            const baseUrl = `https://${this.domain}.atlassian.net`;
            const config = {
                headers: { 'Content-Type': 'application/json' },
                auth: auth,
            };

            await axios.post(`${baseUrl}/rest/api/3/issue/${key}/comment`, body, config);
            return true;

        } catch(error) {
            console.log('error: ', error.response.data.errors)
        }

    }
}