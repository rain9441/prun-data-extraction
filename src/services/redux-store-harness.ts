class ReduxStoreHarness {
    GetStore() {
        var root: any = document.getElementById('container');

        // document.getElementById('container')._reactRootContainer._internalRoot.current.child.child.child.pendingProps.store.getState().toJS()
        if (!root) {
            throw new Error("Unable to find container element, this may not be running on APEX.");
        }

        try {
            var js = root._reactRootContainer._internalRoot.current.child.child.child.pendingProps.store.getState().toJS()
            return js;
        } catch (e) {
            throw new Error("Unable to find state on container element.");
        }
    }; 
}

export { ReduxStoreHarness }
