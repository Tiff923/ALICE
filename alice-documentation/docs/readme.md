# A.L.I.C.E. Documentation

Now on [https://docs.alice.io](https://docs.alice.io)

## Run locally

First install bundler if you don't have it

```bash
sudo gem install bundler
```

Install all gem dependencies.

```bash
bundle install
```

We use jekyll to run a local copy of the site.

```bash
bundle exec jekyll serve
```

## Update search index

```bash
ALGOLIA_API_KEY='your_admin_api_key' bundle exec jekyll algolia
```
