---
layout: post
title:  "Javascript ES6 - Features walkthrough"
summary: "Learn Javascript ES6"
author: xplor4r
date: '2021-01-06 14:35:23 +0530'
category: ["javascript"]
thumbnail: /assets/img/posts/code.jpg
keywords: javascript,es6
permalink: /blog/javascript-es6-features/
usemathjax: false
---


## Understand Mordern JS - ES6

ES6 refers to Ecmascript 2015. The features introduced in the ES6 release were :

- let and const
- Template Literals
- Arrow Functions
- Modules
- Class
- Destructuring
- Rest operator
- Spread operator
- Array functions - map(), reduce(), filter(), find() and findIndex()
- Callbacks and Promises
- Default Function Parameters

### let and const

let and const are block-scoped. Anything inside {} is a block. For ex. for loop, if-else

```js
//value can be changed
let someVariable = 12;

// read-only, value cannot be changed
const PI = 3.14;
```

**Using let :**

when we declare a variable using let keyword, we can assign a new value to that variable later but we cannot re-declare it with the same name.

For example:

```js
let value = 10;
console.log(value); // 10

let value = "hello"; // uncaught SyntaxError : Identifier 'value' has already been declared

value = "hello"; // hello
```

As you can see, we don't get an error in the above code because we're re-assigning a new value to the value variable but we're not re-declaring value again.

Now, take a look at the below code :

```js
// ES5 code
var isValid = true;
if(isValid){
  var number = 10;
  console.log('inside:', number); // inside: 10
}
console.log('outside:', number); //outside : 10
```

As you can see in the above code when we declare a variable with var keyword, it's available outside the if block also.

But in ES6,the case could be different,

```js
let isValid = true;
if(isValid){
  let number = 10;
  console.log('inside:', number); // inside: 10
}
console.log('outside:', number); // Uncaught ReferenceError: number is not defined
```
As you can see in the above code, the outside number is undefined, since let works on a block scope level {}, when we tried to access number outside the block its defined, it throws reference error.

But if there was a number variable outside the if block, then it will work as shown below:

```js
// ES6 Code
let isValid = true;
let number = 20;

if(isValid){
  let number = 10;
  console.log('inside:', number); // inside: 10
}
console.log('outside:', number); // outside : 20
```

We can also create a block by a pair of curly brackets like this:

```js
let i = 10;
{
  let i = 20;
  console.log('inside:',i); //inside: 20
  i = 30;
  console.log('outside:',i); //outside: 30
}
console.log('outside:', i); // outside: 10
```

If we don't have the variable i declared outside, then we'll get an error as can be seen in the below code:

```js
{
 let i = 20;
 console.log('inside:', i); // inside: 20
 i = 30;
 console.log('i again:', i); // i again: 30
}

console.log('outside:', i); // Uncaught ReferenceError: i is not defined

```

**Using const:**

const keywork works exactly the same as let keyword in block scoping functionality. So let's look at how they differ from each other.

When we declare a variable as const, it's considered a constant variable whose value will never change.

In the case of let we're able to assign a new value to that variable later like this:

```js
let number = 10;
number = 20;
console.log(number); // 20
```

But we can't do that in case of const:

```js
const number = 10;
number = 20; // Uncaught TypeError: Assignment to constant variable.
```

We even can't re-declare a const variable.

```js
const number = 20;
console.log(number); // 20
const number = 10; // Uncaught SyntaxError: Identifier 'number' has already been declared
```

Now, take a look at the below code:

```js
const arr = [1,2,3,4];
arr.push(5);
console.log(arr); // [1,2,3,4,5]
```
We said const variable is a constant whose value will never change but we have changed the constant array above. So isn't it contrary?

No ! Arrays are reference types and not primitive types in JavaScript.

So what actually gets stored in arr is not the actual array but only the reference(address) of the memory location where the actual array is stored.

So by doing arr.push(5); we're not actually changing the reference where the arr points to but we're changing the values stored at that reference.

The same is the case with objects:

```js
const obj = {
 name: 'David',
 age: 30
};

obj.age = 40;

console.log(obj); // { name: 'David', age: 40 }
```

Here, also we're not changing the reference of where the obj points to but we're changing the values stored at that reference. So the above code will work but the below code will not work.

```js
const obj = { name: 'David', age: 30 };
const obj1 = { name: 'Mike', age: 40 };
obj = obj1; // Uncaught TypeError: Assignment to constant variable.
```

The above code does not work because we're trying to change the reference that the const variable points to.

So the key point to remember when using const is that, when we declare a variable as a constant using const we cannot re-define and we cannot re-assign that variable but we can change the values stored at that location if the variable is of reference type.

So the below code is invalid because we're re-assigning a new value to it.

```js
const arr = [1, 2, 3, 4];
arr = [10, 20, 30]; // Uncaught TypeError: Assignment to constant variable.
```

But note that, we can change the values inside the array, as seen previously.

The following code of re-defining a const variable is also invalid.

```js
const name = "David";
const name = "Raj"; // Uncaught SyntaxError: Identifier 'name' has already been declared
```

### Template Literals

Template literals are another way of creating strings. You can create mulitiline strings and can embed variables and expression using ${expression} syntax.To create a template string you don't use single or double quotes, you use backtick `

```js
let age = 24;
console.log(`Hi, I am Sujay, I am ${age} years old.`);
// Hi, I am Sujay, I am 24 years old.
```

### Arrow Functions
ES6 gives us a new syntax for defining functions using a fat-arrow.
Arrow functions are mainly syntatic sugar for defining function expressions.

```js
// Regular function
function sum (a,b){
  return a+b;
}

// Arrow Function
var sum = (a,b) => { return a+b; }

```

**Note** : In arrow functions, the behavior of **this** is different. Arrow functions do not default this to the window scope, rather they execute in the scope they are created.

### Modules

A module is a javascript code written in a seperate file. Before ES6 we had to use libraries like CommonJS, requireJS, etc. to work with modules. But now with ES6, JS has its own built-in-modules. The idea is to access a piece of code, only when needed.

#### Import and Export

If we want something declared in a module to be available somewhere else, we export that module using an export statement. You can export any top-level function, class, var, let or const.


- Importing:


```js
//app.js
import {pi, add} from utils;

console.log('pi', pi); // 3.14

console.log('sum', add(2,3)); // 5
```

- Exporting:

```js
//util.js

export const pi = 3.14;
export function add(x,y){
	return x+y;
}

```
To export something as named export, we have to declare it first.

```js
export 'hello'; // this will result in error
export const greeting = 'hello'; // this will work
export { name: 'David' }; // This will result in error
export const object = { name: 'David' }; // This will work
```
All  the functions and variables defined in the file are private to each file and can't be accessed outside the file until we export them. We can use it in another file by importing them.


There are two types of exports:
 - Named Export  (There can be multiple named export, we export it like this:)

 - Default Exports  (There can be only one default export in a single file.

 #### Named Exports

 To export a single value as a named export, we export it like this:

```js
 export const temp = "This is some text to be exported";
```

If we have multiple things to export, we can write an export statement on a seperate line instead of infront of variable declaration and specify the ones needed to be exported in curly brackets:

```js
const temp1 = "This is some dummy text";
const temp2 = "This is some dummy text2";
export {temp1, temp2};
```

Note that, the export syntax is not an object literal syntax. So in ES6, to export something, we can't use key-value pairs like this:

```js
// This is invalid syntax of export in ES6
export { key1: value1, key2: value2 }
```

To import the things we exported as named export, we use the following syntax:

```js
import {temp1, temp2} from './filename';
```

**Note**: while importing something from the file, we dont need to add the **.js** extension to the filename as it's considered by default. The name used while exporting has to match the name we use while importing.

```js
// import from functions.js file from current directory
import {temp1, temp2} from './functions';

//import from functions.js file from parent of current directory
import {temp1} from '../functions';
```

So if you are exporting as:

```js
// constants.js
export const PI = 3.14159;
```
then while importing we have to use the same name used while exporting

```js
import { PI } from './constants';
```

we can't use any other name like this:

```js
import { PiValue } from './constants'; // This will throw an error
```

But if we already have the variable with the same name as the exported variable, we can use the renaming syntax while importing like this:

```js
import { PI as PIValue } from './constants';
```

Here we have renamed PI to PIValue and so we can’t use the PI variable name now, we have to use PIValue variable to get the exported value of PI.

We can also use the renaming syntax at the time of exporting:

```js
// constants.js
const PI = 3.14159;

export { PI as PIValue };
```

then while importing we have to use PIValue like this:

```js
import { PIValue } from './constants';
```

### Class

ES6 introduced a new syntax for creating a class

```js
class Person {
  constructor(name, role){
    this.name = name;
    this.role = role;
  }

  sayHi(){
    return ('Hi ! I am ' + this.name + ', I am a ' + this.role);
  }
}

let person1 = new Person("Sujay", "Backend Developer");

person1.sayHi();

// returns "Hi ! I am Sujay, I am a Backend Developer"
```

#### Default Exports

There can be at most one default export in a single file. You can, however, combine multiple named exports and one default export in a single file.

To declare a default export we add the default keyword in front of the export keyword like this:

```js
//constants.js
const name = "Sujay";
export default name;
```

To import the default export we don't add the curly brackets as we were doing in named export like this:

```js
import name from './constants';
```

If we have multiple named exports and one default exports like this :

```js
//constants.js
export const PI = 3.14159;
export const AGE = 30;
const NAME = "David";
export default NAME;
```

then to import all on a single line we need to use the default exported variable before the curly bracket only.

```js
// NAME is default export and PI and AGE are named exports here
import NAME, {PI, AGE} from './constants';
```

One speciality of default export is that we can change the name of the exported variable while importing:

```js
//constants.js
const AGE = 30;
export default AGE;
```

And in another file, we can use another name while importing

```js
import myAge from './constants';
console.log(myAge); //30
```

Here, we have changed the name of the default exported variable from AGE to myAge.

This works because there can be only one default export so you can name it whatever you want.

Another thing to note about default export is that the export default keyword cannot come before variable declaration like this:

```js
// constants.js
export default const AGE = 30; // This is an error and will not work
```
so we have to use the export default keyword on a separate line like this:

```js
// constants.js

const AGE = 30;
export default AGE;
```

We can, however, export default without declaring the variable like this:

```js
//constants.js
export default {
 name: "Billy",
 age: 40
};
```

and in another file use it like this:

```js
import user from './constants';
console.log(user.name); // Billy
console.log(user.age); // 40
```

There is another way of importing all the variables exported in a file using the following syntax:

```js
import * as constants from './constants';
```
Here we are importing all the named and default exports we have in constants.js and stored in constants variable. So, constants will become an object now.

```js
// constants.js
export const USERNAME = "David";
export default {
 name: "Billy",
 age: 40
};
```

and in another file, we use it as below:

```js
// test.js
import * as constants from './constants';
console.log(constants.USERNAME); // David
console.log(constants.default); // { name: "Billy", age: 40 }
console.log(constants.default.age); // 40
```
If you don’t want to export on separate lines for default and named exports, you can combine it as shown below:

```js
// constants.js
const PI = 3.14159;
const AGE = 30;
const USERNAME = "David";
const USER = {
 name: "Billy",
 age: 40
};

export { PI, AGE, USERNAME, USER as default };

```
Here we are exporting USER as default export and others as named exports.

In another file, you can use it like this:

```js
import USER, { PI, AGE, USERNAME } from "./constants";
```

### Destructuring

Breaking down an array or object in to individual variables.It allows us to "unpack" arrays or objects into a bunch of variables which makes working with arrays and objects a bit more convinient.The variable names should be same as key names.

- Array Destructuring

```js
let a,b;
[a,b] = [10,20];
console.log(a); //10
console.log(b); //20
```

- Object Destructuring

```js
const student = {
  firstname: 'Sujay',
  lastname: 'Kundu'
};

// Object Destructuring
const {firstname, lastname} = student;

console.log(firstname, lastname); //Sujay Kundu
```


### Rest operator

```js
const nSum = (num1, num2, ...args) =>{
  console.log('num1', num1);
  console.log('num2', num2);
  console.log('args', args);
  for(let i=0; i < args.length; i++) {
       sum += args[i]
  }
   console.log(sum);
}

nSum(1,2,3,4,5,6,7);

```

### Spread operator

Spread syntax allows arrays and objects to be expanded into:
  - elements in case of array
  - key-value pairs in case of object

On Arrays :
```js
let mArr1 = [1,2,3,4,5];
let mArr2 = [...mArr1]; // creates a new array
console.log('mArr1', mArr1);
console.log('mArr2', mArr2); //copy of mArr1

// concat

let mArr3 = [7,8];
let mArr4 = [0,...mArr2, ...mArr3];
console.log('mArr4', mArr4); // [0,1,2,3,4,5,7,8]


On Objects :

let mObj1 = {
  name : 'Sujay',
  lastname: 'Kundu'
}

let mObj2 = {
   age: '24',
   gender: 'M'
}

let mObj3 = {...mObj1, ...mObj2};
console.log(mObj3);
// {name: 'Sujay', lastname: 'Kundu',age: '24', gender: 'M'}

```

# Array functions - map(), reduce(), filter(), find() and findIndex()

- Array Function: map()

It iterates the array for us and we can pass a callback function to perform some operation on the each array item, The updated values can be returned by the callback
function to create a new array.

Syntax:

arr.map((item) => {
   // callback function body
})

Example:

```js
const mArr = [1,2,3,4,5];
let newArr = mArr.map((item, i) => {

  // console.log(`Item at pos: ${i} is ${item}`);
   return item * 2;
});

console.log('mArr', mArr);
console.log('newArr', newArr);

// Item at pos : 0 is 1
   Item at pos : 1 is 2
   Item at pos : 2 is 3
   Item at pos : 3 is 4
   Item at pos : 4 is 5

   [5][1,2,3,4,5];
   [5][2,4,6,8,10];
```

- Array Function: reduce()

- Array Function: filter()

- Array Function: find()

- Array Function: findIndex()


### Callbacks and  Promises

### Default function parameters

ES6 has introduced, passing default function parameters :

```js
function showMessage(greeting = "Hello"){
  return "Welome back, " + greeting;
}
```

console.log(showMessage('John')); // Welcome back, John
console.log(showMessage()); // Welcome back, Guest

We can assign any value as a default value to the function parameter.

```js
function display(a=10, b=20, c=b){
  console.log(a, b, c);
}

display();  // 10 20 20
display(40); // 40 20 20
display(1, 30); // 1 30 30
display(1, 30, 40) // 1 30 40
```

In the above code, we have not provided all the arguments to the function. So the above function calls will be the same as below:

```js
display(); // is same as display(undefined, undefined, undefined)
display(40); // is same as display(40, undefined, undefined)
display(1, 30); // is same as display(1, 30, undefined)
```

So if the argument passed is undefined, the default value will be used for the corresponding parameter.

We can also assign complex or calculated value as a default value.

```js
const defaultUser = {
  name: 'Jane',
  location: 'NY',
  job: 'Software Developer'
};

const display = (user = defaultUser, age = 60 / 2 ) => {
 console.log(user, age);
};
display();

/* output

{
  name: 'Jane',
  location: 'NY',
  job: 'Software Developer'
} 30

*/
```

**Note**: null is not equal to undefined

```js
function display(name = 'David', age=35, location = 'NY') {
  console.log(name, age, location);
}

display('David', 35); // David 35 NY
display('David', 35, undefined); // David 35 Netlify
display('David', 35, null); // David 35 null
```
When we pass null as an argument, we’re specifically telling to assign null value to location parameter which is not the same as undefined, so it will not take the default value of NY.

