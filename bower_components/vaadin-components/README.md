# Vaadin Components

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/vaadin-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or [discuss on the vaadin.com forum](https://vaadin.com/forum/#!/category/9848927/)

Vaadin Components is an evolving set of custom HTML elements, built using [Polymer](https://www.polymer-project.org), for building mobile and desktop web applications in modern browsers.

### Component examples and documentation

View live examples and source code side-by-side for individual custom elements.

| Component | Description |
| --- | --- |
| [<**vaadin-grid**>](https://github.com/vaadin/vaadin-grid) &middot; [Examples](https://cdn.vaadin.com/vaadin-components/latest/vaadin-grid/demo/) &middot; [API](https://cdn.vaadin.com/vaadin-components/latest/vaadin-components/apidoc/#vaadin-grid) | Data grid for showing large amounts of tabular data. |


### Quickstart

 Get a quick test-drive of the custom elements by forking one of the following JSFiddles:

- &lt;**vaadin-grid**&gt;
 - [Data generated on-the-fly](http://jsfiddle.net/jounik/tvk1235r/)
 - [JSON data from a URL](http://jsfiddle.net/jounik/tLour4gv/)

### Installation

We offer three ways to use Vaadin Components in your project: Bower, CDN and ZIP archive. The only difference between the options is the URL you use to import the necessary files into your HTML page.

#### 1. Create a new folder for your project

 ```shell
 $ mkdir my-project
 $ cd my-project
 ```

#### 2. Install Vaadin Components

- ##### Bower

 We recommend using [Bower](http://bower.io) for managing your front-end dependencies. Follow the [Bower installation instructions](http://bower.io/#install-bower), then run the following command inside your project folder to install the most recent stable release.

 ```shell
 $ bower install --save vaadin-components
 ```

 This will download Vaadin Components and its dependencies to the `bower_components` folder inside your project's folder.

 If you want to experiment with current development code, download the snapshot version running:

 ```shell
 $ bower install --save vaadin-components#master
 ```

- ##### CDN

 You can use Vaadin Components from CDN (see example below). This is especially convenient for services like JSFiddle, Codepen.io, etc.

   `https://cdn.vaadin.com/vaadin-components/latest/vaadin-grid/vaadin-grid.html`

 _*Note*: that we have a fragment in the url with the version to use, so you could for instance replace it with the snapshot version_


- ##### Download ZIP

 1. Download the latest ZIP archive from [vaadin.com/download](https://vaadin.com/download#components)
 2. Extract the archive under your project folder, for example `deps`

#### 3. Create a HTML file

 Create a new HTML file inside your project folder and copy the following code into it (choose one of the options how to import Vaadin Components in the `<head>` section):

 > **Note on serving the files during development**, when using Bower or the ZIP archive:

 > Due to browser security restrictions, serving HTML imports from a `file:///` URL does not work. You need a web server to view pages where you use custom elements. One simple option is to use the [`serve`](https://www.npmjs.com/package/serve) NPM package.

  ```html
<!doctype html>
<html>
  <head>
    <!-- Import Web Component polyfills and the components that you want -->

    <!-- CDN -->
    <script src="https://cdn.vaadin.com/vaadin-components/latest/webcomponentsjs/webcomponents-lite.js"></script>
    <link href="https://cdn.vaadin.com/vaadin-components/latest/vaadin-grid/vaadin-grid.html" rel="import">

    <!-- Bower -->
    <!-- <script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
    <link href="bower_components/vaadin-components/vaadin-components.html" rel="import"> -->

    <!-- ZIP archive -->
    <!-- <script src="deps/vaadin-components/webcomponentsjs/webcomponents-lite.js"></script>
    <link href="deps/vaadin-components/vaadin-components/vaadin-components.html" rel="import"> -->
  </head>
  <body>

    <vaadin-grid selection-mode="multi">
      <table>
        <!-- Define the columns -->
        <col name="index" header-text="#" width="48">
        <col name="user.picture.thumbnail" width="54">
        <col name="user.name.first" header-text="First Name">
        <col name="user.name.last" header-text="Last Name">
        <col name="user.email" header-text="Email" flex>
      </table>
    </vaadin-grid>

    <script>
      // The Web Components polyfill introduces a custom event we can
      // use to determine when the custom elements are ready to be used
      document.addEventListener("WebComponentsReady", function () {

        // Reference to the grid element
        var grid = document.querySelector("vaadin-grid");

        // Fetch some JSON data from a URL
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
              var json = JSON.parse(xhr.responseText);

              // Use the returned data array directly as the data source
              // (keeping all the data source items in the browser's memory)
              grid.data.source = json.results;
            }
          }
        }
        xhr.open("GET", "http://api.randomuser.me/?results=100", true);
        xhr.send();

        // Add a renderer for the index column
        grid.columns[0].renderer = function(cell) {
            cell.element.innerHTML = cell.row.index;
        }

        // Add a renderer for the picture column
        grid.columns[1].renderer = function(cell) {
            cell.element.innerHTML = '<img src="' + cell.data + '" style="width: 24px;">';
        }
      });
    </script>

  </body>
</html>
  ```
