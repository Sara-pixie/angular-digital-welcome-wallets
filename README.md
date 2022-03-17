# Angular Digital Welcome Wallets

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.2.

# Table of Contents

- **Firebese**
  - [Connecting Angular app to Firebase](#connecting-angular-app-to-firebase)
  - [How to get data from Fidebase DB](#how-to-get-data-from-fidebase-db)
  - [How to push data to Firestore DB](#how-to-push-data-to-firestore-db)
- [NgRx Store](#ngrx-store)
  - [Create an ACTION](#create-an-action)
  - [Define AppState](#define-appstate)
  - [Create a REDUCER](#create-a-reducer)
  - [Creating EFFECTS (HTTP)](#creating-effects-http)
  - [Creating SELECTORS](#creating-selectors)
- [Added Dependencies](#added-dependencies)

## Connecting Angular app to Firebase

1. create [Firebase](https://console.firebase.google.com/) project

2. create a realtime database
   (useful info - [rules](https://firebase.google.com/docs/database/security/rules-conditions))

3. install packages in your project:
   npm i firebase @angular/fire --save
   (will also probably need to -> npm audit fix)

4. go to main page of your project in Firebase & click add WEB app

5. find Your web app's Firebase configuration info and copy it to both environments!

```
    firebaseConfig: {
        apiKey: "AIzaSyDKqRHuxd8a4GlD-oi20UE0Hlr4rz3wl5Y",
        authDomain: "angular-digital-welcome-wallet.firebaseapp.com",
        databaseURL: "https://angular-digital-welcome-wallet-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "angular-digital-welcome-wallet",
        storageBucket: "angular-digital-welcome-wallet.appspot.com",
        messagingSenderId: "573177592731",
        appId: "1:573177592731:web:fdbfa1c7ebf948ffbcff3e"
    }
```

6. in AppModule imports array add:
   [CRUD example setup](https://www.bezkoder.com/angular-13-firebase-crud/)

```
    import { AngularFireModule } from '@angular/fire/compat';
    import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
    import { environment } from 'src/environments/environment';
    ...
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
```

<br>(->Back To [Table of Contents](#table-of-contents))

## How to get data from Fidebase DB

https://firebase.google.com/docs/database/web/read-and-write
in component import:

```
    import { AngularFireDatabase } from '@angular/fire/compat/database';

```

in component constructor:

```
    constructor(db: AngularFireDatabase){
        db.list<Store>('STORE').valueChanges().subscribe((stores: Store[]) => {
            this.stores = stores;
        });
        db.list<Form>('FORM').valueChanges().subscribe((forms: Form[]) => {
            this.forms = forms;
        });
    }
```

then in html:

```
    ...
    *ngFor="let store of stores">
    {{ store.name }}
    ...
```

<br>(->Back To [Table of Contents](#table-of-contents))

## How to push data to Firestore DB

in component method:

```
    db.list('FORM').push(newFormInfo);
```

<br>(->Back To [Table of Contents](#table-of-contents))

## NgRx Store

https://coursetro.com/posts/code/151/Angular-Ngrx-Store-Tutorial---Learn-Angular-State-Management

**npm install @ngrx/store**

<br>(->Back To [Table of Contents](#table-of-contents))

### Create an ACTION

An action in Ngrx/store is two things:

- A type in the form of a string. It describes what's happening.
- It contains an optional payload of data.

```
    // Define the type of action (which is in the form of a string constant)
    export const GET_STORES = 'GetStores';
    ...

    // Create a class for each action with a constructor that allows us to pass in the payload (not a required step, but it does provide you with strong typing)
    export class AddFormInfo implements Action {
        readonly type: string = ADD_FORM_INFO;
        constructor(public payload: FormInfo){}
    }
    ...

    // We're exporting all of our action classes for use within our reducer
    export type Actions =
        GetStoresStart |
        GetStores |
        GetFormsInfoStart |
        GetFormsInfo |
        AddFormInfo;
```

<br>(->Back To [Table of Contents](#table-of-contents))

### Define AppState

```
export interface AppState {
  readonly stores: Store[];
  readonly allFormsInfo: FormInfo[];
}

```

<br>(->Back To [Table of Contents](#table-of-contents))

### Create a REDUCER

A reducer is what takes the incoming action and decides what to do with it. It takes the previous state and returns a new state based on the given action.

```
    // First import everything from your actions file and asign it an alias
    import * as AppActions from './app.actions';
```

Then define your reducer. <br>
It's a function that accepts 2 arguments: 1. **state** (which in this case is an array of FormInfo and has an assigned default of [] - that can be something else as well...) 2. **action** (make it dynamic by getting the exported types in your actions!)
inside it make a **switch** function that checks the type of action being passed in (it comares them to those dynamic actions we referenced earlier) <br>
Then specify what should happen in each case (there can be more logic before the return statement) and make sure the default option return the initial state (so that's why we have state: FormInfo[] = []).

```
    export function formInfoReducer(state: FormInfo[] = [], action: AppActions.Actions){
    switch(action.type){
        case AppActions.ADD_FORM_INFO:
            return [...state, (action as AppActions.AddFormInfo).payload];
        case AppActions.GET_FORMS_INFO:
            return {...state};
        default:
            return state;
    }
}
```

connect a reducer (app.module.ts):

```
    import { StoreModule } from '@ngrx/store';
    import { storesReducer } from './shared/store/stores.reducer';
    import { formInfoReducer } from './shared/store/formInfo.reducer';
    ...
    @NgModule({
        ...
        imports: [
            StoreModule.forRoot({
                // key - same as in AppState!
                // value - reducer name
                stores: storesReducer,
                allFormsInfo: formInfoReducer
            })
        ]
        ...
```

Use the Reducer:

```
    import { Store } from '@ngrx/store';
    import * as AppActions from '../../shared/store/app.actions';
    ...
    constructor(private store: Store<AppState>) {}
    ...

    // send info (DISPATCH)
    // make sure to call 'new' AppActions.actionFunctionName(payload) !
    const formInfo: FormInfo = { /*FormInfo object here*/ }
    this.store.dispatch(new AppActions.AddFormInfo(formInfo));

    ...

    // get state info
    // will create an Observable<type>
    // call the store and then '.select' the part of AppState you're interested in - also see app.module.ts!
    allFormsInfo: Observable<FormInfo[]>;
    constructor(store: Store<AppState>) {
        this.allFormsInfo = store.select('allFormsInfo');
    }

```

<br>(->Back To [Table of Contents](#table-of-contents))

### Creating EFFECTS (HTTP)

**npm install --save @ngrx/effects**

in name.effects.ts:

```
    import { Actions, createEffect, ofType } from '@ngrx/effects';
    import { catchError, map, switchMap } from 'rxjs';
    import { AngularFireDatabase } from '@angular/fire/compat/database';
    import * as AppActions from './app.actions';
    ...
    @Injectable() // so we can inject actions$ and db
    export class AppEffects{
        getAllStores = createEffect(() => {
            return this.actions$.pipe(
                // continue here only if the action(Observable) is of this type
                // can add multiple actions if you want to run the same code for them!
                // it's like a filter...
                ofType(AppActions.GET_STORES_START),
                // get new observable
                switchMap(() =>{
                    //get array of stores
                    return this.db.list<Store>('STORE').valueChanges()
                        // and trigger another action to save them to NgRx Store
                        .pipe(
                            map((stores: Store[]) => new AppActions.GetStores(stores)),
                            // must return a non error observable so actions$ observable doesn't die!
                            catchError(() => new AppActions.GetStoresError())
                        );
                })
            )
        });
        ...more effects...
        constructor(private actions$: Actions,
                    private db: AngularFireDatabase){}
    }
```

in app.module.ts:

```
    import { EffectsModule } from '@ngrx/effects';
    ...
    imports: [
        EffectsModule.forRoot([AppEffects])
    ]
    ...
```

**New Flow:**

1. `this.ngRxStore.dispatch(new AppActions.GetStoresStart());` in component
2. because `GetStoresStart()` is 'registered in reducers it triggers the code for "getAllStores" effect
3. "getAllStores" effect makes a call to DB to get stores info
4. then it calls eithar `GetStoresError()` action or `GetStores(stores)` action
5. `GetStores(stores)` action triggers a reducer which updated the "AppState":

```
    export function storesReducer(state: Store[] = [], action: AppActions.Actions){
        switch(action.type){
            case AppActions.GET_STORES:
                return [...state, ...(action as AppActions.GetStores).payload];
            default:
                return state;
        }
    }
```

6. Then you can get the updated state from the component `this.stores = ngRxStore.select('stores');` as an observable

<br>(->Back To [Table of Contents](#table-of-contents))

### Creating SELECTORS

Why Selectors?

1. **Memoization** First of all, selectors created by `createSelector` are memorized, meaning that they won't be called unnecessarily unless the data in the store has changed. This provides an important performance boost
2. **Easy composition** In functional programming, we can compose different simple, pure functions into more complex ones, thus making the code way more readable and the whole system more maintainable
3. **Cleanliness** We can always easily find from where a particular state is coming, and debug/find issues with no hassle
4. **Consistency** It is always a good idea to do certain things in a single, concise way

There are some rules when creating selectors and states:

1. Selectors must be pure functions
2. Never keep derived state in a store
3. Use the tools provided by NgRx, like

- `createFeatureSelector` (allows us to get a top-level feature state property of the state tree simply by calling it out by its feature name)

```
    const storesFeature = createFeatureSelector<Store[]>('stores');
    const formsInfoFeature = createFeatureSelector<FormInfo[]>('allFormsInfo');
```

- `createSelector` (can be used to select some data from the state based on several slices of the same state)

```
    export const allStores = createSelector(storesFeature, (state: Store[]) => state);
    export const allFormsInfo = createSelector(formsInfoFeature, (state: FormInfo[]) => state);
    export const oneStoreInfo = (index: number) => createSelector(storesFeature, (state: Store[]) => {
        if(state.length > 0){
            return state[index];
        } else {
            return null;
        }
    });
```

- and `Entity.getSelectors`

4. Selectors should be short and do one thing for one result. If two parts of an app use some state in two different forms, don't try to bastardize the selector, but either create two selectors or create the next selector from the first one using `createSelector`. Another approach is to write selector factories.
5. Try to always use named selectors

**Use selectors**

```
    import * as Selectors from '../../shared/store/app.selectors';
    ...
    ngRxStore.select(Selectors.allStores).subscribe((stores) => console.log("All Stores:", stores));
    ngRxStore.select(Selectors.allFormsInfo).subscribe((forms) => console.log("All FormsInfo:", forms));
    ngRxStore.select(Selectors.oneStoreInfo(0)).subscribe((store) => console.log("First store:", store));
```

<br>(->Back To [Table of Contents](#table-of-contents))

## Added Dependencies

- @angular/fire: ^7.2.1
- firebase: ^9.6.8
- @ngrx/store: ^13.0.2
- @ngrx/effects: ^13.0.2
- @fortawesome/angular-fontawesome: ^0.10.1
- @fortawesome/fontawesome-svg-core: ^6.1.0
- @fortawesome/free-solid-svg-icons: ^6.1.0

<br>(->Back To [Table of Contents](#table-of-contents))
