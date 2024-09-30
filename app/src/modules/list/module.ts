import { Module } from "@/types/module";

// Slash Commands
import { ListSlash } from "./commands/list";

// Buttons
import { UpdateListButton } from "./buttons/updateList";

export const ListModule: Module = {
    id: "list",
    slashCommands: [
        ListSlash
    ],
    buttons: [
        UpdateListButton
    ]
}