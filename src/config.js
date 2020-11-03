export default {
  title: 'us2020',
  display_title: 'Police brutality at the BLM protests',
  SERVER_ROOT: 'http://localhost:4040',
  EVENTS_EXT: '/api/us2020/export_events/deeprows',
  ASSOCIATIONS_EXT: '/api/us2020/export_associations/deeprows',
  SOURCES_EXT: '/api/us2020/export_sources/deepids',
  SITES_EXT: '/api/us2020/export_sites/rows',
  DATE_FMT: 'MM/DD/YYYY',
  TIME_FMT: 'HH:mm',

  store: {
    app: {
      debug: false,
      map: {
        anchor: [44.9484, -93.28754],
        maxZoom: 18,
        minZoom: 4,
        startZoom: 5,
        maxBounds: [
          [51.022561, -142.148746],
          [13.265617, -55.185693],
        ],
      },
      cluster: { radius: 50, minZoom: 4, maxZoom: 12 },
      timeline: {
        zoomLevels: [
          { label: '6 months', duration: 262800 },
          { label: '3 months', duration: 131400 },
          { label: '1 month', duration: 43800 },
        ],
        range: [
          new Date('2020-05-25T00:00:00.000Z'),
          new Date('2020-08-09T00:00:00.000Z'),
        ],
        rangeLimits: [
          new Date('2020-01-01T00:00:00.000Z'),
          new Date(), // i.e. today
        ],
      },
      intro: [
        '<iframe src="https://player.vimeo.com/video/473433825?title=0&byline=0&portrait=0" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>',
        'The protests that have swept the US since the killing of George Floyd in May 2020 have themselves been met with further violence.',
        'Evidence of that violence exists in thousands of videos shared online. [Forensic Architecture](https://forensic-architecture.org/investigation/police-brutality-at-the-black-lives-matter-protests) and [Bellingcat](https://www.bellingcat.com/) have geolocated, verified, and analysed that evidence to create this archive.',
        '**Filters**, **navigation instructions**, and **more information** in the left-hand column.',
      ],
      flags: { isInfopoup: false, isCover: false },
      cover: {
        title: 'About and Methodology',
        headerButton: {
          title: 'SHARE YOUR FOOTAGE',
          href: 'https://blmprotests.forensic-architecture.org/share',
        },
        exploreButton: 'BACK TO THE PLATFORM',
        description: [
          '<iframe src="https://player.vimeo.com/video/473433825?title=0&byline=0&portrait=0" style="width:100%; height:50vw; max-height:340px;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>',
          '## Data',
          'A video or image is within the scope of the archive if it directly depicts or, in certain cases, otherwise evidences violence or serious misconduct by law enforcement agents. The data is tagged according to certain behaviours, including:',
          `* The use of chemical agents and “less-lethal” munitions
* Arrests and intimidating behaviour by officers
* Attacks on journalists, medics, and legal observers
* Destruction or confiscation of property by officers`,
          'View our data [here](https://docs.google.com/spreadsheets/d/1-9KKfaEDhgeJ8dz8HjsFNBniDCQj-5ADWbuMkw2hNBU/edit?ts=5f99a04b#gid=0). Some sources have been redacted to avoid increasing the circulation of videos that have not already been widely shared. All the videos referenced in our database are securely archived offline.',
          '## Purpose',
          'This platform is already supporting prospective legal action, independent monitoring, reporting, and advocacy, as well as movement demands for accountability and abolition. We’re looking to engage additional partners, and to put our video archive in the service of those partners: reach us [here](mailto:info@forensic-architecture.org).',
          '## Ethical praxis',
          'We recognise that re-sharing and amplifying video material from protest contexts can have a range of potential (positive and negative) consequences for the authors and subjects of that material, and that there is no single ‘best practice’ when it comes to handling and sharing open source images.',
          'We present the data through text-based descriptions and tags, and only provide a source URL for a datapoint when it has already been widely shared online. For more about our process and ethical praxis, read our [mission statement](https://staging.forensic-architecture.org/wp-content/uploads/2020/09/2020.14.09-FA-Bcat-Mission-Statement.pdf).',
          '## Notes on terminology',
          "**'Less-lethal' Rounds** includes ‘sponge’ bullets, ‘pepper balls’, ‘bean bag’ rounds, rubber bullets, ‘blast ball’ grenades, ‘flash-bang’ projectiles, and other similar munitions. As is well-documented, they are very capable of causing lethal injuries.",
          '**‘Far right’** is defined broadly, from explicitly right-wing militia associations to individual counter-protesters engaged in racist or nationalist behaviour.',
          'This platform is designed by Forensic Architecure using our open source software, [Timemap](https://github.com/forensic-architecture/timemap).',
          '**Full credits at [forensic-architecture.org](https://forensic-architecture.org/investigation/police-brutality-at-the-black-lives-matter-protests)**.',
        ],
      },
    },
    ui: {
      card: {
        order: [
          ['renderTime', 'renderLocation'],
          ['renderLocationPrecision'],
          ['renderAssociations'],
          ['renderSummary'],
          ['renderLawEnforcementAgencies'],
          ['renderNetwork', 'renderReporter'],
          ['renderCustomFields'],
        ],
        extra: [],
      },
      coloring: {
        maxNumOfColors: 5,
        colors: ['#eb443e', '#F4F482', '#FF7D00', '#D34F73', '#CDC7E5'],
      },
    },
    features: {
      USE_CATEGORIES: true,
      CATEGORIES_AS_FILTERS: true,
      COLOR_BY_CATEGORY: false,
      COLOR_BY_ASSOCIATION: true,
      USE_ASSOCIATIONS: true,
      USE_SOURCES: false,
      USE_COVER: true,
      USE_SEARCH: false,
      USE_SITES: false,
      GRAPH_NONLOCATED: false,
      NARRATIVE_STEP_STYLES: false,
      CUSTOM_EVENT_FIELDS: [
        {
          key: 'journalist_name',
          title: 'Name of reporter/s',
          icon: 'face',
          kind: 'text',
        },
        {
          key: 'hide_source',
          title: 'Over 5000 views',
          icon: '',
          kind: 'text',
        },
        {
          key: 'news_organisation',
          title: 'Network',
          icon: 'business',
          kind: 'text',
        },
        {
          key: 'against',
          title: 'Against',
          icon: '',
          kind: 'text',
        },
        {
          key: 'location_precision',
          title: 'Accuracy of location',
          icon: '',
          kind: 'text',
        },
        {
          key: 'links',
          title: 'Source Links',
          icon: '',
          kind: 'list',
        },
        {
          key: 'incident_id',
          title: 'Incident Number',
          icon: '',
          kind: 'text',
        },
        {
          key: 'le_agencys',
          title: 'Related law enforcement agency',
          icon: '',
          kind: 'list',
        },
        {
          key: 'links',
          title: 'Source',
          icon: '',
          kind: 'list',
        },
      ],
      CUSTOM_SOURCE_FIELDS: [
        {
          key: 'twitter_source',
          title: 'Twitter handle for source',
          icon: 'article',
          kind: 'link',
        },
      ],
    },
  },
};
