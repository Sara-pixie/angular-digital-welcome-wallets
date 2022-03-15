# Angular Digital Welcome Wallets

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.2.

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

## How to push data to Firestore DB

in component method:

```
    db.list('FORM').push(newFormInfo);
```

## NgRx Store

https://coursetro.com/posts/code/151/Angular-Ngrx-Store-Tutorial---Learn-Angular-State-Management

**npm install @ngrx/store**

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
        GetStores |
        GetFormsInfo |
        AddFormInfo;
```

### Define AppState

```
export interface AppState {
  readonly stores: Store[];
  readonly allFormsInfo: FormInfo[];
}

```

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

## Added Dependencies

- @angular/fire: ^7.2.1
- firebase: ^9.6.8
- @ngrx/store: ^13.0.2
