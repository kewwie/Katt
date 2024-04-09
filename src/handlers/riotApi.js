module.exports = class RiotAPI {

    constructor() {
        this.baseUrl = "https://api.henrikdev.xyz/valorant";
    }

    async fetchApi(url) {
        const res = await fetch(`${this.baseUrl}${url}`);
        const response = await res.json();
        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    /**
     * Gets a user accounts data
     * @param {Object} options
     * @property {String} puuid
     * 
     * @returns {Object} User account data
     * @property {String} puuid
     * @property {String} region
     * @property {Number} account_level
     * @property {String} name
     * @property {String} tag
     * @property {Object} card
     * @property {String} card.small
     * @property {String} card.large
     * @property {String} card.wide
     * @property {String} card.id
     * @property {String} last_update
     * @property {Number} last_update_raw
     */
    async getAccountByPUUID(options) {
        if (!options.puuid) return null;

        return await this.fetchApi(`/v1/by-puuid/account/${options.puuid}`);
    }

    /**
     * Gets a user accounts data
     * @param {Object} options
     * @property {String} name
     * @property {String} tag
     * 
     * @returns {Object} User account data
     * @property {String} puuid
     * @property {String} region
     * @property {Number} account_level
     * @property {String} name
     * @property {String} tag
     * @property {Object} card
     * @property {String} card.small
     * @property {String} card.large
     * @property {String} card.wide
     * @property {String} card.id
     * @property {String} last_update
     * @property {Number} last_update_raw
     */
    async getAccount(options) {
        if (!options.name || !options.tag) return null;

        return await this.fetchApi(`/v1/account/${encodeURI(options.name)}/${encodeURI(options.tag)}`);
    }

     /**
     * Gets a user rank data
     * @param {Object} options
     * @property {String} region
     * @property {String} puuid
     */
    async getMMRByPUUID(options) {
        if (!options.puuid) return { status: 400, error: "No puuid provided" };
        if (!options.region) return { status: 400, error: "No region provided" };

        return await this.fetchApi(`/v2/by-puuid/mmr/${options.region}/${options.puuid}`);
    }

     /**
     * Gets a user rank data
     * @param {Object} options
     * @property {String} region
     * @property {String} name
     * @property {String} tag
     */
    async getMMR(options) {
        if (!options.name || !options.tag) return { status: 400, error: "No name or tag provided" };
        if (!options.region) return { status: 400, error: "No region provided" };

        return await this.fetchApi(`/v2/mmr/${options.region}/${encodeURI(options.name)}/${encodeURI(options.tag)}`);
    }

    /**
     * Gets a user rank data
     * @param {Object} options
     * @property {String} region
     * @property {String} puuid
     * @property {Number} limit
     */
    async getMatchesByPUUID(options) {
        if (!options.puuid) return { status: 400, error: "No puuid provided" };
        if (!options.region) return { status: 400, error: "No region provided" };

        var data = await this.fetchApi(`/v3/by-puuid/matches/${options.region}/${options.puuid}`);
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
    async getMatches(options) {
        if (!options.name || !options.tag) return { status: 400, error: "No puuid provided" };
        if (!options.region) return { status: 400, error: "No region provided" };

        var data = await this.fetchApi(`/v3/matches/${options.region}/${options.name}/${options.tag}`);
        if (options.limit >= 1) data = data.slice(0, options.limit);
        return data;
    }
};
