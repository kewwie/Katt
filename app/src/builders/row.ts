import { Row, ComponentTypes } from "../types/component";

export class RowBuilder {
    public row: Row;

    constructor() {
        this.row = null;
    }

    public addComponents(components: any[]) {
        this.row = {
            type: ComponentTypes.ActionRow,
            components: components
        }
        return this;
    }

    toJSON() {
        return this.row;
    }
};