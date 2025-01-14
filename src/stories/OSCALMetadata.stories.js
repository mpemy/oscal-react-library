import React from "react";
import OSCALMetadata from "../components/OSCALMetadata";
import {
  exampleMetadata,
  exampleMetadataWithPartiesAndRoles,
} from "../test-data/MetadataData";

export default {
  title: "Components/Metadata",
  component: OSCALMetadata,
};

function Template(args) {
  return <OSCALMetadata {...args} />;
}

export const Default = Template.bind({});

export const WithPartiesAndRoles = Template.bind({});

export const Editable = Template.bind({});

Default.args = {
  metadata: exampleMetadata,
};

WithPartiesAndRoles.args = {
  metadata: exampleMetadataWithPartiesAndRoles,
};

Editable.args = {
  metadata: exampleMetadata,
  isEditable: true,
  onFieldSave: () => {},
  partialRestData: { "top-level": { uuid: "" } },
};
