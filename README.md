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

1. Create an ACTION

An action in Ngrx/store is two things:

- A type in the form of a string. It describes what's happening.
- It contains an optional payload of data.

```
    // Define the type of action (which is in the form of a string constant)
    export const GET_STORES = 'GetStores';
    ...

    // Create a class for each action with a constructor that allows us to pass in the payload (not a required step, but it does provide you with strong typing)
    export class GetStores implements Action {
        readonly type: string = GET_STORES;
        constructor(public payload: Store[]){}
    }
    ...

    // We're exporting all of our action classes for use within our reducer
    export type Actions = GetStores;
```

## Added Dependencies

- @angular/fire: ^7.2.1
- firebase: ^9.6.8
- @ngrx/store: ^13.0.2
