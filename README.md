Reactive Dataflow
=================
Reactive Dataflow is an application architecture for unidirectional data flow based upon [Rx](http://reactivex.io/). 
It is conceptually similar to [Flux](https://github.com/facebook/flux) and [Redux](https://github.com/reactjs/redux), 
but subsitutes the use of state reducer functions and explict dispatchers with Rx combinator functions and schedulers.

Application Architecture
========================
A Reactive Dataflow application is comprised of three key primitives: views, models and state stores. 

Views
-----
A view is a function which transforms a model (aka. props) to a visual representation. Generally speaking views ought 
to be stateless, but may contain internal state to facilitate purely presentational features, such 
as animations and transition effects.

Models
------
A model represents a state to be presented in a view. Unlike Flux/Redux state, Reactive Dataflow models also
include functions which can be used to facilitate a state change. Reactive Dataflow models are comprised of three 
field types:

  * **Values**: Any immutable data type to be presented in a view.
  * **Commands**: A unit function invoked in response to a user action, for instance a button click. 
    A command includes the boolean field *canExecute* which indicates whether the command can 
    execute in its current state.
  * **Properties**: The combination of a value and a function that can be invoked to trigger an update to the value. A property
    includes the boolean field *canUpdate* which indicates whether the property can be updated in its current state.

A Reactive Dataflow application is built by binding an Observable stream of model states to a view rendering function.

State Stores
------------
The backing state container of a Reactive Dataflow application is a state store. A Reactive Dataflow state store 
is similar to a Flux/Redux store. In the typical pattern, a state store is comprised of an observable state stream, 
along with functions (conceptually similar to Flux actions) to initiate a state change operation.

Javascript Implementation for React
===================================
The javascript implementation provided by this library is comprised of two small libraries:
  * **reactive-dataflow-models**: Utility functions for building models.
  
  ```
  npm install --save reactive-dataflow-models
  ```
  
  * **reactive-dataflow-react**: A react component that binds an Observable stream of models to a 
    React view renderinig function.
    
  ```
  npm install --save reactive-dataflow-react
  ```

Example
=======
```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactiveDataflowComponent from 'reactive-dataflow-react';
import * as RxModels from 'reactive-dataflow-models';
import * as Rx from 'rx';

const counterStore = (() => {
  const countState = new Rx.BehaviorSubject(0);

  return {
    state: countState.asObservable(),
    setCount: value => countState.onNext(value),
  };
})();

const counterModel = counterStore.state.map(count => ({
  count,
  increment: RxModels.createCommand(
    () => counterStore.setCount(1 + count),
  ),
}));

const CounterView = props => (
  <div>
    <div>Count: { props.count }</div>
    <button
        disabled={ !props.increment.canExecute }
        onClick={ props.increment.execute }
    >
      Increment
    </button>
  </div>
);

ReactDOM.render(
  <ReactiveDataflowComponent
    render={ CounterView }
    source={ counterModel }
  />,
  document.getElementById('container'),
);

```



