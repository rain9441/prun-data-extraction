class ReduxStoreHarness {
    GetStore() {
        var root: any = document.getElementById('container');

        if (!root) {
            throw new Error("Unable to find container element, this may not be running on APEX.");
        }
        root = root.children[0];
        if (!root) {
            throw new Error("Unable to find child of root container element, this may not be running on APEX.");
        }

        var reactPropertyName = Object.keys(root).filter(x => x.substring(0,5) == "__rea")[0];
        if (!reactPropertyName)
        {
            throw new Error("Unable to find react instance property name, this may not be running on APEX.");
        }

        return root[reactPropertyName]._currentElement._owner._context.store.getState().toJS();
    }; 
}

export { ReduxStoreHarness }
