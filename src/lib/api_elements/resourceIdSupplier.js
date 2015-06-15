function makeId(isFolder, theId) {
    return (isFolder ? "/ids/folder/" : "/ids/file/") + theId;
}

function forEvent(obj) {
    obj.data.resource_id = makeId(obj.data.is_folder, obj.data.target_group_id);
    return obj;
}

function idStorageObject(obj) {
    obj.resource_id = makeId(obj.is_folder, (obj.is_folder ? obj.folder_id : obj.group_id));
    return obj;
}

function forResource(obj) {
    idStorageObject(obj);
    if (obj.is_folder) {
        if (obj.files) {
            obj.files = obj.files.map(idStorageObject)
        }
        if (obj.folders) {
            obj.folders = obj.folders.map(idStorageObject)
        }
    }
    return obj;
}
module.exports = {
    forEvent: forEvent,
    forResource: forResource
}