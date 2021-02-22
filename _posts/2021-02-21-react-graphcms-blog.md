---
layout: post
title:  "Build and Deploy a Blog using React, Typescript and GraphCMS"
summary: "Learn how to build and deploy a Blog App using React, Typescript and GraphCMS"
author: xplor4r
date: '2021-02-21 14:35:23 +0530'
category: ["react", "blog","typescript", "graphql", "graphcms", "bootstrap", "netlify"]
thumbnail: /assets/img/posts/blog-built-using-react-typescript-graphcms.png
keywords: react graphcms typescript, deploy blog using react graphql
permalink: /blog/build-a-blog-using-react-typescript-graphql-graphcms/
usemathjax: false
---

In this article, we will see how to create a blog app using React, Typescript and GraphQl :

Let's start by building our base:

```s
$ npx create-react-app myblog
$ cd myblog
```

Then we need to install our dependencies :

```s
$ yarn add react react-dom  bootstrap jquery popper.js react-bootstrap react-router-bootstrap react-router-dom
```
Installing Typescript and Types :

```s
$ yarn add typescript @types/node @types/react @types/react-bootstrap @types/react-dom @types/react-router-bootstrap
```

Installing Graphql

```s
$ yarn add graphql @apollo/client
```
Create a tsconfig.json and add this :

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "./src/**/*.ts"
  ]
}

```

Now, our typescript setup is ready. We need to change all our files with .js extention to .tsx

### Setting Up GraphCMS

We need to create a account in GraphCMS. Add create content model for our Blog.

After we have created our model, We need to get our Graphql API Endpoint. This API endpoint will help us query our data from GRAPHCMS.
It will look something like this url 'https://api-ap-northeast-1.graphcms.com/v2/ckl88sdscw296sxk01xs1gyvefbb/master'

### Setting up our Graphql Client in React :

Open index.tsx and add this :

```ts
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';


// Apollo client
const client = new ApolloClient({
  uri: YOUR_GRAPHCMS_API_ENDPOINT_GOES_HERE,
  cache: new InMemoryCache()
});

ReactDOM.render(
 <ApolloProvider client={client}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </ApolloProvider>,
  document.getElementById('root')
);

reportWebVitals();
```

Create our Header and Footer components inside components folder :

components/Header/index.tsx

```ts
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { Button, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Header.css';

interface IProps {
    brand?: string;
}

const Header: React.FC<IProps> = (props: IProps) => (
      <Navbar bg="light" expand="md" fixed="top" className="justify-content-between">
        <LinkContainer to="/">
          <Navbar.Brand className="font-weight-bold text-muted">
             <h6>{props.brand}</h6>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="top-nav"/>
        <Navbar.Collapse id="top-nav" className="justify-content-end">
            <Nav className="ml-auto">
                <LinkContainer to="/blog">
                    <Nav.Link>Blog</Nav.Link>
                </LinkContainer>
            </Nav>
        </Navbar.Collapse>
      </Navbar>
);

Header.defaultProps = {
    brand: 'MyApp',
}

export default Header;
```

and components/Footer/index.tsx

```ts
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import './Footer.css';

interface IProps {
    brand?: string;
}

const Footer: React.FC<IProps> = (props: IProps) => (
        <p className="footerText"> © Copyright { props.brand }. All Rights Reserved. 2021</p>
);

Footer.defaultProps = {
    brand: 'MyApp',
}

export default Footer;
```


Create a Layout.tsx

```ts
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';
import Blog from './pages/Blog';
import Post from './pages/Blog/Post';
import Home from './pages/Home';


const Layout: React.FC = () => {
    return(
        <Router>
           <div>
              <Header />
                <main>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/blog" component={Blog} />
                        <Route path="/post/:slug" component={Post} />
                    </Switch>
                </main>
                <Footer />
            </div>
        </Router>
    )
};

export default Layout;
```

Now let's import our Layout in our App

In our App.tsx

```ts
import * as React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import Layout from "./Layout";

class App extends React.Component {
  public render(){
    return(
       <Container fluid>
        <Layout />
      </Container>
    )
  }
}


export default App;
```

Now let's create our pages for Blog. Create a Blogs component at pages/Blog/index.tsx to query all our Blog posts.

```ts
import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Blog.css';

interface BlogPosts{
    id: string,
    title: string,
    excerpt: string,
    slug: string,
    coverImage: {
        fileName: string,
        url: string
    }
}

interface BlogData {
    posts: BlogPosts[];
}

const GET_BLOG_POSTS = gql`
 query GetBlogPosts {
    posts {
        id
        title
        excerpt
        slug
        coverImage {
          fileName
          url
        }
      }
   }
`;

const  Blog = () => {
    const { loading, data } = useQuery<BlogData>(GET_BLOG_POSTS);
    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="blogTitle"> Blog</h1>
                    <p className="blogSubTitle">  Articles on Freelancing, Tech, Engineering,Products and Business </p>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                        <h4> Recent Articles : </h4>

                          <Row className="blogCardsContainer">
                                {data && data.posts.map(post => (
                                    <Card className="blogCard">
                                        <Card.Img variant="top" src={post.coverImage.url} alt={post.coverImage.fileName} />
                                        <Card.Body>
                                        <Card.Title>{post.title}</Card.Title>
                                        <Card.Text>
                                            {post.excerpt}
                                        </Card.Text>
                                          <Link to={`/post/${post.slug}`}>
                                              <Button variant="success" size="sm"> Read More</Button>
                                          </Link>
                                        </Card.Body>
                                        <Card.Footer>
                                        <small className="text-muted">Last updated 3 mins ago</small>
                                        </Card.Footer>
                                    </Card>
                                ))}
                           </Row>

                </Col>
            </Row>
        </Container>
    )
}

export default Blog;
```

To fetch single posts, we can create a post component at /pages/Blog/Post.tsx

```ts
import { gql, useQuery } from '@apollo/client';
import * as React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './Blog.css';

interface PostData{
    id: string,
    date: string,
    createdAt: string,
    title: string,
    excerpt: string,
    tags: string,
    slug: string,
    coverImage: {
      fileName: string,
      url: string
    },
    author: {
      name: string
    },
    content: {
      html: any
    }
}


const GET_BLOG_POST = gql`
    query getBlogPost($slug: String) {
        post (where: {slug: $slug}) {
            author {
               name
            }
            createdAt
            date
            id
            excerpt
            slug
            title
            tags
            coverImage{
                url
                fileName
            }
            content{
                html
            }
      }
    }
`;


interface RouteParams {
   slug: any
 }



const BlogPost: React.FC<RouteParams> = () => {
    // useQuery<Data>(Query, variables)
    const params = useParams<RouteParams>();
    const { loading, data } = useQuery<PostData>(GET_BLOG_POST, { variables : { slug: params.slug } });

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="blogTitle"> Blog</h1>
                </Col>
            </Row>
            <Row>
                <Col lg={10} md={{ span: 6, offset: 1 }}>
                    {loading ? (
                        <p>Loading ...</p>
                    ):(
                        <article className="blogArticle">
                            <h1 className="blogPostTitle"> {data.post.title}</h1>
                            <p className="blogPostSubtitle"> <p dangerouslySetInnerHTML={{ __html: data.post.excerpt}} /></p>
                            <span className="blogPostCoverImageContainer">
                                <Image src={data.post.coverImage.url} alt={data.post.coverImage.fileName} className="blogPostCoverImage" />
                             </span>
                            <p dangerouslySetInnerHTML={{ __html: data.post.content.html}} />
                       </article>
                    )}

                </Col>
            </Row>
        </Container>
    )
}

export default BlogPost;
```

Great ! we now have a blog. Let's test it out :

```s
$ yarn run start
```
This will start our server at http://localhost:3000

If you want to run a production build :

```s
$ yarn run build
```
This will create a build directory with all the static files that are ready to serve.
You can upload in any static hosting and it will be live.  (Eg. using Netlify, Github Pages or Vercel)

Happy Blogging !
