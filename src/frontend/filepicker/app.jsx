import {h, app} from "hyperapp"
import {Folder, File} from "./components.jsx"

export default function init(targetNode, options, core) {

    app({
        root: targetNode,
        state: {
            path: options.path || "/",
            listing: [],
            page: 1,
            pagesTotal: 0
        },
        actions: {
            listFolder(state, actions, folderPath) {
                const path = folderPath || state.path
                return update => {
                    update(Object.assign(state, {path: path}))
                    core.API.storage.get({
                        path: state.path,
                        count: options.perPage,
                        offset: state.page - 1
                    }).then(folder => {
                        update(Object.assign(state, {
                            pagesTotal: Math.ceil(folder.total_count / options.perPage),
                            listing: [].concat(folder.folders, folder.files)
                        }))
                    })
                }
            },
            select(state, actions, item){

            },
            callbacks: {
                selection: () => {
                    options.selection(state.listing.filter(i=>i.isSelected))
                },
                cancel: () => {
                    options.cancel()
                },
                error: (state, actions, error) => {
                    options.error(error)
                }
            }
        },
        events: {
            load(state, actions) {
                actions.listFolder()
            }
        },
        view: (state, actions) => (
            <div class="eg-filepicker">
                {state.listing.map(item => item.is_folder
                    ? <Folder item={item} actions={actions}/>
                    : <File item={item} actions={actions}/>)}
            </div>
        )
    })

}
