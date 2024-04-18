export class RiotAPI {
    baseUrl: string;

    constructor() {
        this.baseUrl = "https://api.henrikdev.xyz/valorant";
    }

    async fetchApi(options: { url: string; rtype?: string; }) {
        const res = await fetch(`${this.baseUrl}${options.url}`);
        if (options.rtype === 'arraybuffer') {
            return await res.arrayBuffer();
        }
        const response = await res.json();
        if (response.status === 200) {
            return response.data;
        } else {
            return response;
        }
    }

    /**
     * Gets a user accounts data
     * @param {Object} options
     * @property {String} puuid
     */
    async getAccountByPUUID(options: { puuid: string; }) {
        if (!options.puuid) return null;

        return await this.fetchApi({ url: `/v1/by-puuid/account/${options.puuid}` });
    }

    /**
     * Gets a user accounts data
     * @param {Object} options
     * @property {String} name
     * @property {String} tag
     */
    async getAccount(options: { name: string; tag: string; }) {
        if (!options.name || !options.tag) return null;

        return await this.fetchApi({ url: `/v1/account/${encodeURI(options.name)}/${encodeURI(options.tag)}` });
    }

     /**
     * Gets a user rank data
     * @param {Object} options
     * @property {String} region
     * @property {String} puuid
     */
    async getMMRByPUUID(options: { region: string; puuid: string; }) {
        if (!options.puuid) return { status: 400, error: "No puuid provided" };
        if (!options.region) return { status: 400, error: "No region provided" };

        return await this.fetchApi({ url: `/v2/by-puuid/mmr/${options.region}/${options.puuid}` });
    }

     /**
     * Gets a user rank data
     * @param {Object} options
     * @property {String} region
     * @property {String} name
     * @property {String} tag
     */
    async getMMR(options: { region: string; name: string; tag: string; }) {
        if (!options.name || !options.tag) return { status: 400, error: "No name or tag provided" };
        if (!options.region) return { status: 400, error: "No region provided" };

        return await this.fetchApi({ url: `/v2/mmr/${options.region}/${encodeURI(options.name)}/${encodeURI(options.tag)}` });
    }

    /**
     * Gets a user rank data
     * @param {Object} options
     * @property {String} region
     * @property {String} puuid
     * @property {Number} limit
     */
    async getMatchesByPUUID(options: { region: string; puuid: string; limit: number; }) {
        if (!options.puuid) return { status: 400, error: "No puuid provided" };
        if (!options.region) return { status: 400, error: "No region provided" };

        var data = await this.fetchApi({ url: `/v3/by-puuid/matches/${options.region}/${options.puuid}` });
        if (options.limit >= 1) data = data.slice(0, options.limit);
        return data;
    }

    /**
     * Gets a user rank data
     * @param {Object} options
     * @property {String} region
     * @property {String} name
     * @property {String} tag
     * @property {Number} limit
     */
    async getMatches(options: { region: string; name: string; tag: string; limit: number; }) {
        if (!options.name || !options.tag) return { status: 400, error: "No puuid provided" };
        if (!options.region) return { status: 400, error: "No region provided" };

        var data = await this.fetchApi({ url: `/v3/matches/${options.region}/${options.name}/${options.tag}` });
        if (options.limit >= 1) data = data.slice(0, options.limit);
        return data;
    }

    async getCrosshair(options: { code: string; }) {
        var query = new URLSearchParams({ code: options.code }).toString();
        return await this.fetchApi(
            { url: `/v1/crosshair/generate${query ? `?${query}` : ''}`, rtype: 'arraybuffer' }
        );
    }
};
