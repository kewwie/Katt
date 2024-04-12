import { Row, ComponentTypes } from "../types/component";

export class RowBuilder {
    public row: Row;

    constructor() {}

    public addComponents(components: any[]) {
        this.row = {
            type: ComponentTypes.ActionRow,
            components: components.map(component => component.toJSON())
        }
    }

    toJSON() {
        return this.row;
    }
};