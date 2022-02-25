import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import OSCALMetadata from "./OSCALMetadata";
import OSCALSystemCharacteristics from "./OSCALSystemCharacteristics";
import OSCALSystemImplementation from "./OSCALSystemImplementation";
import OSCALControlImplementation from "./OSCALControlImplementation";
import OSCALSspResolveProfile from "./oscal-utils/OSCALSspResolver";
import OSCALBackMatter from "./OSCALBackMatter";
import OSCALProfileCatalogInheritance from "./OSCALProfileCatalogInheritance";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
}));

export default function OSCALSsp(props) {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [inheritedProfilesAndCatalogs, setInheritedProfilesAndCatalogs] =
    useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const unmounted = useRef(false);

  const ssp = props["system-security-plan"];
  const restData = {
    "system-security-plan": {
      uuid: ssp.uuid,
    },
  };

  let sspParties;
  if (ssp.metadata) {
    sspParties = ssp.metadata.parties;
  }

  useEffect(() => {
    OSCALSspResolveProfile(
      ssp,
      props.parentUrl,
      (profilesCatalogsTree) => {
        if (!unmounted.current) {
          setIsLoaded(true);
          setInheritedProfilesAndCatalogs(profilesCatalogsTree);
          props.onResolutionComplete();
        }
      },
      () => {
        if (!unmounted.current) {
          setError(error);
          setIsLoaded(true);
          props.onResolutionComplete();
        }
      }
    );

    return () => {
      unmounted.current = true;
    };
  }, []);

  let controlImpl;

  if (!isLoaded) {
    controlImpl = null;
  } else {
    controlImpl = (
      <OSCALControlImplementation
        controlImplementation={ssp["control-implementation"]}
        components={ssp["system-implementation"].components}
        controls={ssp.resolvedControls}
        isEditable={props.isEditable}
        modifications={ssp.modifications}
        onFieldSave={props.onFieldSave}
        restData={restData}
      />
    );
  }

  return (
    <div className={classes.paper}>
      <OSCALMetadata
        metadata={ssp.metadata}
        isEditable={props.isEditable}
        onFieldSave={props.onFieldSave}
        restData={restData}
      />
      <OSCALProfileCatalogInheritance
        inheritedProfilesAndCatalogs={inheritedProfilesAndCatalogs}
      />
      <OSCALSystemCharacteristics
        systemCharacteristics={ssp["system-characteristics"]}
        backMatter={ssp["back-matter"]}
        parentUrl={props.parentUrl}
      />
      <OSCALSystemImplementation
        systemImplementation={ssp["system-implementation"]}
        parties={sspParties}
      />
      {controlImpl}
      <OSCALBackMatter
        backMatter={ssp["back-matter"]}
        parentUrl={props.parentUrl}
      />
    </div>
  );
}
