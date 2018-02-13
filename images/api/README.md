# API description

## Auth

### `/me`
  
#### headers

Authorization bearer: [token]

#### query
path 

#### body
/

#### response
```
{
    "mail": "test@crashlab.be",
    "organisation": "216a4f90-0d20-11e8-ad97-b5059c92bb48"
}
```

---

### `/login`

#### headers

/

#### body
```
{
  password: [user password],
  mail: [user email]
}
```

#### response
```
{
    token: [JWT - token]
}
```


---

### `/logout`

#### headers

Authorization bearer: [token]

#### body
/

#### response
200

---

### `/register`

#### headers

Authorization bearer: [token]

#### body
/

#### response
200


## Schema

## Cells

## Answers


## Organisations

## Users

## Participants

