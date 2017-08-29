import {h} from "hyperapp"

export const Folder = ({item, actions}) => (
    <span onclick={actions.listFolder(item.path)}>{item.path}</span>
)
export const File = ({item, actions}) => (
    <span onclick={actions.select(item.id)}>{item.path}</span>
)
