<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
/>
<link rel="stylesheet" href="./search.css">

![ALICE Logo](./assets/logo.png)

# A.L.I.C.E. Documentation

<div class="searchbox algolia-autocomplete ds-dropdown-menu">
  <input type="text" placeholder="Search the docs..." aria-label="Search">
</div>

## Resources

- [01/10/18 - Technical Training Slides](https://docs.google.com/presentation/d/11QTk76_R_FRc5xrgLrkG-NjsIItYDNcLWG6RgiICm48/edit?usp=sharing)

## Table of Contents

| Steps                                  | Frontend | ML Models | DevOps |
| -------------------------------------- | :------: | :-------: | :----: |
| [React](./react.md)                    |    ✅    |           |        |
| [D3 and Nivo](./d3.md)                 |    ✅    |           |        |
| [Document Clustering](./clustering.md) |          |    ✅     |        |
| [Named Entity Recognition](./ner.md)   |          |    ✅     |        |
| [Relation Extraction](./relation.md)   |          |    ✅     |        |
| [Sentiment Analysis](./sentiment.md)   |          |    ✅     |        |
| [Text Classifier](./classifier.md)     |          |    ✅     |        |
| [Text Summarizer](./summary.md)        |          |    ✅     |        |
| [Topic Modelling](./topics.md)         |          |    ✅     |        |
| [WordCloud](./wordcloud.md)            |          |    ✅     |        |
| [Backend Flask Server](./backend.md)   |          |           |   ✅   |
| [Docker](./docker.md)                  |          |           |   ✅   |
| [Openshift](./openshift.md)            |          |           |   ✅   |

## Getting Help

If there is any issue that is not addressed in this document, kindly [create an issue on this Github repository](https://github.com/GovTechSG/opencerts-documentation/issues).

<script src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>
<script>
// Run the command below in the terminal to UPDATE SEARCH
// ALGOLIA_API_KEY='3ae9a6bbd0e6106dedefda9de3720d34' bundle exec jekyll algolia
  docsearch({
    apiKey: '2f233eb87b9fc4fe2d15b02c8aabeb95',
    indexName: 'alice_documentation',
    appId: 'JTIYY2CRNJ', // Should be only included if you are running DocSearch on your own.
    inputSelector: 'input',   // Replace inputSelector with a CSS selector matching your search input
    debug: true, // Set debug to true if you want to inspect the dropdown
  });
</script>
