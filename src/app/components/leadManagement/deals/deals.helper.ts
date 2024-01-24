export const dealStatus:any = [
    {
        listId: "1",
        name: "New",
        cards: []
    },
    {
        listId: "2",
        name: "Meeting Scheduled",
        cards: []
    },
    {
        listId: "3",
        name: "In Discussion",
        cards: []
    },
    {
        listId: "4",
        name: "Quote Sent",
        cards: []
    },
    {
        listId: "5",
        name: "Quote Accepted",
        cards: []
    },
    {
        listId: "6",
        name: "Project Started",
        cards: []
    },
    {
        listId: "7",
        name: "Cancelled",
        cards: []
    }
];

export const industryDetails = {
    sections: [
      {
        section_code: 1,
        section_title: "COUNTRY- AND FORESTRY, FISHING",
        industry_types: [
          {
            industry_type_code: 1.5,
            industry_type_title: "Mixed Agriculture",
            industry_subtypes: []
          },
          {
            industry_type_code: 2,
            industry_type_title: "forestry and logging",
            industry_subtypes: [
              {
                industry_subtype_code: 2.5,
                industry_subtype_title: "forestry"
              },
              {
                industry_subtype_code: 2.5,
                industry_subtype_title: "logging"
              }
            ]
          }
        ]
      },
      {
        section_code: "B",
        section_title: "MINING AND WINNING OF STONES AND EARTH",
        industry_types: [
          {
            industry_type_code: 5,
            industry_type_title: "Coal mining",
            industry_subtypes: [
              {
                industry_subtype_code: 2.5,
                industry_subtype_title: "Hard coal mining"
              },
              {
                industry_subtype_code: 2.5,
                industry_subtype_title: "Brown coal mining"
              }
            ]
          },
          {
            industry_type_code: 6,
            industry_type_title: "extraction from oil and natural gas",
            industry_subtypes: [
              {
                industry_subtype_code: 2.5,
                industry_subtype_title: "extraction from oil"
              },
              {
                industry_subtype_code: 2.5,
                industry_subtype_title: "extraction from natural gas"
              }
            ]
          },
          {
            industry_type_code: 7,
            industry_type_title: "Ore mining",
            industry_subtypes: [
              {
                industry_subtype_code: 2.5,
                industry_subtype_title: "Iron ore mining"
              },
              {
                industry_subtype_code: 2.5,
                industry_subtype_title: "Non-ferrous metal ore mining"
              }
            ]
          },
          {
            industry_type_code: 8,
            industry_type_title: "extraction from stones and Earth, other Mining",
            industry_subtypes: [
              {
                industry_subtype_code: null,
                industry_subtype_title: "extraction from natural stones, Gravel, Sand, volume and Kaolin _",
                industry_subtypes2: [
                  {
                    industry_subtype_code: 2.5,
                    industry_subtype_title: "extraction from Natural stones and Natural stone, limestone and gypsum stone, chalk and slate"
                  },
                  {
                    industry_subtype_code: 1.5,
                    industry_subtype_title: "extraction from volume and kaolin"
                  }
                ]
              },
              {
                industry_subtype_code: null,
                industry_subtype_title: "Other Mining; extraction from stones and Earth a. n. G.\"",
                industry_subtypes2: [
                  {
                    industry_subtype_code: 1.5,
                    industry_subtype_title: "Peat extraction"
                  }
                ]
              }
            ]
          },
          {
            industry_type_code: 9,
            industry_type_title: "Delivery from Services for the Mining and for the extraction of stones and earth",
            industry_subtypes: [
              {
                industry_subtype_code: 2.5,
                industry_subtype_title: "Delivery from Services for the extraction of oil and natural gas"
              },
              {
                industry_subtype_code: 2.5,
                industry_subtype_title: "Providing services for other mining and the extraction from stones and Earth"
              }
            ]
          }
        ]
      },
      {
        section_code: "K",
        section_title: "DELIVERY FROM FINANCIAL- AND INSURANCE SERVICES",
        industry_types: [
          {
            industry_type_code: null,
            industry_type_title: "Delivery from Financial Services",
            industry_subtypes: [
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Central banks and Credit institutions"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Investment companies"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "trust and other Fund and similar Financial institutions"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Other Financing institutions"
              }
            ]
          },
          {
            industry_type_code: null,
            industry_type_title: "insurance, Reinsurance and Pension funds (without social insurance)",
            industry_subtypes: [
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Insurance",
                industry_subtypes2: [
                  {
                    industry_subtype_code: 0.5,
                    industry_subtype_title: "Health insurance (company health insurance companies)"
                  }
                ]
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Reinsurance"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Pension funds and Pension fund"
              }
            ]
          },
          {
            industry_type_code: null,
            industry_type_title: "With financial and Insurance services related activities",
            industry_subtypes: [
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "With Financial Services connected activities"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "With Insurance services and Pension funds"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "connected activities"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Fund management"
              }
            ]
          }
        ]
      },
      {
        section_code: "L",
        section_title: "PROPERTY AND HOUSING",
        industry_types: [
          {
            industry_type_code: null,
            industry_type_title: "property and Housing",
            industry_subtypes: [
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "purchase and sale from own properties, buildings and apartments"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Rental, leasing from own or leased land, buildings and apartments"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "mediation and Administration from properties, Buildings and apartments for third parties"
              }
            ]
          }
        ]
      },
      {
        section_code: "M",
        section_title: "PROVISION OF FREELANCER WORK, SCIENTIFIC AND TECHNICAL SERVICES",
        industry_types: [
          {
            industry_type_code: null,
            industry_type_title: "Right- and tax advice, Audit",
            industry_subtypes: [
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Legal advice"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Audit and tax advice; Accounting"
              }
            ]
          },
          {
            industry_type_code: null,
            industry_type_title: "Administration and guide from Pursue and operated; Business consulting",
            industry_subtypes: [
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Administration and guide from Pursue and Operated _"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "public relations and Business consulting"
              }
            ]
          },
          {
            industry_type_code: null,
            industry_type_title: "Architecture- and engineering offices; technical, physical and chemical examination",
            industry_subtypes: [
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Architecture- and Engineering offices"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Technical, physical and chemical Investigation _"
              }
            ]
          },
          {
            industry_type_code: null,
            industry_type_title: "Research and Development",
            industry_subtypes: [
              {
                industry_subtype_code: 1.5,
                industry_subtype_title: "Research and Development in the Area Nature-, Engineering, agricultural sciences and medicine",
                industry_subtypes2: [
                  {
                    industry_subtype_code: 1.5,
                    industry_subtype_title: "Other Research and Development in the Area Natural sciences, engineering, agricultural sciences and medicine"
                  }
                ]
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Research and Development in the Area Right-, Economics and social sciences as well as in the areas of language, cultural and art studies"
              }
            ]
          },
          {
            industry_type_code: null,
            industry_type_title: "Advertising and Market research",
            industry_subtypes: [
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Advertising"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Market- and opinion research"
              }
            ]
          },
          {
            industry_type_code: null,
            industry_type_title: "Other freelance, scientific and technical activities",
            industry_subtypes: [
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "studios for Textile-, Jewelry-, Graphic- u. ä. design"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "photography and Photo laboratories"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Translate and Interpreting"
              },
              {
                industry_subtype_code: 0.5,
                industry_subtype_title: "Other freelance, scientific and technical activities etc"
              }
            ]
          },
          {
            industry_type_code: 0.5,
            industry_type_title: "Veterinary",
            industry_subtypes: []
          }
        ]
      }
    ]
  };
  