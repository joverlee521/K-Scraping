# k-Scraping

[k-Scraping](http://jl-kscraping.herokuapp.com/) is a full-stack application that scrapes Korean Drama news from the web!

## About

The purpose of this project is to learn the process of web scraping and the storage of data utilizing MongoDB and Mongoose. The incorporation of Mongoose allows the establishment of associations between documents of different models, such that articles are easily displayed with their associated comments. Passport.js is included to add Google OAuth 2.0 to differentiate between individual users, supporting personalized bookmarks and comments. 

## How To

### Main Page

* The landing page displays the five latest articles in the database.

    ![Main Page](/public/images/homepage.png)

* Clicking on "Get Latest k-Scraps" will scrape the articles seen at [Dramabeans News](http://www.dramabeans.com/news/)

* If the scrape was successful, the new articles will replace the current articles on the page.

    ![Latest Articles](/public/images/latest-articles.png)

* Articles cannot be repeated in the database, so if the database already contains all of the scraped articles, then a modal will pop up to alert users that the latest articles are already displayed

    ![No New Articles Modal](/public/images/no-new-articles.png)

* Clicking on "Load More k-Scraps" will display five older articles on the page.

* If all articles in the database has been displayed, clicking "Load More k-Scraps" will pop up a modal to inform users that there are no more articles.

    ![No More Articles Modal](/public/images/no-more-articles.png)

### Articles

* Each article includes the headline, a small preview of the full article, a "Read Article" button and a "Comments" button.

    ![Article](/public/images/article.png)
  
* Clicking on the "Read Article" button will direct the user to the external webpage of the article

* Clicking on the "Comments" button will reveal the comments section of the article.

    ![Signed Out Comments](/public/images/signed-out-comments.png) 

* All users can read the existing comments of an article, but only signed-in users can write and post a new comment.

    ![Signed In Comments](/public/images/signed-in-comments.png)

* Users can only delete their own comments.

    ![Delete Comment](/public/images/delete-comment.png)

### Bookmarks

* When a user is signed in, they can see a bookmark button on each article.

    ![Bookmark Button](/public/images/bookmark-btn.png)

* Clicking on the bookmark button will add the articles to the user's bookmarks.

* Clicking on "Bookmarks" in the nav-bar will direct users to their bookmarks page.

* On the bookmarks page, a user can click on the trash can button to delete a bookmarked article.

    ![Bookmarks Page](/public/images/bookmarks-page.png)
    
## Technologies Used
* Bootstrap and Handlebars.js
* MongoDB and Mongoose
* Node.js and Express.js
* [Axios](https://www.npmjs.com/package/axios) and [Cheerio](https://www.npmjs.com/package/cheerio)
* [Passport.js](https://www.npmjs.com/package/passport), [Cookie Parser](https://www.npmjs.com/package/cookie-parser), [Cookie Session](https://www.npmjs.com/package/cookie-session)
* [Moment](https://www.npmjs.com/package/moment)
* [Async](https://www.npmjs.com/package/async)
