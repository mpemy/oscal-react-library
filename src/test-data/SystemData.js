import { metadataTestData, responsibleRolesTestData } from "./CommonData";
import {
  systemCharacteristicsDescriptionUrl,
  systemCharacteristicsInformationUrl,
} from "./Urls";
import { localReferenceDiagram } from "./DiagramData";
import { backMatterTestData } from "./BackMatterData";

export const inventoryItemsTestData = [
  {
    uuid: "inventory-item",
    description: "An example inventory item.",
    props: [
      {
        name: "prop-1",
        value: "An example property.",
        remarks: "This is an example property.",
      },
      {
        name: "prop-2",
        value: "Another example property.",
        remarks: "This is another example property.",
      },
    ],
    "responsible-parties": [
      {
        "role-id": "provider",
        "party-uuids": ["party-1"],
      },
    ],
    "implemented-components": [
      {
        "component-uuid": "component-1",
        remarks: "This is an example component.",
      },
    ],
    remarks: "Additional information about this item.",
  },
];

export const usersTestData = [
  {
    uuid: "user-1",
    title: "User 1",
    "short-name": "u1",
    description: "A system user",
    props: [
      {
        name: "type",
        value: "internal",
      },
    ],
    "role-ids": ["asset-administrator"],
    "authorized-privileges": [
      {
        title: "privilege title",
        description: "privilege description",
        "functions-performed": ["reading function", "writing function"],
      },
    ],
  },
];

export const componentsTestData = [
  {
    title: "Example Component",
    uuid: "component-1",
    description: "An example component.",
    status: {
      state: "operational",
    },
    type: "software",
    props: [
      {
        uuid: "prop-1",
        name: "version",
        value: "1.1",
      },
      {
        uuid: "prop-2",
        name: "last-modified-date",
        value: "20210712",
      },
    ],
    "responsible-roles": responsibleRolesTestData,
  },
];

const remarks = "Example system implementation remarks.";

export const systemImplementationTestData = {
  remarks,
  users: usersTestData,
  components: componentsTestData,
  "inventory-items": inventoryItemsTestData,
};

export const systemCharacteristicsTestData = {
  "system-name": "Example System Name",
  description: "This is an example of a system.",
  "system-ids": [
    {
      id: "system-id",
      "identifier-type": systemCharacteristicsDescriptionUrl,
    },
  ],
  "security-sensitivity-level": "moderate",
  "system-information": {
    "information-types": [
      {
        uuid: "information-type-id",
        title: "Information Type Title",
        categorizations: [
          {
            system: systemCharacteristicsInformationUrl,
            "information-type-ids": ["C.3.5.8"],
          },
        ],
        description: "Example information type.",
        "confidentiality-impact": {
          base: "fips-199-moderate",
        },
        "integrity-impact": {
          base: "fips-199-moderate",
        },
        "availability-impact": {
          base: "fips-199-low",
        },
      },
    ],
  },
  "security-impact-level": {
    "security-objective-confidentiality": "confidentiality-value",
    "security-objective-integrity": "integrity-value",
    "security-objective-availability": "availability-value",
  },
  status: {
    state: "other",
    remarks:
      "This is an example, and is not intended to be implemented as a system",
  },
  props: [
    {
      name: "deployment-model",
      value: "private",
    },
    {
      name: "service-models",
      value: "iaas",
    },
  ],
  "authorization-boundary": {
    description: "The description of the authorization boundary would go here.",
    diagrams: [localReferenceDiagram],
  },
};

export const sspTestData = {
  uuid: "66c2a1c8-5830-48bd-8fdd-55a1c3a52888",
  metadata: metadataTestData,
  "system-characteristics": systemCharacteristicsTestData,
  "system-implementation": systemImplementationTestData,
  "back-matter": backMatterTestData,
};

export const sspRestData = {
  "system-security-plan": {
    uuid: "12345678-9012-3456-7890-123456789012",
  },
};
