# React and Redux-Saga (Frontend)

![React Logo](./assets/react/React-logo.png)

[`redux-saga`](https://redux-saga.js.org/) is a library that aims to make application side effects (i.e. asynchronous things like data fetching and impure things like accessing the browser cache) easier to manage, more efficient to execute, easy to test, and better at handling failures.

## Connecting Redux Store to React

`index.js`

```js
// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
```

## React router (routing the application)

```js
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/dashboard">
          <App />
        </Route>
        <Route path="/about" component={About} />
        <Route path="/upload" component={Upload} />
        <Route path="/login" component={Login} />
        <Route path="/create" component={CreateAcc} />
        <PrivateRoute path="/test" component={testLogin} />
        <Redirect from="/" to="/upload" /> // Redirect from / to /upload
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
```

## Redux Store

`reducers/editstate.js`

### State

```js
export const initialState = {
  corpusData: null,
  fileNames: [],
  layout: {},
  fileUploaded: false,
  uploadingData: false,
  uploadStatus: null,

  updatingRelationData: false,
  updatingNerData: false,
  nerSearch: [new Set(), null],

  documentId: '',
};
```

- corpusData

  - Object containing the outputs from our ML models, with the keys being the fileNames
  - `corpusData = {'Overview': { 'ner' : ..., 'relation': ..., ... }, 'ChapterX': { 'ner' : ..., 'relation': ..., ... }, ...}`

- fileNames

  - Array of file names of type string
  - `fileNames = ['Overview', 'ChapterX', ...]`

- layout

  - Object containing the layouts for our dashboards, with the keys being the fileNames
  - Initial layouts are taken from `utils/layout.js` and `utils/overviewLayout.js` (for Overview dashboard)

- fileUploaded

  - Boolean that indicates whether a file has been uploaded.

- uploadingData

  - Boolean that indicates whether the uploading process and ML model outputs are still ongoing.

- uploadStatus

  - Either 'SUCCESS', 'FAILURE', or null
  - Indicates the status of the upload process, initial value is null. 'FAILURE' redirects to `ErrorPage.js`

- updatingRelationData

  - Boolean that indiciates whether the relation data is still being updated when a relation is deleted or updated.

- updatingNerData

  - Boolean that indiciates whether the NER data is still being updated when an entity is deleted or updated.

- nerSearch (Refer to `onSearchChange()` in `NerTable.js`)

  - Initial value is `[new Set(), null]`
  - The first index is a set containing the searched entities found in the NER data.
  - The second index is a string of the search that highlights the non-entity terms in `Taggy.js`.

- documentId
  - The string that is the ObjectID of the document in the MongoDB database.

### Actions and Reducers

Actions are payloads of information that send data from the application to the Store.

Actions must have a type property that indicates the type of action being performed. Types should typically be defined as string constants.

The example below shows when the action creator `uploadingData` is called, the reducers' case `types.UPLOADING_DATA` is executed and sets `uploadingData` and `fileUploaded` to `true`.

Actions:

```js
export const types = {
  UPLOADING_DATA :'UPLOADING_DATA',
  ...
}
```

Reducers:

```js
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPLOADING_DATA:
      return {
        ...state,
        uploadingData: true,
        fileUploaded: true,
      };
    ...
    }
  }
```

Action Creators:

```js
export function uploadingData(payload) {
  return {
    type: types.UPLOADING_DATA,
    payload,
  };
}
```

### Selectors

Selectors are getters of the Store

E.g. The function `getFileStatus` returns the fileUploaded state from the Store.

```js
export function getFileStatus(store) {
  return store.editstate.fileUploaded;
}
```

## Sagas

`sagas/editstate.js`

Taking the previous example further, after we upload data, we want to dispatch some action to notify the Store that the upload has succeeded and update the Store with the new data that was received.

In the example below, when the action creator `uploadingData` creates the action `types.UPLOADING_DATA`, `takeEvery(types.UPLOADING_DATA, uploadData)` watches for the action `UPLOADING_DATA` and calls the function `uploadData` concurrently.

```js
export default [
  takeEvery(types.UPLOADING_DATA, uploadData),
  takeEvery(types.UPDATING_NER_DATA, updateNer),
  takeEvery(types.UPDATING_RELATION_DATA, updateRelation),
];
```

In the function `uploadData` in `sagas/editstate.js`, `put` dispatches the action `UPLOAD_SUCCESS` to the Store, which sets the state of `uploadStatus` to 'SUCCESS' in the Store.

```js
yield put({
      type: types.UPLOAD_SUCCESS,
    });
```

## Connecting React Components to Redux-Saga

`App.js`

```js
import { connect } from 'react-redux';

import {
  <reducers...>
  <selectors...>
} from './reducers/editstate';

const App = props => {
  const {
    documentId,
    saveDocumentId,
    ...
  } = props
}

const mapStateToProps = (store) => ({
  documentId: getDocumentId(store),
  ...
});

const mapDispatchToProps = (dispatch) => ({
  saveDocumentId: (payload) => dispatch(saveDocumentId(payload)),
  ...
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```
