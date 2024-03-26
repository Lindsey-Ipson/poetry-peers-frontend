# Poetry Peers

Deployed at https://poetry-peers-frontend.onrender.com

Backend code base: 

* https://github.com/Lindsey-Ipson/poetry-peers-backend
* Deployed at https://poetry-peers-backend.onrender.com

## Summary

This is the frontend of Poetry Peers, a collaborative poetry analysis application. It allows users to explore new poems by key word, theme, or a selection of random poems. Users can tag specific lines in a poem with a new or pre-existing theme, and provide a brief analysis/explanation. These tags are then viewable to all other users when they view that poem. The purpose of the application is to allow users to explore new poems and poetry themes, while gaining new insights into the literature from fellow poetry readers.

## API

This application utilizes an external API PoetryDB (https://poetrydb.org/index.html). This API holds over 3000 poems, which are searchable by title, author, or linecount. It can also return any number of random poems. It accepts all data in query parameters and returns JSON with poem data consisting of author, title, lines, and linecount.

The general format of the API is:

`/<input field>/<search term>[;<search term>][..][:<search type>][/<output field>][,<output field>][..][.<format>]`

## Standard User Flow

After signing up, the site’s main functionality can be accessed through the navigation bar. Clicking the logo/brand name takes the user to a homepage which contains instructions for navigating the site. The Poems tab renders twenty new random poem each time it is accessed, and also allows the user to search all poems in the external API by title. It renders poetry cards for all poems which include the poem title, author, first few lines of the poem, and linecount. Clicking on any of the poems takes the user to an analyze-poem page, which finds all tags users have submitted for that poem, and displays a uniquely colored badge next to all highlighted lines for each tag. Clicking on any of these badges results in a small model pop-up overlaying the page which includes information about the tag including user, post date, and analysis. Clicking on the theme name in these modals takes the user to an overview of that theme.

The Theme tab displays a list of all themes, searchable by name, and includes links to all poems that have been tagged with that theme. When clicking a poem from the Themes page, the first matching tag with that theme is automatically rendered navigation to the poem. From the Themes tab, users can also click the theme name, which takes the user to a specific theme overview page which displays all highlighted lines and analyses for all poems associated with that tag. Clicking any of the poems from this page also auto-triggers a pop-up of the first matching tag to that theme in the subsequent poem analysis page.

The Contributions tab contains statistics about a user's account history and allows them to review and delete tags they have made. Clicking on a theme from this page takes the user to that themes' page overview, while clicking a poem from this page directs the user to the poem analysis page with that tag modal auto-displayed upon navigation.

## Example Screenshots
### Homepage
![Homepage Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-frontend/blob/main/README_files/HomepageScreenshot.png)
### Explore Poems Random
![Explore Poems Random Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-frontend/blob/main/README_files/ExplorePoemsRandomScreenshot.png)
### Explore Poems Search
![Explore Poems Search Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-frontend/blob/main/README_files/ExplorePoemsSearchScreenshot.png)
### Explore Themes
![Explore Themes Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-frontend/blob/main/README_files/ExploreThemesScreenshot.png)
### Analyze Poem
![Analyze Poem Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-frontend/blob/main/README_files/AnalyzePoemScreenshot.png)
### Create Tag
![Create Tag Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-frontend/blob/main/README_files/CreateTagScreenshot.png)
### View Theme
![View Theme Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-frontend/blob/main/README_files/ViewThemeScreenshot.png)
### View Account Contributions
![View Account Contributions Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-frontend/blob/main/README_files/ContributionsScreenshot.png)

## Data Schema
![Database Schema](https://github.com/Lindsey-Ipson/poetry-peers-frontend/blob/main/README_files/DataSchemaDiagram.png)

## Main Technology Used:

* Javascript 
* React
* Vite
* Crypto-JS
* Bootstrap
* Reactstrap
* Jest
* React Testing Library
* Babel