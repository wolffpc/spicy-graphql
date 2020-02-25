# Spicy GraphQL

![GitHub repo size](https://img.shields.io/github/repo-size/wolffpc/spicy-graphql)
![David](https://img.shields.io/david/wolffpc/spicy-graphql)

Spicy GraphQL is an API implementation using GraphQL that allows users to query information about different Hot Ones episodes and the hot sauces used during the interviews.

Users are also able to create accounts (with hashed and salted passwords) to leave reviews on individual episodes with a 1-5 star rating and optional commentary. 

You can visit the GraphQL Playground website live [here](https://spicy-api.herokuapp.com/). Please note: This is currently running on a free tier heroku instance and may take a minute to "wake up" if it hasn't been used recently.

Ideally I'd like to put together a proper frontend using this API at some point in the future.

## Using Spicy GraphQL

If you've worked with GraphQL before the GraphQL Playground interface should be familiar but if not I've listed some example queries and mutations you could test out yourself. The `DOCS` tab on the right side of the Playground site details all others not listed here.

Get the title, guest, and url link for every interview in season 9
```graphql
query{
  interviews(season:9){
    title
    guest
    link
  }
}
```

Get the name and scoville heat units of all the hot sauces from season 6
```graphql
query{
  sauces(season:6){
    name
    scoville
  }
}
```

Create a user and return the authentication token
```graphql
mutation{
  createUser(
    data:{
      email:"you@example.com"
      handle:"Jon Doe"
      password:"yourpassword"
    }
  ){
    token
  }
}
```

Login using the user you've created and return the authentication token
```graphql
mutation{
  login(
    data:{
      email:"you@example.com"
      password:"yourpassword"
    }
  ){
    token
  }
}
```

For the following mutations you will need to be authenticated. This can be accomplished by setting an authorization http header using the `HTTP HEADERS` section in the GraphQL Playground
```graphql
{
  "Authorization":"Bearer LongAuthenticationTokenGoesHere"
}
```

Get your user information including any reviews you've written
```graphql
query{
  me{
    handle
    email
    review {
       stars
       commentary
       interview {
           season
           episode
       } 
    }
  }
}
```

Create a review for season 9 episode 12 (you can find the ID for any episode using the `interview` query)
```graphql
mutation{
  createReview(
    data:{
      stars:5
      commentary:"This was the best Hot Ones yet!"
      interview:"ck7142ss100ma0776hnzhgb22"
    }
  ){
    commentary
    stars
    interview{
      season
      episode
    }
  }
}
```

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have `npm` installed.
* You have `docker` setup on your system.

## Installing Spicy GraphQL

To setup Spicy GraphQL locally, follow these steps after cloning the repository:

Install Prisma:
```
npm install -g prisma
```

Move into the `spicy-graphql/prisma` directory
```
cd spicy-graphql/prisma
```

To launch Prisma on your machine, you need a Docker Compose file that configures Prisma and specifies the database it can connect to.

Create Docker Compose file
```
touch docker-compose.yml
```

Add Prisma and database Docker images (your database info may differ)
```yml
version: '3'
services:
  prisma:
    image: prismagraphql/prisma:1.34
    restart: always
    ports:
      - '4466:4466'
    environment:
      PRISMA_CONFIG: |
        port: 4466
        databases:
          default:
            connector: postgres
            host: postgres
            port: 5432
            user: prisma
            password: prisma
  postgres:
    image: postgres:10.3
    restart: always
    environment:
      POSTGRES_USER: prisma
      POSTGRES_PASSWORD: prisma
    volumes:
      - postgres:/var/lib/postgresql/data
volumes:
  postgres: ~
```

Launch Prisma and the connected database
```
docker-compose up -d
```

Configure your Prisma API
```
prisma init --endpoint http://localhost:4466
```

Deploy the Prisma API
```
prisma deploy
```

Generate your Prisma client
```
prisma generate
```

Navigate back to the root of the project
```
cd ..
```

Create a config directory
```
mkdir config
```

Add a `dev.env` file
```
touch dev.env
```

Configure the appropriate environment variables
```
PRISMA_ENDPOINT=http://localhost:4466
PRISMA_SECRET=yourprismasecret
JWT_SECRET=yourjsonwebtokensecret
```

Run the server!
```
npm run dev
```

You should now be able to visit your Prisma server at `localhost:4466` (and the admin interface at `localhost:4466/_admin`) and your Prisma client at `localhost:4000`. 

## Contact

If you want to contact me you can reach me at <wolffpc1@gmail.com>.