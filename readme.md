# Firefose

Firefose is a [Firebase](https://firebase.google.com/) object modeling tool designed to work in an asynchronous environment.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install Firefose.

```bash
npm install firefose --save
```


# Importing

```javascript
// Using Node.js
const firefose = require('firefose');

// Using ES6 imports
import firefose from 'firefose';
```
# Connection
You can connect to Firefose using services account key from firebase. Details of admin account SDK can be found [here](https://firebase.google.com/docs/admin/setup).

Connect methods has 2 parameters.
- **credentials**- which should be an object with following keys.
    - type
    - project_id
    - private_key_id
    - private_key
    - client_email
    - client_id
    - auth_uri
    - token_uri
    - auth_provider_x509_cert_url
    - client_x509_cert_url
- **databaseURI**

```javascript
const {connect} = require('firefose');

const credentials = {
    type: 'type',
    project_id: "project_id",
    private_key_id: "private_key_id",
    private_key: "private_key",
    client_email: "client_email",
    client_id: "client_id",
    auth_uri: "auth_uri",
    token_uri: "token_uri",
    auth_provider_x509_cert_url: "auth_provider_x509_cert_url",
    client_x509_cert_url: "client_x509_cert_url"
}

await connect(credentials, "databaseURI")
```
# Types
Firefose supports following data types.
- **String**: string
- **Number**: number (integer or float)
- **Boolean**: boolean
- **Object**: Javascript object
- **Array**: Javascript array
- **Date**: Javascript date
- **ObjectId**: Reference to other schema

# Schema
Next you can build schema. Schema constructor has 2 parameters.
- Schema Definations - Each Key in schema can have following properties.
    - type: Type from Firefose types
    - required (optional): Boolean indicatiing if the field is required
    - default (optional): Any data type specifying default value
    - ref (optional): string reference of to other schemas
- Options (optional)
    - Timestamp: Boolean value (Default false)


```javascript
const {Schema} = require('firefose');
const {String, Number, Array} = require('firefose/types');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    active: {
        type: Number,
        default: 1
    },
    password: {
        type: String,
        required: true
    }
}, {timestamp: true});
```
# Model
You can create model from the schema. It requires 2 parameters.
- collection: String value for the firestore collection
- schema: An instance of Schema.
```javascript
const {model} = require('firefose');

const User = model("users", userSchema);
```

# Usage
Model object has following methods
## create
This methods creates a document in the respective firestore collection.

**Requires**
- data: An object of the data to be stored in firestore

**Returns**
- A promise of the data stored in the firestore collection

```javascript
const data = await User.create({name: "John Doe", email: "john@gmail.com", password: "123456"});
/*
{
  id: 'kWVzukkK2XXqhmJkS6Lb',
  name: 'John Doe',
  email: 'john@gmail.com',   
  password: '123456',        
  active: 1
}
*/
```
## findById
This methods returns a single document from the collection.

**Requires**
- id: id of the document

**Returns**
- Promise of the data from collection

```javascript
const data = await User.findById('kWVzukkK2XXqhmJkS6Lb');
/*
{
  id: 'kWVzukkK2XXqhmJkS6Lb',
  name: 'John Doe',
  email: 'john@gmail.com',   
  active: 1,
  password: '123456'
}
*/
```

## find

This method can be used to get one or more documents from firestore. You can use following methods with find.
- where: Specifing conditions
- orderBy: Ordering data by a field
- limit: Limiting total documents returned from firestore
- offset: Offset on the data returned from firestore
- populate: Populates referneces to other schema
- execute: This method is required at the end of each query with find

Differtent usages of this method are as following:

```javascript
//returns all the  posts in collection
const posts = Post.find().execute();
/*
[
  {
    id: 'qXdmXL1ebnE2aAMRJLBt',
    user: { id: 'NLQklOyIeP6FChAPtMck' },
    createdAt: 2022-06-20T14:17:53.986Z, 
    updatedAt: 2022-06-20T14:17:53.986Z, 
    content: 'This is a test post',      
    title: 'Hello World 2'
  },
  {
    id: 'zHsHFjSQ0MCcrIgnilN1',
    user: { id: 'NLQklOyIeP6FChAPtMck' },
    title: 'Hello World',
    createdAt: 2022-06-20T14:16:04.658Z,
    updatedAt: 2022-06-20T17:35:34.088Z,
    content: 'content updated'
  }
]
*/
```
```javascript
// returns conditional data
const data = await User.find()
            .where('name', '==', 'John Doe')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .offset(2)
            .execute();
/*
[
  {
    id: 'TBI3l7bp0YCNZfoOlKuR', 
    active: 1,
    email: 'sdfsdfsdf',
    name: 'John Doe',
    password: '123456'
  }
]
*/
```
```javascript
// returns posts populated with users
const posts = await Post.find().populate('user').execute();
/*
[
  {
    id: 'qXdmXL1ebnE2aAMRJLBt',
    updatedAt: 2022-06-20T14:17:53.986Z,
    content: 'This is a test post',     
    createdAt: 2022-06-20T14:17:53.986Z,
    user: {
      id: 'NLQklOyIeP6FChAPtMck',       
      posts: 'aa',
      email: 'sdfsdfsdf',
      name: 'jack',
      password: '123456',
      active: 1
    },
    title: 'Hello World 2'
  },
  {
    id: 'zHsHFjSQ0MCcrIgnilN1',
    content: 'content updated',
    updatedAt: 2022-06-20T17:35:34.088Z,
    title: 'Hello World',
    user: {
      id: 'NLQklOyIeP6FChAPtMck',
      password: '123456',
      name: 'jack',
      email: 'sdfsdfsdf',
      posts: 'aa',
      active: 1
    },
    createdAt: 2022-06-20T14:16:04.658Z
  }
]
*/
```

## updateById
This method can be used to update the content of an existing document in collection.

**Requires**
- id: Id of the document
- data: Data to be updated

**Returns**
- Promise of the id

```javascript
const data = await User.updateById('TBI3l7bp0YCNZfoOlKuR', {password: 'new password'});
/*
TBI3l7bp0YCNZfoOlKuR
*/
```

## deleteById
This method can be used to delete an existing document in collection.

**Requires**
- id: Id of the document

**Returns**
- Promise of the id

```javascript
const data = await User.deleteById('TBI3l7bp0YCNZfoOlKuR');
/*
TBI3l7bp0YCNZfoOlKuR
*/
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)