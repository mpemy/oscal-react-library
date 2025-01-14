export const exampleParties = [
  {
    uuid: "party-1",
    type: "organization",
    name: "Some group of people",
    "email-addresses": ["owners@email.org"],
    "telephone-numbers": [
      {
        type: "mobile",
        number: "+18005555555",
      },
      {
        type: "office",
        number: "+18004444444",
      },
      {
        number: "+18006666666",
      },
      {
        type: "home",
        number: "+18007777777",
      },
    ],
    addresses: [
      {
        type: "work",
        "addr-lines": ["0000 St", "Suite 3"],
        city: "City",
        state: "State",
        "postal-code": "0000",
        country: "US",
      },
      {
        type: "home",
        "addr-lines": ["1111 Road St"],
        city: "City",
        state: "State",
        "postal-code": "0000",
        country: "US",
      },
      {
        "addr-lines": ["2222 St"],
        city: "City",
        state: "State",
        "postal-code": "0000",
        country: "US",
      },
    ],
  },
];

export const profileCatalogInheritanceData = {
  inherited: [
    {
      title: "Example Catalog",
      type: "catalog",
      uuid: "0988f548-8ece-41b8-b098-dc340e02c344",
    },
    {
      title: "Example Inherited Profile",
      type: "profile",
      uuid: "8f204564-3e62-406b-a138-03888c6bcd08",
      inherited: [
        {
          title: "Nested Inherited Catalog",
          type: "catalog",
          uuid: "09dc20e1-85a2-4a06-9f82-1eee6104e12f",
        },
      ],
    },
  ],
};

export const metadataTestData = {
  title: "Test Title",
  parties: exampleParties,
  version: "Revision 5",
};

export const responsibleRolesTestData = [
  {
    "party-uuids": ["party-1"],
    "role-id": "provider",
  },
];

export const responsiblePartiesTestData = [
  {
    "party-uuids": ["party-1"],
    "role-id": "provider",
  },
];

export const implementedComponentsRolesTestData = [
  {
    "component-uuid": "component-1",
    remarks: "An example component.",
  },
];
