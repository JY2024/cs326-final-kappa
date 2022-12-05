# Kappa
## Nice To Meat You
Fall 2022
### Team Members
Jiaqi "Jay" Ye (JY2024)\
Daksh Dangi (Kasagi009)\
Isabella Chilton (ichilt15)

### Overview

Are you feeling hungry, but you're too lazy to search for food that matches your very specific preferences? Are you passionate about home-cooking? Are you passionate about eating? Well, you're in luck!

Nice To Meat You is a website designed for food lovers, focusing on convenience and community-building. A user can easily input their own dietary preferences (ex. vegetarian, pescetarian, etc.) and explore the feed page, where they can then view recipes that match at least half of their preferences. Forget about having to scroll through search results and combing through many different websites; now, when you're hungry, delicious homemade meals are just a click away: click 'yes' to view a recipe and save it, or select 'no' to view the next recipe. It's that easy. Nice To Meat You also features a chatting system, so you can get connected with like-minded people and share your love of food together.

This is an innovative idea because there isn't another application that makes finding tailor-made recipes this easy. Its purpose is to create a community that is passionate about home-cooking, providing a unique experience in regards to forming relationships with other food lovers.


### User Interface
- Main Feed Page: Explore recipes by other users and either reject them or save them to your collection.
- Personal Information Page: Edit personal information (location and preferences).
- Display Information Page: Edit display-related information (display name, profile picture, description).
- Security Information Page: Change security-related information (change password, delete account).
- Profile Page: Displays a particular user's information (picture, description, saved recipes, owned recipes, etc). You can create recipes and unlike saved recipes from here too.
- Recipe Page: Displays information for a particular recipe.
- Chat Page: Displays all chats with other users on the site. From here, you can chat with other people about their recipes/cooking/etc.

### APIs

### Database

### URL Routes / Mappings

### Authentication / Authorization
Nice to Meat You uses a miniCrypt file (provided for the class) to encrypt and descrypt passwords using salts and hashes.
When users create a new account, passwords are encrypted and stored as salts and hashes in the database.
When users try to login to the website, their passwords are compared to what is stored in the database, allowing them to login if they are correct.
There are no special permissions for specific users. All UI views are accessible to any user (provided that they save the recipe / encounter the recipe). No user can view the account settings pages of another user.

### Division of Labor
- Jay Ye: Main Feed, Account Settings Pages (personal info, display, security), backend user functionality, backend comment functionality, final.md
- Daksh Dangi: Recipe page, Chat feature, backend chat functionality, backend message functionality, Heroku deployment, video editing
- Isabella Chilton: Profile page, Recipe creation popup, backend recipe functionality, backend like functionality, authentication, milestone3.md
- Everyone: Project ideas document (ideas.md), wireframes, milestone1.md, milestone2.md, API documentation

### Conclusion
We definitely learned a lot throughout the design and implementation. There are so many tools we were introduced to that we had almost no experience with before: first, we learned how to use a framework (Bootstrap) to layout our HTML pages, introducing us to basic design concepts. Second, we learned how to do DOM surgery to change the visuals of our pages on-demand. Third, we learned a lot about backend development using routing with Express, get and post requests from the client to the backend, managing databases with postgresql, authentication using salts and hashes, and deployment on Heroku. Finally, we also learned what it is really like to do full-stack web development via a collaborative process.

Our team did encounter some difficulties while working on this project. Because we had little to no experience with some aspects of this project, we spent a substantial amount of time learning to use new tools via outside resources and debugging when things went wrong (which was often). 

Difficulties
- working while not together
- merging together code
- learning things on the spot, using outside resources

What we would've liked to know:
- a bit more preparation
- an overview in class / clearer milestone guidelines and instructions
- additional resources

Technical Hurdles
- learning things on the spot
