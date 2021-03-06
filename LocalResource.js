export default class LocalResource {

  constructor(name, query = {}, module = null) {
    this.name = name;
    this.module = module;
    this.reducer = this.reducer.bind(this);
  }

  getMutator(dispatch) {
    const { name, module } = this;
    return {
      update: newData => dispatch({
        type: 'STRIPESLOCALSTATE_UPDATE',
        payload: newData,
        meta: {
          module,
          resource: name,
        },
      }),
      replace: newData => dispatch({
        type: 'STRIPESLOCALSTATE_REPLACE',
        payload: newData,
        meta: {
          module,
          resource: name,
        },
      }),
    };
  }

  stateKey() {
    return `${this.module}-${this.name}`;
  }

  actionApplies(action) {
    if (action.meta && action.meta.module && action.meta.resource) {
      const key = `${action.meta.module}-${action.meta.resource}`;
      return key === this.stateKey();
    }
    return false;
  }

  reducer(state = {}, action) {
    if (this.actionApplies(action)) {
      switch (action.type) {
        case 'STRIPESLOCALSTATE_UPDATE':
          return Object.assign({}, state, action.payload);
        case 'STRIPESLOCALSTATE_REPLACE':
          return action.payload;
        default:
          return state;
      }
    } else {
      return state;
    }
  }

}
