import OSCALResolveProfileOrCatalogUrlControls from "./OSCALProfileResolver";
import { fixJsonUrls } from "./OSCALBackMatterUtils";
/**
 * Loads an SSP's 'import-profile' and adds the resulting controls to the SSP
 *
 * @see {@link https://pages.nist.gov/OSCAL/documentation/schema/implementation-layer/ssp/xml-schema/#global_import-profile}
 */
export default function OSCALSspResolveProfile(
  ssp,
  parentUrl,
  onSuccess,
  onError
) {
  if (!ssp["import-profile"]) {
    return;
  }
  let profileUrl = ssp["import-profile"].href;

  const inheritedProfilesAndCatalogs = {
    inherited: [],
  };

  // Fix profile URL if not a json
  if (!profileUrl.endsWith(".json")) {
    profileUrl = fixJsonUrls(profileUrl);
  }
  // TODO - this is incorrect in the ssp-example.json data (https://github.com/usnistgov/oscal-content/issues/60, https://easydynamics.atlassian.net/browse/EGRC-266)
  // TODO - this should be improved for other use cases
  if (!profileUrl.startsWith("http")) {
    profileUrl = `${parentUrl}/../${profileUrl}`;
  }

  // Fixing linting error here would take significant change to codebase given how we use props.
  /* eslint no-param-reassign: "error" */
  ssp.resolvedControls = [];
  ssp.modifications = {
    "set-parameters": [],
    alters: [],
  };

  OSCALResolveProfileOrCatalogUrlControls(
    ssp.resolvedControls,
    ssp.modifications,
    profileUrl,
    parentUrl,
    ssp["back-matter"],
    inheritedProfilesAndCatalogs.inherited,
    () => {
      onSuccess(inheritedProfilesAndCatalogs);
    },
    onError,
    []
  );
}

/**
 *
 * @param data data to be updated with new value, for later use in a REST request
 * @param editedFieldJsonPath path to the field that is being updated
 * @param newValue updated value for the edited field
 * @param appendToLastFieldInPath boolean indicating if the updated value should be appended to an array or replace an existing value
 */
export function populatePartialRestData(
  data,
  editedFieldJsonPath,
  newValue = null,
  appendToLastFieldInPath = false
) {
  if (editedFieldJsonPath.length === 1) {
    const editData = data;

    if (typeof editedFieldJsonPath.at(0) === "function") {
      editedFieldJsonPath.at(0)(data);
    } else if (appendToLastFieldInPath) {
      editData[editedFieldJsonPath].push(newValue);
    } else {
      editData[editedFieldJsonPath] = newValue;
    }

    return;
  }

  if (Number.isInteger(editedFieldJsonPath.at(0))) {
    populatePartialRestData(
      data[Number(editedFieldJsonPath.shift())],
      editedFieldJsonPath,
      newValue,
      appendToLastFieldInPath
    );
  } else if (typeof editedFieldJsonPath.at(0) === "function") {
    populatePartialRestData(
      editedFieldJsonPath.shift()(data),
      editedFieldJsonPath,
      newValue,
      appendToLastFieldInPath
    );
  } else {
    populatePartialRestData(
      data[editedFieldJsonPath.shift()],
      editedFieldJsonPath,
      newValue,
      appendToLastFieldInPath
    );
  }
}
