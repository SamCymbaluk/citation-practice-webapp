# MLA Citation Game

This is a web app built using Foundation for Apps for Cathedral High School.

This app provides teachers and instructors as easy way to help their students practice MLA 8 citations.

## Requirements

You'll need the following software installed to get started.

  - [Node.js](http://nodejs.org): Use the installer for your OS.
  - [Git](http://git-scm.com/downloads): Use the installer for your OS.
    - Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
  - [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `npm install -g gulp bower`
    - Depending on how Node is configured on your machine, you may need to run `sudo npm install -g gulp bower` instead, if you get an error with the first command.

## Setup

Clone this repository.

```bash
git clone https://github.com/SamCymbaluk/citation-practice-webapp.git
```

Change into the directory.

```bash
cd citation-practice-webapp
```

Install the dependencies. If you're running Mac OS or Linux, you may need to run `sudo npm install` instead, depending on how your machine is configured.

```bash
npm install
bower install
```

While you're working on your project, run:

```bash
foundation watch
```

## Deploy
Once you have setup the project, follow these steps to deploy the web app to a production environment.

#### 1. Setup the backend
This web app relies on a RESTful NodeJS backend.
Click [here](https://github.com/SamCymbaluk/citation-practice-backend) and follow the setup instructions before continuing.

#### 2. Set the backend URL
To point the web app at the backend you just setup, navigate into the [/client/assets/js/controllers](/client/assets/js/controllers) folder.
Here, you will see a few Controller files. Go into each file and replace the URLs from the ajax requests with the URL of the backend you just setup (defaults to `http://cathedralgaels.ca:3001`).

#### 3. Compile
When inside the `citation-practice-webapp` folder, run:
```bash
gulp build
```
This will compile the app into the build folder

#### 4. Deploy the front end
To complete the deploy process, simply copy the contents of the `build` folder that was created in step 3 into the root directory of your web server.
