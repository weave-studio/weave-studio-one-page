// src/_data/navigation.js - Navigation structure
module.exports = {
    main: [
      {
        text: "Home",
        url: "/"
      },
      {
        text: "About",
        url: "/about/"
      },
      {
        text: "Services",
        url: "/services/",
        children: [
          {
            text: "Web Design",
            url: "/services/web-design/"
          },
          {
            text: "Development",
            url: "/services/development/"
          },
          {
            text: "Consulting",
            url: "/services/consulting/"
          }
        ]
      },
      {
        text: "Blog",
        url: "/blog/"
      },
      {
        text: "Contact",
        url: "/contact/"
      }
    ],
    
    footer: [
      {
        title: "Services",
        links: [
          {
            text: "Web Design",
            url: "/services/web-design/"
          },
          {
            text: "Development",
            url: "/services/development/"
          },
          {
            text: "Consulting",
            url: "/services/consulting/"
          }
        ]
      },
      {
        title: "Company",
        links: [
          {
            text: "About",
            url: "/about/"
          },
          {
            text: "Blog",
            url: "/blog/"
          },
          {
            text: "Case Studies",
            url: "/case-studies/"
          },
          {
            text: "Contact",
            url: "/contact/"
          }
        ]
      },
      {
        title: "Resources",
        links: [
          {
            text: "Documentation",
            url: "/docs/",
            external: true
          },
          {
            text: "Style Guide",
            url: "/style-guide/"
          },
          {
            text: "FAQ",
            url: "/faq/"
          },
          {
            text: "Support",
            url: "/support/"
          }
        ]
      }
    ]
  };