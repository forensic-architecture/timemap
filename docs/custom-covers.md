## Using Timemap with a Custom Cover

By default, instances of Timemap use no cover. By setting the `USE_COVER` flag
to true in [config.js][], however, you can use explanatory text and videos that are 
displayed when your instance is first loaded.

The structure you need to specify in `app.cover` in the Redux store overrides
in config.js is outlined below:

```js
const theCover = {
  // The video that plays in the background of the cover. Will otherwise be plain black
  bgVideo: "https://url-for-background-video.mp4",
  // Titles sit at the top of the screen
  title: "My Custom Timemap Instance",
  subtitle: "Mapping Events in my personal open source investigation",
  subsubtitle: "January 2020",
  // The main text on the cover. This string is markdown, so you can include links and styles.
  description: "A brief description of what the platform shows. [Links](https://forensic-architecture.org) can be written in markdown.",
    // Header videos sit above the 'EXPLORE' button, and can include a basic description, as well as translations.
    headerVideos: [
    {
      buttonTitle: "ABOUT",
      desc: "This film details the investigation's methodology and findings at a high level.",
      file: ""https://url-to-video.mp4,
      poster: "https://url-for-thumbnail.png",
      title: "About the Investigation",
      translations: [
        {
          code: "ITA",
          desc: "Italian translation",
          paths: ["https://url-to-video.mp4"],
          title: "Translated Title",
        },
        {
          code: "RUS",
          desc: "Russian translation",
          paths: ["https://url-to-video.mp4"],
          title: "Translated Title",
        }
      ]
    },
    {
      buttonTitle: "HOW TO USE",
      desc: "This step-by-step guide explores the way that the platform arranges and presents information.",
      file: ""https://url-to-video.mp4,
      poster: "https://url-for-thumbnail.png",
      title: "How to Use the Platform"
    }
  ],
  // These videos sit at the bottom of the page, beneath the rest of the
  // content. The max length of the list is 4 for stylistic reasons, any later
  // indices will not be shown.
  videos: [
    {
      buttonTitle: "VERIFICATION:",
      buttonSubtitle: "How we verified data",
      desc: "This video shows how we verified the data.",
      file: "https://url-to-video.mp4",
      poster: "https://url-for-thumbnail.png",
      title: "Verifying data in this investigation"
    },
    {
      buttonTitle: "VERIFICATION:",
      buttonSubtitle: "How we verified data",
      desc: "This video shows how we verified the data.",
      file: "https://url-to-video.mp4",
      poster: "https://url-for-thumbnail.png",
      title: "Verifying data in this investigation"
    },
    {
      buttonTitle: "VERIFICATION:",
      buttonSubtitle: "How we verified data",
      desc: "This video shows how we verified the data.",
      file: "https://url-to-video.mp4",
      poster: "https://url-for-thumbnail.png",
      title: "Verifying data in this investigation"
    },
    {
      buttonTitle: "VERIFICATION:",
      buttonSubtitle: "How we verified data",
      desc: "This video shows how we verified the data.",
      file: "https://url-to-video.mp4",
      poster: "https://url-for-thumbnail.png",
      title: "Verifying data in this investigation"
    }
  ]
}

module.exports = {
  // ... other values in config.js
  store: {
    app: {
      cover: theCover,
      // ...
    }
    // ... 
  }
}
```
