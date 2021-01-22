---
layout: post
title:  "Adding Real-Time Search To Jekyll Site using Algolia"
summary: "Learn how to integrate Algolia Search in Jekyll Site"
author: xplor4r
date: '2020-06-18 14:35:23 +0530'
category: ["jekyll","ruby","git"]
thumbnail: /assets/img/posts/code.jpg
keywords: jekyll blog,algolia,search
permalink: /blog/how-to-add-realtime-search-to-your-devlopr-jekyll-blog-using-jekyll-algolia/
usemathjax: false
---


## How to add realtime search to your devlopr-jekyll blog using jekyll-algolia

In this tutorial, I will show you on how you can add a search to your jekyll blog using Algolia. Let's get started :

First we need to create a algolia account to get a Algolia API Key, which we will use to index our blog pages:

Create a Account in Algolia using this - [https://www.algolia.com/api-keys](https://www.algolia.com/api-keys) , and create a account in algolia

![add instant search to jekyll using jekyll algolia](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,q_auto:best,w_auto/q_auto:best/v1592648040/sujaykundu.com/jekyll-algolia-1.webp)

After you are logged, We need to create a application :

### Installation

The plugin requires at least Jekyll 3.6.0 and Ruby 2.3.0.

First, add the jekyll-algolia gem to your Gemfile, in the :jekyll_plugins section.

# Gemfile

```ruby
group :jekyll_plugins do
  gem 'jekyll-algolia', '~> 1.0'
end
```

Once this is done, download all dependencies using:

`$ bundle install`

Configuration:

We need to add our algolia application settings in our blog's _config.yml file:

```yaml
algolia:
  application_id: your_application_id
  index_name: blog_posts # You can replace that with whatever name you want
  files_to_exclude: []
  nodes_to_index: 'article'
  search_only_api_key: your_application_search_only_api_key
```

Replace your_application_id and your_application_search_only_api_key with your application generated keys.

Once done, Run the jekyll algolia plugin,

Once your application ID is setup, you can run the indexing by running the following command:

```bash
$ ALGOLIA_API_KEY='your_admin_api_key' bundle exec jekyll algolia
```

If you are using Windows. You might need to set a environment variable for the API key like this :

```shell
set ALGOLIA_API_KEY=your_admin_api_key
```

Then run this command :

```bash
jekyll algolia ALGOLIA_API_KEY
```

Then it will start indexing process:

Note that ALGOLIA_API_KEY should be set to your admin API key.

Once run it will start indexing your blog posts.

You can go to the algolia dashboard and check the updated indexes in the Indices section.

![jekyll algolia search optimizatio](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,q_auto:best,w_auto/q_auto:best/v1592648041/sujaykundu.com/jekyll-algolia-2.webp)

Building the UI :

We will be using Instantsearch library to build the user interface for the search . You can read the documentation over here:  <https://github.com/algolia/instantsearch.js>

This is the html in includes/algolia_search.html to show search results , which you can modify according to your needs:

```jsx
<style>
    #search-searchbar{
      width: 100%;
      text-align: center;
      margin-top: 20px;
    }

    .card-thumbnail{
      float:left;
      width:200px;
      height:200px;
      margin-right:40px;
    }

  .ais-search-box {
    margin-top: 15px;
    margin-bottom: 15px;
    position: relative;
    max-width: 400px;
    width: 100%;
  }
  .ais-search-box--input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font: inherit;
    background-color: var(--nav-color) !important;
    display: inline-block;
    border: 1px solid #111;
    color: #ff7601 !important;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 1px 0 rgba(85,95,110,.2);
    box-shadow: 0 1px 1px 0 rgba(85,95,110,.2);
    -webkit-transition: background .4s ease,-webkit-box-shadow .4s ease;
    transition: box-shadow .4s ease,background .4s ease;
    transition: box-shadow .4s ease,background .4s ease,-webkit-box-shadow .4s ease;
    padding: 10px 10px 10px 35px;
    vertical-align: middle;
    white-space: normal;
    height: 100%;
    width: 100%;
}

  .ais-hits--item{
    float:left;
    width: 100% !important;
  }

  #search-container, .search-card{
     width: 100%;
  }

</style>

    <script>
    /* Instanciating InstantSearch.js with Algolia credentials */
    const search = instantsearch({
      appId: 'your_algolia_id',
      indexName: 'your_algolia_index_name',
      apiKey: 'your_algolia_api_key'
    });

    search.addWidget(
      instantsearch.widgets.searchBox({
        container: '#search-searchbar',
        placeholder: 'Search into posts...',
        poweredBy: true
      })
    );

    search.addWidget(
      instantsearch.widgets.hits({
        container: '#search-hits',
        templates: {
          item: function(hit) {
            return `
                        <div class="card search-card">
                            <div class="card-body center">
                                <img class="card-thumbnail" src="${ hit.thumbnail }" />
                                <h4 class="card-title">${ hit.title }</h4>
                                <h6 class="card-subtitle mb-2 text-muted">${moment.unix(hit.date).format('MMM D, YYYY')}</h6>
                                <p class="card-body"> ${ hit.summary } </p>
                                <a href="${hit.url}" data-disqus-identifier="${hit.url}" class="btn btn-dark btn-lg">Read</a>

                            </div>
                        </div>
            `;
          }
        }
      })
    );
```

You might like to checkout the official documents [here](https://blog.algolia.com/instant-search-blog-documentation-jekyll-plugin/) -  for more information on the alogolia api configurations.

You can check and modify your indexed search results from the algolia app dashboard :

![Updating algolia indexed search results](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,q_auto:best,w_auto/q_auto:best/v1592648043/sujaykundu.com/jekyll-algolia-3.webp)

If you are using [devlopr-jekyll](https://github.com/sujaykundu777/devlopr-jekyll) you dont have to do anything with regards to UI for search. You can checkout the implementation over there and experience the search.

Hope you like it. Don't forget to subscribe for cool web dev tricks coming on way.