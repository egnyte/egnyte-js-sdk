import {h} from "hyperapp"

export const Folder = ({item, actions}) => (
    <span onclick={_=>actions.listFolder(item.path)}>{item.name}</span>
)
export const File = ({item, actions}) => (
    <span onclick={_=>actions.select(item.id)}>{item.name}</span>
)
